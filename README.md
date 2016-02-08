Deerkin X
==========

a Deerkin written in Javascript

using:

./configs/irc_config.js
have it connect to your, network/channel/nick of your choice

./configs/db_config.js 
to make it not write to tmp

./configs/web_config.js
have it listen on different port

writing deers

	curl server.tld:port/deer/<deer-name> -d @- < deer.example
	# anything from 0-F, terminate lines with n
	# make sure last line is also terminated with n

to see your new deer

	curl server.tld:port/deer/<deer-name>
