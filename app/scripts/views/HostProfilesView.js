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
			"keyup .searchFilter": "watchForReturn"
		},

		render: function() {

			BaseView.prototype.render.call(this);

			this.renderRows();

			return this;

		},

		renderRows: function() {

			var self = this;
			var query = new Parse.Query(Parse.Object.extend("Profile"));
			query.include("user");
			var tpl = _.template(HostProfilesRowTemplate);

			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
			}

			if( this._in("searchName").val() != "" ) {
				query.contains("displayName", this._in("searchName").val());
			}

			if( this._in("searchStatus").val() != "" ) {
				query.contains("status", this._in("searchStatus").val());
			}

			this.$el.find('tbody').html("");

			var cbSuccess = function(profiles) {

				_.each(profiles, function(profile) {

					var data = {
						id: profile.id,
						name: profile.get('displayName'),
						url: profile.get('profilePicture') ? profile.get('profilePicture').url() : '',
						status: profile.get('status'),
						host: profile.get('host'),
						user: profile.get('user'),
						rating: profile.get('rating'), 
						type: profile.get('user').get('type'), 
						email: profile.get('user').get('email')
					}

					self.$el.find('tbody').append( tpl(data) );

				});

			};

			query.find().then(cbSuccess);
		}

	});
	return ProfilesView;
});