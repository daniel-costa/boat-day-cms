define([
'views/BaseView',
'text!templates/HostsTemplate.html', 
'text!templates/HostsRowTemplate.html'
], function(BaseView, HostsTemplate, HostsRowTemplate){
	var HostsView = BaseView.extend({

		className: "view-hosts",
		
		template: _.template(HostsTemplate),

		events : {
			"blur .searchFilter": "renderRows",
			"keyup .searchFilter": "watchForReturn",
			"click .idInfo": "alertObjectID",
			"click .page": "changePage",
		},

		initialize: function() {

			this.pagination.cbRefreshPage = HostsView.prototype.renderRows;

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

			if( this._in("searchFirstName").val() != "" ) {
				query.contains("firstname", this._in("searchFirstName").val());
			}

			if( this._in("searchLastName").val() != "" ) {
				query.contains("lastname", this._in("searchLastName").val());
			}

			if( this._in("searchPhone").val() != "" ) {
				query.notEqualTo("phone", this._in("searchPhone").val());
			}

			if( this._in("searchStatus").val() != "" ) {
				query.contains("status", this._in("searchStatus").val());
			} else {
				query.notEqualTo("status", 'creation');
			}

			if( this._in("searchType").val() != "" ) {
				query.contains("type", this._in("searchType").val());
			}

			return query;

		},

		renderRows: function() {

			var self = this;

			self.$el.find('tbody').html("");

			var query = new Parse.Query(Parse.Object.extend("Host"))
			query.ascending("firstname, lastname");

			query = self.applyFilter(query);
			
			query.include("user");
			
			self.handlePagination(query).then(function(query) {
				query.find().then(function(hosts) {
					_.each(hosts, function(host) {
						self.$el.find('tbody').append( _.template(HostsRowTemplate)({ model: host }) );
					});
				});
			});
		},
		
	});
	return HostsView;
});
