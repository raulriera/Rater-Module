/* 

Rater Module for Appcelerator Titanium

About:
Created by Greg Pierce, http://agiletortoise.com
Modified by Raul Riera, http://raulriera.com

*/

var Rater = {
	appName: '',
	appId: '',
	appLaunches: 20,
	appUsageInSeconds: 0 // 0 if you don't want to use this
};

Rater.data = {
	launchCount: 0,
	timeUsed: 0,
	neverRemind: false
};

Rater.startUsageTimer = function(){
	Rater.usageTimerInterval = setInterval(function() {
	    Rater.data.timeUsed++;

	    // Debugging
	    // Ti.API.info(Rater.data.timeUsed + " seconds of app usage");

	    // Check if the desired usage time has been reached
	    if(Rater.data.timeUsed === Rater.appUsageInSeconds) {
	    	// Pause the timer
	    	Rater.pauseUsageTimer();
	    	// Open the rating dialog
	    	Rater.openRateDialog();
	    }                    
	}, 1000);
};

Rater.pauseUsageTimer = function(){
	clearInterval(Rater.usageTimerInterval);
};

Rater.initUsageCounter = function(){
	// Check if the user wants to use this feature
	if (Rater.appUsageInSeconds > 0) {
		Rater.startUsageTimer();
	}
};

Rater.load = function(){
	// Read the data
	Rater.read();

	// Increase the launch count
	Rater.data.launchCount++;

	// Init the usage counter
	Rater.initUsageCounter();

	// Save the data
	Rater.save();
};

Rater.read = function(){
	var prop = Ti.App.Properties.getString("RaterData", null);
	if(prop) {
		Rater.data = JSON.parse(prop);
	}
};

Rater.save = function(){
	Ti.App.Properties.setString("RaterData", JSON.stringify(Rater.data));
};

Rater.run = function(){
	
	if(Rater.data.neverRemind || Rater.data.launchCount % Rater.appLaunches != 0) { return; }

	Rater.openRateDialog();
};

Rater.openRateDialog = function(){
	var a = Ti.UI.createAlertDialog({
		title: L("rating_title"),
		message: String.format(L('rating_message'), Rater.appName),
		buttonNames: [L("rating_option_1"), L("rating_option_2"), L("rating_option_3")],
		cancel: 2
	});

	a.addEventListener('click',function(e){
		switch(e.index) {
			case 0 : // rate
				Rater.data.neverRemind = true;
				Rater.save();
				
				// detect android device 
				if( Titanium.Platform.osname == 'android' ){
					Ti.Platform.openURL("market://search?q=pname:" + Rater.appId);
					
				// detect iphone and ipad devices
				} else {
					if (Ti.Platform.version < 7) {
						Ti.Platform.openURL("itms-apps://ax.itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id=" + Rater.appId);
					} else {
						Ti.Platform.openURL("itms-apps://itunes.apple.com/app/id" + Rater.appId);
					}
				}
				
				break;
			case 1 : // don't remind
				Rater.data.neverRemind = true;
				Rater.save();
				break;
		}
	});
	a.show();
};

Rater.init = function(_appName, _appId){
	Rater.load();

	// Set the default values
	Rater.appName = _appName;
	Rater.appId = _appId;

	Rater.run();
};

Ti.App.addEventListener('resumed', function(e){	
	// Read the data again
	Rater.read();
});

Ti.App.addEventListener('pause', function(e){	
	// Save the data
	Rater.save();
});
