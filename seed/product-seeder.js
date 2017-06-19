var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/shoppingv2')

var products = [
    new Product({
        imagePath: 'http://via.placeholder.com/300x200',
        title: 'Title 1',
        description: 'Description 1',
        price: 10
    }),
    new Product({
        imagePath: 'http://via.placeholder.com/300x200',
        title: 'Title 2',
        description: 'Description 2',
        price: 20
    }),
    new Product({
        imagePath: 'http://via.placeholder.com/300x200',
        title: 'Title 3',
        description: 'Description 3',
        price: 40
    }),
    new Product({
        imagePath: 'http://via.placeholder.com/300x200',
        title: 'Title 4',
        description: 'Description 4',
        price: 15
    }),
    new Product({
        imagePath: 'http://via.placeholder.com/300x200',
        title: 'Title 5',
        description: 'Description 5',
        price: 15
    })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}