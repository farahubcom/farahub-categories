const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;


class CategoriesListValidator {

    /**
     * The validator rules
     * 
     * @returns {object}
     */
    rules() {
        return {
            query: {
                in: ["query"],
                optional: true,
                isString: true
            },
            sort: {
                in: ["query"],
                optional: true,
                isString: true
            },
            page: {
                in: ["query"],
                optional: true,
                isInt: true,
                toInt: true
            },
            perPage: {
                in: ["query"],
                optional: true,
                isInt: true,
                toInt: true
            },
            label: {
                in: ["query"],
                optional: true,
                isString: true
            },
            parent: {
                in: ["query"],
                optional: true,
                isString: true,
                customSanitizer: {
                    options: (value, { req }) => {
                        return ObjectId(value);
                    }
                }
            },
            //
        }
    }
}

module.exports = CategoriesListValidator;