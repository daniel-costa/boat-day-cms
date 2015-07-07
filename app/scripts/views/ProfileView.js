define([
'views/BaseView',
'text!templates/ProfileTemplate.html', 
'text!templates/RequestTemplate.html',
'text!templates/ReviewsTemplate.html'
], function(BaseView, ProfileTemplate, RequestTemplate, ReviewsTemplate){
	var ProfileView = BaseView.extend({

		className: "view-profile",
		
		template: _.template(ProfileTemplate),

		profilePicture: null,

		seatRequests: {},

		events : {
			"submit form" : "update",
			"click .delete-picture": "deletePicture",
			"click .upload": "uploadPicture",
			"click .update-seatRequests": "updateSeatRequest"
		},

		render: function() {
			BaseView.prototype.render.call(this);
			this.renderSeatRequests();
			this.renderReviews();
			return this;
		},

		renderSeatRequests: function() {

			var self = this;

			this.$el.find('#seatRequests').html("");
			var tpl = _.template(RequestTemplate);

			var query = self.model .relation('requests').query();
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

		renderReviews: function() {

			var self = this;

			this.$el.find('#reviews').html("");
			var tpl = _.template(ReviewsTemplate);

			var query = self.model .relation('reviews').query();
			query.find().then(function(matches) {
				_.each(matches, function(reviews){
					console.log(reviews.get('fromProfile').id);
					var data = {
						id: reviews.id, 
						fromProfile: reviews.get('fromProfile').id,
						toProfile: reviews.get('toProfile').id,
						rateAvg: reviews.get('rateAvg'), 
						review: reviews.get('review')
					}
					self.$el.find('#reviews').append( tpl(data) );
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

			// var query = self.model.relation('seatRequests').get(self.seatRequests.id).query();
			// query.save(data).then(seatRequestUpdateSuccess);
			alert("Still TODO")
			
		}, 

		deletePicture: function() {

			alert("TODO")
		}, 

		uploadPicture: function() {
			alert("TODO")
		}

	});
	return ProfileView;
});
