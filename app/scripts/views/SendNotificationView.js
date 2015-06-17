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

			var profilesFetchSuccess = function(matches) {

				var select = $('<select>').attr({ id: 'profile', name: 'profile', class: 'form-control' });

				_.each(matches, function(profile) {
					var opt = $('<option>').attr('value', profile.id).text(profile.get('displayName'));
					select.append(opt);
					self.collectionProfiles[profile.id] = profile;
				});

				self.$el.find('.profiles').html(select);
			};

			var queryProfiles = new Parse.Query(Parse.Object.extend("Profile"));
			queryProfiles.ascending('displayName');
			queryProfiles.find().then(profilesFetchSuccess);

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
				// boat: this.model
				// boatday: this.model
			}; 

			var sendNotificationSuccess = function( SendNotification ) {

				Parse.history.navigate('dashboard', true);

			};

			this.model.save(data).then(sendNotificationSuccess);

		}

	});
	return SendNotificationView;
});
