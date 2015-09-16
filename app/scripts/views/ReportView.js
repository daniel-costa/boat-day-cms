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
			"keyup .searchFilter": "watchForReturn", 
			"click .btn-read": "readUpdate"
		},

		render: function() {

			BaseView.prototype.render.call(this);
			this.renderRows();
			
			return this;

		},

		readUpdate: function(event) {

			event.preventDefault();

			var self = this;
			var e = $(event.currentTarget);
			var parent = e.closest('tr').attr('data-id');
			var currentStatus = e.closest('a').attr('data-read');
			var booleanCurrentStatus = (currentStatus.toLowerCase() == "true");
			var newStatus = !booleanCurrentStatus;
			
			if(confirm("Do you want to change status to " + newStatus + "?")) {
				var query = new Parse.Query(Parse.Object.extend("Report"));
				query.equalTo("objectId", parent);
				query.first({
					success: function(object) {
						object.set("read", newStatus).save().then(function(){
							self.render();
						});
					}, 
					error: function(error) {
						console.log("Error: " + error.code + " " + error.message);
					}
				});
			}
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

					var data = {
						id: report.id, 
						createdAt: report.createdAt.toUTCString().substring(0, 26),
						action: report.get('action'), 
						message: report.get('message'), 
						sender: report.get('fromProfile'),
						boatday: report.get('boatday'), 
						profile: report.get('profile'), 
						read: report.get('read')
					}

					self.$el.find('tbody').append( tpl(data) );

				});

			};

			query.find().then(cbSuccess);
		}
		
	});
	return ReportView;
});
