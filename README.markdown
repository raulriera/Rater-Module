# What is it?:
Create a cycling reminder to go rate your app at the App Store. Tracks 
the app launch count and app usage in seconds. It also reminds the user every 20 launches (configurable) or any given amount of time (configurable) to 
rate the app, with a click to launch the app page in the App Store.

Reminders stop if the user clicks the "Rate Now" or "Don't Remind Me" options.

# Usage:
In your app.js (or elsewhere), call:

```javascript
Ti.include("rater.js");
Rater.init("[Your app name]","[Your app's App Store ID]");
```

# About:
Created by Greg Pierce, http://agiletortoise.com  
Modified by Raul Riera, http://raulriera.com

# Localization options:
Please follow Appcelerator's guidelines in order to localized your application

```xml
<string name="rating_title">Feedback</string>
<string name="rating_message">Thank you for using %s, it would mean a lot to us if you took a minute to rate us at the App Store!.</string>
<string name="rating_option_1">Rate now</string>
<string name="rating_option_2">Don't remind me again</string>
<string name="rating_option_3">Not now</string>
```
