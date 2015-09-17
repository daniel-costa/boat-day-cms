define([
'views/BoatDaysView',
'text!templates/BoatDaysPastTemplate.html'
], function(BoatDaysView, BoatDaysPastTemplate){
	
	var BoatDaysPastView = BoatDaysView.extend({

		className: "view-boatdays-past",
		
		template: _.template(BoatDaysPastTemplate),

		applyFilter: function(query) {
			
			BoatDaysView.prototype.applyFilter.call(this, query);

			query.lessThan("date", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
			query.descending('date, departureTime');
			
			return query;
		}

	});
	return BoatDaysPastView;
});