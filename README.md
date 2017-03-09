# homebridge-http-ambient-light

Homebridge plugin for a light sensor that can be accessed via HTTP. I would suggest getting an ESP8266 or an Arduino with an Ethernet shield as well as a light sensor that is compatible with those like the BH1750 for instance.

## Installation

Run the following command
```
npm install -g homebridge-http-ambient-light
```

Chances are you are going to need sudo with that.

## Config.json

This is an example configuration

```
"accessories" : [
    
    {
        "accessory": "http-ambient-light",
        "name": "Outdoor Light Sensor",
        "getUrl": "http://192.168.2.86:22222/bh1750",
        "serial" : "CA2B60B4213E",
        "updateInterval" : 15
    }
]    
```

| Key           | Description                                                                        |
|---------------|------------------------------------------------------------------------------------|
| accessory     | Required. Has to be "http-ambient-light"                                             |
| name          | Required. The name of this accessory. This will appear in your homekit app         |
| getUrl         | Required. The url from where this plugin will try to update its data. |
| serial         | Optional. Assigns a serial number. Not really required but I would advise in making up some arbitrary string. |
| updateInterval | Optional. If you set a number here, the plugin will periodically fetch data from the URL. The value is in minutes. |

## Format of the data source

This plugin expects a JSON formatted output when fetching data like this example shows
```
 { "light": 0 }
```
The value is expected to be an integer.
