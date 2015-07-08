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
			"keyup .searchFilter": "watchForReturn"
		},

		render: function() {

			BaseView.prototype.render.call(this);
			this.renderRows();
			return this;

		},

		renderRows: function() {

			var self = this;
			
			var innerQuery = new Parse.Query(Parse.Object.extend('User'));
			innerQuery.equalTo('type', 'guest');

			var query = new Parse.Query(Parse.Object.extend('Profile'));
			query.matchesQuery("user", innerQuery);
	
			var tpl = _.template(GuestProfilesRowTemplate);

			this.$el.find('tbody').html("");

			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
			}

			if( this._in("searchName").val() != "" ) {
				query.contains("displayName", this._in("searchName").val());
			}

			if( this._in("searchRatings").val() != "" ) {
				query.contains("rating", parseInt(this._in("searchRatings").val()));
			}

			if( this._in("searchStatus").val() != "" ) {
				query.contains("status", this._in("searchStatus").val());
			}

			var cbSuccess = function(guests) {

				_.each(guests, function(result) {
					
					var data = {
						id: result.id, 
						name: result.get('displayName'),
						rating: result.get('rating'), 
						status: result.get('status'), 
						profile: result.get('profile')
					}

					self.$el.find('tbody').append( tpl(data) );

				});

			};

			query.find().then(cbSuccess);
			
		}
		
	});
	return HostsView;
});
