define([
'views/BaseView',
'text!templates/BoatValidationTemplate.html'
], function(BaseView, BoatValidationTemplate){
	var BoatValidationView = BaseView.extend({

		className: "view-boat-validate",
		
		template: _.template(BoatValidationTemplate),

		events : {
			
			
		},
		render: function() {

			BaseView.prototype.render.call(this);

			return this;
		},

	});
	return BoatValidationView;
});
