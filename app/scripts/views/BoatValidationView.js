define([
'views/BaseView',
'text!templates/BoatValidationTemplate.html',
'text!templates/BoatPicturesRowTemplate.html', 
'text!templates/BoatInsuranceRowTemplate.html'
], function(BaseView, BoatValidationTemplate, BoatPicturesRowTemplate, BoatInsuranceRowTemplate){
	var BoatValidationView = BaseView.extend({

		className: "view-boat-validate",
		
		template: _.template(BoatValidationTemplate),

		boatPictures: {},

		proofOfInsurance: {},

		events : {
			
			
		},
		render: function() {

			BaseView.prototype.render.call(this);
			this.boatPicturesRow();
			this.boatInuranceRow();
			return this;
		},

		boatPicturesRow: function() {

			var self = this;
			self.boatPictures = {};

			var query = self.model.relation('boatPictures').query();
			query.find().then(function(matches) {
				_.each(matches, self.appendBoatPicture, self);
			});
		}, 

		appendBoatPicture: function(FileHolder) {

			this.$el.find('#boatPictures').append(_.template(BoatPicturesRowTemplate)({ 
				id: FileHolder.id,
				url: FileHolder.get('file').url(), 
				createdAt: FileHolder.createdAt
			}));

			this.boatPictures[FileHolder.id] = FileHolder;
		}, 

		boatInuranceRow: function() {

			var self = this;
			self.proofOfInsurance = {};

			var query = self.model.relation('proofOfInsurance').query();
			query.ascending("createdAt");
			query.find().then(function(matches) {
				_.each(matches, self.appendInsurance, self);
			});
		}, 

		appendInsurance: function(FileHolder) {

			this.$el.find('#proofOfInsurance').append(_.template(BoatInsuranceRowTemplate)({ 
				id: FileHolder.id,
				file: FileHolder.get('file'), 
				createdAt: FileHolder.createdAt
			}));

			this.proofOfInsurance[FileHolder.id] = FileHolder;
		}
	});
	return BoatValidationView;
});
