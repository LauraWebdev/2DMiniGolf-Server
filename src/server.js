const Jetty = require('jetty');
const con = new Jetty(process.stdout);
const WebSocket = require('ws');
const NetworkPlayer = require('./models/NetworkPlayer');
const NetworkMessage = require('./models/NetworkMessage');

const serverPort = 1337;
const serverTicksPerSecond = 20;
const server = new WebSocket.Server({ port: serverPort });
const timeoutCutoff = 3;

const maxConnections = 10;
let connections = [];

con.clear();

server.on('connection', function connection(ws) {
	ws.on('message', function incoming(data) {
		let networkPlayer = new NetworkPlayer(ws, JSON.parse(data));

		let existingPlayer = isAlreadyConnected(networkPlayer.guid);
		if(existingPlayer) {
			existingPlayer.update(ws, networkPlayer);
		} else {
			connections.push(networkPlayer);
			con.clear();
			UpdateConsole();
		}
	});
});

setInterval(function broadcastLoop() {
	let currentTime = Math.round(+new Date()/1000);

	connections.forEach(function(connection) {
		// Disconnect Timeout
		let timeSinceLastUpdate = currentTime - connection.lastUpdate;
		if(timeSinceLastUpdate > timeoutCutoff) {
			disconnectPlayer(connection);
		}
	});

	server.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
			let networkMessage = new NetworkMessage(connections);
			let networkMessagePayload = JSON.stringify(networkMessage);
		  	client.send(networkMessagePayload);
		}
	  });

	UpdateConsole();
}, 1000 / serverTicksPerSecond);

function disconnectPlayer(connection) {
	let connectionIndex = connections.indexOf(connection);
	connections.splice(connectionIndex, 1);

	con.clear();
	UpdateConsole();
}

function isAlreadyConnected(_guid) {
	return connections.find(o => o.guid == _guid);
}

function UpdateConsole() {
	con.moveTo(1,0).text("|||| 2DMiniGolf Server |||| Port: " + serverPort + " | Players: " + connections.length + "/" + maxConnections);
	con.moveTo(3,0).text("Players:");
	con.moveTo(4,0);

	for(let i = 0; i < connections.length; i++) {
		con.moveTo(i + 4, 0).text("                                                                                                                                                                                                                  ");
		con.moveTo(i + 4, 0).text((connections[i].isDead ? "+ " : "- ") + connections[i].guid + "   @[" + ConsolePosition(connections[i].position.x) + "," + ConsolePosition(connections[i].position.y) + "," + ConsolePosition(connections[i].position.z) + "] with [" + ConsolePosition(connections[i].velocity.x) + "," + ConsolePosition(connections[i].velocity.y) + "," + ConsolePosition(connections[i].velocity.z) + "]");
	}
}

function ConsolePosition(_pos) {
	return _pos.toFixed(2);
}