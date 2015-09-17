define([
'views/BoatDaysView',
'text!templates/BoatDaysUpcomingTemplate.html'
], function(BoatDaysView, BoatDaysUpcomingTemplate){
	
	var BoatDaysUpcomingView = BoatDaysView.extend({

		className: "view-boatdays-upcoming",
		
		template: _.template(BoatDaysUpcomingTemplate),

		applyFilter: function(query) {
			
			BoatDaysView.prototype.applyFilter.call(this, query);

			query.greaterThanOrEqualTo("date", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
			query.ascending('date, departureTime');

			return query;
		}

	});
	return BoatDaysUpcomingView;
});