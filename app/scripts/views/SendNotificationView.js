define([
'views/BaseView',
'text!templates/SendNotification.html'
], function(BaseView, SendNotification){
	var SendNotificationView = BaseView.extend({

		className: "view-host-update",
		
		template: _.template(SendNotification),

		collectionProfiles: {},

		events : {
			"submit form" : "send"
		},

		render: function() {

			BaseView.prototype.render.call(this);
			var self = this;

			
			var fetched = 0;
			var total = 0;
			var select = $('<select>').attr({ id: 'profile', name: 'profile', class: 'form-control' });

			var queryProfiles = new Parse.Query(Parse.Object.extend("Profile"));
			queryProfiles.equalTo('status', 'complete');
			queryProfiles.ascending('displayName');
			queryProfiles.limit(500);
			queryProfiles.count().then(function(_total) {
				total = _total;
				doQuery();
			});

			var doQuery = function() {

				queryProfiles.find().then(function(matches) {
					
					_.each(matches, function(profile) {

						select.append($('<option>').attr('value', profile.id).text(profile.get('displayName')));
						self.collectionProfiles[profile.id] = profile;
					});

					fetched += matches.length;

					if( total > fetched) {
						queryProfiles.skip(fetched);
						doQuery();
					} else {
						self.$el.find('.profiles').html(select);
					}
					
				});
			};

			return this;
		}, 

		send: function(event) {

			event.preventDefault();

			var self = this;
			
			var data = {
				to: self.collectionProfiles[this._in('profile').val()],
				action: "bd-message", 
				message: this._in('message').val(), 
				fromTeam: true,
				from: Parse.User.current().get('profile'), 
				sendEmail: Boolean(this.$el.find('[name="sendEmail"]').val())
				// boat: this.model
				// boatday: this.model
			}; 

			var NotificationModel = Parse.Object.extend('Notification');
			var model = new NotificationModel();
			model.save(data).then(function( SendNotification ) {
				Parse.history.navigate('dashboard', true);
			});

		}

	});
	return SendNotificationView;
});
