console.log("© Copyright Joshua Vaughan");

var music_number = 0;
var skippable = false;
var music_songs = require("./songlist.json");
var encoder = undefined;
var prefix = "?";

var Discordie = require("discordie");
var client = new Discordie({
	autoReconnect: true
});

client.connect({
	token: "NDc0Mjg5Njk0ODg5NDc2MTI3.DkSMUw.g7uu-3wOc8ny6ai7dUlGSRBGi-g"
});

client.Dispatcher.on("GATEWAY_READY", e => {
	console.log("Connected");
	client.Guilds.get("473992496570040332").voiceChannels[0].join(false, true);
	setTimeout(music_play, 5000);
});

function music_play() {
	var number = Math.floor(Math.random() * 3) + 1;
	if (music_number >= 5) {
		if (number == 1) {
			var music_selected = "./voices/Josh_Intro.wav";
		};
		if (number == 2) {
			var music_selected = "./voices/Lux_Intro.wav";
		};
		if (number == 3) {
			var music_selected = "./voices/Enty_Intro.wav";
		};
		skippable = false;
		music_number = 0;
	}
	else {
		var music_selected = music_songs[Math.floor(Math.random() * music_songs.length)];
		client.User.setGame({
			type: 2,
			name: "🎵 " + music_selected.substr(8).replace(".mp3", "")
		});
		skippable = true;
		music_number = music_number + 1;
	};
	encoder = client.VoiceConnections[0].voiceConnection.createExternalEncoder({
		type: "ffmpeg",
		format: "pcm",
		outputArgs: ["-af", "volume=0.2"],
		source: music_selected
	});
	encoder.play();
	encoder.once("end", () => {
		music_play();
	});
};

client.Dispatcher.on("MESSAGE_CREATE", e => {
	if (e.message.content.toLowerCase() == prefix + "restart") {
		if (e.message.author.id == "439081159620689940") {
			console.log("Shutting down...");
			e.message.reply("Shutting down... :exclamation:");
			client.disconnect();
		};
	};
	if (e.message.content.toLowerCase() == prefix + "skip") {
		if (e.message.member.hasRole(e.message.guild.roles[4])) {
			if (skippable == true) {
				e.message.reply("Skipping... :twisted_rightwards_arrows:");
				encoder.destroy();
				music_play();
			}
			else {
				e.message.reply("You can't skip this song! :warning:");
			};
		}
		else {
			e.message.reply("You need to be premium to do that! :warning:");
		};
	};
	if (e.message.content.toLowerCase().startsWith(prefix + "warn")) {
		if (e.message.member.hasRole(e.message.guild.roles[3])) {
			if (e.message.mentions[0]) {
				if (e.message.mentions[0].memberOf("473992496570040332").hasRole(e.message.guild.roles[7])) {
					e.message.reply("That user is already warned! :warning:")
				}
				else {
					e.message.mentions[0].memberOf("473992496570040332").assignRole(e.message.guild.roles[7])
					e.message.reply("Warned " + e.message.mentions[0].mention + " :rage:")
				};
			} 
			else {
				e.message.reply("You didn't mention anybody! :warning:")
			};
		}
		else {
			e.message.reply("You need to be a moderator to do that! :warning:")
		};
	};
	if (e.message.content.toLowerCase() == prefix + "shop") {
		e.message.reply("<https://shop.spreadshirt.co.uk/peace-merch/> :shirt:")
	};
});

client.Dispatcher.on("GUILD_MEMBER_ADD", e => {
	e.guild.textChannels[4].sendMessage(e.member.mention + ", Welcome! Make sure to read " + e.guild.textChannels[1].mention + "! :wave:")
	e.member.assignRole(e.guild.roles[5]);
});