define([
'views/BaseView',
'text!templates/GuestProfilesTemplate.html', 
'text!templates/GuestProfilesRowTemplate.html'
], function(BaseView, GuestProfilesTemplate, GuestProfilesRowTemplate){
	var HostsView = BaseView.extend({

		className: "view-guests-lists",
		
		template: _.template(GuestProfilesTemplate),

		events : {
			"blur .searchFilter": "renderRows",
			"keyup .searchFilter": "watchForReturn",
			"click .idInfo": "alertObjectID"
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
			
			var innerQuery = new Parse.Query(Parse.Object.extend('User'));
			innerQuery.equalTo('type', 'guest');

			var query = new Parse.Query(Parse.Object.extend('Profile'));
			query.matchesQuery("user", innerQuery);
			query.include('user');
			
			var tpl = _.template(GuestProfilesRowTemplate);

			this.$el.find('tbody').html("");

			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
			}

			if( this._in("searchName").val() != "" ) {
				query.contains("displayName", this._in("searchName").val());
			}

			if( this._in("searchStatus").val() != "" ) {
				query.contains("status", this._in("searchStatus").val());
			}

			var cbSuccess = function(profiles) {

				_.each(profiles, function(profile) {
						
					var data = {
						id: profile.id, 
						url: profile.get('profilePicture') ? profile.get('profilePicture').url() : '',
						name: profile.get('displayName'),
						rating: profile.get('rating'), 
						status: profile.get('status'), 
						email: profile.get('user').get('email'),
						profile: profile.get('profile')
					}

					self.$el.find('tbody').append( tpl(data) );

				});

			};

			query.find().then(cbSuccess);
			
		}
		
	});
	return HostsView;
});
