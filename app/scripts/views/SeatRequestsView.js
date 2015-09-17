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
			"keyup .searchFilter": "watchForReturn",
			"click .idInfo": "alertObjectID",
			"click .page": "changePage",
		},
		
		initialize: function() {

			this.pagination.cbRefreshPage = SeatRequestsView.prototype.renderSeatRequests;

		},

		render: function() {

			BaseView.prototype.render.call(this);
			this.renderSeatRequests();
			return this;

		}, 

		alertObjectID: function(event) {
			event.preventDefault();
			alert($(event.currentTarget).closest('tr').attr('data-id'));
		},

		applyFilter: function(query) {

			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
			}

			return query;
		},

		renderSeatRequests: function() {

			var self = this;

			self.$el.find('tbody').html("");

			var query = new Parse.Query(Parse.Object.extend("SeatRequest"));
			query.descending('createdAt');

			query = self.applyFilter(query);

			query.include("boatday");
			query.include("profile");
			query.include("promoCode");
			
			self.handlePagination(query).then(function(query) {
				query.find().then(function(seatRequests) {
					_.each(seatRequests, function(seatRequest) {
						self.$el.find('tbody').append(_.template(SeatRequestsRowTemplate)({ model: seatRequest }));
					});
				});
			});
		}

	});
	return SeatRequestsView;
});
