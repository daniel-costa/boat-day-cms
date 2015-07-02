define([
'views/BaseView',
'text!templates/ProfileTemplate.html'

], function(BaseView, ProfileTemplate){
	var ProfileView = BaseView.extend({

		className: "view-profile",
		
		template: _.template(ProfileTemplate),

		profilePicture: null,

		events : {
			"submit form" : "update",
			"change .upload": "uploadPicture", 
			"click .delete-picture": "deleteProfilePicture"
		},

		initialize: function(){

			//this.tempBinaries.profilePicture = this.model.get('profilePicture');

		},

		render: function() {
			BaseView.prototype.render.call(this);
			//this.displayProfilePicture(this.model.get('profilePicture').url());
			return this;
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

		uploadPicture: function ( event ) {
			alert("Still to do");
		},

		deleteProfilePicture: function( event ) {

			alert("TO Do");
		}

	});
	return ProfileView;
});
