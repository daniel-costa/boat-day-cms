define([
'views/BaseView',
'text!templates/GuestsTemplate.html', 
'text!templates/GuestsRowTemplate.html'
], function(BaseView, GuestsTemplate, GuestsRowTemplate){
	var HostsView = BaseView.extend({

		className: "view-guests-lists",
		
		template: _.template(GuestsTemplate),

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
			var query = new Parse.Query(Parse.Object.extend("User"));
			query.include('profile');
			query.equalTo('type', 'guest');
			var tpl = _.template(GuestsRowTemplate);

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
						id: result.get('profile').id, 
						name: result.get('profile').get('displayName'),
						rating: result.get('profile').get('rating'), 
						status: result.get('profile').get('status'), 
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
