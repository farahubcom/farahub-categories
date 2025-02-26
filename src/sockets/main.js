const { Socket } = require("@farahub/framework/foundation");


class MainSocket extends Socket {

    /**
     * The socket name
     * 
     * @var string
     */
    name = 'Main';

    /**
     * The socket events
     * 
     * @var array
     */
    events = [
        { name: 'CategoryCreated', handler: 'created' },
        { name: 'CategoryUpdated', handler: 'updated' },
        // { name: 'CategoryMovedToTrash', handler: 'moviedToTrash' },
        // { name: 'CategoryDeleted', handler: 'deleted' },
    ];

    /**
     * Get list or user workspaces
     * 
     * @param {*} req request
     * @param {*} res response
     * 
     * @return void
     */
    created(socket) {
        return async function () {
            //
        }
    }

    /**
     * Get list or user workspaces
     * 
     * @param {*} req request
     * @param {*} res response
     * 
     * @return void
     */
    updated(socket) {
        return async function () {
            //
        }
    }
}

module.exports = MainSocket;