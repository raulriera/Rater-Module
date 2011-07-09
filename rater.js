// RATER MODULE for Appcelerator Titanium
/*
WHAT IS IT:
Create a cycling reminder to go rate your app at the App Store. Tracks 
the app launch count, and reminds the user every 20 launches (configurable) to 
rate the app, with a click to launch the app page in the App Store.

Reminders stop if the user clicks the "Rate Now" or "Don't Remind Me" options.

USAGE:
In your app.js (or elsewhere), call:
	Ti.include("rater.js");
	Rater.init("[Your app name]","[Your app's App Store ID]");
	Rater.run();

ABOUT:
Created by Greg Pierce, http://agiletortoise.com
Modified by Raul Riera, http://raulriera.com

LOCALIZATION:
<string name="rating_title">Feedback</string>
<string name="rating_message">Thank you for using this application, it would mean a lot to us if you took a minute to rate us at the App Store!.</string>
<string name="rating_option_1">Rate now</string>
<string name="rating_option_2">Don't remind me again</string>
<string name="rating_option_3">Not now</string>

*/

var Rater = {
	appName:'',
	appId:'',
	interval: 20
};

Rater.data = {
	launchCount:0,
	neverRemind:false
};

Rater.load = function() {
	var prop = Ti.App.Properties.getString("RaterData", null);
	if(prop) {
		Rater.data = JSON.parse(prop);
	}
	Rater.data.launchCount++;
	Rater.save();
};
Rater.save = function() {
	Ti.App.Properties.setString("RaterData", JSON.stringify(Rater.data));
};
Rater.message = function() {
	var msg = L("rating_message");
	return msg;
};
Rater.run = function() {
	if(Rater.data.neverRemind || Rater.data.launchCount % Rater.interval != 0) { return; }
	var a = Ti.UI.createAlertDialog({
		title: L("rating_title"),
		message:Rater.message(),
		buttonNames:[L("rating_option_1"), L("rating_option_2"), L("rating_option_3")],
		cancel:2
	});
	a.addEventListener('click',function(e){
		switch(e.index) {
			case 0 : // rate
				Rater.data.neverRemind = true;
				Rater.save();
				Ti.Platform.openURL("itms-apps://ax.itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id=" + Rater.appId);
				break;
			case 1 : // don't remind
				Rater.data.neverRemind = true;
				Rater.save();
				break;
		}
	});
	a.show();
};

Rater.init = function(_appName, _appId) {
	Rater.load();
	Rater.appName = _appName;
	Rater.appId = _appId;
};
