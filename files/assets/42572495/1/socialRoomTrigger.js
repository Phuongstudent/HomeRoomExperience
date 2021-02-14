var SocialRoomTrigger = pc.createScript('socialRoomTrigger');

// initialize code called once per entity
SocialRoomTrigger.prototype.initialize = function() {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
};

// update code called every frame
SocialRoomTrigger.prototype.update = function(dt) {
    
};

SocialRoomTrigger.prototype.onTriggerEnter = function(entity) {
       if (entity.tags._list[0] !== "noncollide"){
            this.app.fire("game:hascollided");
    window.open("https://us04web.zoom.us/j/2213568285?pwd=V0lXV3NrRmFVS091SVRTZ1djYUloZz09");
       }
   
};