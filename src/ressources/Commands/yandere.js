var https = require('https');
var banned_tags = ['child', 'childs', 'loli', 'lolis', 'shota', 'shotacon', 'childporn', 'youngs', 'young']


exports.run = (client, message, args) => {
	var url = '/post.json?limit=100&tags=';
	if (!args) url = '/post.json?limit=100';
	else {
		if (banned_tags.indexOf(args.toLowerCase()) > -1 ) return system.shortsend(message.channel, `This tag isn't allowed.`)
		url += args.split(' ').join('+');
	}

	var page;
	var options = {
	  host: 'yande.re',
	  port: 443,
	  path: url
	};
	var req = https.request(options, function(res) {
	 	res.on("data", function (chunk) {
	 	  page += chunk;
      page = page.replace('undefined', '');
	  });
		res.on("end", function() {
			let out = JSON.parse(page)
			if (out.length > 0) {
				let post = out[Math.floor((Math.random()*(out.length-1)))];
				message.channel.send(post.file_url)
			}
      		else return message.channel.send('No images found.');
		});
	});
	req.end();
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 1,
  type: 6
};

exports.help = {
  name: `yandere`,
  description: `Search image on Yande.re (only on NSFW channel).`,
  usage: `${client.settings.prefix}yandere [tag]`
};
