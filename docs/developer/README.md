#Setup


To setup the device, obtain a particle photon, and wire it as shown in the fritzing diagram contained in the developer folder. You will need a photon, jumper wires, an HC-SRO4 ultrasonic distance sensor, a Piezo buzzer and a SparkFun MMA8452Q accelerometer. You will need to register your particle and make sure it can access thee particle.io console.


On the JS side, you will need to place your particleAccessToken and deviceID at in the corresponding myParticleAccessToken and myDeviceId variables in project.js.


After that, simply access the app using cordova, or open the html directly on a webpage. If the particle is plugged in and connected to particle.io, and both the access token and device ID are correct, the sensor will begin working automatically.

# App-side

Note: The Desktop/PC website is under Project, whereas the mobile/cordova app is under BikeProject. Bike Project is the intended usage, whereas Project is just in here for historical documentation. This is meant to be used as an app.


There are four files for the App-side of this project:

* project.html - html for the app on regular desktop
* index.html - html for the app on mobile (cordova)
* project.css - css for the app
* projectApp.js - javascript underlying the app. This file deals with the application itself and makes any necessary visual changes and data is exchanged. It never directly interacts with the hardware or Particle.io, and only exchanges information through project.js.
* project.js - javascript underlying the app. This file deals with the application's communication to the hardware through particle.io and any underlying calculations that need to be done with the data. It does not directly interact with the App, and can only update information on the app by passing information to projectApp.js


##ProjectApp.js

This file primarily contains eventListeners corresponding to the buttons and sliders of the app, and updates the app with new information as necessary.


It communicates to project.js by calling methods of the object literal 'sensors', contained within the project.js file. It receives data from project.js through projectStateUpdate().


##Project.js


This file contains all of the communication with the particle through particle.io, and with projectApp.js. For ease of use, most of the file's functions are contained in the object literal 'sensors'.


This file receives information from the particle by subscribing to the eventStream is sensors.setup(), and receives a new 'objectContainingData' in newProjectEvent anytime particle.io publishes an event. It then sets its own relevant variables using this data, uses those variables in sensors.check() to decide whether to ring the bell (if so, it calls the particle function 'ring'), and passes data to projectApp through sensors.stateChange().



#Hardware


There is a single file controlling the hardware:


* particle/project.ino - this is the actual particle code that interacts directly with the hardware
* resources/particle/particle.min.js - misc file dealing with particle. Do not change.
* src/HC-SRO4.h & src/HC-SRO4.cpp - library files that project.ino uses to communicate with the distance sensor. Do not change.
* src/SparkFunMMA8452Q.h & src/SparkFunMMA8452Q.cpp - library files that project.ino uses to communicate with the acelerometer. Do not change


##project.ino


Relevant functions:


* setup(): Generic setup function. Initializes distance sensor using rangefinder.init() and accelerometer using accel.begin(SCALE_2G, ODR_1). Also sets up pins for the buzzer and begins autoPublish timer, which publishes data to particle.io every publishTime milliseconds.
* loop(): Generic loop function. Takes data from distance sensor using rangefinder.distInch() and passes the data to rollingAvg(). Also calls publish() and publishes information if needed using the if statement at the bottom.
* speedEstimate(): Estimates speed based on the change in distance overtime. The Distance sensor produces a lot of random noise, so the function uses two if statements to remove most of it. The first rounds any speed where 0.15 > speed > -0.15 to 0, since the distance sensor often produces small changes in distance that causes the distance sensor to register very small changes in movement where there is none. The sensor also, occasionally produces very large changes in distance for very short period of times. This is solved using an if statement checking the array noiseCancel, which will round the speed to 0 if at least half of the recent speed readings were 0.
* readAccel(): Shows the orientation of the sensor. Can be read on monitor. Here to make sure the sensor is correctly orientated.
* rollingAvg(): provides a rollingAvg of the distances, since the distance sensor often produces small variations at random.
* getSpeed(), getAccel(), getPos(), getDist(): Getter methods used primarily by publish(). Can be modified to manipulate the data if needed.
* ringer(), ring(): Methods that ring the bell for a period of time determined by buzzTime. ringer() is a particle function, while ring is just a non-particle function caller of ringer().
* publish(), publishState(): Prepares the data into a JSON format and marks it for publishing by the loop. publishState() is a particle function caller of publish().
