

sensors.setup(); //Initial Setup
sensors.setStateChangeListener(projectStateUpdate);



document.getElementById("connect-page").hidden = false;
document.getElementById("main-page").hidden = true; //Setting Initial Variables & States
document.getElementById("advanced-page").hidden = true;
document.getElementById("button-connect-main").hidden = true;
document.getElementById("button-advanced-info").hidden = true;
document.getElementById("button-info-advanced").hidden = true;
document.getElementById("info").hidden = true;

function loadingScreen(){ //Loading screen in case sensors are down
  document.getElementById("button-connect-main").hidden = false;
  document.getElementById("status-data").innerHTML = "Connected!"
}
function projectStateUpdate(newState){
  console.dir(newState);
  if(newState.currentDistance != -1){
    loadingScreen();
  }
  if(newState.currentSpeed < 300 && newState.currentSpeed > -300){ //Gets rid of noise from snsors
    document.getElementById("accel-data").innerHTML = Math.floor(~~newState.currentSpeed * 100)/100;
  }
  document.getElementById("pos-data").innerHTML = Math.floor(newState.currentPosition * 100)/100; //All of the UI updates. Simplified to 2 significant figures.
  if(newState.currentDistance == 0 || newState.currentDistance == 100000 || newState.currentDistance > 40){
    document.getElementById("dist-data").innerHTML = "N/A"
  }else{
    document.getElementById("dist-data").innerHTML = Math.floor(newState.currentDistance * 100)/100;
  }

}

document.getElementById("mindistslider").addEventListener("change", function(){
  document.getElementById("min-dist-data").innerHTML = mindistslider.value;
  sensors.setMinDist(mindistslider.value);
})
document.getElementById("minspeedslider").addEventListener("change", function(){
  document.getElementById("min-speed-data").innerHTML = minspeedslider.value;
  sensors.setMinSpeed(minspeedslider.value);
})
document.getElementById("button-connect-main").addEventListener("click", function() { //Event Listeners for the Transition Buttons
   document.getElementById("connect-page").hidden = true;
   document.getElementById("main-page").hidden = false;
})

document.getElementById("button-main-connect").addEventListener("click", function() { //Event Listeners for the Transition Buttons
   document.getElementById("connect-page").hidden = false;
   document.getElementById("main-page").hidden = true;
})

document.getElementById("button-main-connect").addEventListener("click", function() { //Event Listeners for the Transition Buttons
   document.getElementById("connect-page").hidden = false;
   document.getElementById("main-page").hidden = true;
})

document.getElementById("button-main-advanced").addEventListener("click", function() { //Event Listeners for the Transition Buttons
   document.getElementById("main-page").hidden = true;
   document.getElementById("advanced-page").hidden = false;
   document.getElementById("button-advanced-info").hidden = false;
   document.getElementById("info-page").hidden = true;
})

document.getElementById("button-advanced-info").addEventListener("click", function() { //Event Listeners for the Transition Buttons
   document.getElementById("info-page").hidden = false;
   document.getElementById("advanced-page").hidden = true;
   document.getElementById("button-advanced-info").hidden = true;
   document.getElementById("button-info-advanced").hidden = false;
   document.getElementById("info").hidden = false;
})

document.getElementById("button-info-advanced").addEventListener("click", function() { //Event Listeners for the Transition Buttons
   document.getElementById("info-page").hidden = true;
   document.getElementById("advanced-page").hidden = false;
   document.getElementById("button-advanced-info").hidden = false;
  document.getElementById("button-info-advanced").hidden = true;
   document.getElementById("info").hidden = true;
})


document.getElementById("button-advanced-main").addEventListener("click", function() { //Event Listeners for the Transition Buttons
   document.getElementById("main-page").hidden = false;
   document.getElementById("advanced-page").hidden = true;
})
