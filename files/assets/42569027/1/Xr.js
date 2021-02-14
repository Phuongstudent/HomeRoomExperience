var Xr = pc.createScript('xr');

// entity with button element
Xr.attributes.add('buttonVr', {
    type: 'entity'
});

// Xr.attributes.add('buttonVrMobile', {
//     type: 'entity'
// });

// entity with camera component
Xr.attributes.add('cameraEntity', {
    type: 'entity'
});

Xr.attributes.add('uiMenu', {
    type: 'entity'
});

// Xr.attributes.add('elementUnsupported', {
//     type: 'entity',
//     title: 'Unsupported Message'
// });

// Xr.attributes.add('elementHttpsRequired', {
//     type: 'entity',
//     title: 'HTTPS Required Message'
// });

Xr.prototype.initialize = function() {
    this.app.xr.on('available:' + pc.XRTYPE_VR, this.checkButton, this);
    this.app.xr.on('start', this.checkButton, this);
    this.app.xr.on('end', this.EndSession, this);
    this.app.on('xr:enableVrButton', this.enableVRButton, this);
    
    this.buttonVr.element.on('click', function() {
        this.sessionStart();
    }, this);
    
    // this.buttonVrMobile.element.on('click', function() {
    //     this.sessionStart();
    // }, this);
    
    
    // esc - end session
    this.app.keyboard.on('keydown', function (evt) {
        if (evt.key === pc.KEY_ESCAPE && this.app.xr.active) {
            this.app.xr.end();
        }
    }, this);
    
    // this.checkButton();
};

Xr.prototype.checkButton = function() {
    if (this.app.xr.supported) {
        // this.elementHttpsRequired.enabled = false;
        // this.elementUnsupported.enabled = false;
        
        if (this.app.xr.active) {
            // hide button in XR session
            this.buttonVr.enabled = false;
            // this.app.fire("ui:start");
            this.app.fire("firstpersonmovement:changerigidstate");
            this.app.fire("cameracontroller:adjustcameraheight");
        } else {
            // show button outside of XR sessiom
            this.buttonVr.enabled = true;
        
            // check if session type is available
            var available = this.app.xr && ! this.app.xr.active && this.app.xr.isAvailable(pc.XRTYPE_VR);

            // set button opacity accordingly
            this.buttonVr.element.opacity = available ? 0.5 : 0.1;
            // this.buttonVr.children[0].element.opacity = available ? 1.0 : 0.2;
        }
    } else {
        // WebXR is not supported
        // this.buttonVr.enabled = false;
        
        // Check if we are on HTTPS
        // if (window.location.protocol == "https:") {
        //     this.elementUnsupported.enabled = true;
        //     this.elementHttpsRequired.enabled = false;
        // } else {
        //     this.elementUnsupported.enabled = false;
        //     this.elementHttpsRequired.enabled = true;
        // }
    }
};

Xr.prototype.EndSession = function() {
    this.buttonVr.enabled = true;
    var available = this.app.xr && ! this.app.xr.active && this.app.xr.isAvailable(pc.XRTYPE_VR);

    // set button opacity accordingly
    this.buttonVr.element.opacity = available ? 0.5 : 0.1;
    
    //fire event to adjust back the player height and enalbe collision and rigidbody
    this.app.fire("firstpersonmovement:changebackrigidstate");
    this.app.fire("cameracontroller:adjustbackcameraheight");
    
    //Open Menu UI
    // this.app.fire("ui:backToMenu");
};

Xr.prototype.sessionStart = function() {
    if (! this.app.xr.supported) {
        // WebXR is not supported
        return;
    }
    
    if (this.app.xr.active) {
        // session already active
        return;
    }
    
    if (! this.app.xr.isAvailable(pc.XRTYPE_VR)) {
        // this session type is not available
        return;
    }
    
    // start XR session of selected type
    this.cameraEntity.camera.startXr(pc.XRTYPE_VR, pc.XRSPACE_LOCAL);
};

Xr.prototype.enableVRButton = function() {
     this.buttonVr.enabled = true;
};