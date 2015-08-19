define([
'models/BoatDayModel',
'views/BaseView',
'text!templates/PastBoatDaysTemplate.html', 
'text!templates/PastBoatDaysRowTemplate.html'
], function(BoatDayModel, BaseView, PastBoatDaysTemplate, PastBoatDaysRowTemplate){
	var PastBoatDaysView = BaseView.extend({

		className: "view-past-boatdays-lists",
		
		template: _.template(PastBoatDaysTemplate),

		events : {

			"blur .searchFilter": "renderRows",
			"keyup .searchFilter": "watchForReturn",
			"click .btn-duplicate": "duplicate"
			//"click .btn-cancel" : "cancelBoatDay"
		},

		render: function() {

			BaseView.prototype.render.call(this);
			this.renderRows();
			return this;

		},

		duplicate: function(event) {
			event.preventDefault();

			var query = new Parse.Query(Parse.Object.extend("BoatDay"));
			query.get($(event.currentTarget).closest('tr').attr('data-id')).then(function(boatDay) {
			  	new BoatDayModel({
			  		status:'creation',
			  		name: boatDay.get('name'), 
			  		description: boatDay.get('description'),
			  		date: null,
			  		departureTime: boatDay.get('departureTime'),
			  		arrivalTime: boatDay.get('arrivalTime'),
			  		duration: boatDay.get('duration'), 
			  		location: boatDay.get('location'),
			  		locationText: boatDay.get('locationText'), 
			  		availableSeats: boatDay.get('availableSeats'),
			  		price: boatDay.get('price'),
			  		bookingPolicy: boatDay.get('bookingPolicy'),
			  		cancellationPolicy: boatDay.get('cancellationPolicy'),
			  		category: boatDay.get('category'),
			  		arrivalTime: boatDay.get('arrivalTime'), 
				  	captain: boatDay.get('captain'),
				  	boat: boatDay.get('boat'),
				  	host: boatDay.get('host'), 
				  	chatMessages: boatDay.get('chatMessages'), 
				  	seatRequests: boatDay.get('seatRequests'), 
				  	bookedSeats: boatDay.get('bookedSeats'), 
				  	earnings: boatDay.get('earnings')
			  	}).save().then(function(bd){
			  		Parse.history.navigate('boatday/'+bd.id, true);
			  	});
			});
		},

		renderRows: function() {

			var self = this;

			var startingDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

			var queryPastBoatDays = new Parse.Query(Parse.Object.extend("BoatDay"));
			queryPastBoatDays.include('host');
			queryPastBoatDays.include('boat');
			queryPastBoatDays.include('captain');
			queryPastBoatDays.descending('date');
			queryPastBoatDays.descending('departureTime');
			queryPastBoatDays.lessThan("date", startingDate);

			var tpl = _.template(PastBoatDaysRowTemplate);

			if( this._in("searchobjectId").val() != "" ) {
				queryPastBoatDays.contains("objectId", this._in("searchobjectId").val());
			}

			if( this._in("searchName").val() != "" ) {
				queryPastBoatDays.contains("name", this._in("searchName").val());
			}

			if( this._in("searchPriceMin").val() != "" ) {
				queryPastBoatDays.greaterThanOrEqualTo("price", parseFloat(this._in("searchPriceMin").val()));
			}
			if( this._in("searchPriceMax").val() != "" ) {
				queryPastBoatDays.lessThanOrEqualTo("price", parseFloat(this._in("searchPriceMax").val()));
			}

			if( this._in("searchStatus").val() != "" ) {
				queryPastBoatDays.contains("status", this._in("searchStatus").val());
			}


			this.$el.find('tbody').html("");

			var cbSuccess = function(boatdays) {

				_.each(boatdays, function(boatday) {
					
					var host = boatday.get('host');
					var boat = boatday.get('boat');
					var captain = boatday.get('captain');
					var data = {
						id: boatday.id, 
						availableSeats: boatday.get('availableSeats'), 
						date: boatday.get('date').toUTCString().substring(0, 16), 
						departureTime: boatday.get('departureTime'), 
						name: boatday.get('name'),
						category: boatday.get('category'),
						price: boatday.get('price'), 
						status: boatday.get('status'), 
						hostId: host.id ? host.id : null, 
						hostName: host.get('firstname'),
						boatId: boat.id ? boat.id: null,
						boatName: boat.get('name'),
						captainId: captain ? captain.id: null, 
						captainName: captain ? captain.get('displayName') : null

					}

					self.$el.find('tbody').append( tpl(data) );

				});

			};

			queryPastBoatDays.find().then(cbSuccess);
		}
	});
	return PastBoatDaysView;
});
