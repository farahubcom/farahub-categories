class CreateOrUpdateCategoryValidator {

    /**
     * The validator rules
     * 
     * @returns {object}
     */
    rules() {
        return {
            name: {
                in: ["body"],
                isString: {
                    bail: true
                },
                notEmpty: {
                    bail: true,
                    errorMessage: 'ورود نام دسته اجباری است'
                }
            },
        }
    }
}

module.exports = CreateOrUpdateCategoryValidator;