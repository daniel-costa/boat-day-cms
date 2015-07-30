define([
'views/BaseView',
'text!templates/CouponTemplate.html'
], function(BaseView, CouponTemplate){
	var CouponView = BaseView.extend({

		className: "view-coupon-update",
		
		template: _.template(CouponTemplate),

		events : {

			"submit form" : "update"
		},


		render: function() {

			BaseView.prototype.render.call(this);
			var self = this;

			this.$el.find('.expDate').datepicker({
				startDate: '0d',
				autoclose: true
			});

			return this;
		},
		
		update: function(event) {
			
			event.preventDefault();
			var self = this;

			var data = {

				name: this._in('name').val(), 
				code: this._in('code').val(),
				discount: parseInt(this._in('discount').val()), 
				expiration: this._in('expDate').datepicker('getDate'), 
				status: this._in('status').val()
			};
			
			var couponUpdateSuccess = function( profile ) {

				Parse.history.navigate('coupons', true);

			};
			
			this.model.save(data).then(couponUpdateSuccess);

		}

	});
	return CouponView;
});
