


//Adafruit_LIS3DH lis = Adafruit_LIS3DH();
#include "src/HC-SR04.h"
#include "src/SparkFunMMA8452Q.h"

const int triggerPin = A0;
const int echoPin = D5;

HC_SR04 rangefinder = HC_SR04(triggerPin, echoPin); //For Distance sensor
MMA8452Q accel; //Constructor for Accelerometer



int publishTime = 1000;

int buzztime = 1000;
int connectTime = 500;
bool buzz = true;
Timer autoPublish(publishTime, publish);
Timer buzzerStuff(buzztime, ringer, true);
//Timer tryConnect(connectTime, attemptConnection, false);
//Timer checkDist(printRange, attemptConnection, false);
String data = "";
double pos = 7;
double acceleration = 0;
double speed = 0;
double dist = 0;
long period1 = 0;
long period2 = 0;
long currentMillis = 0;
bool shouldPublish = false;

const String topic = "BikeProject";
int a;


const int buzzPin = D6;



void setup(){
  bool success = Particle.function("ring",ring);
  Serial.begin(9600);
  pinMode(buzzPin, OUTPUT);
  digitalWrite(buzzPin, LOW);
  rangefinder.init();
  accel.begin(SCALE_2G, ODR_1); // Set up accelerometer with +/-2g range, and slowest (1Hz) ODR
  autoPublish.start();

}

bool currentBuzz = false;

int delayTime = 100; //In Milliseconds
long currentTime = 0;

void loop(){

  if(millis() > currentTime + delayTime){
    currentTime = millis();

    unsigned long start = micros();
    float inch = rangefinder.distInch();
    unsigned long calcTime = micros() - start;
    Serial.printf("Range finding duration: %lu | Distance in inches: %.2f\n", calcTime, inch); //Prints out distancee
    pos = rollingAvg(inch);
    Serial.print("Rolling avg in inches: "); //Prints out position
    Serial.println(pos);

    readAccel(); //Updates variables
    getDist();

  }
  //publish();

  if(shouldPublish){ //Publishes if relevant
    Serial.println("Publishing");
    Serial.print("Dist: ");
    Serial.println(dist);
    Particle.publish(topic, data, 60, PRIVATE);
    shouldPublish = false;
  }
  //Serial.println(getDist());
}

float rollingArray[3] = {-1, -1, -1}; //Takes rolling average of the distances
float total = 0;
float last = 0;
int count = 0;

float avg;
float first;
float second;

float noiseCancel[6] = {0, 0, 0, 0, 0, 0}; //Array for getting rid of noise
int zeroCount = 0;

float speedEstimate(){ //Returns the estimated Speed in inches/second
  if(count >= 3){
    avg = rollingArray[0] - rollingArray[2];
    avg = avg/((delayTime * 2)/1000.0);
    if(avg < 0.15 && avg > -0.15){
      avg = 0;
    }
    noiseCancel[0] = noiseCancel[1];
    noiseCancel[1] = noiseCancel[2];
    noiseCancel[2] = noiseCancel[3];
    noiseCancel[3] = noiseCancel[4];
    noiseCancel[4] = noiseCancel[5];
    noiseCancel[5] = avg;

    for(int k = 0; k < 6; k++){ //Helps get rid of random "high" values from sensor
      if(noiseCancel[k] == 0){
        zeroCount++;
      }
    }
    if(zeroCount >= 3){ //Same as above
      avg = 0;
    }
    Serial.print("Estimated Speed: ");
    Serial.print(avg);
    Serial.println(" inches/sec");
    zeroCount = 0;
    return avg;
 }else{
   return -1;
 }
}


float rollingAvg(float newest){

  if(count < 3){
    rollingArray[count] = newest;
    count++;
    for(int y = 0; y < count; y++){
      total += rollingArray[y];
      total = total/count;
      last = total;
      total = 0;
      return last;
    }
  }else{
    if(newest != -1){
      rollingArray[0] = rollingArray[1];
      rollingArray[1] = rollingArray[2];
      rollingArray[2] = newest;
    }else{
      Serial.println("bad reading");
    }
    for(int x = 0; x < 3; x++){
      if(rollingArray[x] != -1){
        total += rollingArray[x];
      }
    }
    total = total/3;
    last = total;
    total = 0;
    return last;
  }

}

void readAccel(){
  if (accel.available())
    {
		// To update acceleration values from the accelerometer, call accel.read();
        accel.read();


    byte pl = accel.readPL(); //This code just makes sure the sensors are in the right orientation.
    switch (pl){
      case PORTRAIT_U:
      Serial.print("Correct Orientation");
      break;
      case PORTRAIT_D:
      Serial.print("Incorrect Orientation");
      break;
      case LANDSCAPE_R:
      Serial.print("Incorrect Orientation");
      break;
      case LANDSCAPE_L:
      Serial.print("Incorrect Orientation");
      break;
      case LOCKOUT:
    Serial.print("Correct Orientation");
    break;
}
        /*Serial.print("X: ");
        Serial.println(accel.cx); //Code to generally measure orientation, if needed
        Serial.print("Y: ");
        Serial.println(accel.cy);
        Serial.print("Z: ");
        Serial.println(accel.cz);
        Serial.println();*/
    }
}


double getSpeed(){ //returns the current speed
  speed = speedEstimate();
  return speed;
}

double getAccel(){ //returns acceleration/outdated. Only use if want to measure using acelerometer.
  return acceleration;
}

double getPos(){ //returns the position.
  return pos;
}

double getDist(){
  dist = getPos() / getSpeed(); //Returns Distance in seconds
  return dist;
}



const int buzzerPin = D0;

void ringer(){ //Ringer with dif parameters
  ring("");
}
int ring(String args){ //"rings" the buzzer
  Serial.println("Ring!");
  if(buzz){
    Serial.println("Ring On");
    digitalWrite(buzzPin, HIGH);
    buzz = false;
    buzzerStuff.start();
  }else{
    Serial.println("Ring Off");
    digitalWrite(buzzPin, LOW);
    buzz = true;
    buzzerStuff.stop();
  }


}

int publishState(String args){ //For cloud
  publish();
  return 0;
}
void publish() { //Writes info to var data and marks it for publishing

  if(dist < 0){
    dist = 100000;
  }

  data = "{";
  data += "\"pos\":";
  data = data + pos;
  data += ", ";
  data += "\"accel\":";
  data = data + acceleration;
  data += ", ";
  data += "\"speed\":";
  data = data + speed;
  data += ", ";
  data += "\"dist\":";
  data = data + dist;
  data += " }";





  shouldPublish = true; //Marks for publishing

  //Serial.println(data);
}
