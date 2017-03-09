var Service;
var Characteristic;
var HomebridgeAPI;
var request = require('request');
var inherits = require('util').inherits;


module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    HomebridgeAPI = homebridge;

    homebridge.registerAccessory("homebridge-http-ambient-light", "http-ambient-light", HTTPAmbientLight);
};


function HTTPAmbientLight(log, config) {
    this.log = log;
    this.name = config.name;
    this.getUrl = config.getUrl;
    this.lastRecord = { "light": 90 };
    this.updateInterval = config.updateInterval || 0;
    this.updateInterval = this.updateInterval * 60 * 1000;
 
    // info service
    this.informationService = new Service.AccessoryInformation();
        
    this.informationService
        .setCharacteristic(Characteristic.Manufacturer, config.manufacturer || "ROHM Semiconductor")
        .setCharacteristic(Characteristic.Model, config.model || "BH1750FVI")
        .setCharacteristic(Characteristic.SerialNumber, config.serial || "84ACD5E42542");

    // light sensor service
    this.service_lux = new Service.LightSensor(this.name);

    this.service_lux.getCharacteristic(Characteristic.CurrentAmbientLightLevel)
        .setProps({ minValue: 0, maxValue: 65535, minStep: 1 })
        .on('get', this.getLux.bind(this));

    
    var that = this;
    if (this.updateInterval > 0) {
        setInterval(function() {
            that.getLux(function(err, value) {
                that.service_lux.getCharacteristic(Characteristic.CurrentAmbientLightLevel)
                    .setValue(value);
            });
        }, this.updateInterval);
    }
}


HTTPAmbientLight.prototype.getLux = function(callback) {
    var that = this;
    request(this.getUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            that.lastRecord = JSON.parse(body);
            callback(null, that.lastRecord.light);
        }
    });
};


HTTPAmbientLight.prototype.getServices = function() {
    return [this.informationService, this.service_lux];
};