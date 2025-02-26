class CategoryCreatedOrUpdated {

    /**
     * Modified category
     * 
     * @var Category
     */
    category;

    /**
     * Workspace connection
     * 
     * @var Connection
     */
    connection;

    /**
     * Authentiacated user
     * 
     * @var User
     */
    user;

    /**
     * Create event instance
     * 
     * @constructor
     * @param {Category} category Modified category
     * @param {Connection} connection Workspace connection
     * @param {User} user Authenticated user
     */
    constructor(category, connection, user) {
        this.category = category;
        this.connection = connection;
        this.user = user;
    }
}

module.exports = CategoryCreatedOrUpdated;