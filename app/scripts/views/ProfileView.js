define([
'views/BaseView',
'text!templates/ProfileTemplate.html', 
'text!templates/SeatRequestsTemplate.html',
'text!templates/ReviewsTemplate.html'
], function(BaseView, ProfileTemplate, SeatRequestsTemplate, ReviewsTemplate){
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
			return this;
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
		}, 

		appendSeatRequests: function(SeatRequest) {

			this.$el.find('#seatRequests').append(_.template(SeatRequestsTemplate)({
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