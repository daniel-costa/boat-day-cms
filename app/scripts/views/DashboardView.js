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
			this.renderBoatsCompleteStatus();
			this.renderBoatsEditingStatus();
			this.renderStatistics();
			this.renderUpcomingEvents();
			this.renderGoneEvents();
			this.renderBoatdaysNumber();
			this.renderBoatDaysLeisure();
			this.renderBoatDaysFishing();
			this.renderBoatDaysSport();
			this.renderBoatDaysSailing();
			this.renderHostsNumber();
			this.renderHostTable();
			return this;

		},

		renderBoatsCompleteStatus: function() {

			var self = this;
			var query = new Parse.Query(Parse.Object.extend("Boat"));
			query.equalTo("status", "complete");
			query.include("host");
			var tpl = _.template(DashboardBoatRowTemplate);


			this.$el.find('#boatsComplete').html("");

			var cbSuccess = function(boats) {

				_.each(boats, function(boat) {

					var data = { 
						id: boat.id,
						name: boat.get('name'), 
						host: boat.get('host').get('firstname') +" "+ boat.get('host').get('lastname'),
						hostStatus: boat.get('host').get('status')
					}

				});

			};

			query.find().then(cbSuccess);

		}, 

		renderBoatsEditingStatus: function() {

			var boats = Parse.Object.extend("Boat");
			var query = new Parse.Query(boats);
			query.equalTo("status", "editing");

			query.find({

				success: function(results) {

					//Number of boats with editing status
					var boatsEditingStatus = results.length;
					$('#boatsEditingStatus').html(boatsEditingStatus);

					var output = '';

					for (var i = 0; i < results.length; i++) {

						var object = results[i];

						// output += '<li class="list-group-item list-group-item-info">' + object.get('name') + '</li>';
						output += '<div class="list-group"><a href="#/boat/'+ object.id +'" class="list-group-item active">' + object.get('name') + '</a></div>'
					}

					$('#boats-status-editing').html(output);
				}, 

				error: function(error) {

					alert("Error: " + error.code + " " + error.message);

				}

			});
		},

		renderBoatDaysLeisure: function() {

			var boatDays = Parse.Object.extend("BoatDay");
			var query = new Parse.Query(boatDays);
			query.greaterThan("date", new Date());
			query.equalTo("category", "leisure");

			query.find({

				success: function(results) {

					var upcomingLeisure = results.length;
					$('#leisureNumber').html(upcomingLeisure);
				}
			});

		},

		renderBoatDaysFishing: function() {

			var boatDays = Parse.Object.extend("BoatDay");
			var query = new Parse.Query(boatDays);
			query.greaterThan("date", new Date());
			query.equalTo("category", "fishing");

			query.find({

				success: function(results) {

					var upcomingFishing = results.length;
					$('#fishingNumber').html(upcomingFishing);
				}
			});

		},

		renderBoatDaysSport: function() {

			var boatDays = Parse.Object.extend("BoatDay");
			var query = new Parse.Query(boatDays);
			query.greaterThan("date", new Date());
			query.equalTo("category", "sports");

			query.find({

				success: function(results) {

					var upcomingSports = results.length;
					$('#sportNumber').html(upcomingSports);
				}
			});

		},

		renderBoatDaysSailing: function() {

			var boatDays = Parse.Object.extend("BoatDay");
			var query = new Parse.Query(boatDays);
			query.greaterThan("date", new Date());
			query.equalTo("category", "sailing");

			query.find({

				success: function(results) {

					var upcomingSailing = results.length;
					$('#sailingNumber').html(upcomingSailing);
				}
			});

		},

		renderStatistics: function() {

			var boats = Parse.Object.extend("Boat");
			var query = new Parse.Query(boats);

			query.find({

				success: function(results) {
					
					var boatsNumber = results.length;
					$('#boatsNumber').html(boatsNumber);
				}

			});
		}, 

		renderUpcomingEvents: function() {

			var boatDays = Parse.Object.extend("BoatDay");
			var query = new Parse.Query(boatDays);
			query.greaterThan("date", new Date());

			query.find({

				success: function(results) {

					var upcomingEvents = results.length;
					$('#boatdaysFuture').html(upcomingEvents);
				}

			});
		
		}, 

		renderGoneEvents: function() {

			var boatDays = Parse.Object.extend("BoatDay");
			var query = new Parse.Query(boatDays);
			query.lessThan("date", new Date());

			query.find({

				success: function(results) {

					var goneEvents = results.length;
					$('#boatdaysPast').html(goneEvents);
				}

			});
		
		}, 

		renderBoatdaysNumber: function() {

			var boatDays = Parse.Object.extend("BoatDay");
			var query = new Parse.Query(boatDays);

			query.find({

				success: function(results) {

					var boatdaysNumber = results.length;
					$('#boatdaysNumber').html(boatdaysNumber);
				}

			});
		}, 

		renderHostsNumber: function() {

			var hosts = Parse.Object.extend("Host");
			var query = new Parse.Query(hosts);

			query.find({

				success: function(results) {

					var hostsNumber = results.length;
					$('#hostsNumber').html(hostsNumber);
				}

			});
		}, 

		renderHostTable: function() {

			var self = this;
			var query = new Parse.Query(Parse.Object.extend("Host"));
			query.equalTo("status", "complete");
			var tpl = _.template(DashboardHostRowTemplate);


			this.$el.find('#hostsComplete').html("");

			var cbSuccess = function(hosts) {

				_.each(hosts, function(host) {

					var data = { 
						id: host.id,
						firstname: host.get('firstname'),
						lastname: host.get('lastname'),
						ssn: host.get('SSN'), 
						dateOfBirth: host.get('birthdate').toUTCString().substring(0, 16), 
						user: host.get('user'),
						profile: host.get('profile')
					}

					self.$el.find('#hostsComplete').append( tpl(data) );

				});

			};

			query.find().then(cbSuccess);
		}


	});
	return DashboardView;
});
