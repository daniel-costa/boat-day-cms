define([
'views/BaseView',
'models/FileHolderModel',
'text!templates/BoatTemplate.html', 
'text!templates/BoatPictureTemplate.html',
'text!templates/BoatCaptainTemplate.html', 
'text!templates/BoatInsuranceTemplate.html'
], function(BaseView, FileHolderModel, BoatTemplate, BoatPictureTemplate, BoatCaptainTemplate, BoatInsuranceTemplate){
	var BoatView = BaseView.extend({

		className: "view-boat-update",
		
		template: _.template(BoatTemplate),

		boatPictures: {},
		
		proofOfInsurance: {},

		captains: {},

		events : {
			"submit form" : "update",
			"change .upload": "uploadNewFile",
			"click .update-picture": "updateBoatPicture",
			"click .delete-picture": 'deleteBoatPicture', 
			"click .delete-insurance": "deleteInsurance",
			"click .notify-host": "sendBoatNotification", 
			"click .update-captain": "updateCaptain"
		}, 

		render: function() {

			BaseView.prototype.render.call(this);
			this.displayBoatPictures();
			this.displayCaptains();
			this.displayInsuranceFiles();
			return this;

		},

		update: function(event) {
			
			event.preventDefault();

			var self = this;

			var data = {

				status: this._in('status').val(),
				name: this._in('name').val(),
				hullID: this._in('hullID').val(),
				buildYear: parseInt(this._in('buildYear').val()),
				length: parseInt(this._in('length').val()),
				capacity: parseInt(this._in('capacity').val()),
				type: this._in('type').val(),
				validationText: this._in('validationText').val(), 
				validationTextInternal: this._in('validationTextInternal').val(),
				features: {
					airConditioning: Boolean(this._in('featureAirConditioning').is(':checked')),
					autopilot: Boolean(this._in('featureAutopilot').is(':checked')),
					cooler: Boolean(this._in('featureCooler').is(':checked')),
					depthFinder: Boolean(this._in('featureDepthFinder').is(':checked')),
					fishFinder: Boolean(this._in('featureFishFinder').is(':checked')),
					gps: Boolean(this._in('featureGps').is(':checked')),
					grill: Boolean(this._in('featureGrill').is(':checked')),
					internet: Boolean(this._in('featureInternet').is(':checked')),
					liveBaitWell: Boolean(this._in('featureLiveBaitWell').is(':checked')),
					microwave: Boolean(this._in('featureMicrowave').is(':checked')),
					refrigeration: Boolean(this._in('featureRefrigeration').is(':checked')),
					rodHolder: Boolean(this._in('featureRodHolder').is(':checked')),
					shower: Boolean(this._in('featureShower').is(':checked')),
					sink: Boolean(this._in('featureSink').is(':checked')),
					stereo: Boolean(this._in('featureStereo').is(':checked')),
					stereoAuxInput: Boolean(this._in('featureStereoAuxInput').is(':checked')),
					sonar: Boolean(this._in('featureSonar').is(':checked')),
					swimLadder: Boolean(this._in('featureSwimLadder').is(':checked')),
					tvDvd: Boolean(this._in('featureTvDvd').is(':checked')),
					trollingMotor: Boolean(this._in('featureTrollingMotor').is(':checked')),
					wakeboardTower: Boolean(this._in('featureWakeboardTower').is(':checked'))
				}, 
			};	

			var boatUpdateSuccess = function( boat ) {

				//Parse.history.navigate('boats', true);
				self.render();

			};

			this.model.save(data).then(boatUpdateSuccess);
		},

		displayBoatPictures: function() {
			
			var self = this;

			self.boatPictures = {};
			this.$el.find('#boatPictures').html('');

			var query = self.model.relation('boatPictures').query();
			query.ascending('order');
			query.find().then(function(matches) {
				_.each(matches, self.appendBoatPicture, self);
			});
		},


		appendBoatPicture: function(FileHolder) {

			this.$el.find('#boatPictures').append(_.template(BoatPictureTemplate)({ 
				file: FileHolder
			}));

			this.boatPictures[FileHolder.id] = FileHolder;
		},

		deleteBoatPicture: function(event) {

			event.preventDefault();

			var self = this;
			var e = $(event.currentTarget);
			var id = e.closest('tr').attr('data-id');
			var order = self.boatPictures[id].get('order');

			if( confirm("Do you really want to delete picture #"+order+"?") ) {
				this.model.relation('boatPictures').remove(self.boatPictures[id]);
				this.model.save().then(function() {
					delete this.boatPictures[id];
					self.displayBoatPictures();
				});
			}
		},

		updateBoatPicture: function(event) {

			event.preventDefault();

			var self = this;
			var e = $(event.currentTarget);
			var parent = e.closest('tr');
			
			self.boatPictures[parent.attr('data-id')].save({ 
				order: parseInt(parent.find('[name="order"]').val())
			}).then(function() {
				self.displayBoatPictures();
			}, function(e) {
				console.log(e);
			});

		},

		// displayCaptains: function() {
			
		// 	var self = this;
			
		// 	self.$el.find('.captains-list').html('');

		// 	var displayAll = function(matches) {
		// 		_.each(matches, self.appendCaptain, self);
		// 	};

		// 	var query = self.model.relation('captains').query();
		// 	query.ascending("createdAt");
		// 	query.find().then(displayAll);

		// },

		// appendCaptain: function(CaptainRequest) {

		// 	this.$el.find('.captains-list').append(_.template(BoatCaptainTemplate)({ 
		// 		id: CaptainRequest.id, 
		// 		email: CaptainRequest.get('email'),
		// 		status: CaptainRequest.get('status')
		// 	}));

		// }, 

		displayCaptains: function() {

			var self = this; 
			self.captains = {};
			this.$el.find('#captains').html('');

			var query = self.model.relation('captains').query();
			query.ascending("createdAt");
			query.find().then(function(matches){
				_.each(matches, self.appendCaptain, self);
			});
		},

		appendCaptain: function(CaptainRequest) {

			this.$el.find('#captains').append(_.template(BoatCaptainTemplate)({
				id: CaptainRequest.id, 
				captain: CaptainRequest
			}));
			this.captains[CaptainRequest.id] = CaptainRequest;
		},

		updateCaptain: function(event) {

			event.preventDefault();

			var self = this;
			var e = $(event.currentTarget);
			var parent = e.closest('tr');

			self.captains[parent.attr('data-id')].save({ 
				status: parent.find('[name="status"]').val()
			}).then(function() {
				self.displayCaptains();
			}, function(e) {
				console.log(e);
			});
		},

		displayInsuranceFiles: function() {
			
			var self = this;
			self.proofOfInsurance = {};
			this.$el.find('#proofOfInsurance').html('');

			var query = self.model.relation('proofOfInsurance').query();
			query.ascending("createdAt");
			query.find().then(function(matches) {
				_.each(matches, self.appendInsurance, self);
			});
		},

		appendInsurance: function(FileHolder) {

			this.$el.find('#proofOfInsurance').append(_.template(BoatInsuranceTemplate)({ 
				id : FileHolder.id,
				file: FileHolder,
			}));

			this.proofOfInsurance[FileHolder.id] = FileHolder;

		},

		deleteInsurance: function(event) {

			event.preventDefault();

			var self = this;
			var e = $(event.currentTarget);
			var id = e.closest('tr').attr('data-id');

			if( confirm("Do you really want to delete "+id+"?") ) {
				this.model.relation('proofOfInsurance').remove(self.proofOfInsurance[id]);
				this.model.save().then(function() {
					delete this.proofOfInsurance[id];
					self.displayInsuranceFiles();
				});
			}

		},

		uploadNewFile: function (event) {

			var self = this;
			var e = $(event.currentTarget);
			var opts = {};
			var cb = null;
			var FileHolderModel = Parse.Object.extend('FileHolder');

			if( e.attr('name') == 'boat-picture' ) {
				cb = function(file) {
					new FileHolderModel({ file: file }).save().then(function(fh) {
						self.model.relation('boatPictures').add(fh);
						self.model.save().then(function() {
							self.displayBoatPictures();
						});
					});
				};
				opts.pdf = false;
			} else {
				cb = function(file) {
					new FileHolderModel({ file: file }).save().then(function(fh) {
						self.model.relation('proofOfInsurance').add(fh);
						self.model.save().then(function() {
							self.displayInsuranceFiles();
						});
					});
				};
			}

			this.uploadFile(event, cb, opts);
		},

		sendBoatNotification: function() {

			event.preventDefault();

			var NotificationModel = Parse.Object.extend("Notification");
			var status = this.model.get('status');

			if( confirm("Are you sure you want to send a notification ?") ) {
				if( status == 'approved' ) {
					new NotificationModel({
						from: Parse.User.current().get('profile'),
						to: this.model.get('profile'),
						action: "boat-approved",
						boat: this.model,
						fromTeam: true
					}).save().then(function() {
						alert('Notification Sent');	
					});
				} else if( status == 'denied' ) {
					new NotificationModel({
						from: Parse.User.current().get('profile'),
						to: this.model.get('profile'),
						action: "boat-denied",
						boat: this.model,
						fromTeam: true
					}).save().then(function() {
						alert('Notification Sent');
					});
				} else {
					alert('Boat must be approved or denied to receive a notification');
				}
			}
		}
	
	});
	return BoatView;
});
// 	</select>
// </div> -->

