/*
 * MagicMirror2
 * Module: MMM-LaunchSchedule
 *
 * By Terry Reinert
 * 
 */


Module.register("MMM-LaunchSchedule", {
	config:null,

	defaults: {
        updateInterval: ((60 * 60 * 1000) / 15),    // LL2 API allows 15 updates per hour for free
	},

	init: function(){
		Log.log(this.name + " is in init!");
	},

	start: function(){
		Log.log(this.name + " is starting!");

        // update the dom 
        setInterval(function() {
		    this.updateDom();
        }, this.config.updateInterval);
	},

	loaded: function(callback) {
		Log.log(this.name + " is loaded!");
		callback();
	},

	getScripts: function() {
    	return	["moment.js"];
	}, 

	getStyles: function() {
		return 	["MMM-LaunchSchedule.css"];
	},


	// only called if the module header was configured in module config in config.js
	getHeader: function() {
		return this.data.header + " Foo Bar";
	},

	// messages received from other modules and the system (NOT from your node helper)
	// payload is a notification dependent data structure
	notificationReceived: function(notification, payload, sender) {
		// once everybody is loaded up
		if(notification==="ALL_MODULES_STARTED"){
			// send our config to our node_helper
			this.sendSocketNotification("CONFIG",this.config)
		}
		if (sender) {
			Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
		} else {
			Log.log(this.name + " received a system notification: " + notification);
		}
	},

	// messages received from from your node helper (NOT other modules or the system)
	// payload is a notification dependent data structure, up to you to design between module and node_helper
	socketNotificationReceived: function(notification, payload) {
		Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
		if(notification === "message_from_helper"){
			this.config.message = payload;
			// tell mirror runtime that our data has changed,
			// we will be called back at GetDom() to provide the updated content
			this.updateDom(1000)
		}

	},

	// system notification your module is being hidden
	// typically you would stop doing UI updates (getDom/updateDom) if the module is hidden
	suspend: function(){

	},

	// system notification your module is being unhidden/shown
	// typically you would resume doing UI updates (getDom/updateDom) if the module is shown
	resume: function(){

	},

	// this is the major worker of the module, it provides the displayable content for this module
	getDom: function() {
		var wrapper = document.createElement("div");

		// if user supplied message text in its module config, use it
		if(this.config.hasOwnProperty("message")){
			// using text from module config block in config.js
			wrapper.innerHTML = this.config.message;
		}
		else{
		// use hard coded text
			wrapper.innerHTML = "Hello world!";
		}

		// pass the created content back to MM to add to DOM.
		return wrapper;
	},

})
