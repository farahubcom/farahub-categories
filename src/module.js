const { Module } = require('@farahub/framework/foundation');
const models = require('./models');
const schemas = require('./schemas');
const controllers = require('./controllers');
const sockets = require('./sockets');
const hooks = require('./hooks');
const listeners = require('./listeners');
const conditions = require('./conditions');
const triggers = require('./triggers');


class CategoriesModule extends Module {

    /**
     * The module name
     * 
     * @var string
     */
    name = 'Categories';

    /**
     * The module version
     * 
     * @var string
     */
    version = '1.0.0';

    /**
     * The module base path
     * 
     * use for routing 
     * 
     * @var string
     */
    basePath = '';

    /**
     * The module hooks
     * 
     * @var object
     */
    hooks = hooks;

    /**
     * The module conditions
     * 
     * @var array
     */
    conditions = conditions;

    /**
     * The module triggers
     * 
     * @var array
     */
    triggers = triggers;

    /**
     * Register the module
     * 
     * @return void
     */
    register() {
        this.registerModels(models);
        this.registerSchemas(schemas);
        this.registerListeners(listeners);
        this.registerControllers(controllers);
    }

    /**
     * Boot the module
     * 
     * @return void
     */
    boot() {
        this.registerSockets(sockets);
        //
    }
}

module.exports = CategoriesModule;