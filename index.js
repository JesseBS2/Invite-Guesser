const Discord = require("discord.js");
const Client = new Discord.Client();


/* 
  THIS CODE WAS MADE ENTIRELY TO SHOW OF DISCORD'S EXPLOITABLE INVITE SYSTEM, PLEASE NEVER USE THIS SCRIPT
  I CAN NOT BE HELD RESPONSIBLE FOR ANY PROBLEMS OR ISSUES CAUSED BY THIS PROGRAM
  
  This bot will create random invite links for Discord, as discord simply uses `discord.gg/` followed by six alpha-numeric characters.
  The code here generates 6 random characters and sends them into your channel every 2.5 seconds.
  Because there are (26*26*10)^6 or 95,428,956,661,680,000,000,000 possible server invite combinations, the odds of this bot guessing one are very low
  I wrote this code on my phone in like 10 minutes out of bordem.

  Does this count as hacking? I think this counts as hacking.
  "A security hacker is someone who explores methods for breaching defenses and exploiting weaknesses in a computer system or network. Hackers may be motivated by a multitude of reasons, such as profit, protest, information gathering, challenge, recreation, or to evaluate system weaknesses to assist in formulating defenses against potential hackers." - Wikipedia
  This code is exploiting Discord's invite system, so I guess it is? All the more reason to not use this program
*/


var Servers = {}
var SETTINGS = {
  token: "your bot token",  // replace "your bot token" with actual bot token
  prefix: "!!"
}


Client.login(SETTINGS.token);

Client.on("ready",() => {
  console.log(">>> Invite Finder Online");
  Client.guilds.cache.forEach(guild => {
    Servers[guild.id] = { // The more servers this bot is in the more memory it will take up,
      "Searching": false,
      "LoopInterval": null
    }
  });
  Client.user.setActivity(SETTINGS.prefix+"commands",{type:"PLAYING"});
});


Client.on("message",async msg => {
  
  if(msg.content === SETTINGS.prefix+"ping"){
    const pingedMessage = await msg.channel.send("Loading...");

    let latency = (Number(pingedMessage.createdTimestamp)-Number(msg.createdTimestamp)).toString()+"ms";
    let ping = (Client.ws.ping).toFixed(2).toString()+"ms";

    pingedMessage.edit("**Ping:** "+ping+"\n**Latency:** "+latency);
  
  }else if(msg.content === SETTINGS.prefix+"commands"){
    return msg.channel.send("`"+SETTINGS.prefix+"ping` - Show bot's ping to server\n`"+SETTINGS.prefix+"commands` - Show this menu\n`"+SETTINGS.prefix+"search` - Start guessing invites\n`"+SETTINGS.prefix+"stop` - Stop guessing invites");  // help menu
  }else if(msg.content === SETTINGS.prefix+"search"){
    if(Servers[msg.guild.id]["searching"] === true)return msg.channel.send("**Already searching in this server**");
    msg.channel.send("**Starting Search**");

    Servers[msg.guild.id]["LoopInterval"] = setInterval(() => {
      var Gen = GenerateLink(); // generate a new link every loop
      if(!msg.channel){ // if the channel isn't found cancel the loop
        clearInterval(Servers[msg.guild.id]["LoopInterval"]);
        Servers[msg.guild.id]["LoopInterval"] = null;
        return;
      }else{
        msg.channel.send("discord.gg/"+Gen);  // Send the link
      }
    },2500);

    Servers[msg.guild.id]["searching"] = true;
    console.log(">> Started Searching in "+msg.guild.name);

  }else if(msg.content === SETTINGS.prefix+"stop"){
    if(Servers[msg.guild.id]["searching"] === false){
      return msg.channel.send("**Not Searching**"); // can't cancel what doesn't exist
    
    }else if(Servers[msg.guild.id]["searching"] === true){
      clearInterval(Servers[msg.guild.id]["LoopInterval"]);
      Servers[msg.guild.id]["LoopInterval"] = null; // Set loop to Null
      Servers[msg.guild.id]["searching"] = false; // Searching is false
      console.log("> Stopped Searching in "+msg.guild.name);
      return msg.channel.send("**Stopped Searching**");
    }
  }
});

function GenerateLink(){
 var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // all characters that are available for discord invites
 var symbols = 6; // length of invites
 var toReturn = "";
 for(var count = 0; count < symbols; count++){  // loop through for length of invite
  toReturn += characters.charAt(Math.round(Math.random()*characters.length-1)); // pick random character from string
 }
 return toReturn;
}
