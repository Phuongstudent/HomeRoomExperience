var CancelButton = pc.createScript('cancelButton');

CancelButton.attributes.add("studyRoomPopUp", {type: "entity"});
CancelButton.attributes.add("hangOutRoomPopUp", {type: "entity"});


// initialize code called once per entity
CancelButton.prototype.initialize = function() {
     this.entity.element.on("click", this.cancel, this);
};

// update code called every frame
CancelButton.prototype.cancel = function(dt) {
    this.studyRoomPopUp.enabled = false;
    this.hangOutRoomPopUp.enabled = false;
};

// swap method called for script hot-reloading
// inherit your script state here
// CancelButton.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/