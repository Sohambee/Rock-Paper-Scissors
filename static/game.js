var socket = io();

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');

var buttonX1 = 50;
var buttonY1 = 55;
var buttonW1 = 175;
var buttonH1 = 190;

var buttonX2 = 55;
var buttonY2 = 225;
var buttonW2 = 175;
var buttonH2 = 190;

var buttonX3 = 45;
var buttonY3 = 425;
var buttonW3 = 175;
var buttonH3 = 190;

var id;

var wins = 0;
var losses = 0;
var ties = 0;
var choice = "";

var rock = document.getElementById("rock");
var paper = document.getElementById("paper");
var scissors = document.getElementById("scissors");
var title = document.getElementById("title");


document.addEventListener('mousedown', function(event) {
	console.log(event.x + " " + event.y);
	if (event.x > buttonX1 && event.x < buttonX1 + buttonW1 && event.y > buttonY1 && event.y < buttonY1 + buttonH1) {
		socket.emit('pressed', "r");
		console.log('You selected ROCK');
	}
	if (event.x > buttonX2 && event.x < buttonX2 + buttonW2 && event.y > buttonY2 && event.y < buttonY2 + buttonH2) {
		socket.emit('pressed', "p");
		console.log('You selected PAPER');

	}
	if (event.x > buttonX3 && event.x < buttonX3 + buttonW3 && event.y > buttonY3 && event.y < buttonY3 + buttonH3) {
		socket.emit('pressed', "s");
		console.log('You selected SCISSORS');
	}
});

socket.emit('new player');

socket.on('message', function(data) {
	if (id == null) {
		id = data;
	}
	console.log(id);
});

socket.on('player', function(players) {
	var player = players[id];
	wins = player.totalWin;
	losses = player.totalLoss;
	ties = player.tie;
	choice = player.choice;
	if (player.choice == "r") {
		choice = "You selected ROCK";
	} else if (player.choice == "p") {
		choice = "You selected PAPER";
	} else {
		choice = "You selected SCISSORS";
	}
});

socket.on('state', function() {
	context.clearRect(0, 0, 800, 600);
	context.fillStyle = "black";
	context.font = "30pt Comfortaa";
	context.fillText("WINS: " + wins, 250, 500);
	context.fillText("LOSSES: " + losses, 250, 535);
	context.fillText("TIES: " + ties, 250, 570);
	context.fillText(choice, 250, 400);
	context.drawImage(rock, 5, 5, 175, 190);
	context.drawImage(paper, 15, 200, 175, 190);
	context.drawImage(scissors, 15, 400, 175, 190);
	context.drawImage(title, 250, 10, 500, 200);
});
