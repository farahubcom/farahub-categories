const { Doc } = require("@farahub/framework/facades");
const mongoose = require('mongoose');
const People = require("./people");
const Products = require("./products");

const { ObjectId } = mongoose.Types;


const hooks = {
    People,
    Products,
    'Lawyers/Case-Management': {
        'main.createOrUpdate.preSave': async ({ caseData, data, connection, inject }) => {

            // assign categories
            if (data.categories && data.categories.length > 0) {

                const Category = this.model('Category');

                caseData.categories = await Promise.all(
                    data.categories.map(
                        async categoryId => {
                            const category = await Doc.resolve(categoryId, Category);
                            return category && category.id;
                        }
                    ).filter(Boolean)
                )
            }

        },
    },
}

module.exports = hooks;