var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server); 

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function() {
	console.log('Starting server on port 5000');
});

var playerCounter = 0;
var player = {};
var playerID = {};

io.on('connection', function(socket) {
	if (playerCounter < 2) {
		socket.on('new player', function() {
			player[socket.id] = {
				choice: "",
				totalWin: 0,
				totalLoss: 0,
				tie: 0,
				submit: false
			};
			playerID[playerCounter] = socket.id;
			io.sockets.emit('message', socket.id);
			playerCounter++;
		});
		console.log('Player connected!', socket.id);
	}

	/*socket.on('disconnect', () => {
			delete player[socket.id];
			console.log('Player disconnected!', socket.id);
			playerCounter--;
	});*/

	socket.on('pressed', function(data, submit) {
	var play = player[socket.id] || {};
		play.submit = true;
		play.choice = data;
		checkResult();
	});
});

function checkResult() {
	console.log(playerID[0] + " " + playerID[1]);
	if (playerID[0] != null && playerID[1] != null) {
		if (player[playerID[0]].submit && player[playerID[1]].submit) {
			if (player[playerID[0]].choice == player[playerID[1]].choice) {
				player[playerID[0]].tie++;
				player[playerID[1]].tie++;
			} else if ((player[playerID[0]].choice == "r" && player[playerID[1]].choice == "s") || (player[playerID[0]].choice == "p" && player[playerID[1]].choice == "r") || (player[playerID[0]].choice == "s" && player[playerID[1]].choice == "p")) {
				player[playerID[0]].totalWin++;
				player[playerID[1]].totalLoss++
			} else {
				player[playerID[1]].totalWin++;
				player[playerID[0]].totalLoss++
			}
			player[playerID[1]].submit = false;
			player[playerID[0]].submit = false;
			io.sockets.emit('player', player);
		}
	}
}

setInterval(function() {
	io.sockets.emit('state');
}, 1000 / 60);
