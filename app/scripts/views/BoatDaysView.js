define([
'views/BaseView',
'text!templates/BoatDaysRowTemplate.html'
], function(BaseView, BoatDaysRowTemplate){

	var BoatDaysView = BaseView.extend({

		query: null,

		events : {
			"blur .searchFilter": "applyFilter",
			"keyup .searchFilter": "watchForReturn",
			"click .idInfo": "alertObjectID", 
			"click .btn-duplicate": "duplicate"
		},

		boatdays: {},

		initialize: function() {

			this.query = new Parse.Query(Parse.Object.extend("BoatDay"));
			this.query.include('host');
			this.query.include('boat');
			this.query.include('captain');
			this.query.descending('date');
			this.query.descending('departureTime');

		},

		applyFilter: function() {
			var self = this;

			var tpl = _.template(BoatDaysRowTemplate);

			if( this._in("searchobjectId").val() != "" ) {
				this.query.contains("objectId", this._in("searchobjectId").val());
			}

			if( this._in("searchName").val() != "" ) {
				this.query.contains("name", this._in("searchName").val());
			}


			if( this._in("searchCategory").val() != "" ) {
				this.query.contains("category", this._in("searchCategory").val());
			}

			if( this._in("searchPriceMin").val() != "" ) {
				this.query.greaterThanOrEqualTo("price", parseFloat(this._in("searchPriceMin").val()));
			}
			if( this._in("searchPriceMax").val() != "" ) {
				this.query.lessThanOrEqualTo("price", parseFloat(this._in("searchPriceMax").val()));
			}

			if( this._in("searchStatus").val() != "" ) {
				this.query.contains("status", this._in("searchStatus").val());
			}

			this.$el.find('tbody').html("");

			this.query.find().then(function(boatdays) {

				_.each(boatdays, function(boatday) {
					
					self.boatdays[boatday.id] = boatday;

					var host = boatday.get('host');
					var boat = boatday.get('boat');
					var captain = boatday.get('captain');
					
					var data = {
						id: boatday.id, 
						availableSeats: boatday.get('availableSeats'), 
						date: boatday.get("date"),
						departureTime: boatday.get('departureTime'), 
						name: boatday.get('name'),
						category: boatday.get('category'),
						price: boatday.get('price'), 
						status: boatday.get('status'), 
						availableSeats: boatday.get('availableSeats'), 
						bookedSeats: boatday.get('bookedSeats'), 
						hostId: typeof host.id !== 'undefined' ? host.id : '', 
						hostName: host.get('firstname') +" "+ host.get('lastname'),
						boatId: boat.id ? boat.id: null,
						boatName: boat.get('name'),
						captainId: captain ? captain.id: null, 
						captainName: captain ? captain.get('displayName') : null
					}

					self.$el.find('tbody').append( tpl(data) );

				});
			});
		},

		render: function() {

			BaseView.prototype.render.call(this);
			
			this.applyFilter();

			return this;

		},

		alertObjectID: function(event) {
			event.preventDefault();
			alert($(event.currentTarget).closest('tr').attr('data-id'));
		},

		duplicate: function(event) {
			event.preventDefault();

			var baseBoatDay = this.boatdays[$(event.currentTarget).closest('tr').attr('data-id')];
			var newBoatday = baseBoatDay.clone();

			if( confirm("Do you really want to duplicate this boat?") ) {

				newBoatday.save({
		  		status:'creation',
		  		date: null,
		  		bookedSeats: 0,
			  	earnings: 0,

			  	}).then(function(newBoatday) {

			  		var q = new Parse.Query(Parse.Object.extend("Question"));
			  		q.equalTo("boatday", baseBoatDay);
			  		q.find().then(function(items) {

			  			var promises = [];
			  			_.each(items, function(item) {
			  				var newItem = item.clone();
			  				promises.push(newItem.save({
			  					boatday: newBoatday,
			  					addToBoatDay: true,
			  				}));
			  			});

			  			return Parse.Promise.when(promises);

			  		}).then(function(){
			  			Parse.history.navigate('#/boatday/'+newBoatday.id, true);
			  		});

				}, function(error) {
					console.log(error);
				});
			}
		}
	});
	return BoatDaysView;
});
