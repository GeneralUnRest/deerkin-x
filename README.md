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

	curl server.tld:port/deer/<deer-name> --data-binary @- < deer.example
	# if using --data-binary, you can omit the use of n char
	# --data-binary sends the newlines just fine 
	# anything from 0-F, terminate lines with n or \n
	# make sure last line is also terminated with n or \n
	# please do not mix use of n and an actual newline (\n)

to see your new deer

	curl server.tld:port/deer/<deer-name>

if you want to make your own deer in your text editor you might be interested in

https://github.com/GeneralUnRest/vim-deerkin-syntax-highlight
