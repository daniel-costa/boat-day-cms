define([
'views/BaseView',
'text!templates/NavigationTopTemplate.html'
], function(BaseView, NavigationTopTemplate) {
	var NavigationTopView = BaseView.extend({

		className: "view-navigation-top",
		
		template: _.template(NavigationTopTemplate),

		render: function() {

			BaseView.prototype.render.call(this);

			var self = this;

			var unreadHelpCenterNumber = new Parse.Query(Parse.Object.extend("HelpCenter"));
			unreadHelpCenterNumber.equalTo("status", "unread");

			var unreadReportNumber = new Parse.Query(Parse.Object.extend("Report"));
			unreadReportNumber.notEqualTo("read", true);

			Parse.Promise.when(unreadHelpCenterNumber.count(), unreadReportNumber.count()).then(function(unreadHelpCenterNumberTotal, unreadReportNumberTotal) {

				self.$el.find('.newHelpCenter').text(unreadHelpCenterNumberTotal);
				self.$el.find('.newReport').text(unreadReportNumberTotal);

			});

			return this;
		}
	});
	return NavigationTopView;
});
