define([
'views/BaseView',
'text!templates/ReportTemplate.html', 
'text!templates/ReportRowTemplate.html'
], function(BaseView, ReportTemplate, ReportRowTemplate){
	var ReportView = BaseView.extend({

		className: "view-report",
		
		template: _.template(ReportTemplate),

		events : {
			"blur .searchFilter": "renderRows",
			"keyup .searchFilter": "watchForReturn"
		},

		render: function() {

			BaseView.prototype.render.call(this);
			this.renderRows();
			
			return this;

		},

		renderRows: function() {

			var self = this;
			var query = new Parse.Query(Parse.Object.extend("Report"));

			query.include('fromProfile');

			var tpl = _.template(ReportRowTemplate);

			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
			}

			// if( this._in("searchName").val() != "" ) {
			// 	query.contains("name", this._in("searchName").val());
			// }

			
			if( this._in("searchAction").val() != "" ) {
				query.contains("action", this._in("searchAction").val());
			}
			
			this.$el.find('tbody').html("");

			var cbSuccess = function(reports) {

				_.each(reports, function(report) {

					// var senderProfile = report.get('fromProfile') ? report.get('fromProfile') : null;
					// console.log(senderProfile);
					var data = {
						id: report.id, 
						action: report.get('action'), 
						message: report.get('message'), 
						//sender: senderProfile.displayName, 
						boatday: report.get('boatday'), 
						profile: report.get('profile')
						
					}

					self.$el.find('tbody').append( tpl(data) );

				});

			};

			query.find().then(cbSuccess);
		}
		
	});
	return ReportView;
});
