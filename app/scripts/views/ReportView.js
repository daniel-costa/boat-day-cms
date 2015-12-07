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
			"click .btn-read": "readUpdate",
			"click .idInfo": "alertObjectID", 
			"click .page": "changePage",
		},

		initialize: function() {

			this.pagination.cbRefreshPage = ReportView.prototype.renderRows;

		},

		render: function() {

			BaseView.prototype.render.call(this);
			this.renderRows();
			
			return this;

		},

		alertObjectID: function(event) {
			event.preventDefault();
			alert($(event.currentTarget).closest('tr').attr('data-id'));
		},

		applyFilter: function(query) {

			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
			}

			if( this._in("searchSender").val() != "" ) {
				var queryDisplayName = new Parse.Query(Parse.Object.extend("Profile"));
				queryDisplayName.contains("displayName", this._in("searchSender").val());

				querySenderProfile = new Parse.Query.or(queryDisplayName);
				query.matchesQuery("fromProfile", querySenderProfile);
			}

			return query;
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

			this.$el.find('tbody').html("");

			var query = new Parse.Query(Parse.Object.extend("Report"));

			query = self.applyFilter(query);

			query.include('fromProfile');
			query.include('profile');
			query.include('boatday');
			query.include('user');

			var tpl = _.template(ReportRowTemplate);

			self.handlePagination(query).then(function(query) {
				query.find().then(function(reports) {
					_.each(reports, function(report) {
						self.$el.find('tbody').append( _.template(ReportRowTemplate)({ model: report }) );

					});

				});
			});
		}
		
	});
	return ReportView;
});
