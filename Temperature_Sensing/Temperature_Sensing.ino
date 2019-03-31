#include <ESP8266WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <private.h>
#define myPeriodic 15 //in sec | Thingspeak pub is 15sec
#define ONE_WIRE_BUS 14
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);
float prevTemp = 0;
const char* server = "api.thingspeak.com";
const char* aws = "ec2-13-124-136-39.ap-northeast-2.compute.amazonaws.com";
String url = "/data?";
String apiKey = APIK;
const char* MY_SSID = SSID;
const char* MY_PWD = PASS;
int sent = 0;
int seq = 0; 
void setup() {
  Serial.begin(115200);
  connectWifi();
}

void loop() {
  float temp;
  //char buffer[10];
  DS18B20.requestTemperatures();
  temp = DS18B20.getTempCByIndex(0);
  //String tempC = dtostrf(temp, 4, 1, buffer);//handled in sendTemp()
  Serial.print(String(sent) + " Temperature: ");
  Serial.println(temp);

  //if (temp != prevTemp)
  //{
  //sendTeperatureTS(temp);
  //prevTemp = temp;
  //}

  sendTeperatureTS(temp);
  int count = myPeriodic;
  while (count--)
    delay(1000);
}

void connectWifi()
{
  Serial.print("Connecting to " + *MY_SSID);
  WiFi.begin(MY_SSID, MY_PWD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("Connected");
  Serial.println("");
}//end connect

void sendTeperatureTS(float temp)
{
  WiFiClient client;

  if (client.connect(server, 80)) { // use ip 184.106.153.149 or api.thingspeak.com
    Serial.println("WiFi Client connected ");

    String postStr = apiKey;
    postStr += "&field1=";
    postStr += String(temp);
    postStr += "\r\n\r\n";

    client.print("POST /update HTTP/1.1\n");
    client.print("Host: api.thingspeak.com\n");
    client.print("Connection: close\n");
    client.print("X-THINGSPEAKAPIKEY: " + apiKey + "\n");
    client.print("Content-Type: application/x-www-form-urlencoded\n");
    client.print("Content-Length: ");
    client.print(postStr.length());
    client.print("\n\n");
    client.print(postStr);




  }//end if
  if (client.connect(aws, 8080)) {

    Serial.println("AWS Client connected ");
    String data = "seq=" + String(seq++) + "&device=ds18b20&type=T&" + String("value=") + String(temp);

    String getheader = "GET " + String(url) + String(data) + " HTTP/1.1";
    client.println(getheader);
    client.println("User-Agent: cheoulwon");
    client.println("Host : " + String(aws));
    client.println("Connection: close");
    client.println();

    Serial.println(getheader);

  }
  sent++;
  delay(45000);
  client.stop();
}//end sendqol
