define([
'jquery', 
'underscore', 
'parse',
'views/BaseView',
'text!templates/BoatDaysTemplate.html'
], function($, _, Parse, BaseView, BoatDaysTemplate){
	var BoatDaysView = BaseView.extend({

		className: "view-boatdays-lists",
		
		template: _.template(BoatDaysTemplate),

		events : {

			"blur .searchFilter": "renderBoatDays",
			"keyup .searchFilter": "watchForReturn"
		},


		initialize: function() {

		},

		render: function() {

			BaseView.prototype.render.call(this);
			this.renderBoatDays();
			return this;

		},

		renderBoatDays: function() {
			var boatdays = Parse.Object.extend("BoatDay");
			var query = new Parse.Query(boatdays);


			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
			}

			if( this._in("searchavailableSeats").val() != "" ) {
				query.contains("availableSeats", this._in("searchavailableSeats").val());
			}

			if( this._in("searchDepartureTime").val() != "" ) {
				query.contains("departureTime", this._in("searchDepartureTime").val());
			}

			if( this._in("searchName").val() != "" ) {
				query.contains("name", this._in("searchName").val());
			}

			if( this._in("searchPrice").val() != "" ) {
				query.contains("price", this._in("searchPrice").val());
			}

			if( this._in("searchStatus").val() != "" ) {
				query.contains("status", this._in("searchStatus").val());
			}

			$("#tbody").html("");
			query.include("host");
			query.include("boat");
			query.include("captain");
			query.find({

				success: function(boatdays) {

					var json = JSON.stringify(boatdays);
					var boatdays = JSON.parse(json);

					var output = '';

					$.each (boatdays, function(i,boatdays) {
						var host = boatdays.host;
						var boat = boatdays.boat;
						var captain = boatdays.captain;

						if(captain != null){
						
							$("#tbody").append("<tr><td class='info'>" + boatdays.objectId + "</td><td class='info'>" + boatdays.availableSeats 
								+ "</td><td class='info'>" + boatdays.date.iso + "</td><td class='info'>" + boatdays.departureTime + "</td><td class='info'>"
								+ boatdays.name + "</td><td class='info'>" + boatdays.price + "</td><td class='info'>" + boatdays.status + "</td><td class='info'><a href='#/host/"+ host.objectId +
								"'class='btn btn-primary'>Host</a></td><td class='info'><a href='#/boat/"+ boat.objectId +
								"'class='btn btn-primary'>Boat</a></td><td class='info'><a href='#/captain/"+ captain.objectId +"'class='btn btn-primary'>Captain</a></td><td class='info'><a href='#/boatday/" + boatdays.objectId + 
								"'><span class='glyphicon glyphicon-pencil'></span></a></td></tr>");
						}
						
					});

				}

			});

		}

	});
	return BoatDaysView;
});
