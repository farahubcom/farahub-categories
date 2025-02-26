const mongoose = require("mongoose");
const { Doc } = require("@farahub/framework/facades");

const { ObjectId } = mongoose.Types;


class DeleteCategoryValidator {

    /**
     * The application instance
     * 
     * @var Application
     */
    app;

    /**
     * Create validator instance
     * 
     * @param {Application} app
     * @constructor
     */
    constructor(app) {
        this.app = app;
    }

    /**
     * The validator rules
     * 
     * @returns {object}
     */
    rules() {
        return {
            categoryId: {
                in: ["params"],
                isMongoId: {
                    bail: true
                },
                custom: {
                    options: (value, { req }) => {
                        const Category = req.wsConnection ?
                            req.wsConnection.model('Category') :
                            this.app.connection.model('Category');
                            
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
                        return ObjectId(value);
                    }
                }
            }
        }
    }

    /**
     * Custom validation formatter
     * 
     * @returns {func}
     */
    toResponse(res, { errors }) {
        return res.status(404).json({
            ok: false,
            message: 'Category not found'
        })
    }
}

module.exports = DeleteCategoryValidator;