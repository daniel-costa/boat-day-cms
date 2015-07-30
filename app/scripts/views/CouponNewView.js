define([
'views/BaseView',
'text!templates/CouponNewTemplate.html'
], function(BaseView, CouponNewTemplate){
	var CouponNewView = BaseView.extend({

		className: "view-coupon-new",
		
		template: _.template(CouponNewTemplate),

		events : {

			"submit form" : "save"
		},


		render: function() {

			BaseView.prototype.render.call(this);
			var self = this;

			this.$el.find('.date').datepicker({
				startDate: '0d',
				autoclose: true
			});

			return this;
		},
		
		save: function(event) {
			
			event.preventDefault();
			var self = this;

			var data = {
				status: "approved", 
				name: this._in('name').val(), 
				code: this._in('code').val(),
				discount: parseInt(this._in('discount').val()), 
				expiration: this._in('date').datepicker('getDate'), 
				perSeat: Boolean(this._in('perSeat').val())
			};
			
			var couponSaveSuccess = function( profile ) {

				Parse.history.navigate('coupons', true);

			};
			
			var Coupon = Parse.Object.extend("Coupon");
			var coupon = new Coupon();
			coupon.save(data).then(couponSaveSuccess);

		}

	});
	return CouponNewView;
});
