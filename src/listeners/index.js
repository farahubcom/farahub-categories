const CategoryCreatedOrUpdated = require("../events/CategoryCreatedOrUpdated");
const CategoryDeleted = require("../events/CategoryDeleted");
const LogCategoryDeletionActivity = require("./LogCategoryDeletionActivity");
const LogCategoryModificationActivity = require("./LogCategoryModificationActivity");


module.exports = new Map([
    [
        CategoryCreatedOrUpdated, [
            LogCategoryModificationActivity,
        ],

        CategoryDeleted, [
            LogCategoryDeletionActivity,
        ]
    ]
]);