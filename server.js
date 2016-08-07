/**
 * Created by pavlheo on 5/30/2016.
 */
var express  = require('express');
var playService = require('./playService.js');
var bodyParser = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var jwt = require('jsonwebtoken');
var socketioJwt = require('socketio-jwt');
var config = require('./config'); // get our config file
var User   = require('./user'); // get our mongoose model
var ChatMessage = require('./chatMessage');
var GameDots = require('./gameDots');
var http = require('http');
var app = express();                               // create our app w/ express
var server = http.createServer(app);
var io = require('socket.io').listen(server);
app.use(express.static(__dirname+"/app"));
app.use(bodyParser.json());
app.use(morgan('dev'));

mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret);

// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router();

apiRoutes.post('/users', function (req, res) {
    var user = new User(req.body);
    user.save(function (err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({success: true});
    });
});

apiRoutes.post('/authenticate', function (req, res) {
    // find the user

    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.json({success: false, message: 'Authentication failed. User not found.'});
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
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                console.log('Invalid token');
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                console.log('Auth OK');
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        console.log('No token');
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
    res.json({message: 'Welcome to the coolest API on earth!'});
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
    User.find({}, '_id firstName lastName username', function (err, users) {
        res.json(users);
    });
});

apiRoutes.get('/dots', function (req, res) {
    var player1Id = req.decoded._doc._id;
    GameDots
        .findOne({'state': 'accepted', $or: [{'player1': player1Id}, {'player2': player1Id}]})
        .sort({createdAt: -1})
        .populate('player1', '_id firstName lastName username') // <-- only return the Persons name
        .populate('player2', '_id firstName lastName username')
        .exec(function (err, gameData) {
            if (err) {
                throw err;
            }
            console.log(gameData);
            res.json(gameData);
        });
});

apiRoutes.post('/dots/invite', function(req, res) {  //POST (authorized via JWT)/dots/invite {userId: userId}
    var player1Id = req.decoded._doc._id;
    var player2Id = req.body.userId;
    var newGame = new GameDots({
        player1: player1Id,
        player2: player2Id,
        state: 'invited',
        playerInTurn: 1,
        gameData: playService.getGameData()
    });
    newGame.save(function (err) {
        if (err) {
            throw err;
        }
        GameDots
            .findById(newGame._id)
            .populate('player1', '_id firstName lastName username') // <-- only return the Persons name
            .populate('player2', '_id firstName lastName username')
            .exec(function (err, gameData) {
                if (err) {
                    throw err;
                }
                console.log(gameData);
                io.to(player2Id).emit('dots.invited', gameData);
                res.json(gameData);
            });
    });
});

apiRoutes.post('/dots/accept', function(req, res) {  //POST (authorized via JWT)/dots/accept {gameId: gameId}
    var playerId = req.decoded._doc._id;
    var gameId = req.body.gameId;
    GameDots
        .findOne({'_id': gameId, 'state': 'invited', 'player2': playerId})
        .populate('player1', '_id firstName lastName username') // <-- only return the Persons name
        .populate('player2', '_id firstName lastName username')
        .exec(function (err, gameData) {
            if (err) {
                throw err;
            }
            if (gameData) {
                gameData.state = 'accepted';
                gameData.save(function (errSave) {
                    if (errSave) {
                        throw errSave;
                    }
                    io.to(gameData.player1._id).emit('dots.accepted', gameData);
                    res.json(gameData);
                });
            }
            else {
                res.json();
            }
        });
});

apiRoutes.post('/dots/decline', function(req, res) {  //POST (authorized via JWT)/dots/decline {gameId: gameId}
    var playerId = req.decoded._doc._id;
    var gameId = req.body.gameId;
    GameDots
        .findOne({'_id': gameId, 'state': 'invited', 'player2': playerId})
        .populate('player1', '_id firstName lastName username') // <-- only return the Persons name
        .populate('player2', '_id firstName lastName username')
        .exec(function (err, gameData) {
            if (err) {
                throw err;
            }
            if (gameData) {
                gameData.state = 'declined';
                gameData.save(function (errSave) {
                    if (errSave) {
                        throw errSave;
                    }
                    io.to(gameData.player1._id).emit('dots.declined', gameData);
                    res.json(gameData);
                });
            }
            else {
                res.json();
            }
        });
});

apiRoutes.post('/dots/play', function(req, res) {  //POST (authorized via JWT)/dots/play {gameId: gameId, indexX: indexX, indexY: indexY}
    var playerId = req.decoded._doc._id;
    GameDots
        .findOne({'_id': req.body.gameId, 'state': 'accepted'})
        .populate('player1', '_id firstName lastName username') // <-- only return the Persons name
        .populate('player2', '_id firstName lastName username')
        .exec(function (err, gameData) {
            if (err) {
                throw err;
            }
            if (gameData && playerId == gameData['player' + gameData.playerInTurn]._id) {//All is ok, right player makes turn
                if (playService.makeTurn(gameData.gameData, gameData.playerInTurn, req.body.indexX, req.body.indexY)) {
                    gameData.playerInTurn = 3 - gameData.playerInTurn;//Pass the move to other player
                    gameData.markModified('gameData');
                    if (gameData.gameData.remainingMoves == 0) {
                        gameData.state = 'finished';//No more moves allowed - does not make sense to continue
                    }
                    gameData.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        io.to(gameData['player' + gameData.playerInTurn]._id).emit('dots.played', gameData);
                        res.json(gameData);
                    });
                }
            }
            else {
                res.json(gameData); // do nothing otherwise
            }
        });
});

apiRoutes.post('/dots/abandon', function(req, res) {  //POST (authorized via JWT)/dots/giveup {gameId: gameId}
    var playerId = req.decoded._doc._id;
    GameDots
        .findOne({'_id': req.body.gameId, 'state': 'accepted'})
        .populate('player1', '_id firstName lastName username') // <-- only return the Persons name
        .populate('player2', '_id firstName lastName username')
        .exec(function (err, gameData) {
            if (gameData && playerId == gameData['player' + gameData.playerInTurn]._id) {//All is ok, right player makes turn
                if (err) {
                    console.log('when finding: error '+err);
                    throw err;
                }
                if (gameData.gameData.scores[gameData.playerInTurn].score < gameData.gameData.scores[3 - gameData.playerInTurn].score) { //This is losing player
                    gameData.state = 'finished';
                    gameData.save(function (err) {
                        if (err) {
                            console.log('when saving: error '+err);
                            throw err;
                        }
                        io.to(gameData['player' + (3 - gameData.playerInTurn)]._id).emit('dots.abandoned', gameData);
                        res.json(gameData);
                    });
                }
            }
            else {
                res.json(gameData); // do nothing otherwise
            }
        });
});

apiRoutes.get('/chat', function (req, res){
    ChatMessage
        .find({})
        .sort({createdAt: 'desc'})
        .populate('user','username')
        .exec(function (err, chatMessages) {
            if (err) throw (err);
            res.json(chatMessages);
        });
});

apiRoutes.post('/chat', function (req, res) {
    var chatMessage = new ChatMessage();
    chatMessage.user = req.decoded._doc._id;
    chatMessage.message = req.body.message;
    chatMessage.save(function (err) {
        if (err) throw err;

        io.sockets.emit('chat.message', {
            payload: req.body.message,
            source: req.decoded._doc.username
        });

        console.log('ChatMessage saved successfully');
        res.json({success: true});
    });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);
app.listen(8080);
console.log("App listening on port 8080");


io
    .on('connection', socketioJwt.authorize({
        secret: app.get('superSecret'),
        timeout: 15000 // 15 seconds to send the authentication message
    }))
    .on('authenticated', function(socket) {
        console.log('connected & authenticated: ' + JSON.stringify(socket.decoded_token));
        socket
            .join(socket.decoded_token._doc._id)
            .on('disconnect', function () {
                console.log('user disconnected');
            });
    });

server.listen(8188, function() {
    console.log('listening on *:8188');
});