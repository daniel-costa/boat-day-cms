define([
'views/BaseView',
'text!templates/SeatRequestTemplate.html', 
], function(BaseView, SeatRequestTemplate){
	var SeatRequestView = BaseView.extend({

		className: "view-seat-request",
		
		template: _.template(SeatRequestTemplate),

		
		render: function() {
			BaseView.prototype.render.call(this);
			return this;
		},

	});
	return SeatRequestView;
});