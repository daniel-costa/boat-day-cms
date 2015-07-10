define([
'views/BaseView',
'text!templates/DashboardTemplate.html', 
'text!templates/DashboardHostRowTemplate.html',
'text!templates/DashboardBoatRowTemplate.html',
], function(BaseView, DashboardTemplate, DashboardHostRowTemplate, DashboardBoatRowTemplate){
	var DashboardView = BaseView.extend({

		className: "view-dashboard",
		
		template: _.template(DashboardTemplate),

		render: function() {

			BaseView.prototype.render.call(this);


			this.renderBoats();
			this.renderHosts();
			this.renderBoatDaysStats();

			return this;

		},

		renderHosts: function() {

			var self = this;

			var query = new Parse.Query(Parse.Object.extend("Host"));
			query.equalTo("status", "complete");
			query.include('profile');
			query.find().then(function(hosts) {

				self.$el.find('#hostsComplete').html("");
				var tpl = _.template(DashboardHostRowTemplate);

				_.each(hosts, function(host) {

					var data = { 
						host: host,
						user: host.get('user'),
						profile: host.get('profile'), 
						profileId: host.get('profile').id
					};
					
					self.$el.find('#hostsComplete').append( tpl(data) );

				});

			});
		},

		renderBoats: function() {

			var self = this;

			var query = new Parse.Query(Parse.Object.extend("Boat"));
			query.equalTo("status", "complete");
			query.include("host");
			query.find().then(function(boats) {

				self.$el.find('#boatsComplete').html("");
				var tpl = _.template(DashboardBoatRowTemplate);

				_.each(boats, function(boat) {

					var data = { 
						boat: boat,
						host: boat.get('host'),
						profile: boat.get('host').get('profile')
					}
					
					self.$el.find('#boatsComplete').append( tpl(data) );

				});

			});

		}, 

		renderBoatDaysStats: function() {

			var self = this;

			var qLeisure = new Parse.Query(Parse.Object.extend("BoatDay"));
			qLeisure.greaterThan("date", new Date());
			qLeisure.equalTo("category", "leisure");
			qLeisure.equalTo("status", "complete");

			var qFishing = new Parse.Query(Parse.Object.extend("BoatDay"));
			qFishing.greaterThan("date", new Date());
			qFishing.equalTo("category", "fishing");
			qFishing.equalTo("status", "complete");

			var qSailing = new Parse.Query(Parse.Object.extend("BoatDay"));
			qSailing.greaterThan("date", new Date());
			qSailing.equalTo("category", "sailing");
			qSailing.equalTo("status", "complete");

			var qSports = new Parse.Query(Parse.Object.extend("BoatDay"));
			qSports.greaterThan("date", new Date());
			qSports.equalTo("category", "sports");
			qSports.equalTo("status", "complete");

			Parse.Promise.when(qLeisure.count(), qFishing.count(), qSailing.count(), qSports.count()).then(function(qLeisureTotal, qFishingTotal, qSailingTotal, qSportsTotal) {

				self.$el.find('.leisureNumber').text(qLeisureTotal);
				self.$el.find('.fishingNumber').text(qFishingTotal);
				self.$el.find('.sailingNumber').text(qSailingTotal);
				self.$el.find('.sportNumber').text(qSportsTotal);

			});

		}


	});
	return DashboardView;
});
