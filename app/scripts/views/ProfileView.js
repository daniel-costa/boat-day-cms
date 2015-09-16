define([
'views/BaseView',
'text!templates/ProfileTemplate.html', 
'text!templates/SeatRequestsTableTemplate.html',
'text!templates/ReviewsTemplate.html',
'text!templates/ProfileNotificationTableRow.html'
], function(BaseView, ProfileTemplate, SeatRequestsTableTemplate, ReviewsTemplate, ProfileNotificationTableRow){
	var ProfileView = BaseView.extend({

		className: "view-profile",
		
		template: _.template(ProfileTemplate),

		profilePicture: null,

		seatRequests: {},

		events : {
			"submit form" : "update",
			"click .update-requests": "updateSeatRequest"
		},

		render: function() {
			BaseView.prototype.render.call(this);
			this.renderSeatRequests();
			this.renderReviews();
			this.renderNotification();
			return this;
		},

		renderNotification: function() {

			var self = this;
			var query = new Parse.Query(Parse.Object.extend('Notification'));
			query.equalTo("to", self.model);
			query.include('boatday');
			query.find().then(function (notifications){

				self.$el.find('#notification').html("");
				var tpl = _.template(ProfileNotificationTableRow);

				_.each(notifications, function(notification){

					var data = { 
						id: notification.id,
						action: notification.get('action'),
						fromTeam: notification.get('fromTeam'),
						message: notification.get('message')
						//boatday: notification.get('boatday'),
					};
					
					self.$el.find('#notification').append( tpl(data) ) ;
					
				});

			});
		}, 

		renderSeatRequests: function() {

			var self = this; 
			self.seatRequests = {};
			this.$el.find('#seatRequests').html('');

			var query = self.model.relation('requests').query();
			query.ascending("createdAt");
			query.find().then(function(matches){
				_.each(matches, self.appendSeatRequests, self);
			});

			//console.log(self.model.id);
		}, 

		appendSeatRequests: function(SeatRequest) {

			this.$el.find('#seatRequests').append(_.template(SeatRequestsTableTemplate)({
				id: SeatRequest.id, 
				seat: SeatRequest
			}));
			this.seatRequests[SeatRequest.id] = SeatRequest;
		},

		updateSeatRequest: function(event) {

			event.preventDefault();

			var self = this;
			var e = $(event.currentTarget);
			var parent = e.closest('tr');

			self.seatRequests[parent.attr('data-id')].save({ 
				status: parent.find('[name="status"]').val(),
				contribution: parseInt(parent.find('[name="contribution"]').val()),
				ratingGuest: parseInt(parent.find('[name="ratingGuest"]').val()),
				ratingHost: parseInt(parent.find('[name="ratingHost"]').val()), 
				reviewGuest: parent.find('[name="reviewGuest"]').val(),
				seats: parseInt(parent.find('[name="ratingHost"]').val())
			}).then(function() {
				self.renderSeatRequests();
			}, function(e) {
				console.log(e);
			});
		}, 

		renderReviews: function() {

			var self = this;

			this.$el.find('#reviews').html("");
			var tpl = _.template(ReviewsTemplate);

			var query = self.model .relation('reviews').query();
			query.find().then(function(matches) {
				_.each(matches, function(reviews){
	
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
				status: this._in('status').val()
			};
			
			var profileUpdateSuccess = function( profile ) {

				Parse.history.navigate('profiles', true);

			};

			this.model.save(data).then(profileUpdateSuccess);

		}

	});
	return ProfileView;
});