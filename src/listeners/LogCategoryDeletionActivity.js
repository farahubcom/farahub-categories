const { Listener } = require("@farahub/framework/foundation");


class LogCategoryDeletionActivity extends Listener {

    /**
     * handle the event
     * 
     * @param {Login} event event
     */
    async handle(event) {
        
        // const Activity = event.connection.model('Activity');

        // await Activity.createNew({
        //     causer: event.user.id,
        //     causerModel: 'User',
        //     subject: event.category.id,
        //     subjectModel: 'Category',
        //     event: 'deleted',
        // })

        //
    }
}


module.exports = LogCategoryDeletionActivity;