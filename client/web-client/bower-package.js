var bower = require('bower');

bower.commands
    .install([
        'pace',
        'angular',
        'angular-sanitize',
        'angular-route',
        'bootstrap',
        'angular-bootstrap'
    ], {
        save: true
    }, { /* custom config */ })
    .on('end', function (installed) {
        console.log(installed);
    });