const { Condition } = require("@farahub/framework/foundation");


class CategoryCreated extends Condition {

    /**
     * Name of the condition
     * 
     * @var string
     */
    name = 'Category created';

    /**
     * Identifier of the condition
     * 
     * @var string
     */
    identifier = 'category-created';

    /**
     * Handle the condition
     * 
     * @param object data
     * @return bool
     */
    async handle(params, data) {
        return true;
    }
}

module.exports = CategoryCreated;