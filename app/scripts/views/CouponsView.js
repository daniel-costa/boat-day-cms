define([
'views/BaseView',
'text!templates/CouponsTemplate.html', 
'text!templates/CouponsRowTemplate.html'
], function(BaseView, CouponsTemplate, CouponsRowTemplate){
	var CouponsView = BaseView.extend({

		className: "view-coupons-lists",
		
		template: _.template(CouponsTemplate),

		events : {
			"blur .searchFilter": "renderRows",
			"keyup .searchFilter": "watchForReturn", 
			"click .idInfo": "alertObjectID",
			"click .page": "changePage",
		},

		initialize: function() {

			this.pagination.cbRefreshPage = CouponsView.prototype.renderRows;

		},

		render: function() {

			BaseView.prototype.render.call(this);
			this.renderRows();
			
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

			if( this._in("searchName").val() != "" ) {
				query.contains("name", this._in("searchName").val());
			}

			if( this._in("searchCode").val() != "" ) {
				query.contains("code", this._in("searchCode").val());
			}

			if( this._in("searchStatus").val() != "" ) {
				query.contains("status", this._in("searchStatus").val());
			}

			if( this._in("searchPerSeat").val() != "" ) {
				query.equalTo("perSeat", this._in("searchPerSeat").val() == "true");
			}

			return query;

		},

		renderRows: function() {

			var self = this;

			this.$el.find('tbody').html("");

			var query = new Parse.Query(Parse.Object.extend("Coupon"));

			query = self.applyFilter(query);

			self.handlePagination(query).then(function(query) {
				query.find().then(function(coupons) {
					_.each(coupons, function(coupon) {
						self.$el.find('tbody').append( _.template(CouponsRowTemplate)({ model: coupon }) );

					});

				});
			});
		}
		
	});
	return CouponsView;
});
