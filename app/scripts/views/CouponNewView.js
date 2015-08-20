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

			var Coupon = Parse.Object.extend("Coupon");
			var coupon = new Coupon();
			
			if( this._in('name').val() == '' || this._in('code').val() == '' || this._in('discount').val() == '' || !this._in('date').datepicker('getDate')) {
				alert('Some fields empty');
				return;
			}

			coupon.save({
				status: "approved", 
				name: this._in('name').val(), 
				code: this._in('code').val().toUpperCase(),
				discount: parseFloat(this._in('discount').val()),
				expiration: this._in('date').datepicker('getDate'),
				perSeat: this._in('perSeat').val() == 'true',
			}).then(function( profile ) {
				Parse.history.navigate('coupons', true);
			});

		}

	});
	return CouponNewView;
});
