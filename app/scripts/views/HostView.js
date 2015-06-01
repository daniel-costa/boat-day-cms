define([
'jquery', 
'underscore', 
'parse',
'views/BaseView',
'text!templates/HostTemplate.html'
], function($, _, Parse, BaseView, HostTemplate){
	var HostView = BaseView.extend({

		className: "view-host-update",
		
		template: _.template(HostTemplate),

		events : {

			"submit form" : "update"
		},

		initialize: function() {

		},

		render: function() {

			BaseView.prototype.render.call(this);
			
			return this;

		},

		update: function(event) {
			
			event.preventDefault();

			var data = {

				SSN: this._in('ssn').val(),
				accountHolder: this._in('accountHolder').val(),
				street: this._in('street').val(),
				accountRouting: this._in('accountRout').val(), 
				accountNumber: this._in('accountNum').val(), 
				//birthdate: this._in('birthDate').val(), 
				city: this._in('city').val(),
				country: this._in('country').val(),
				firstname: this._in('firstname').val(), 
				lastname: this._in('lastname').val(), 
				phone: this._in('phone').val(), 
				state: this._in('state').val(), 
				status: this._in('status').val(), 
				street: this._in('street').val(), 
				type: this._in('hostType').val(), 
				zipCode: this._in('zipcode').val()

			
			};
			
			var hostUpdateSuccess = function( profile ) {

				data.profile = profile;

				Parse.history.navigate('hosts', true);
			} ;

			var hostUpdateError = function(error) {

				console.log(error);
			};

			this.model.save(data).then(hostUpdateSuccess, hostUpdateError);

		},

	});
	return HostView;
});
