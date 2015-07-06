define([
'views/BaseView',
'text!templates/ProfileTemplate.html', 
'text!templates/RequestTemplate.html'
], function(BaseView, ProfileTemplate, RequestTemplate){
	var ProfileView = BaseView.extend({

		className: "view-profile",
		
		template: _.template(ProfileTemplate),

		profilePicture: null,

		seatRequests: {},

		events : {
			"submit form" : "update",
			"change .upload": "uploadPicture", 
			"click .delete-picture": "deleteProfilePicture", 
			"click .update-seatRequests": "updateSeatRequest"
		},

		initialize: function(){

			//this.tempBinaries.profilePicture = this.model.get('profilePicture');

		},

		render: function() {
			BaseView.prototype.render.call(this);
			//this.displayProfilePicture(this.model.get('profilePicture').url());
			this.renderSeatRequests();
			return this;
		},

		renderSeatRequests: function() {

			var self = this;

			this.$el.find('#seatRequests').html("");
			var tpl = _.template(RequestTemplate);

			var query = self.model.relation('requests').query();
			query.find().then(function(matches) {
				_.each(matches, function(seatRequests){
					
					var data = {

						id: seatRequests.id, 
						rating: seatRequests.get('rating'),
						seats: seatRequests.get('seats'),
						status: seatRequests.get('status'), 
						contribution: seatRequests.get('contribution'), 
						boatday: seatRequests.get('boatday')
					}
					self.$el.find('#seatRequests').append( tpl(data) );
				});
			});
		}, 

		update: function(event) {
			
			event.preventDefault();

			var data = {
				
				displayName: this._in('displayName').val(), 
				about: this._in('about').val(), 
				status: this._in('status').val(), 
				//url: profile.get('profilePicture') ? profile.get('profilePicture').url() : ''
			};
			
			var profileUpdateSuccess = function( profile ) {

				Parse.history.navigate('profiles', true);

			};

			this.model.save(data).then(profileUpdateSuccess);

		},

		updateSeatRequest: function(event) {

			event.preventDefault();

			var self = this;
			
			// var data = {

			// 	status: this._in('status').val(),
			// 	contribution: this._in('contribution').val(),
			// 	seats: this._in('seats').val(),
			// 	rating: this._in('rating').val()
			// };

			// var seatRequestUpdateSuccess = function( boatday ) {

			// 	self.render();

			// };

			// var query = self.model.relation('seatRequests').get(self.seatRequests[id]).query();
			// query.save(data).then(seatRequestUpdateSuccess);
			alert("Still TODO")
			
		},

		uploadPicture: function ( event ) {
			alert("Still to do");
		},

		deleteProfilePicture: function( event ) {

			alert("TO Do");
		}

	});
	return ProfileView;
});
