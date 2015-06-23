define([
'views/BaseView',
'text!templates/HostValidationTemplate.html'
], function(BaseView, HostValidationTemplate){
	var HostValidationView = BaseView.extend({

		className: "view-host-validate",
		
		template: _.template(HostValidationTemplate),

		events : {
			
			
		},
		render: function() {

			BaseView.prototype.render.call(this);

			return this;
		},

	});
	return HostValidationView;
});
