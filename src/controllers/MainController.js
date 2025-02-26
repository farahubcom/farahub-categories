const { Controller } = require("@farahub/framework/foundation");
const { Auth, Workspace, Injection, Lang, Validator, Event, Doc } = require("@farahub/framework/facades");
const mongoose = require('mongoose');
const CategoriesListValidator = require('../validators/CategoriesListValidator');
const CreateOrUpdateCategoryValidator = require('../validators/CreateOrUpdateCategoryValidator');
const DeleteCategoryValidator = require('../validators/DeleteCategoryValidator');
const CategoryCreatedOrUpdated = require('../events/CategoryCreatedOrUpdated');
const CategoryDeleted = require('../events/CategoryDeleted');


const { ObjectId } = mongoose.Types;


class MainController extends Controller {

    /**
     * The controller name
     * 
     * @var string
     */
    name = 'Main';

    /**
     * The controller base path
     * 
     * @var string
     */
    basePath = '/categories';

    /**
     * The controller routes
     * 
     * @var array
     */
    routes = [
        {
            type: 'api',
            method: 'get',
            path: '/',
            handler: 'list',
        },
        {
            type: 'api',
            method: 'post',
            path: '/',
            handler: 'createOrUpdate',
        },
        {
            type: 'api',
            method: 'delete',
            path: '/:categoryId',
            handler: 'delete',
        },
    ]

    /**
     * List of categories match params
     * 
     * @return void
     */
    list() {
        return [
            Auth.authenticate('jwt', { session: false }),
            Workspace.resolve(this.app, true),
            Injection.register(this.module, 'main.list'),
            Validator.validate(new CategoriesListValidator()),
            async function (req, res, next) {
                try {

                    const args = req.query;

                    const Category = req.wsConnection ?
                        req.wsConnection.model('Category') :
                        this.app.connection.model('Category');

                    const injections = await req.inject('search', { user: req.user });


                    let search = {
                        ...(injections && Object.assign({},
                            ...injections
                        ))
                    };

                    if (args && args.label) {
                        search = {
                            ...search,
                            label: args.label
                        }
                    }

                    if (args && args.query && args.query !== '') {
                        search = {
                            ...search,
                            "name.fa-IR": { $regex: args.query + '.*' }
                        }
                    }

                    if (args && args.parent) {
                        search = {
                            ...search,
                            parent: args.parent
                        }
                    }

                    const sort = args && args.sort ? args.sort : "-createdAt";

                    const populationInjections = await req.inject('populate');

                    const query = Category
                        .find(search)
                        .populate([
                            ...(populationInjections || [])
                        ]);

                    query.sort(sort);

                    const total = await Category.find(search).count();


                    if (args && args.page > -1) {
                        const perPage = args.perPage || 25;
                        query.skip(args.page * perPage)
                            .limit(perPage)
                    }

                    let data = await query.lean({ virtuals: true });

                    data = Lang.translate(data);

                    res.json({ ok: true, data, total });

                    await req.inject("postResponse");

                    return;
                } catch (error) {
                    next(error);
                }
            }
        ]
    }

    /**
     * Create or upadte an existing category
     * 
     * @param {*} req request
     * @param {*} res response
     * 
     * @return void
     */
    createOrUpdate() {
        return [
            Auth.authenticate('jwt', { session: false }),
            Workspace.resolve(this.app, true),
            Injection.register(this.module, 'main.createOrUpdate'),
            Validator.validate(new CreateOrUpdateCategoryValidator()),
            Event.register(this.module),
            async function (req, res, next) {
                try {

                    const data = req.body;

                    const Category = req.wsConnection ?
                        req.wsConnection.model('Category') :
                        this.app.connection.model('Category');

                    const { wsConnection: connection, inject } = req;
                    let modified = await Category.createOrUpdate(data, data.id, { connection, inject });

                    let category = await Category.findById(modified.id).lean({ virtuals: true });
                    category = Lang.translate(category);

                    res.json({ ok: true, category });

                    const { workspace, user } = req;
                    if (workspace) {
                        req.event(new CategoryCreatedOrUpdated(modified, connection, user));
                    }

                    await req.inject("postResponse", { category, inject, workspace, connection, user });

                    return;
                } catch (error) {
                    next(error);
                }
            }
        ]
    }

    /**
     * Delete category
     * 
     * @param {*} req request
     * @param {*} res response
     * 
     * @return void
     */
    delete() {
        return [
            Auth.authenticate('jwt', { session: false }),
            Workspace.resolve(this.app, true),
            Injection.register(this.module, 'main.delete'),
            Validator.validate(new DeleteCategoryValidator(this.app)),
            Event.register(this.module),
            async function (req, res, next) {
                try {
                    const { categoryId } = req.params;

                    const Category = req.wsConnection ?
                        req.wsConnection.model('Category') :
                        this.app.connection.model('Category');

                    // resolve category document
                    const category = await Doc.resolve(categoryId, Category);

                    // inject pre delete hooks
                    await req.inject('preDelete', { category });

                    // dispatch event
                    if (req.workspace) {
                        req.event(new CategoryDeleted(category, req.wsConnection, req.user));
                    }

                    // delete category
                    await Category.findByIdAndDelete(category.id);

                    // return response
                    res.json({ ok: true });

                    // inject post response hooks
                    const { inject, wsConnection: connection, workspace, user } = req;
                    await req.inject("postResponse", { category, inject, workspace, connection, user });

                    return;
                } catch (error) {
                    next(error);
                }
            }
        ]
    }
}

module.exports = MainController;