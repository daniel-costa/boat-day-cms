define([
'views/BaseView',
'text!templates/HostProfilesTemplate.html',
'text!templates/HostProfilesRowTemplate.html'
], function(BaseView, HostProfilesTemplate, HostProfilesRowTemplate){
	var ProfilesView = BaseView.extend({

		className: "view-host-profiles",
		
		template: _.template(HostProfilesTemplate),

		events : {
			"focus .searchFilter": "tagFieldValue",
			"blur .searchFilter": "leaveField",
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
			innerQuery.equalTo('type', 'host');

			var query = new Parse.Query(Parse.Object.extend('Profile'));
			query.matchesQuery("user", innerQuery);
			query.include('user');
	
			var tpl = _.template(HostProfilesRowTemplate);

			this.$el.find('tbody').html("");

			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
			}

			if( this._in("searchName").val() != "" ) {
				query.contains("displayName", this._in("searchName").val());
			}

			if( this._in("searchStatus").val() != "" ) {
				query.equalTo("status", this._in("searchStatus").val());
			}

			var cbSuccess = function(profiles) {

				_.each(profiles, function(profile) {
		
					var data = {
						id: profile.id, 
						url: profile.get('profilePicture') ? profile.get('profilePicture').url() : '',
						name: profile.get('displayName') ? profile.get('displayName') : '',
						status: profile.get('status'), 
						rating: profile.get('rating'), 
						email: profile.get('user').get('email'), 
						host: profile.get('host')
					}

					self.$el.find('tbody').append( tpl(data) );

				});

			};

			query.find().then(cbSuccess);
			
		}
	});
	return ProfilesView;
});