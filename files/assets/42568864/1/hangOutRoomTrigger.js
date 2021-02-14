var HangOutRoomTrigger = pc.createScript('gameRoomTrigger');

// initialize code called once per entity
HangOutRoomTrigger.prototype.initialize = function() {
      this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
};


HangOutRoomTrigger.prototype.onTriggerEnter = function(entity) {
      if (entity.tags._list[0] !== "noncollide"){
          this.app.fire("game:hascollided");
    window.open("https://backyard.co/p/NWD32S");
      }
  
};