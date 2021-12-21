'use strict';

// DEPENDENCIAS
const fs = require('fs'),
    path = require('path');


// Función para obtener todos los ficheros de carpetas y subcarpetas    
var walk = function (dir) {
    var results = [];
    var list = fs.readdirSync(dir);

    list.forEach(function (file) {
        file = path.join(dir, file);
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
        } else {
            /* Is a file */
            results.push(file);
        }
    });
    return results;
};

module.exports = walk;
