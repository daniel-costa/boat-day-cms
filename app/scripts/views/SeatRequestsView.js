define([
'views/BaseView',
'text!templates/SeatRequestsTemplate.html', 
'text!templates/SeatRequestsRowTemplate.html'
], function(BaseView, SeatRequestsTemplate, SeatRequestsRowTemplate){
	var SeatRequestsView = BaseView.extend({

		className: "view-seat-requests-list",
		
		template: _.template(SeatRequestsTemplate),

		events : {
			"blur .searchFilter": "renderSeatRequests",
			"keyup .searchFilter": "watchForReturn"
		},

		render: function() {

			BaseView.prototype.render.call(this);
			this.renderSeatRequests();
			return this;

		}, 

		renderSeatRequests: function() {

			var self = this;
			var query = new Parse.Query(Parse.Object.extend("SeatRequest"));
			query.include("boatday");
			query.include("profile");
			query.include("promoCode");
			query.descending('createdAt');
			var tpl = _.template(SeatRequestsRowTemplate);

			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
			}

			if( this._in("searchGuests").val() != "" ) {
				query.contains("displayName", this._in("searchGuests").val());
			}

			if( this._in("searchBoatDays").val() != "" ) {
				query.contains("name", this._in("searchBoatDays").val());
			}

			this.$el.find('tbody').html("");

			var cbSuccess = function(seatRequests) {

				_.each(seatRequests, function(seatRequest) {
					//console.log(seatRequest.get('promoCode').id);
					var data = {
						id: seatRequest.id, 
						profileName: seatRequest.get('profile').get('displayName'), 
						boatdayName: seatRequest.get('boatday').get('name'), 
						hostRating: seatRequest.get('ratingHost'), 
						guestRating: seatRequest.get('ratingGuest'), 
						contribution: seatRequest.get('contribution'), 
						profile: seatRequest.get('profile'), 
						boatday: seatRequest.get('boatday'), 
						coupon: seatRequest.get('promoCode')

					}

					self.$el.find('tbody').append( tpl(data) );
				});
			};

			query.find().then(cbSuccess);
		}

	});
	return SeatRequestsView;
});
