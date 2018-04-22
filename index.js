const Discord = require ("discord.js");
const YTDL = require("ytdl-core");
var bott = {
    PREFIX: "!",
    TOKEN: "NDMyMDIxODQwMzY2NjY1NzM4.Db1M5A.MAZ-aQctC_piLmPJI2ILaBeHgPI",
    AUTHORNAME: "Kim Jong Oink#2750",
    AUTHORDISC: "1129",
    AUTHORUID: "437347463905411072",
    BOTID: "432021840366665738",
    BOTPERMS: "363528",
    BOTSERV: "K3KKNdc",
    THEME: "https://youtu.be/AVS55EzWTMs"
}
var bot = new Discord.Client();

var servers = {};

function play(connection, message) {
	var server = servers[message.guild.id];
	
	server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
	
	server.queue.shift();
	
	server.dispatcher.on("end", function() {
		if (server.queue[0]) play(connection, message);
		else connection.disconnect();
	});
}
 
var ball = [
    "Yes",
    "No",
    "Maybe"
];

bot.on("ready",function(){
    console.log("READY");
    bot.user.setGame("!help");
});

bot.on("guildMemberAdd", function(member) {
	member.guild.channels.find("name", "general").sendMessage(member.toString() + " Welcome New Member To This Amazing Discord Server!");
	
	member.addRole(member.guild.roles.find("name", "Member"));
});
 
bot.on("message", function(message) {
    if (message.author.equals(bot.user))return;
 
    if (!message.content.startsWith(bott.PREFIX)) return;
 
    var args = message.content.substring(bott.PREFIX.length).split(" ");
   
    switch (args[0].toLowerCase()) {
        case "ping":
            console.log(message.author.username +"#"+ message.author.discriminator + " UID "+ message.author.id +" called "+ args[0] +" Server: " + message.guild.name.toString() + ". Channel: #" + message.channel.name.toString() + "." )
            message.channel.send("Pong!");
            break;
        case "pong":
            console.log(message.author.username +"#"+ message.author.discriminator + " UID "+ message.author.id +" called "+ args[0] +" Server: " + message.guild.name.toString() + ". Channel: #" + message.channel.name.toString() + "." )        
            message.channel.send("Ping!");
            break;
        case "8ball":
            console.log(message.author.username +"#"+ message.author.discriminator + " UID "+ message.author.id +" called "+ args[0] +" Server: " + message.guild.name.toString() + ". Channel: #" + message.channel.name.toString() + "." )
            if (args[1]) message.channel.send(ball[Math.floor(Math.random() * ball.length)]);
            else message.channel.send("Please ask something ;-;");
            break;
        case "noticeme":
            console.log(message.author.username +"#"+ message.author.discriminator + " UID "+ message.author.id +" called "+ args[0] +" Server: " + message.guild.name.toString() + ". Channel: #" + message.channel.name.toString() + "." )
            message.channel.send("I've noticed you, " + message.author.toString() + ". Be happy.");
            break;
        case "theme":
            console.log(message.author.username +"#"+ message.author.discriminator + " UID "+ message.author.id +" called "+ args[0] +" Server: " + message.guild.name.toString() + ". Channel: #" + message.channel.name.toString() + "." )
            message.channel.send(bott.THEME);
            break;
        case "invite":
            console.log(message.author.username +"#"+ message.author.discriminator + " UID "+ message.author.id +" called "+ args[0] +" Server: " + message.guild.name.toString() + ". Channel: #" + message.channel.name.toString() + "." )
            if (message.author.id == bott.AUTHORUID) {
                message.author.send("**Invite me to a server:** https://discordapp.com/oauth2/authorize?client_id="+ bott.BOTID +"&scope=bot&permissions=" + bott.BOTPERMS );
                message.channel.send("Sure, "+ bott.AUTHORNAME +". I've DM'ed you the invite link. \nAlso here's a link to the server: https://discord.gg/" + bott.BOTSERV)
            }
            else message.channel.send("You can't invite me to your server. :stuck_out_tongue: My server: https://discord.gg/GpGuNBQ");
            break;
        case "rip":
            console.log(message.author.username +"#"+ message.author.discriminator + " UID "+ message.author.id +" called "+ args[0] +" Server: " + message.guild.name.toString() + ". Channel: #" + message.channel.name.toString() + "." )
            message.channel.send("RIP Moon City, Your time has come. :cry::cry::cry:. You should know that " + message.author.toString() + " is one of these people who still love you. :cry:")
            break;
        case "help":
            console.log(message.author.username +"#"+ message.author.discriminator + " UID "+ message.author.id +" called "+ args[0] +" Server: " + message.guild.name.toString() + ". Channel: #" + message.channel.name.toString() + "." )
            message.channel.send("Check your DMs, " + message.author.toString() + ".")
            message.author.send("**Avabile commands**: \n \n **"+ "ping** - Make me reply *Pong!* \n **" + "pong** - Make me reply *Ping!* \n **"+ "author** - Who is running me? \n **"+ "8ball** - Ask a question and I will reply *Yes*, *No* or *Maybe*. \n **" + "noticeme** - Make me notce you. \n **" + "theme** - Get a link to my theme \n **"+ "rip** - RIP Moon City, Your time has come \n **"+ "invite** - Invite me to your server \n **"+ "help** - Display this")
            break;

        default:
            message.channel.send("I've searched far and wide, but I can't find that command.")
            break;
		case "play":
			if (!args[1]) {
				message.channel.sendMessage("You Need To Provide a Link Bruh");
				return;
			}
			
			if (!message.member.voiceChannel) {
				message.channel.sendMessage("Jump In A Voice Channel First Retard");
				return;
			}
			
			if (!servers[message.guild.id]) servers[message.guild.id] = {
				queue: []
			};
			
			var server = servers[message.guild.id];
			
			server.queue.push(args[1]);
			
			if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
				play(connection, message);
			});
			break;
		case "skip":
			var server = servers[message.guild.id];
			
			if (server.dispatcher) server.dispatcher.end();
			break;
		case "stop":
			var server = servers[message.guild.id];
			
			if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
			break;
    }
});
 
bot.login(bott.TOKEN)