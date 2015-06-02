define([
'views/BaseView',
'text!templates/CaptainTemplate.html'
], function(BaseView, CaptainTemplate){
	var CaptainView = BaseView.extend({

		className: "view-captain-update",
		
		template: _.template(CaptainTemplate),

		events : {

			//"submit form" : "update"
		},

		render: function() {

			BaseView.prototype.render.call(this);
			
			return this;

		},

	});
	return CaptainView;
});
