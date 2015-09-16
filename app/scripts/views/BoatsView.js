define([
'views/BaseView',
'text!templates/BoatsTemplate.html', 
'text!templates/BoatsRowTemplate.html'
], function(BaseView, BoatsTemplate, BoatsRowTemplate){
	var BoatsView = BaseView.extend({

		className: "view-boats-lists",
		
		template: _.template(BoatsTemplate),

		boats: {},

		events : {
			"blur .searchFilter": "renderRows",
			"keyup .searchFilter": "watchForReturn", 
			"click .btn-duplicate": "duplicate"
		},

		render: function() {

			BaseView.prototype.render.call(this);
			this.renderRows();
			
			return this;

		},

		duplicate: function(event) {

			event.preventDefault();

			var baseBoat = this.boats[$(event.currentTarget).closest('tr').attr('data-id')];

			var r1 = baseBoat.relation("boatPictures").query();
			var r2 = baseBoat.relation("proofOfInsurance").query();
			var r3 = baseBoat.relation("captains").query();
			
			Parse.Promise.when(r1.find(), r2.find(), r3.find()).then(function(boatPictures, proofOfInsurances, captainRequests) {

				baseBoat.clone().save().then(function(newBoat) {
					
					_.each(boatPictures, function(boatPicture) { 
						newBoat.relation("boatPictures").add(boatPicture);
					});

					_.each(proofOfInsurances, function(proofOfInsurance) { 
						newBoat.relation("proofOfInsurance").add(proofOfInsurance);
					});

					_.each(captainRequests, function(captainRequest) { 
						newBoat.relation("captains").add(captainRequest);
					});

					newBoat.save({
						name: newBoat.get("name") + " bis",
					}).then(function(boat) {
						Parse.history.navigate('#/boat/'+boat.id, true);
					});
				});
			});

 		}, 

		renderRows: function() {

			var self = this;
			var query = new Parse.Query(Parse.Object.extend("Boat"));
			query.include('Host');
			var tpl = _.template(BoatsRowTemplate);

			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
			}

			if( this._in("searchName").val() != "" ) {
				query.contains("name", this._in("searchName").val());
			}

			if( this._in("searchBuildYearMin").val() != "" ) {
				query.greaterThanOrEqualTo("buildYear", parseInt(this._in("searchBuildYearMin").val()));
			}

			if( this._in("searchBuildYearMax").val() != "" ) {
				query.lessThanOrEqualTo("buildYear", parseInt(this._in("searchBuildYearMax").val()));
			}

			if( this._in("searchbelow15").val() != "" ) {
				query.lessThan("length", 15);
			}

			if( this._in("searchbetween15-30").val() != "" ) {
				query.greaterThan("length", 15);
				query.lessThan("length", 30);
			}

			if( this._in("searchbetween30-45").val() != "" ) {
				query.greaterThan("length", 30);
				query.lessThan("length", 45);
			}

			if( this._in("searchabove45").val() != "" ) {
				query.greaterThan("length", 45);
			}
			

			if( this._in("searchStatus").val() != "" ) {
				query.contains("status", this._in("searchStatus").val());
			}

			if( this._in("searchType").val() != "" ) {
				query.contains("type", this._in("searchType").val());
			}

			this.$el.find('tbody').html("");

			var cbSuccess = function(boats) {

				_.each(boats, function(boat) {

					self.boats[boat.id] = boat;

					var data = {
						id: boat.id,
						build: boat.get('buildYear'), 
						length: boat.get('length'),
						hullId: boat.get('hullID'), 
						name: boat.get('name'), 
						status: boat.get('status'), 
						type: boat.get('type'), 
						host: typeof boat.get('host') !== 'undefined' ? boat.get('host') : ''
					}

					self.$el.find('tbody').append( tpl(data) );

				});

			};

			query.find().then(cbSuccess);
		}

	});
	return BoatsView;
});
