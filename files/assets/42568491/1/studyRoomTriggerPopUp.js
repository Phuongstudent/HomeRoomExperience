var StudyRoomTriggerPopUp = pc.createScript('studyRoomTriggerPopUp');

// initialize code called once per entity
StudyRoomTriggerPopUp.prototype.initialize = function() {
      this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
};


StudyRoomTriggerPopUp.prototype.onTriggerEnter = function(entity) {
      if (entity.tags._list[0] !== "noncollide"){
        this.app.fire("game:hascollided");
        window.open("https://ucalgary.zoom.us/j/5920681531");  
      }

};

// swap method called forwd script hot-reloading
// inherit your script state here
// TriggerPopUp.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/a