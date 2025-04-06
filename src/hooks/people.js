const { Doc } = require("@farahub/framework/facades");
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;


const people = {
    'main.list.populate': async () => {
        return {
            path: 'categories',
            select: 'name'
        }
    },
    'main.createOrUpdate.validate': async () => {
        return {
            categories: {
                in: ["body"],
                optional: true,
                isArray: true,
            },
            'categories.*': {
                in: ["body"],
                custom: {
                    options: (value, { req }) => {
                        const Category = req.wsConnection.model('Category');
                        return Doc.resolve(value, Category).then(category => {
                            if (!category)
                                return Promise.reject(false);
                            return Promise.resolve(true);
                        })
                    },
                    bail: true
                },
                customSanitizer: {
                    options: (value, { req }) => {
                        const Category = req.wsConnection.model('Category');
                        return Doc.resolve(value, Category);
                    }
                }
            }
        }
    },
    'main.details.populate': async () => {
        return {
            path: 'categories',
            select: 'name'
        }
    },
    'main.createOrUpdate.preSave': async ({ data, connection, inject, person }) => {

        // assign categories
        person.categories = data.categories?.map(category => category.id);
    },

}

module.exports = people