var FirstPersonMovement = pc.createScript('firstPersonMovement');

FirstPersonMovement.attributes.add('camera', {
    type: 'entity',
    description: 'Optional, assign a camera entity, otherwise one is created'
});

FirstPersonMovement.attributes.add('power', {
    type: 'number',
    default: 2500,
    description: 'Adjusts the speed of player movement'
});

FirstPersonMovement.attributes.add('lookSpeed', {
    type: 'number',
    default: 0.25,
    description: 'Adjusts the sensitivity of looking'
});

// initialize code called once per entity
FirstPersonMovement.prototype.initialize = function() {
        this.timeSinceLastClick = 0.3;
    this.force = new pc.Vec3();
    this.eulers = new pc.Vec3();
        // Cache some temp variables for use later
    this._tempQuat1 = new pc.Quat();
    this._tempQuat2 = new pc.Quat();
    this._tempVec3_1 = new pc.Vec3();

    var app = this.app;
    this.movement = true;

    this.app.on("firstpersonmovement:changerigidstate", this.ChangeState, this);
    this.app.on("firstpersonmovement:changebackrigidstate", this.ChangeBackState, this);
    this.app.on("game:hascollided", this.hasCollide, this);
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.enableMovement, this);
    
    
      // Calculate the camera euler angle rotation around x and y axes
    // This allows us to place the camera at a particular rotation to begin with in the scene
    var quat = this.camera.getRotation();
    this.ey = this.getYaw(quat) * pc.math.RAD_TO_DEG;
    this.ex = this.getPitch(quat, this.ey) * pc.math.RAD_TO_DEG;
    
      // The target rotation for the camera to rotate to
    this.targetEx = this.ex;
    this.targetEy = this.ey;
    
     this.moved = false;
    // Listen for mouse move events
    app.mouse.on("mousemove", this._onMouseMove, this);

    // when the mouse is clicked hide the cursor
    app.mouse.on("mousedown", function () {
        app.mouse.enablePointerLock();
    }, this);            

    // Check for required components
    if (!this.entity.collision) {
        console.error("First Person Movement script needs to have a 'collision' component");
    }

    if (!this.entity.rigidbody || this.entity.rigidbody.type !== pc.BODYTYPE_DYNAMIC) {
        console.error("First Person Movement script needs to have a DYNAMIC 'rigidbody' component");
    }
    
     // Only register touch events if the device supports touch
    this.lastTouchPosition = new pc.Vec2();  
    this.addEventCallbacks();
};

FirstPersonMovement.prototype.addEventCallbacks = function() {    
    if (this.app.touch) {
        this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
        this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);
        this.app.touch.on(pc.EVENT_TOUCHEND, this.onTouchEnd, this);
    }
};

FirstPersonMovement.prototype.enableMovement = function() {
    this.movement = true;
    console.log("Movement enabled!");
};

// update code called every frame
FirstPersonMovement.prototype.update = function(dt) {
    // If a camera isn't assigned from the Editor, create one
    if (!this.camera) {
        this._createCamera();
    }
    
    var force = this.force;
    var app = this.app;

    // Get camera directions to determine movement directions
    var forward = this.camera.forward;
    var right = this.camera.right;
    var justOpen = true;

    // movement
    var x = 0;
    var z = 0;

    // Use W-A-S-D keys to move player
    // Check for key presses
    if (app.keyboard.isPressed(pc.KEY_A) || app.keyboard.isPressed(pc.KEY_Q) && this.movement) {
        x -= right.x;
        z -= right.z;
    }

    if (app.keyboard.isPressed(pc.KEY_D) && this.movement) {
        x += right.x;
        z += right.z;
    }

    if (app.keyboard.isPressed(pc.KEY_W) && this.movement) {
        x += forward.x;
        z += forward.z;
    }

    if (app.keyboard.isPressed(pc.KEY_S) && this.movement) {
        x -= forward.x;
        z -= forward.z;
    }

    // use direction from keypresses to apply a force to the character
    if (x !== 0 && z !== 0 && this.movement) {
        force.set(x, 0, z).normalize().scale(this.power);
        this.entity.rigidbody.applyForce(force);
    }
    
        var lerp = 1;
    if (this.snappinessFactor > 0) {
        lerp = dt / this.snappinessFactor;
    } 
    this.ex = pc.math.lerp(this.ex, this.targetEx, lerp);
    this.ey = pc.math.lerp(this.ey, this.targetEy, lerp);
 
          if (this.app.touch){
            this.camera.setEulerAngles(0, this.ey, 0);
          }
          else{
            this.camera.setEulerAngles(this.ex, this.ey, 0);    
          }
    

    // // update camera angle from mouse events
    // this.camera.setLocalEulerAngles(this.eulers.y, this.eulers.x, 0);
};

FirstPersonMovement.prototype.onTouchStart = function (e) {
      if (this._paused || this.app.xr.active ){
        return;
    }
    // this.doRaycast(e.x, e.y);
    var touch = e.touches[0];
    this.lastTouchPosition.set(touch.x , touch.y);
    
//      // Check if user has previously clicked within the time window to be registered as a double click
//     if (this.timeSinceLastClick < 0.3) {
//         // User has double clicked so let's perform an action
//         this.switchraycast = true;
   

//         // We should also set the timeSinceLastClick to be outside the time window so their third click
//         // won't accidently be registered as a double click

//         this.timeSinceLastClick = 0.3;  
//     }
//     else {
//         // Reset timeSinceLastClick if the click was done after the time allowed for a double
//         // click to register
//         this.timeSinceLastClick = 0;
//     }
    
    // stop mouse events firing as well
    // e.event.preventDefault();
};

FirstPersonMovement.prototype.onTouchMove = function (e) {
      if ( this.app.xr.active) {
        return;
    }
  
    
    var x = 0;
    var z = 0;
    var forward3 = this.camera.forward;
    var right3 = this.camera.right;
    var force3 = this.force;
    
    var touch = e.touches[0];
    var xDiff = 0;
    xDiff = this.lastTouchPosition.x - touch.x;
    var yDiff = 0;
    yDiff = this.lastTouchPosition.y - touch.y;
    
    
   if( Math.abs(xDiff) > Math.abs(yDiff) ){
        //rotate camera left and right
   
            this.moveCamera(-(this.lastTouchPosition.x - touch.x), -(this.lastTouchPosition.y - touch.y), this.lookSpeed);
     
//         else{
//             if (xDiff > 0) {
               
//                  //Move left
//                 x -= right3.x;
//                 z -= right3.z;
//             }
//             else {
//                 //Move right
//                 x += right3.x;
//                 z += right3.z;
//             } 
//          }
    }   else{
        if ( yDiff > 0){
        //move forward
        x += forward3.x;
        z += forward3.z; 
        this.TouchstartForward = true;
        } else{
        //move backward
        x -= forward3.x;
        z -= forward3.z;
        this.TouchstartBackward = true;
        }
    }
    this.lastTouchPosition.set(touch.x, touch.y);
    

    
    if (x !== 0 && z !== 0) {
        force3.set(x, 0, z).normalize().scale(this.power*1.3);
        this.entity.rigidbody.applyForce(force3);
    }
    
    // stop mouse events firing as well
    e.event.preventDefault();
};

FirstPersonMovement.prototype.moveCamera = function(dx, dy, sensitivity) {
    // Update the current Euler angles, clamp the pitch.
      if (this._paused) {
        return;
    }
    
    if (!this.moved) {
        // first move event can be very large
        this.moved = true;
        return;
    }
       
    this.targetEx -= dy * sensitivity;
    this.targetEx = pc.math.clamp(this.targetEx, -90, 90);
    this.targetEy -= dx * sensitivity;  
};


FirstPersonMovement.prototype._onMouseMove = function (e) {

    
      if (this._paused || this.app.xr.active) {
        return;
    }
    
   if (pc.Mouse.isPointerLocked() || e.buttons[0]){
             this.moveCamera(e.dx, e.dy, this.lookSpeed);  
   }
   
      
        
};

FirstPersonMovement.prototype.getYaw = function (angle) {    
    // var forward2 = this.entity.forward.clone();
    // var forward3 = this.camera.forward.clone();
    // var forward4 = new pc.Vec3();
    // forward4.sub2(forward3,forward2);
    // return Math.atan2(-angle.x, -angle.z);
    var forward4 = this.camera.forward.clone();
    return Math.atan2(-forward4.x, -forward4.z);
    
};

FirstPersonMovement.prototype.getPitch = function(quaternion, yaw) {
    var quatWithoutYaw = this._tempQuat1;
    var yawOffset = this._tempQuat2;
    
    yawOffset.setFromEulerAngles(0, -yaw, 0);
    quatWithoutYaw.mul2(yawOffset, quaternion);
    
    var transformedForward = this._tempVec3_1;
    
    quatWithoutYaw.transformVector(pc.Vec3.FORWARD, transformedForward);
    
    return Math.atan2(transformedForward.y, -transformedForward.z) ;      
};

// Get the dot product between two quaternions
FirstPersonMovement.prototype.dot = function (quat_left, quat_right) {
    var dot = quat_left.x * quat_right.x + quat_left.y * quat_right.y + 
        quat_left.z * quat_right.z + quat_left.w * quat_right.w;

    return dot;
};

// Returns the angle in degrees between two rotations /a/ and /b/.
FirstPersonMovement.prototype.quatAngle = function (quat_a, quat_b) {
    var dot = this.dot(quat_a, quat_b);
    
    if(quat_a.equals(quat_b) )
    {
        return 0;
    }        
    
    var rad2Deg = 1 / (Math.PI / 180);

    var angle = Math.acos(Math.min(Math.abs(dot), 1)) * 2 * rad2Deg;

    return angle;
    
};

FirstPersonMovement.prototype.rotateTowards = function (quat_a, quat_b, degreesDelta) {
    var angle = this.quatAngle(quat_a, quat_b);
        
    if (angle === 0)
    {
        return quat_b;
    }
    
    return new pc.Quat().slerp(quat_a, quat_b, Math.min(1, degreesDelta / angle));
    
};



FirstPersonMovement.prototype.hasCollide = function() {
    // this.force = new pc.Vec3();
    // var force = this.entity.forward.clone().scale(10000);
    // this.entity.rigidbody.applyForce(force);
    // this.movement = false;
};

// FirstPersonMovement.prototype._createCamera = function () {
//     // If user hasn't assigned a camera, create a new one
//     this.camera = new pc.Entity();
//     this.camera.setName("First Person Camera");
//     this.camera.addComponent("camera");
//     this.entity.addChild(this.camera);
//     this.camera.translateLocal(0, 0.5, 0);
// };

FirstPersonMovement.prototype.ChangeState= function(){
    this.entity.rigidbody.enabled = false;
    this.entity.collision.enabled = false;
    
};

FirstPersonMovement.prototype.ChangeBackState= function(){
    this.entity.rigidbody.enabled = true;
    this.entity.collision.enabled = true;
    
};