
// Require.js allows us to configure shortcut alias

require.config({
	
	// By pass RequireJS Cache
	urlArgs: "bust=" + (new Date()).getTime(),

	paths: {
		jquery:	 'vendor/jquery/dist/jquery.min',
		underscore: 'vendor/underscore/underscore-min',
		backbone:   'vendor/backbone/backbone',
		parse:	  'vendor/parse/parse.min',
		text:	   'vendor/requirejs-text/text',
		bootstrap:  'vendor/bootstrap/dist/js/bootstrap', 
		async:		'vendor/requirejs-plugins/src/async',
		datepicker: 'vendor/bootstrap-datepicker/dist/js/bootstrap-datepicker',
		gapi: 		'//apis.google.com/js/platform',
	},
	shim: {
		"parse": {
			deps: ["jquery", "underscore"],
			exports: "Parse"
		},
		"bootstrap": {
			deps: ["jquery"]
		} , 

		datepicker: {
			deps: ["jquery", "bootstrap"],
			exports: 'datepicker'
		},
		gapi: {
			exports: 'gapi'
		}
	}, 
	googlemaps: {
		params: {
			key: 'AIzaSyDWM2B3u-5wW4sqLtd__BqjHNPSNsUpzYg'
		}
	}
});

require(['parse', 'router', 'views/AppView', 'bootstrap', 'datepicker', 'gapi'], function(Parse, AppRouter, AppView) {
	
	//Parse.initialize("8YpQsh2LwXpCgkmTIIncFSFALHmeaotGVDTBqyUv", "FaULY8BIForvAYZwVwqX4IAmfsyxckikiZ2NFuEp");
	Parse.initialize("LCn0EYL8lHOZOtAksGSdXMiHI08jHqgNOC5J0tmU", "kXeZHxlhpWhnRdtg7F0Cdc6kvuGHVtDlnSZjfxpU");
	
	var cb = function() {
		new AppRouter();
		Parse.history.start();
	}

	new AppView(cb);

});