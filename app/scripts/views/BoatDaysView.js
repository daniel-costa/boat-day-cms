define([
'views/BaseView',
'text!templates/BoatDaysTemplate.html', 
'text!templates/BoatDaysRowTemplate.html'
], function(BaseView, BoatDaysTemplate, BoatDaysRowTemplate){
	var BoatDaysView = BaseView.extend({

		className: "view-boatdays-lists",
		
		template: _.template(BoatDaysTemplate),

		events : {

			"blur .searchFilter": "renderRows",
			"keyup .searchFilter": "watchForReturn"
		},

		render: function() {

			BaseView.prototype.render.call(this);
			this.renderRows();
			return this;

		},

		renderRows: function() {

			var self = this;
			var query = new Parse.Query(Parse.Object.extend("BoatDay"));

			var tpl = _.template(BoatDaysRowTemplate);

			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
			}

			if( this._in("searchavailableSeats").val() != "") {
				query.equalTo("availableSeats", parseInt(this._in("searchavailableSeats").val()));
			}

			if( this._in("searchDepartureTime").val() != "" ) {
				query.equalTo("departureTime", parseInt(this._in("searchDepartureTime").val()));
			}

			if( this._in("searchName").val() != "" ) {
				query.contains("name", this._in("searchName").val());
			}

			if( this._in("searchPriceMin").val() != "" ) {
				query.greaterThanOrEqualTo("price", parseFloat(this._in("searchPriceMin").val()));
			}
			if( this._in("searchPriceMax").val() != "" ) {
				query.lessThanOrEqualTo("price", parseFloat(this._in("searchPriceMax").val()));
			}

			if( this._in("searchStatus").val() != "" ) {
				query.contains("status", this._in("searchStatus").val());
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
						date: boatday.get('date'), 
						departureTime: boatday.get('departureTime'), 
						name: boatday.get('name'), 
						price: boatday.get('price'), 
						status: boatday.get('status'), 
						hostId: host.id ? host.id : null, 
						boatId: boat.id ? boat.id: null,
						captainId: captain ? captain.id: null

					}

					self.$el.find('tbody').append( tpl(data) );

				});

			};

			query.find().then(cbSuccess);
		}

	});
	return BoatDaysView;
});
