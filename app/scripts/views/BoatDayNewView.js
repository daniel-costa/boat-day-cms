define([
'async!https://maps.google.com/maps/api/js?sensor=false',
'views/BaseView',
'text!templates/BoatDayNewTemplate.html', 
], function(gmaps, BaseView, BoatDayNewTemplate){
	var BoatDayNewView = BaseView.extend({

		className: "view-boatday-create",
		
		template: _.template(BoatDayNewTemplate),

		collectionHosts: {}, 

		collectionBoats: {}, 

		collectionCaptains: {}, 

		events : {
			'submit form' : 'save',
			'change [name="host"]' : "hostSelected",
			'change [name="boat"]' : "boatSelected"
		},

		_map: null,

		_marker: null,

		render: function() {

			BaseView.prototype.render.call(this);
			var self = this;

			var hostsFetchSuccess = function(matches) {

				var select = $('<select>').attr({ id: 'host', name: 'host', class: 'form-control' });

				_.each(matches, function(host) {
					var opt = $('<option>').attr('value', host.id).text(host.get('firstname') + " "+ host.get('lastname'));
					select.append(opt);
					self.collectionHosts[host.id] = host;
				});
				self.$el.find('.host').html(select);
				select.change();
			};

			var queryHosts = new Parse.Query(Parse.Object.extend("Host"));
			queryHosts.equalTo('status', 'approved');
			queryHosts.ascending('firstname');
			queryHosts.find().then(hostsFetchSuccess);

			this.$el.find('.date').datepicker({
				startDate: '0d',
				autoclose: true
			});

			this.setupGoogleMap();

			return this;

		},

		hostSelected: function(event) {

			event.preventDefault();
			var self = this;
			var host = self.collectionHosts[$(event.currentTarget).val()];

			var boatsFetchSuccess = function(matches) {

				var select = $('<select>').attr({ id: 'boat', name: 'boat', class: 'form-control' });

				_.each(matches, function(boat){
					var opt = $('<option>').attr('value', boat.id).text(boat.get('name') + ', ' + boat.get('type'));
					select.append(opt);
					self.collectionBoats[boat.id] = boat;
				});

				self.$el.find('.boats').html(select);
				select.change();
			};

			var queryBoats = host.relation('boats').query();
			queryBoats.equalTo('status', 'approved');
			queryBoats.include('profile');
			queryBoats.find().then(boatsFetchSuccess);
		}, 	  

		boatSelected: function(event) {

			event.preventDefault();
			var self = this;
			var boat = self.collectionBoats[$(event.currentTarget).val()];

			self.collectionCaptains = {};
			
			self.collectionCaptains[boat.get('profile').id] = boat.get('profile');

			var queryCaptains = boat.relation('captains').query();
			queryCaptains.equalTo('status', 'approved');
			queryCaptains.include('captainProfile');
			queryCaptains.each(function(captainRequest) {

				if(captainRequest.get('captainProfile')) {
					self.collectionCaptains[captainRequest.get('captainProfile').id] = captainRequest.get('captainProfile')
				}

			}).then(function() {

				var select = $('<select>').attr({ id: 'captain', name: 'captain', class: 'form-control' });

				_.each(self.collectionCaptains, function(captain) {

					var opt = $('<option>').attr('value', captain.id).text(captain.get('displayName'));
					select.append(opt);
					self.collectionCaptains[captain.id] = captain;
				});
				
				self.$el.find('.captains').html(select);
				select.change();
				
			});
		
		}, 

		setupGoogleMap: function() {

			var self = this;

			var displayMap = function(latlng) {

				var opts = {
					zoom: 10,
					center: latlng
				};

				if( !self._map ) {
					
					var ctn = self.$el.find('.map').get(0);
					self._map = new google.maps.Map(ctn, opts);

					google.maps.event.addListener(self._map, "idle", function(){
						google.maps.event.trigger(self._map, 'resize');
					}); 

					google.maps.event.addListener(self._map, 'click', function(event) {
						self.moveMarker(event.latLng)
					});

				}

			};

			displayMap(new google.maps.LatLng(25.761919, -80.190225));
		},

		moveMarker: function(latlng) {

			var self = this;

			var gotAddress = function (results, status) {

				if (status === google.maps.GeocoderStatus.OK) {

					if (results[0]) {
						var addr = results[0].formatted_address;
						self._in('locationText').val(addr.slice(0, addr.lastIndexOf(",")));
					
					}

				}

			};

			self._map.panTo(latlng);

			new google.maps.Geocoder().geocode({ 'latLng': latlng }, gotAddress);

			if( !self._marker ) {
				self._marker = new google.maps.Marker({
					map: self._map,
					draggable: true,
					animation: google.maps.Animation.DROP,
					position: latlng
				});
			} else {
				self._marker.setPosition(latlng);
			}

		},

		save: function(event) {
			
			event.preventDefault();

			var self = this;

			var data = {
				host: self.collectionHosts ? self.collectionHosts[this._in('host').val()] : null,
				boat: self.collectionBoats ? self.collectionBoats[this._in('boat').val()] : null, 
				captain: self.collectionCaptains ? self.collectionCaptains[this._in('captain').val()] : null,  
				status: "creation",
				availableSeats: parseInt(this._in('availableSeats').val()),
				bookingPolicy: this._in('bookingPolicy').val(),
				cancellationPolicy: this._in('cancellationPolicy').val(), 
				category: this._in('category').val(), 
				date: this._in('date').datepicker('getDate'),
				departureTime: parseInt(this._in('departureTime').val()),
				arrivalTime: parseInt(this._in('departureTime').val()) + parseInt(this._in('duration').val()),
				description: this._in('description').val(), 
				duration: parseInt(this._in('duration').val()),
				name: this._in('name').val(), 
				price: parseInt(this._in('price').val()), 
				category: this._in('activity').val(),
				location: self._marker ? new Parse.GeoPoint({latitude: self._marker.getPosition().lat(), longitude: self._marker.getPosition().lng()}) : null,
				locationText: this._in('locationText').val(),
				bookedSeats: parseInt(this._in('bookSeats').val()), 
				earnings: parseInt(this._in('earnings').val()),
				features: {
					leisure: {
						cruising: Boolean(this.$el.find('[name="featuresLeisureCruising"]').is(':checked')),
						partying: Boolean(this.$el.find('[name="featuresLeisurePartying"]').is(':checked')),
						sightseeing: Boolean(this.$el.find('[name="featuresLeisureSightseeing"]').is(':checked')),
						other: Boolean(this.$el.find('[name="featuresLeisureOther"]').is(':checked'))
					},
					fishing: {
						flats: Boolean(this.$el.find('[name="featuresFishingFlats"]').is(':checked')),
						lake: Boolean(this.$el.find('[name="featuresFishingLake"]').is(':checked')),
						offshore: Boolean(this.$el.find('[name="featuresFishingOffshore"]').is(':checked')),
						recreational: Boolean(this.$el.find('[name="featuresFishingRecreational"]').is(':checked')),
						other: Boolean(this.$el.find('[name="featuresFishingOther"]').is(':checked')),
						equipment: Boolean(this.$el.find('[name="featuresFishingEquipment"]').is(':checked')),
						equipmentItems: {
							bait: Boolean(this.$el.find('[name="featuresFishingEquipmentItemsBait"]').is(':checked')),
							lines: Boolean(this.$el.find('[name="featuresFishingEquipmentItemsLines"]').is(':checked')),
							hooks: Boolean(this.$el.find('[name="featuresFishingEquipmentItemsHooks"]').is(':checked')),
							lures: Boolean(this.$el.find('[name="featuresFishingEquipmentItemsLures"]').is(':checked')),
							nets: Boolean(this.$el.find('[name="featuresFishingEquipmentItemsNets"]').is(':checked')),
							rods: Boolean(this.$el.find('[name="featuresFishingEquipmentItemsRods"]').is(':checked')),
							sinkers: Boolean(this.$el.find('[name="featuresFishingEquipmentItemsSinkers"]').is(':checked'))
						}
					},
					sports: {
						snorkeling: Boolean(this.$el.find('[name="featuresSportsSnorkeling"]').is(':checked')),
						tubing: Boolean(this.$el.find('[name="featuresSportStubing"]').is(':checked')),
						wakeBoarding: Boolean(this.$el.find('[name="featuresSportsWakeBoarding"]').is(':checked')),
						waterSkiing: Boolean(this.$el.find('[name="featuresSportsWaterSkiing"]').is(':checked')),
						equipment: Boolean(this.$el.find('[name="featuresSportsEquipment"]').is(':checked')),
						equipmentItems: {
							fins: Boolean(this.$el.find('[name="featuresSportsEquipmentItemsFins"]').is(':checked')),
							helmets: Boolean(this.$el.find('[name="featuresSportsEquipmentItemsHelmets"]').is(':checked')),
							masks: Boolean(this.$el.find('[name="featuresSportsEquipmentItemsMasks"]').is(':checked')),
							snorkels: Boolean(this.$el.find('[name="featuresSportsEquipmentItemsSnorkels"]').is(':checked')),
							towLine: Boolean(this.$el.find('[name="featuresSportsEquipmentItemsTowLine"]').is(':checked')),
							tubes: Boolean(this.$el.find('[name="featuresSportsEquipmentItemsTubes"]').is(':checked')),
							wakeboard: Boolean(this.$el.find('[name="featuresSportsEquipmentItemsWakeboard"]').is(':checked')),
							waterSkis: Boolean(this.$el.find('[name="featuresSportsEquipmentItemsWaterSkis"]').is(':checked'))
						}
					},
					global: {
						children: Boolean(this.$el.find('[name="featuresGlobalChildren"]').is(':checked')),
						smoking: Boolean(this.$el.find('[name="featuresGlobalSmoking"]').is(':checked')),
						drinking: Boolean(this.$el.find('[name="featuresGlobalDrinking"]').is(':checked')),
						pets: Boolean(this.$el.find('[name="featuresGlobalPets"]').is(':checked')) 
					}, 
					extras: {
						food: Boolean(this.$el.find('[name="featuresExtrasFood"]').is(':checked')),
						drink: Boolean(this.$el.find('[name="featuresExtrasDrink"]').is(':checked')),
						music: Boolean(this.$el.find('[name="featuresExtrasMusic"]').is(':checked')),
						towels: Boolean(this.$el.find('[name="featuresExtrasTowels"]').is(':checked')),
						sunscreen: Boolean(this.$el.find('[name="featuresExtrasSunscreen"]').is(':checked')),
						inflatables: Boolean(this.$el.find('[name="featuresExtrasInflatables"]').is(':checked'))
					}
				}

			};
			
			var boatdayCreateSuccess = function( boatday ) {
				Parse.history.navigate('upcoming-boatdays', true);
			};

			var BoatDay = Parse.Object.extend("BoatDay");
			var boatDay = new BoatDay();
			boatDay.save(data).then(boatdayCreateSuccess);


		},

	});
	return BoatDayNewView;
});
