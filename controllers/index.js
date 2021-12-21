'use strict';

// DEPENDENCIAS
const fsFileWalk = require('../helpers/fsFileWalk');

module.exports = (config, app) => {
    fsFileWalk(__dirname).filter(file => {
        return (file.indexOf('.') !== 0 && file !== __filename && file.slice(-3) === '.js');
    }).forEach(file => {
        require(file)(config, app);
    });
};