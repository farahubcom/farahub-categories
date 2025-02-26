const Category = require('./Category')
const Person = require('./Person')
const Product = require('./Product')
const Contract = require('./Contract')


const schemas = {
    Category,
    'injects': {
        'People': {
            Person,
        },
        'Products': {
            Product,
        },
        'Contract': {
            Contract,
        }
    }
}

module.exports = schemas;