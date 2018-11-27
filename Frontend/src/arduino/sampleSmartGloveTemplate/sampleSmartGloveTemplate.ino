int pinky_top = 11;
int pinky_middle = 13;
int pinky_bottom = 12;
int pinky_nail = A0;

int ring_top = 10;
int ring_middle = 9;
int ring_bottom = 8;
int ring_nail = A1;

int middle_top = 7;
int middle_middle = 5;
int middle_bottom = 6;
int middle_nail = A2;

int index_top = 2;
int index_middle = 3;
int index_bottom = 4;
int index_nail = A4;

int pinky_top_value;
int pinky_middle_value; 
int pinky_bottom_value; 
int pinky_nail_value;

int ring_top_value;
int ring_middle_value; 
int ring_bottom_value; 
int ring_nail_value; 

int middle_top_value;
int middle_middle_value;  
int middle_bottom_value; 
int middle_nail_value;

int index_top_value;
int index_middle_value;
int index_bottom_value; 
int index_nail_value;


void setup() {
  
  pinMode(pinky_top, INPUT);
  pinMode(pinky_middle, INPUT);
  pinMode(pinky_bottom, INPUT);
  pinMode(pinky_nail, INPUT);
  
  pinMode(index_top, INPUT);
  pinMode(index_middle, INPUT);
  pinMode(index_bottom, INPUT);
  pinMode(index_nail, INPUT);
  
  pinMode(middle_top, INPUT);
  pinMode(middle_middle, INPUT);
  pinMode(middle_bottom, INPUT);
  pinMode(middle_nail, INPUT);
  
  pinMode(ring_top, INPUT);
  pinMode(ring_middle, INPUT);
  pinMode(ring_bottom, INPUT);
  pinMode(ring_nail, INPUT);
  
  Serial.begin(57600);
}

void loop() { 

  pinky_top_value = readCapacitivePin(pinky_top); 
  pinky_middle_value = readCapacitivePin(pinky_middle);
  pinky_bottom_value = readCapacitivePin(pinky_bottom);
  pinky_nail_value = readCapacitivePin(pinky_nail);

  ring_top_value = readCapacitivePin(ring_top); 
  ring_middle_value = readCapacitivePin(ring_middle);
  ring_bottom_value = readCapacitivePin(ring_bottom);
  ring_nail_value = readCapacitivePin(ring_nail);

  middle_top_value = readCapacitivePin(middle_top); 
  middle_middle_value = readCapacitivePin(middle_middle);
  middle_bottom_value = readCapacitivePin(middle_bottom);
  middle_nail_value = readCapacitivePin(middle_nail);

  index_top_value = readCapacitivePin(index_top); 
  index_middle_value = readCapacitivePin(index_middle);
  index_bottom_value = readCapacitivePin(index_bottom);
  index_nail_value = readCapacitivePin(index_nail);
  
  if(pinky_top_value == 0)    { sendStr(String(pinky_top)); }
  if(pinky_middle_value == 0) { sendStr(String(pinky_middle)); }
  if(pinky_bottom_value == 0) { sendStr(String(pinky_bottom)); }
  if(pinky_nail_value == 0)   { sendStr(String(pinky_nail)); }

  if(ring_top_value == 0)     { sendStr(String(ring_top)); }
  if(ring_middle_value == 0)  { sendStr(String(ring_middle)); }
  if(ring_bottom_value == 0)  { sendStr(String(ring_bottom)); }
  if(ring_nail_value == 0)    { sendStr(String(ring_nail)); }

  if(middle_top_value == 0)   { sendStr(String(middle_top)); }
  if(middle_middle_value == 0){ sendStr(String(middle_middle)); }
  if(middle_bottom_value == 0){ sendStr(String(middle_bottom)); }
  if(middle_nail_value == 0)  { sendStr(String(middle_nail)); }

  if(index_top_value == 0)    { sendStr(String(index_top)); }   
  if(index_middle_value == 0) { sendStr(String(index_middle)); }
  if(index_bottom_value == 0) { sendStr(String(index_bottom)); }
  if(index_nail_value == 0)   { sendStr(String(index_nail)); }
}

void sendStr(String sendString){ 
  Serial.println(sendString);  
  Serial.flush();
};
 

 


 


