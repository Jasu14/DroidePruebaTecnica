'use strict';

/***************************************************** DEPENDENCIAS ******************************************************/

const Transport = require('winston-transport'),
    Sequelize = require('sequelize'),
    winston = require('winston');

class DataBaseTransport extends Transport {
    constructor(opts) {
        super(opts);
        // instanciado de la base de datos
        this._db = opts.db;
    }

    log(info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        // guardar en la base de datos
        var data = {};
        if (info.req !== undefined) {
            data.ip = info.req.ip;
            data.method = info.req.method;
            data.path = info.req.path;
            if (info.req.user) data.username = info.req.user.username;
        }
        data.level = info.level;
        data.version = info.version;
        data.message = JSON.stringify(info.message);
        data.datetime = new Date();

        var xData = {};
        Object.keys(info).forEach(function(key) {
            if (key !== "message" && key !== "level" && key !== "req" && key !== "version") {
                xData[key] = info[key];
            }
        });
        data.data = JSON.stringify(xData);
        console.log(`${data.level.toUpperCase()} ${data.datetime.toLocaleString()} ${data.path}: ${data.message}`);
        if(data.level === "error"){
            console.error(xData.exception);
        }

        this._db.Log.create(data);

        // Perform the writing to the remote service
        callback();
    }
};

module.exports = (config, db) => {

    return winston.createLogger({
        level: config.log.level,
        format: winston.format.json(),
        defaultMeta: { version: config.log.version },
        transports: [
            //
            // - Write to all logs with level `info` and below to `combined.log` 
            // - Write all logs error (and below) to `error.log`.
            //
            //        new winston.transports.File({ filename: 'error.log', level: 'error' }),
            //new winston.transports.Console({ format: winston.format.simple() }),
            new DataBaseTransport({ db: db })
        ]
    });
};