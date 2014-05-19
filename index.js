var i2c = require('i2c');

function SeeedOLED(){
   this.wire = new i2c(0x3C, {device: '/dev/i2c-1'});
   this.CommandMode = 0x80;
   this.DataMode = 0x40;
   this.DisplayOffCmd = 0xAE;
   this.DisplayOnCmd = 0xAF;
   this.DisplayNormalDisplayCmd = 0xA6;
}

SeeedOLED.prototype.sendCommand = function(command){
   this.wire.writeBytes(this.CommandMode,[command],function(){});
   //this.wire.writeByte(this.CommandMode,function(){});
   //this.wire.writeByte(command,function(){});
};

SeeedOLED.prototype.sendData = function(data){
   this.wire.writeBytes(this.DataMode,[data],function(){});
   //this.wire.writeByte(this.DataMode,function(){});
   //this.wire.writeByte(data,function(){});
};

SeeedOLED.prototype.init = function(){
   var that = this;
   that.sendCommand(that.DisplayOffCmd);
   setTimeout(function(){
   that.sendCommand(that.DisplayOnCmd);
      setTimeout(function(){
         that.sendCommand(that.NormalDisplayCmd);
      },5);
   },5);
};

SeeedOLED.prototype.setTextXY = function(row,col){
   this.sendCommand(0xB0+row);
   this.sendCommand(0x00 + (8*col & 0x0F));
   this.sendCommand(0x10 + ((8*col>>4) & 0x0F));
}

SeeedOLED.prototype.putChar = function(c) {
   var cc = c.charCodeAt(0);
   if(cc<32 || cc>127){
      cc = ' '.charAtCode(0);
   }
   for(var i=0; i<8; i++){
      this.sendData(0x00);
   }
}

SeeedOLED.prototype.clearDisplay = function(){
   this.sendCommand(this.DisplayOffCmd);
   for(var j=0;j<8;j++){
      this.setTextXY(j,0);
      for(var i=0;i<16;i++){
         this.putChar(' ');
      }
   }   
   this.sendCommand(this.DisplayOnCmd);
}

var oled = new SeeedOLED();

oled.init();
oled.clearDisplay();
