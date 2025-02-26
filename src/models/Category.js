const mongoose = require("mongoose");
const { Doc } = require("@farahub/framework/facades");

const { ObjectId } = mongoose.Types;


class Category {


    /**
     * Find categories of specific label
     * 
     * @param {string} label
     * @param {object} filter
     * @returns {Category[]}
     */
    static getByLabel(label, filter = {}) {
        return this.model('Category').find({ label, ...filter });
    }


    /**
     * Find first category of specific label
     * 
     * @param {string} label
     * @param {object} filter
     * @returns {Category[]}
     */
    static getOneByLabel(label, filter = {}) {
        return this.model('Category').findOne({ label, ...filter });
    }

    /**
     * get descendants of the category as array
     * 
     * @param {Category} category category
     * @param {array} array descendants
     * @return {array} descendants array
     */
    getDescendantsAsArray(category = this, result = []) {

        if (category.children.length > 0) {
            category.children.forEach(category => {
                result = [...result, ...this.getDescendantsAsArray(category, result)]
            })
        }

        result = [...result, category];
        return result;
    }

    /**
     * get ancestors of the category as array
     * 
     * @param {Category} category category
     * @param {array} array ancestors
     * @return {array} ancestors array
     */
    getAncestorsAsArray(category = this, result = []) {

        if (category.parent) {
            result = [...result, ...this.getAncestorsAsArray(category.parent, result)]
        }

        result = [...result, category];
        return result;
    }

    /**
     * Create new or update an existing category
     * 
     * @param {Object} data category data created
     * @param {string} data.identifier category identifier
     * @param {string} data.name category name
     * @param {string} data.label category label
     * @param {Array} data.children children category
     * @param {string} categoryId modifying category id
     * @return {Category} modified category
     */
    static async createOrUpdate(data, categoryId, { connection, inject }) {
        try {
            const Category = this.model('Category');

            // create instance
            const category = categoryId ?
                await Category.findById(
                    ObjectId(categoryId)
                ) : new Category();

            if (category.isNew) {

                // assign label
                category.label = data.label;

                // assign identifier
                if (data.identifier) {
                    category.identifier = data.identifier;
                }
            }

            // assign name
            category.name = {
                'fa-IR': data.name
            };

            // assign children if exist
            if (data.children && data.children.length > 0) {
                await Promise.all(
                    data.children.map(
                        async child => {
                            child = await Doc.resolve(child, Category);

                            category.children = category.children ? [...category.children, child.id] : [child.id];
                        }
                    )
                )
            }

            // assign parent after category created if exist
            if (data.parent) {
                const parent = await Doc.resolve(data.parent, Category);

                category.parent = parent.id;

                if (parent.children && !parent.children.includes(ObjectId(category.id))) {
                    parent.children = [...parent.children, ObjectId(category.id)];
                    await parent.save();
                }
            }

            // inject pre save hooks
            await inject('preSave', { category, data, categoryId })

            // save document
            await category.save();

            // inject post save hooks
            await inject('postSave', { category, data, categoryId })

            // return modified category
            return category;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Category;