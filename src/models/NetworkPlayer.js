class NetworkPlayer {
    constructor(_ws, _data) {
        this.ws = _ws;
        this.lastUpdate = _data.lastUpdate;
        this.guid = _data.guid;
        this.position = this.roundVector3(_data.position);
        this.velocity = this.roundVector3(_data.velocity);
        this.isDead = _data.isDead;
    }

    update(_ws, _data) {
        this.ws = _ws;
        this.lastUpdate = _data.lastUpdate;
        this.guid = _data.guid;
        this.position = this.roundVector3(_data.position);
        this.velocity = this.roundVector3(_data.velocity);
        this.isDead = _data.isDead;
    }

    roundVector3(_vector3) {
        let newVector3 = {x: this.round(_vector3.x), y: this.round(_vector3.y), z: this.round(_vector3.z)};
        return newVector3;
    }

    round(_number) {
        return Math.round((_number + Number.EPSILON) * 100) / 100;
    }
}

module.exports = NetworkPlayer;