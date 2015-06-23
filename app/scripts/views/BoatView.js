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

		events : {

			"submit form" : "update",
			"change .upload": "uploadNewFile",
			"click .btn-upload": "clickUpload",
			"click .delete-picture": 'deleteBoatPicture'
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

			var data = {

				status: this._in('status').val(),
				name: this._in('name').val(),
				hullID: this._in('hullID').val(),
				buildYear: parseInt(this._in('buildYear').val()),
				length: parseInt(this._in('length').val()),
				capacity: parseInt(this._in('capacity').val()),
				type: this._in('type').val(),
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

				Parse.history.navigate('boats', true);

			};

			this.model.save(data).then(boatUpdateSuccess);
		},

		displayBoatPictures: function() {
			
			var self = this;

			self.$el.find('.picture-files').html('');
			self.boatPictures = {};

			var query = self.model.relation('boatPictures').query();
			query.ascending("createdAt");
			query.find().then(function(matches) {
				_.each(matches, self.appendBoatPicture, self);
			});
		},

		appendBoatPicture: function(FileHolder) {

			this.$el.find('.picture-files').append(_.template(BoatPictureTemplate)({ 
				id: FileHolder.id,
				file: FileHolder.get('file')
			}));
			
			this.boatPictures[FileHolder.id] = FileHolder;
		},

		deleteBoatPicture: function(event) {

			event.preventDefault();
			var id = $(event.currentTarget).attr('file-id');
			// this.model.relation('boatPictures').remove(this.boatPictures[id]);
			// this.model.save();
			// delete this.boatPictures[id];
			// $(event.currentTarget).closest('.boat-picture').remove();
			this.modal({
				title: 'Delete boat picture',
				body: 'Are you sure want to delete boat picture?',
				noButton: false,
				yesButtonText: 'Yes'
			});

		},

		displayCaptains: function() {
			
			var self = this;
			
			self.$el.find('.captains-list').html('');

			var displayAll = function(matches) {
				_.each(matches, self.appendCaptain, self);
			};

			var query = self.model.relation('captains').query();
			query.ascending("createdAt");
			query.find().then(displayAll);

		},

		appendCaptain: function(CaptainRequest) {

			this.$el.find('.captains-list').append(_.template(BoatCaptainTemplate)({ 
				id: CaptainRequest.id, 
				email: CaptainRequest.get('email'),
				status: CaptainRequest.get('status')
			}));

		}, 


		displayInsuranceFiles: function() {
			
			var self = this;

			self.$el.find('.insurance-files').html('');
			
			self.proofOfInsurance = {};

			var query = self.model.relation('proofOfInsurance').query();
			query.ascending("createdAt");
			query.find().then(function(matches) {
				_.each(matches, self.appendInsurance, self);
			});
		},

		appendInsurance: function(FileHolder) {

			this.$el.find('.insurance-files').append(_.template(BoatInsuranceTemplate)({ 
				id: FileHolder.id,
				file: FileHolder.get('file')
			}));

			this.proofOfInsurance[FileHolder.id] = FileHolder;

		},

		uploadNewFile: function (event) {

			var self = this;
			var e = $(event.currentTarget);
			var opts = {};
			var cb = null;

			if( e.attr('name') == 'boat-picture' ) {
				cb = function(file) {
					new FileHolderModel({ file: file }).save().then(function(fh) {
						self.appendBoatPicture(fh);
						self.model.relation('boatPictures').add(fh);
						self.model.save();
					});
				};
				opts.pdf = false;
			} else {
				cb = function(file) {
					new FileHolderModel({ file: file }).save().then(function(fh) {
						self.appendInsurance(fh);
						self.model.relation('proofOfInsurance').add(fh);
						self.model.save();
					});
				};
			}

			this.uploadFile(event, cb, opts);

		},
	
	});
	return BoatView;
});
