define([
'views/BaseView',
'text!templates/GuestProfilesTemplate.html', 
'text!templates/GuestProfilesRowTemplate.html'
], function(BaseView, GuestProfilesTemplate, GuestProfilesRowTemplate){
	var GuestProfilesView = BaseView.extend({

		className: "view-guests-lists",
		
		template: _.template(GuestProfilesTemplate),

		events : {
			"blur .searchFilter": "renderRows",
			"keyup .searchFilter": "watchForReturn",
			"click .idInfo": "alertObjectID", 
			"click .page": "changePage",
		},

		initialize: function() {

			this.pagination.cbRefreshPage = GuestProfilesView.prototype.renderRows;

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

			if( this._in("searchName").val() != "" ) {
				query.contains("displayName", this._in("searchName").val());
			}

			if( this._in("searchStatus").val() != "" ) {
				query.contains("status", this._in("searchStatus").val());
			}

			return query;
		}, 

		renderRows: function() {

			var self = this;

			self.$el.find('tbody').html("");

			
			var innerQuery = new Parse.Query(Parse.Object.extend('User'));
			innerQuery.equalTo('type', 'guest');

			var query = new Parse.Query(Parse.Object.extend('Profile'));
			query.matchesQuery("user", innerQuery);

			query = self.applyFilter(query);

			query.include('user');

			self.handlePagination(query).then(function(query) {
				query.find().then(function(profiles) {
					_.each(profiles, function(profile) {
						self.$el.find('tbody').append( _.template(GuestProfilesRowTemplate)({ model: profile }) );

					});

				});

			});
		},
		
	});
	return GuestProfilesView;
});
