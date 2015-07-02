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
			"keyup .searchFilter": "watchForReturn", 
			"click .btn-cancel" : "cancelBoatDay"
		},

		render: function() {

			BaseView.prototype.render.call(this);
			this.renderRows();
			return this;

		},

		renderRows: function() {

			var self = this;
			var query = new Parse.Query(Parse.Object.extend("BoatDay"));
			query.include('host');
			query.include('boat');
			query.include('captain');

			var tpl = _.template(BoatDaysRowTemplate);

			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
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
						captainName: captain.get('displayName')

					}

					self.$el.find('tbody').append( tpl(data) );

				});

			};

			query.find().then(cbSuccess);
		}, 

		cancelBoatDay: function( event ) {

			event.preventDefault();
			var BoatDayModel = Parse.Object.extend("BoatDay");

			if( confirm("Are you sure you want cancel this Boatday ?") ) {

				BoatDayModel({ status: 'cancel' }).save().then(function() {
					alert('Boatday Cancelled');
				});

			} 

		},


	});
	return BoatDaysView;
});
