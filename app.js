const http = require('http');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var config = require('./config');

var app = express();
app.disable('x-powered-by');

app.set('port', config.port);
app.set('hostname', config.host);

app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.sessionSecret
  }));

var router = express.Router();
require('./controllers')(config, router);
app.use('/', router);

// Routes
var radar = require('./routes/radar');
app.use('/radar', radar);

var server = http.createServer(app);

server.listen(app.get('port'), app.get('hostname'), function () {
    console.log('Express server listening on ' + app.get('hostname') + ":" + app.get('port'));
});

process.on('uncaughtException', function (err) {
    console.error(err.stack);
});
