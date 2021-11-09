

# 1. Description


The expected users are bikers. People often get into bike accidents because of fast traveling bikes & people not noticing when a bike is coming up behind them. My solution is have an automatic bike ringer that senses when you are coming up behind someone, alerting them to get out of the way.

This app will be connected over the cloud to a Particle position sensor that you place on the front of your bike or scooter. This device will sense whether you're approaching a person and will play a ringing sound automatically to alert them. This app will also be connected to a motion sensor to tell how fast you're biking and/or scootering.

The user can set how far in advance you want the app to play the ringing sound. For example, the user may set it so that his bike rings 10 seconds in advance of approaching a person. The app will use the position and velocity of the vehicle to calculate how many seconds you are away from the person, and ring at the proper time.



This is useful and has merit as it will help keep people from getting hurt by getting hit by bikes. It gives people a heads up.


# 2. Hardware and Cloud Infrastructure Needed

## Hardware:

1. GP2Y0A710K0F 100-550cm IR Distance sensor (as seen here: https://acroname.com/sites/default/files/assets/sharp_gp2y0a710yk0f_datasheet.pdf)

2. ADXL362 accelerometer (as seen here: https://www.analog.com/media/en/technical-documentation/data-sheets/ADXL362.pdf) to calculate speed, or a particle/arduino speedometer if it would work better.

3. A Piezzo Buzzer that comes with the particle toolkit to simulate the "ringing" sound

4. A toy car (Or some other toy/model "vehicle" to simulate a bike) for testing the device


## Cloud Infrastructure:

1. Particle.io

# 3. Unknowns and Challenges


It's not yet clear how I'm going to connect the Particle to a toy car, or other toy vehicle, or if I'll have to do tests using an actual bike and film it as a sort of "video demo." This shouldn't be too hard to figure out, but a lot of it will depend on how the Particle & sensors are set up.


I have not used the Accelerometer, Buzzer, or IR Distance sensor before. I don't think it will be too difficult to learn, but it will be something I will have to figure out.


I also don't know if Particle.io works differently on an app than a regular webpage. I have a small amount of experience with app-building, and the UI should be quite simple, but I might have to learn a bit more to do this.


# 4. User Stories & Usage Scenarios


**General Use**:
A user sets the app to ring the bell when the bike is 10 seconds away from a person. As the user approaches a person on his bike, the app calculates using speedometer and distance sensor data that the person is 15 seconds away. The app waits for the user to approach for 5 seconds, and then sees that the user is 10 seconds away from the person. It then sends out a signal to the bell to ring.


**Ring Restriction Feature:**
A user sets the app to only ring when the bike is moving at faster than 5 mph. After a biking trip, the user walks his bike to the bike-rack. The app senses from the distance sensor that the bike is approaching an object, but doesn't send a signal to ring, because the accleration & position data shows that the bike is moving at too slow a speed.


**Warning Feature:**
A user sets the app to ring the bell when the bike is 1 second away from a person. The app warns the user that at least 5 seconds is recommended, so the user changes the time to 6 seconds instead.


**Disconnect Feature:**
A user disconnects the sensor/bell device from his phone before riding his trip. Upon approaching a person, the bell does not go off, as it requires the app to tell it to do so.


# 5. Paper Prototypes


[This is a link to the Full Paper Prototype](https://raw.githubusercontent.com/wustl-cse222-fs19/project-project_plan_will_martin/master/docs/proposal/diagrams/Full%20Paper%20Prototype.jpeg?token=ALEHKGISJIK3D7P5GZBQEX252OBH6)

The user starts on the Disconnected screen. If they try to connect to the Event Stream by pressing the button, and it fails, it will send them to the Failed Connection Screen. If they try to connect and it succeeds, it sends them to the main screen.


The main screen shows the distance the sensor is away from the nearest object, how fast the sensor (and Bike) is traveling, and how soon the sensor (And Bike) will collide with the nearest object and current speed. Clicking Disconnect sends you back to the Disconnect Page, and clicking advanced sends you to the advanced options page.


The Advanced Options has a slider for the minimum distance the bike has to be before the device rings, and a slider for the minimum speed the bike has to be going for the device to ring. It also includes the current settings for both sliders, and the Particle ID if that needs to be used. Clicking back sends you back to the main screen. If you click the information button at the top, it sends you to the info screen (Explanation below)


[This is a link to a Zoomed in Photo of the Info Screen](https://github.com/wustl-cse222-fs19/project-project_plan_will_martin/blob/master/docs/proposal/diagrams/Zoomed%20In%20Paper%20Prototype%20Info%20Screen.jpeg?raw=true)


The info screen just displays information about what each slider means. Namely, the Min Distance slider refers to the minimum distance in time from the nearest object you have to be so that the bell will ring, and the min speed slider refers to the minimum speed the bike has to be going for the bell will ring.



[This is a link to a Zoomed in Photo of everything but the Info Screen](https://raw.githubusercontent.com/wustl-cse222-fs19/project-project_plan_will_martin/master/docs/proposal/diagrams/Zoomed%20In%20Paper%20Prototype%20without%20Info%20Screen.jpeg?token=ALEHKGM6GFEZKTXJY22CBGK52OA7Q)



# 6. Implementation: Sequence Diagrams


[Ringing Procedure](https://raw.githubusercontent.com/wustl-cse222-fs19/project-project_plan_will_martin/master/docs/proposal/diagrams/RingProcedure.png?token=ALEHKGMBN2QO6VGJVQD6EP252OBFM)


The Particle Photon sends regular updates to Particle.io in the form of events containing full state. This state includes the speed of the sensor and the distance from the nearest object (Other than the bike on which the photon & sensors are mounted, of course).


The app is connected to an event stream that listens for these events. It calculates the time before which the sensor/bike will collide into the nearest object based on speed and location data, and when it passes a certain threshold (As set in the previously mentioned advanced data screen), the app will call the Particle cloud function ring(), which will activate the buzzer, "ringing" the bell.


The code for the sequence diagram is below.


```code
title Ringing Procedure

participant Photon
participant Particle.io
participant App

Photon->Particle.io: Distance & Acceleration State
Note over Photon, Particle.io: Sent as Event every half second
Particle.io->App: Distance & Acceleration State
App->Particle.io:Call to Ring()
Particle.io->Photon:Call to Ring()
```

[Setting Defaults & Warnings](https://raw.githubusercontent.com/wustl-cse222-fs19/project-project_plan_will_martin/master/docs/proposal/diagrams/RingTimeAndWarning.png?token=ALEHKGMNGU5Z5VRP36Q7SOS52OBGW)

The user can use the app to change the minimum distance time on the app, but if it's below the recommended amount (It's recommended that the app ring the bell 5 seconds in advance), then the app will display a warning. The user can then either ignore the warning or change the distance to a time above the recommended minimum.


Upon making that decision, the app updates the GUI to show the new time.


```code
title Setting Defaults & Warning



participant App
participant User

note over User, App: Time before ring set by User using App slider
User->App: Sets time before ring to 1 second
App->User: Warning Message Displayed: 5 seconds recommended
User->App: Changes time before ring to 6 second

App->User: Displays new Time before Ring
```


[Setting Defaults & Warnings 2](https://raw.githubusercontent.com/wustl-cse222-fs19/project-project_plan_will_martin/master/docs/proposal/diagrams/MinSpeedandWarning.png?token=ALEHKGK72LD72VO5THG43QC52OBT2)


This is the same thing as the above, but with the Min Speed Slider.



# 7. Plan and Schedule

## Weekly Schedule / Progress

| Week End     | Deliverables & Accomplishments |
|:-------------|:-------------------------------|
| By Nov 16    | Webpage built with needed buttons that's able to communicate with particle using events|
| By Nov. 23   | Piezzo Buzzer set up, able to be called by webpage when appropriate. Accelerometer set up & sends data to webpage through cloud. Fallback: Accelerometer may be difficult, at least get Piezzo set up right.  |
| By Nov. 30   | Webpage is now a Mobile App & the IR Distance Sensor is working and sends data to webpage through cloud Note: IR Distance Sensor may be difficult, should experiment with it before the deadline week.|
| Dec. 3       |  Complete Project Due!         |

## Group Member Responsibilities (Groups only)

N/A


| Name         | Responsibilities |
|:-------------|:-----------------|
|              |                  |
|              |                  |



## Times Reserved for Project Work

Fill in a schedule of times reserved for the project.  If you can't set regular weekly times, create a schedule based on specific days.

| Week Day | Times | Who (if on a team) |
|:---------|:------|--------------------|
| Monday   | 6:00 - 7:00      |                    |
| Tuesday  | 5:30 - 7:30      |                    |
| Wednesday| 5:30 - 6:30 if needed      |                    |
| Thursday | 6:00 - 7:30 or until Weekly goals are finished      |                    |
| Friday   |       |                    |
| Saturday |       |                    |
| Sunday   |       |                    |


## Bonus Credit

- This project uses the ADXL362 Accelerometer, GP2Y0A710K0F 100-550cm IR Distance sensor, and Piezzo Buzzer, none of which are used in class
- This project has a unique design in that the particle & sensors will be mounted to a bike (Or, for demonstration, a toy car)
- This project has unique merit in that this project will prevent me from being hit by bikers while walking to Internet of Things studio
