# Embedded Car Sensors

This is a public reupload of a prototype embedded car sensor app initially built for CSE222S and expanded on afterwards.

This repo has two parts: An HTML/Javascript App that can run on Phone, Tablet, or Browser, and Particle Microcontroller Software that is designed to detect incoming obstacles using an ultrasonic sensor and accelerometer. 

The Browser app connects to the Microcontroller using Bluetooth LE or Wifi and sends updates about speed, acceleration, and nearby obstacles. The Browser app may also be used to configure the Microcontroller software to adjust the sensitivity and proximity alarm.

The Microcontroller contains an MMA8452Q Triple Axis Accelerometer, an HC-SRO4 ultrasonic distance sensor, and an alarm (See Diagram in docs/developer). In its default configuration, the microcontroller will track acceleration, velocity, and distance from nearby objects. When the car is projected to collide with a nearby object within 5 seconds, the alarm will sound.


## Sub Directories

* 'docs' contains documentation regarding the original proposal, as well as current documentation for developer and user.
* 'docs/proposal' contains the proposal
* 'docs/developer' contains the developer documentation
* 'docs/reports' contains the weekly reports for the project
* 'lib' is a library used for the HC-SRO4 ultrasonic distance sensor, and includes default example usages
* 'project' contains the code for the project itself. The js, html, and css is contained directly in this parent folder
* 'project/src' contains libraries used for the project, namely for the HC-SR04 sensor and the MMA8452Q Accelerometer
* 'project/particle' contains the .ino file for the particle & sensors
