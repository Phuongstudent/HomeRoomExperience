var LibraryTrigger = pc.createScript('libraryTrigger');

// initialize code called once per entity
LibraryTrigger.prototype.initialize = function() {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
};

// update code called every frame
LibraryTrigger.prototype.onTriggerEnter = function(entity) {

    if (entity.tags._list[0] !== "noncollide"){
    this.app.fire("game:hascollided");
    window.open("https://library.ucalgary.ca/");
    }
    
};