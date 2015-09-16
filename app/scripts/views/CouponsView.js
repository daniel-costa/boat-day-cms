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
			"click .idInfo": "alertObjectID"
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


		renderRows: function() {

			var self = this;
			var query = new Parse.Query(Parse.Object.extend("Coupon"));
			var tpl = _.template(CouponsRowTemplate);

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

			this.$el.find('tbody').html("");

			var cbSuccess = function(coupons) {

				_.each(coupons, function(coupon) {

					var data = {
						id: coupon.id, 
						name: coupon.get('name'), 
						code: coupon.get('code'), 
						discount: coupon.get('discount'), 
						status: coupon.get('status'), 
						expDate: coupon.get('expiration').toUTCString().substring(0, 16)
					}

					self.$el.find('tbody').append( tpl(data) );

				});

			};

			query.find().then(cbSuccess);
		}
		
	});
	return CouponsView;
});
