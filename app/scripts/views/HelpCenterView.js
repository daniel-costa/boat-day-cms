define([
'views/BaseView',
'text!templates/HelpCenterTemplate.html', 
'text!templates/HelpCenterRowTemplate.html'
], function(BaseView, HelpCenterTemplate, HelpCenterRowTemplate){
	var HelpCenterView = BaseView.extend({

		className: "view-help-center",
		
		template: _.template(HelpCenterTemplate),

		helpcenter: {},

		events : {
			"blur .searchFilter": "renderRows",
			"keyup .searchFilter": "watchForReturn", 
			"click .btn-read": "statusUpdate", 
			"click .idInfo": "alertObjectID",
			"click .page": "changePage",
		},

		initialize: function() {

			this.pagination.cbRefreshPage = HelpCenterView.prototype.renderRows;
			
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

		statusUpdate: function(event) {
			event.preventDefault();

			var self = this;
			var e = $(event.currentTarget);
			var parent = e.closest('tr').attr('data-id');
			var currentStatus = e.closest('a').attr('data-status');
			var newStatus;

			if(currentStatus == "read"){
				newStatus = "unread";
			} else {
				newStatus = "read";
			}
			
			console.log(currentStatus);

			if(confirm("Do you want to change status to " + newStatus + "?")) {
				var query = new Parse.Query(Parse.Object.extend("HelpCenter"));
				query.equalTo("objectId", parent);
				query.first({
					success: function(object) {
						object.set("status", newStatus).save().then(function(){
							self.render();

							console.log(newStatus);
						});
					}, 
					error: function(error) {
						console.log("Error: " + error.code + " " + error.message);
					}
				});
			}
		}, 
		
		applyFilter: function(query) {

			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
			}

			if( this._in("searchCategory").val() != "" ) {
				query.contains("category", this._in("searchCategory").val());
			}

			if( this._in("searchFeedback").val() != "" ) {
				query.contains("feedback", this._in("searchFeedback").val());
			}

			return query;

		},

		renderRows: function() {

			var self = this;
			
			self.$el.find('tbody').html("");

			var query = new Parse.Query(Parse.Object.extend("HelpCenter"));
			query.descending('createdAt');
			
			query = self.applyFilter(query);

			query.include('user.profile');

			self.handlePagination(query).then(function(query) {
				query.find().then(function(matches) {
					_.each(matches, function(match) {
						self.$el.find('tbody').append(_.template(HelpCenterRowTemplate)({ model: match }));
					});
				});
			});
		}
		
	});
	return HelpCenterView;
});
