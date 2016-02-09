#!/usr/bin/env node
// db stuff
var db_config = require('./configs/db_config');
var level = require('level');
var db = level(db_config.db_path);

// helper stuff
var term_color = require('colors');
var irc_color = require('irc-colors');

// prints to term
print_term = function (value, res) {

	for (var i = 0; i < value.length; i++) {
		switch(value.charAt(i)) {
			case '0':
				res.write(term_color.white.bgWhite('@'));
				break;
			case '1':
				res.write(term_color.black.bgBlack('@'));
				break;
			case '2': 
				res.write(term_color.blue.bgBlue('@'));
				break;
			case '3':
				res.write(term_color.green.bgGreen('@'));
				break;
			case '4':
				res.write(term_color.red.bgRed('@'));
				break;
			case '5': 
				res.write(term_color.grey.bgWhite.dim('@'));
				break;
			case '6':
				res.write(term_color.magenta.bgMagenta('@'));
				break;
			case '7':
				res.write(term_color.green.bgGreen('@'));
				break;
			case '8':
				res.write(term_color.yellow.bgYellow('@'));
				break;
			case '9':
				res.write(term_color.green.bgGreen('@'));
				break;
			case 'a': case 'A':
				res.write(term_color.cyan.bgCyan('@'));
				break;
			case 'b': case 'B':
				res.write(term_color.cyan.bgCyan('@'));
				break;
			case 'c': case 'C':
				res.write(term_color.blue.bgBlue('@'));
				break;
			case 'd': case 'D':
				res.write(term_color.red.bgRed('@'));
				break;
			case 'e': case 'E':
				res.write(term_color.white.bgWhite('@'));
				break;
			case 'f': case 'F':
				res.write(term_color.grey.bgWhite.dim('@'));
				break;
			case 'n': case '\n':
				res.write('\n');
				break;
			default:
		}
	}
}

// print message to irc
print_irc = function (value,client,to) {

	var linebuffer = '';
	for (var i = 0; i < value.length; i++) {
		switch(value.charAt(i)) {
			case '0':
				linebuffer+=irc_color.white.bgwhite('@');
				break;
			case '1':
				linebuffer+=irc_color.black.bgblack('@');
				break;
			case '2': 
				linebuffer+=irc_color.navy.bgnavy('@');
				break;
			case '3':
				linebuffer+=irc_color.green.bggreen('@');
				break;
			case '4':
				linebuffer+=irc_color.red.bgred('@');
				break;
			case '5': 
				linebuffer+=irc_color.brown.bgbrown('@');
				break;
			case '6':
				linebuffer+=irc_color.purple.bgpurple('@');
				break;
			case '7':
				linebuffer+=irc_color.olive.bgolive('@');
				break;
			case '8':
				linebuffer+=irc_color.yellow.bgyellow('@');
				break;
			case '9':
				linebuffer+=irc_color.lime.bglime('@');
				break;
			case 'a': case 'A':
				linebuffer+=irc_color.teal.bgteal('@');
				break;
			case 'b': case 'B':
				linebuffer+=irc_color.cyan.bgcyan('@');
				break;
			case 'c': case 'C':
				linebuffer+=irc_color.blue.bgblue('@');
				break;
			case 'd': case 'D':
				linebuffer+=irc_color.pink.bgpink('@');
				break;
			case 'e': case 'E':
				linebuffer+=irc_color.gray.bggray('@');
				break;
			case 'f': case 'F':
				linebuffer+=irc_color.silver.bgsilver('@');
				break;
			case 'n': case '\n':
				// make sure the last line is 
				// terminated with n
				// otherwise it won't be printed
				client.say(to, linebuffer);
				linebuffer = '';
				break;
			default:
		}
	}
}

// express stuff
var web_config = require('./configs/web_config');
var express = require('express');
var app = express();

// CONTROLLERS
read_data = function(req, res, next) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
        data += chunk;
    });
    req.on('end', function() {
        req.body = data;
        next();
    });
};

return_deer = function (req,res, next) {
	db.get(req.params.deerid, function (err,value) {
		if (err) {
			res.status(404);
			res.send("DEER NOT FOUND");
			return;
		}
		
		print_term(value,res);	
		res.send();
	});
};

save_deer = function (req,res,next) {
	db.get(req.params.deerid, function (err,value) {
		if (!err) {
			res.status(401);
			res.write("DEER ALREADY EXISTS");
			res.send();
			return;
		}
		
		if (req.body.match(/[^0-9a-fA-Fn\n]/)) {
			res.status(500);
			res.write("DEER PASSED IN IS INVALID\n");
			res.write("DEER MUST NOT MATCH /[^0-9a-fA-Fn\\n]/\n");
			res.write("SEE /help FOR MORE INFO");

			res.send();
			return;
		}

		db.put(req.params.deerid, req.body);
		res.write("DEER SAVED");
		res.send();
	});
};

usage = function (req,res,next) {
	res.send("null");
}

// ROUTES
// help does nothing right now
app.get(web_config.ROOT+'/help',usage);

// fetch/set deers
app.route(web_config.ROOT+'/deer/:deerid')
	.get(return_deer)
	.post([read_data,save_deer]);

// start listening on config'd port (default: 8080)
app.listen(web_config.port, web_config.address);

// irc client stuff
var irc_config = require('./configs/irc_config');
var irc = require('irc');
var client = new irc.Client(irc_config.server,irc_config.nick,irc_config.options);

// LISTENER FUNCT
on_msg = function (from, to, text, message) {
	// if message contains $NICK:
	if (text.match(RegExp(irc_config.nick+':'))) {
		var thedeer = text.replace(/.*: (.*)/, function (err,grp) {
			return grp;
		});
		db.get(thedeer, function(err,value) {
			if (err) {
//				console.log("NO SUCH DEER: "+thedeer);
				return;
			}
			
			print_irc(value,client,to);
		});
	}
} 

on_invite = function(channel, from, message) {
	client.join(channel);
}

// begin listening for messages
client.addListener('message#',on_msg);

// listen for invites
client.addListener('invite',on_invite);
