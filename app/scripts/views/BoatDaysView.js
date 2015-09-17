define([
'views/BaseView',
'text!templates/BoatDaysRowTemplate.html'
], function(BaseView, BoatDaysRowTemplate){

	var BoatDaysView = BaseView.extend({

		query: null,

		events : {
			"blur .searchFilter": "renderRows",
			"keyup .searchFilter": "watchForReturn",
			"click .idInfo": "alertObjectID", 
			"click .btn-duplicate": "duplicate",
			"click .page": "changePage",
		},

		boatdays: {},

		initialize: function() {

			this.pagination.cbRefreshPage = BoatDaysView.prototype.renderRows;

		},

		applyFilter: function(query) {
			
			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
			}

			if( this._in("searchName").val() != "" ) {
				query.contains("name", this._in("searchName").val());
			}

			if( this._in("searchCategory").val() != "" ) {
				query.equalTo("category", this._in("searchCategory").val());
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

			return query;
		},

		renderRows: function() {

			var self = this;

			this.$el.find('tbody').html("");
			
			var query = new Parse.Query(Parse.Object.extend("BoatDay"));
			
			query = self.applyFilter(query);

			query.include('host');
			query.include('boat');
			query.include('captain');

			self.handlePagination(query).then(function(query) {
				query.find().then(function(boatdays) {
					_.each(boatdays, function(boatday) {
						self.boatdays[boatday.id] = boatday;
						self.$el.find('tbody').append(_.template(BoatDaysRowTemplate)({ self: self, model: boatday }));
					});
				});
			});
		},

		render: function() {

			BaseView.prototype.render.call(this);
			
			this.renderRows();

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
