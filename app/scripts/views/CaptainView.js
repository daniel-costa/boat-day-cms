define([
'jquery', 
'underscore', 
'parse',
'views/BaseView',
'text!templates/CaptainTemplate.html'
], function($, _, Parse, BaseView, CaptainTemplate){
	var CaptainView = BaseView.extend({

		className: "view-captain-update",
		
		template: _.template(CaptainTemplate),

		events : {

			//"submit form" : "update"
		},

		initialize: function() {
		},

		render: function() {

			BaseView.prototype.render.call(this);
			
			return this;

		},

		// update: function(event) {
			
		// 	event.preventDefault();

		// 	var data = {

		// 		displayName: this._in('displayName').val(), 
		// 		about: this._in('about').val(), 
		// 		status: this._in('status').val()

		// 	};
			
		// 	var profileUpdateSuccess = function( profile ) {

		// 		data.profile = profile;

		// 		Parse.history.navigate('profiles', true);
		// 	};

		// 	var profileUpdateError = function(error) {

		// 		console.log(error);
		// 	};

		// 	this.model.save(data).then(profileUpdateSuccess, profileUpdateError);

		// },

	});
	return CaptainView;
});
