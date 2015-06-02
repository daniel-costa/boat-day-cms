define([
'views/BaseView',
'text!templates/HomeTemplate.html'
], function(BaseView, HomeTemplate){
	var HomeView = BaseView.extend({

		className: "view-home",
		
		template: _.template(HomeTemplate),

		events : {

			"submit form" : "signIn",
		},

		render: function() {

			BaseView.prototype.render.call(this);
			
			return this;

		},

		signIn: function(event) {
			
			event.preventDefault();

			var logInSuccess = function(user) {

				var query = (new Parse.Query(Parse.Role));
				query.equalTo("name", "admin-cms");
				query.equalTo("users", Parse.User.current());
				query.first().then(function(adminRole) {

					if ( adminRole ) {

						console.log("user is an admin");
						Parse.history.navigate('dashboard', true);

					} 

				});

			};

			var logInError = function(error) {
				//alert(error.message);
				//self._error(error.message);
				alert("Enter your correct credentials");
			};

			Parse.User.logIn(this._in('email').val(), this._in('password').val()).then(logInSuccess, logInError);
		}

	});
	return HomeView;
});
