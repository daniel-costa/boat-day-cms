define([
'views/BaseView',
'text!templates/BoatValidationTemplate.html',
'text!templates/BoatValidationPictureRowTemplate.html', 
'text!templates/BoatValidationInsuranceRowTemplate.html'
], function(BaseView, BoatValidationTemplate, BoatValidationPictureRowTemplate, BoatValidationInsuranceRowTemplate){
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
			query.ascending('order');
			query.find().then(function(matches) {
				_.each(matches, self.appendBoatPicture, self);
			});
		}, 

		appendBoatPicture: function(FileHolder) {

			this.$el.find('#boatPictures').append(_.template(BoatValidationPictureRowTemplate)({ 
				file: FileHolder
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

			this.$el.find('#proofOfInsurance').append(_.template(BoatValidationInsuranceRowTemplate)({ 
				file: FileHolder,
			}));

			this.proofOfInsurance[FileHolder.id] = FileHolder;
		}
	});
	return BoatValidationView;
});
