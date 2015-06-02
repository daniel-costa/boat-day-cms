define([
'views/BaseView',
'text!templates/BoatTemplate.html', 
'text!templates/BoatPictureTemplate.html',
], function(BaseView, BoatTemplate, BoatPictureTemplate){
	var BoatView = BaseView.extend({

		className: "view-boat-update",
		
		template: _.template(BoatTemplate),

		events : {

			"submit form" : "update"
		}, 

		render: function() {

			BaseView.prototype.render.call(this);
			this.displayBoatPictures();
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
				}
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


	});
	return BoatView;
});
