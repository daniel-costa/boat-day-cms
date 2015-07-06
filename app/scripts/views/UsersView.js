define([
'views/BaseView',
'text!templates/UsersTemplate.html',
'text!templates/UsersRowTemplate.html'
], function(BaseView, UsersTemplate, UsersRowTemplate){
	var UsersView = BaseView.extend({

		className: "view-users",
		
		template: _.template(UsersTemplate),

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
			var query = new Parse.Query(Parse.Object.extend("User"));

			var tpl = _.template(UsersRowTemplate);

			this.$el.find('tbody').html("");

			var cbSuccess = function(users) {

				_.each(users, function(user) {

					var data = {
						id: user.id,
						username: user.get('username'),
						email: typeof user.get('email') !== 'undefined' ? user.get('email') : '',
						host: typeof user.get('host') !== 'undefined' ? user.get('host') : '',
						profile: typeof user.get('profile') !== 'undefined' ? user.get('profile') : '', 
						status: typeof user.get('status') !== 'undefined' ? user.get('status') : '', 
						tos: typeof user.get('tos') !== 'undefined' ? user.get('tos') : '',
						type: typeof user.get('type') !== 'undefined' ? user.get('type') : '', 
						host: typeof user.get('host') !== 'undefined' ? user.get('host') : '',
						profile: typeof user.get('profile') !== 'undefined' ? user.get('profile') : ''
					}

					self.$el.find('tbody').append( tpl(data) );

				});

			};

			query.find().then(cbSuccess);
		}

	});
	return UsersView;
});