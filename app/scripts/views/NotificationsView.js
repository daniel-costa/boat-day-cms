define([
'views/BaseView',
'text!templates/NotificationsTemplate.html', 
'text!templates/NotificationsRowTemplate.html'
], function(BaseView, NotificationsTemplate, NotificationsRowTemplate) {
	var NotificationsView = BaseView.extend({

		className: "view-notifications",
			
		template: _.template(NotificationsTemplate),

		events: {
			"blur .searchFilter": "renderRows",
			"keyup .searchFilter": "watchForReturn",
			"click .page": "changePage", 
			"click .idInfo": "alertObjectID",
		},

		initialize: function() {

			this.pagination.cbRefreshPage = NotificationsView.prototype.renderRows;

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

		renderRows: function() {
			var self = this;

			self.$el.find('tbody').html("");

			var query = new Parse.Query(Parse.Object.extend("Notification"));
			query.limit(1000);
			query.descending("createdAt");

			query = self.applyFilter(query);

			query.include("to");
			query.include("from");
			query.include("boatday");
			query.include("request");
			query.include("boat");

			self.handlePagination(query).then(function(query) {
				query.find().then(function(notifications) {
					_.each(notifications, function(notification) {
						self.$el.find('tbody').append( _.template(NotificationsRowTemplate)({ model: notification }) );
					});
				});
			});

		}, 

		applyFilter: function(query) {

			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
			}

			if( this._in("searchActions").val() != "" ) {
				query.contains("action", this._in("searchActions").val());
			}

			if( this._in("searchFromTeam").val() != "" ) {
				query.contains("fromTeam", this._in("searchFromTeam").val());
			}

			if( this._in("searchFromTeam").val() != "" ) {
				query.equalTo("fromTeam", this._in("searchFromTeam").val() == "true");
			}
			return query;
		}
	});
	return NotificationsView;
});