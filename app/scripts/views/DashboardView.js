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
			this.renderStatistics();

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
						url: host.get('profile').get('profilePicture') ? host.get('profile').get('profilePicture').url() : '',
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

			var startingDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
			
			var qLeisure = new Parse.Query(Parse.Object.extend("BoatDay"));
			qLeisure.greaterThanOrEqualTo("date", startingDate);
			qLeisure.equalTo("category", "leisure");
			qLeisure.equalTo("status", "complete");

			var qFishing = new Parse.Query(Parse.Object.extend("BoatDay"));
			qFishing.greaterThanOrEqualTo("date", startingDate);
			qFishing.equalTo("category", "fishing");
			qFishing.equalTo("status", "complete");

			var qSailing = new Parse.Query(Parse.Object.extend("BoatDay"));
			qSailing.greaterThanOrEqualTo("date", startingDate);
			qSailing.equalTo("category", "sailing");
			qSailing.equalTo("status", "complete");

			var qSports = new Parse.Query(Parse.Object.extend("BoatDay"));
			qSports.greaterThanOrEqualTo("date", startingDate);
			qSports.equalTo("category", "sports");
			qSports.equalTo("status", "complete");

			Parse.Promise.when(qLeisure.count(), qFishing.count(), qSailing.count(), qSports.count()).then(function(qLeisureTotal, qFishingTotal, qSailingTotal, qSportsTotal) {

				self.$el.find('.leisureNumber').text(qLeisureTotal);
				self.$el.find('.fishingNumber').text(qFishingTotal);
				self.$el.find('.sailingNumber').text(qSailingTotal);
				self.$el.find('.sportNumber').text(qSportsTotal);

			});

		},

		renderStatistics: function() {

			var self = this;

			var guestNumber = new Parse.Query(Parse.Object.extend("User"));
			guestNumber.equalTo("type", "guest");

			var seatRequestNumber = new Parse.Query(Parse.Object.extend("SeatRequest"));

			var unreadHelpCenterNumber = new Parse.Query(Parse.Object.extend("HelpCenter"));
			unreadHelpCenterNumber.equalTo("status", "unread");

			var unreadReportNumber = new Parse.Query(Parse.Object.extend("Report"));
			unreadReportNumber.notEqualTo("read", true);

			Parse.Promise.when(guestNumber.count(), seatRequestNumber.count(), unreadHelpCenterNumber.count(), unreadReportNumber.count()).then(function(guestNumberTotal, seatRequestNumberTotal, unreadHelpCenterNumberTotal, unreadReportNumberTotal) {

				self.$el.find('.guestsNumber').text(guestNumberTotal);
				self.$el.find('.seatRequestNumber').text(seatRequestNumberTotal);
				self.$el.find('.newHelpCenter').text(unreadHelpCenterNumberTotal);
				self.$el.find('.newReport').text(unreadReportNumberTotal);

			});

		}

	});
	return DashboardView;
});
