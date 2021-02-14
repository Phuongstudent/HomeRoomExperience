var Network = pc.createScript('network');

// static variables
Network.id = null;
Network.socket = null;

var name = window.prompt("Enter your name: ");

// initialize code called once per entity
Network.prototype.initialize = function() {
    this.player = this.app.root.findByName('Camera');
    this.other = this.app.root.findByName('Other');
    // this.other.tags.add(name);

    // var socket = io.connect('https://cliff-near-wilderness.glitch.me'); // Glitch hosted server
    var socket = io.connect('https://calgary-hacks.sourabh.org/'); // aws server
    Network.socket = socket;
    
    
    socket.emit ('initialize', name);
    
    
    var self = this;
    socket.on ('playerData', function (data) {
        self.initializePlayers (data);
    });

    socket.on ('playerJoined', function (data) {
        self.addPlayer(data);
    });

    socket.on ('playerMoved', function (data) {
        self.movePlayer(data);
    });

    socket.on ('playerDisconnected', function (data) {
        self.removePlayer(data);
    });
    
};

Network.prototype.initializePlayers = function (data) {
    this.players = data.players;
    Network.id = data.id;

    for(var id in this.players){
        if(id != Network.id){
            this.players[id].entity = this.createPlayerEntity(this.players[id]);
        }
    }
    

    this.initialized = true;
    console.log('initialized');
};

Network.prototype.addPlayer = function (data) {
    console.log("addPlayer");
    this.players[data.id] = data;
    this.players[data.id].entity = this.createPlayerEntity(data);
};

Network.prototype.movePlayer = function (data) {
    if (this.initialized && !this.players[data.id].deleted) {
        // console.log("move", data.x, data.y, data.z, data.rx, data.ry, data.rz);
        this.players[data.id].entity.rigidbody.teleport(data.x, data.y, data.z, data.rx, data.ry, data.rz);
    }
    else {
        console.log("Not Moved");
    }
};

Network.prototype.removePlayer = function (data) {
    if (this.players[data].entity) {
        this.players[data].entity.destroy();
        this.players[data].deleted = true;
    }
};

Network.prototype.createPlayerEntity = function (data) {
    var newPlayer = this.other.clone();
    newPlayer.enabled = true;
  
    this.other.getParent().addChild(newPlayer);
    var material = this.app.assets.find(data.color, "material");
    // console.log(newPlayer.model.model.meshInstances[0].material);
    newPlayer.model.model.meshInstances[0].material = material.resource;
    newPlayer.findByName("NameTagText").element.text = data.name;
    newPlayer.findByName("NameTagText2").element.text = data.name;
    console.log("Color : ",data.color);
     console.log('player created');
    if (data)
        newPlayer.rigidbody.teleport(data.x, data.y, data.z);

    return newPlayer;
};

// update code called every frame
Network.prototype.update = function(dt) {
    this.updatePosition();
};

Network.prototype.updatePosition = function () {

    if (this.initialized) {    
        var pos = this.player.getPosition();
        var rot = this.player.getLocalEulerAngles();
        
        pos.y -= 0.857;
    
        Network.socket.emit('positionUpdate', {id: Network.id, x: pos.x, y: pos.y, z: pos.z, rx: -rot.x, ry: -rot.y, rz:-rot.z});
    }
};
