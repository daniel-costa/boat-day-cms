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

			this.$el.find('.expDate').datepicker('setDate', this.model.get('expiration'));
			
			return this;
		},
		
		update: function(event) {
			
			event.preventDefault();

			var self = this;

			if( this._in('name').val() == '' || this._in('code').val() == '' || this._in('discount').val() == '' || !this._in('date').datepicker('getDate')) {
				alert('Some fields empty');
				return;
			}

			this.model.save({
				status: "approved", 
				name: this._in('name').val(), 
				code: this._in('code').val().toUpperCase(),
				discount: parseInt(this._in('discount').val()),
				expiration: this._in('date').datepicker('getDate'), 
				perSeat: this._in('perSeat').val() == 'true',
			}).then(function( profile ) {
				Parse.history.navigate('coupons', true);
			});

		}

	});
	return CouponView;
});
