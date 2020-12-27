class NetworkMessage {
    constructor(_players) {
        _players.forEach(function(o){ delete o.ws; });
        this.players = _players;
    }
}

module.exports = NetworkMessage;