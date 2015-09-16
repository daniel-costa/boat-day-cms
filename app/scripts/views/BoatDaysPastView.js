define([
'views/BoatDaysView',
'text!templates/BoatDaysPastTemplate.html'
], function(BoatDaysView, BoatDaysPastTemplate){
	
	var BoatDaysPastView = BoatDaysView.extend({

		className: "view-boatdays-past-lists",
		
		template: _.template(BoatDaysPastTemplate),

		initialize: function() {

			BoatDaysView.prototype.initialize.call(this);

			this.query.lessThan("date", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));

		}

	});
	return BoatDaysPastView;
});