var myParticleAccessToken = "b48f54efd84db47e6d76303ae3018b116ddac276"
var myDeviceId =        "57004f0005504b464d323520"   // "1c002f000647373034353237"
var topic =                 "BikeProject"


function newProjectEvent(objectContainingData) { //Function called whenever Particle sends out an eevent

      //console.log("JSON Parse Start")


      console.dir(objectContainingData);
      var obj = JSON.parse(objectContainingData.data); //Parses  Data
      sensors.currentSpeed = obj.speed;
      sensors.currentPosition = obj.pos/12;
      sensors.currentDistance = obj.dist;
      //console.log(obj.dist);
      //console.log("JSON Parse Successful")

      sensors.stateChange(); //Calls state change to update state

    }


var sensors = {

  currentSpeed: 0,
  currentPosition: 10,
  currentDistance: -1,
  minDist: 5,
  minSpeed: 2,
  alreadyRung: false,
  lastDistance: 100000,
  oneBackDist: 100000,
  lastPosition: 1000000,
  positionBeefore: 10000000,

  setup: function() { //Cloud Code
      particle = new Particle(); //Particle variable


      function onSuccess(stream) { //Subscribes to event stream
        console.log("getEventStream success")
        stream.on('event', newProjectEvent)

      /*var functionData = { //Tells Particle to publish data to update initial state
             deviceId:myDeviceId,
             name: "publishState",
             argument: "",
             auth: myParticleAccessToken
        }


        particle.callFunction(functionData); *///For setting initial state
      }
      function onFailure(e) { console.log("getEventStream call failed")
                              console.dir(e) }

      particle.getEventStream( { name:topic, auth: myParticleAccessToken, deviceId: myDeviceId }).then(onSuccess, onFailure);

    },

  calcDist: function(){ //Calculates the distance from another person using the speed and position
    this.currentDistance = this.currentSpeed/this.currentPosition;
    this.stateChange();
  },
  setMinDist: function(a){
    this.minDist = a;
    this.stateChange();
  },
  setMinSpeed: function(a){
    this.minSpeed = a;
    this.stateChange();
  },
  setStateChangeListener: function(aListener) { //Sets garageStateUpdate as thee statechangelistner
      this.stateChangeListener = aListener;
      this.stateChange();

    },
    check: function(){
      console.log(this.alreadyRung);
      if(this.currentPosition > this.lastPosition && this.lastPosition > this.positionBefore && this.currentDistance != -1){
        this.alreadyRung = false;
        console.log("Ringer reset");
      }

      if(!this.alreadyRung && this.currentSpeed >= this.minSpeed && this.currentDistance <= this.minDist && this.currentDistance > 0){

        console.log("Ring!");
        console.log("CurrentSpeed: " + this.currentSpeed);
        console.log("minSpeed: " + this.minSpeed);
        console.log("currentDistance: " + this.currentDistance);
        console.log("minDist: " + this.minDist);

        this.lastDistance = this.currentDistance;

        var func = {
                 deviceId:myDeviceId,
                 name: "ring",
                 argument: "",
                 auth: myParticleAccessToken
            }
          function onSuccess(e) { console.log("ring call success") }
          function onFailure(e) { console.log("ring failed")
                                     console.dir(e) }
          particle.callFunction(func).then(onSuccess,onFailure);

        this.alreadyRung = true;
      }
      this.positionBefore = this.lastPosition;
      this.lastPosition = this.currentPosition;
      this.oneBackDist = this.currentDistance;
    },

  stateChange(){ //Updates the State
    this.check();
    var callingObject = this
    //console.log("StateChange - Sent");

    if(callingObject.stateChangeListener){

      var state = {
        currentSpeed: this.currentSpeed,
        currentPosition: this.currentPosition,
        currentDistance: this.currentDistance,
        minDist: this.minDist,
        minSpeed: this.minSpeed,
      }
      callingObject.stateChangeListener(state) //Sends UI without delay
      //setTimeout(function(){callingObject.stateChangeListener(state)}, 1000); //Sends to UI with 1s delay
    }
  },
}
