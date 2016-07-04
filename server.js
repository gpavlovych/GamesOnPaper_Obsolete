/**
 * Created by pavlheo on 5/30/2016.
 */
var express  = require('express');
var playService = require('./playService.js');
var bodyParser = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('./config'); // get our config file
var User   = require('./user'); // get our mongoose model
var ChatMessage = require('./chatMessage');
var http = require('http');
var app = express();                               // create our app w/ express
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static('app'));
app.use(bodyParser.json());
app.use(morgan('dev'));

mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret);

// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router();
var unprotectedRoutes = express.Router();

apiRoutes.post('/users', function (req, res){
    var user = new User(req.body);
    user.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});

apiRoutes.post('/authenticate', function (req, res){
    // find the user

    User.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({success: false, message: 'Authentication failed. Wrong password.'});
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn: '24h' // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    });
});

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

apiRoutes.get('/dots', function (req, res){
    res.json(playService.getGameData());
});

apiRoutes.post('/dots', function(req, res){
    var data = req.body.data;
    var result = playService.makeTurn(data, req.body.color, req.body.indexX, req.body.indexY);
    res.json({result:result, data:data });
});

apiRoutes.get('/chat', function (req, res){
    console.log(req.decoded._doc._id);
    ChatMessage
        .find({})
        .sort({createdAt: 'desc'})
        .populate('user','username')
        .exec(function (err, chatMessages) {
            if (err) throw (err);
            res.json(chatMessages);
        });
});

apiRoutes.post('/chat', function (req, res){
    console.log(req.body);
    var chatMessage = new ChatMessage();
    chatMessage.user = req.decoded._doc._id;
    chatMessage.message = req.body.message;
    chatMessage.save(function(err) {
        if (err) throw err;

        io.sockets.emit('chat.message', {
            payload: req.body.message,
            source: req.decoded._doc.username
        });

        console.log('ChatMessage saved successfully');
        res.json({ success: true });
    });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);
app.listen(8080);
console.log("App listening on port 8080");

io.on('connection', function(socket){
    socket.broadcast.emit('user connected');

    socket.on('message', function (from, msg) {

        console.log('recieved message from', from, 'msg', JSON.stringify(msg));

        console.log('broadcasting message');
        console.log('payload is', msg);
        io.sockets.emit('broadcast', {
            payload: msg,
            source: from
        });
        console.log('broadcast complete');
    });
});

server.listen(3000, function(){
    console.log('listening on *:3000');
});