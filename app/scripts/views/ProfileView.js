define([
'views/BaseView',
'text!templates/ProfileTemplate.html', 
'text!templates/SeatRequestsTableTemplate.html',
'text!templates/ReviewRowTemplate.html',
'text!templates/ProfileNotificationTableRow.html'
], function(BaseView, ProfileTemplate, SeatRequestsTableTemplate, ReviewRowTemplate, ProfileNotificationTableRow){
	var ProfileView = BaseView.extend({

		className: "view-profile",
		
		template: _.template(ProfileTemplate),

		profilePicture: null,

		seatRequests: {},

		events : {
			"submit form" : "update",
			"click .update-requests": "updateSeatRequest", 
			"click .idInfo": "alertObjectID"
		},

		render: function() {
			BaseView.prototype.render.call(this);
			this.renderSeatRequests();
			this.renderReviews();
			this.renderNotification();
			return this;
		},

		alertObjectID: function(event) {
			event.preventDefault();
			alert($(event.currentTarget).closest('tr').attr('data-id'));
		},

		renderNotification: function() {

			var self = this;
			self.$el.find('#notification').html("");

			var query = new Parse.Query(Parse.Object.extend('Notification'));
			query.equalTo("to", self.model);
			query.include("from");
			query.include('boatday');
			query.find().then(function (notifications){
				_.each(notifications, function(notification){					
					self.$el.find('#notification').append( _.template(ProfileNotificationTableRow)({ model: notification }) ) ;
				});

			});
		}, 

		renderSeatRequests: function() {

			var self = this; 
			self.seatRequests = {};
			this.$el.find('#seatRequests').html('');

			var query = self.model.relation('requests').query();
			query.include('boatday');
			query.include('profile');
			query.ascending("createdAt");
			query.find().then(function(matches){
				_.each(matches, self.appendSeatRequests, self);
			});
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
				seats: parseInt(parent.find('[name="seats"]').val())
			}).then(function() {
				self.renderSeatRequests();
			}, function(e) {
				console.log(e);
			});
		}, 

		renderReviews: function() {

			var self = this;

			this.$el.find('#reviews').html("");
			var tpl = _.template(ReviewRowTemplate);

			var query = self.model .relation('reviews').query();
			query.include('fromProfile');
			query.include('toProfile');
			query.find().then(function(matches) {
				_.each(matches, function(reviews){
					self.$el.find('#reviews').append( _.template(ReviewsTemplate)({ model:reviews }) );
				});
			});
		}, 

		update: function(event) {
			
			event.preventDefault();
			var self = this;
			self.model.save({ 

				displayName: this._in('displayName').val(), 
				about: this._in('about').val(), 
				status: this._in('status').val()

			}).then(function() { self.render(); });
		}

	});
	return ProfileView;
});