define([
'jquery',
'parse',
], function($, Parse){
	var AppView = Parse.View.extend({

		el: document,

		initialize: function(cb) {
			
			cb();
		}

	});
	return AppView;
});