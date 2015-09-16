define([
'views/BoatDaysView',
'text!templates/BoatDaysUpcomingTemplate.html'
], function(BoatDaysView, BoatDaysUpcomingTemplate){
	
	var BoatDaysUpcomingView = BoatDaysView.extend({

		className: "view-boatdays-upcoming-lists",
		
		template: _.template(BoatDaysUpcomingTemplate),

		initialize: function() {

			BoatDaysView.prototype.initialize.call(this);

			this.query.greaterThanOrEqualTo("date", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));

		}

	});
	return BoatDaysUpcomingView;
});