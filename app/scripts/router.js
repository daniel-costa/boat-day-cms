define([
	'views/HomeView',
	'views/DashboardView',
	'views/BoatDaysUpcomingView', 
	'views/BoatDayView',
	'views/HostsView', 
	'views/HostView',
	'views/HostProfilesView', 
	'views/ProfileView',
	'views/BoatsView', 
	'views/BoatView', 
	'views/SendNotificationView', 
	'views/HostValidationView', 
	'views/BoatValidationView', 
	'views/HelpCenterView', 
	'views/ReportView', 
	'views/GuestProfilesView', 
	'views/BoatDayNewView', 
	'views/BoatDaysPastView', 
	'views/CouponsView', 
	'views/CouponView',
	'views/CouponNewView',
	'views/SeatRequestsView', 
	'views/SeatRequestView'
], function(HomeView, DashboardView, BoatDaysUpcomingView, BoatDayView, HostsView, HostView, HostProfilesView, ProfileView, BoatsView, 
	BoatView, SendNotificationView, HostValidationView, BoatValidationView, HelpCenterView, ReportView, GuestProfilesView, BoatDayNewView, BoatDaysPastView, 
	CouponsView, CouponView, CouponNewView, SeatRequestsView, SeatRequestView) {
	
	var AppRouter = Parse.Router.extend({

		routes: {
			'upcoming-boatdays': 'showBoatDaysUpcomingView',
			'past-boatdays': 'showBoatDaysPastView',
			// 'boatDay/:new': 'showBoatDayNewView',
			'create-boatday': 'showBoatDayNewView',
			'boatday/:boatdayid': 'showBoatDayView', 
			'hosts': 'showHostsView',
			'host/:hostid': 'showHostView', 
			'host-validation/:hostid': 'showHostValidationView', 
			'profiles': 'showProfilesView',
			'profile/:profileid': 'showProfileView',
			'boats': 'showBoatsView',
			'boat/:boatid': 'showBoatView',
			'boat-validation/:boatid': 'showBoatValidationView',
			'home': 'showHomeView',
			'sign-out': 'signOut',
			'send-notification': 'showSendNotificationView', 
			'help-center': 'showHelpCenterView',
			'report': 'showReportView',
			'guests': 'showGuestsView',  
			'seat-requests': 'showSeatRequestsView', 
			'seat-request/:requestid': 'showSeatRequestView', 
			'coupons': 'showCouponsView',
			'coupon/:couponid': 'showCouponView', 
			'create-coupon': 'showCouponNewView',
			'*actions': 'showDashboardView'
		},

		showHomeView: function() {
			this.render(new HomeView());
		},

		signOut: function() {
			Parse.User.logOut();
			this.showHomeView();
		},

		showBoatDaysUpcomingView: function() {
			var self = this;
			self.handleAdminAndSignUp(function() {
				self.render(new BoatDaysUpcomingView());
			});
		}, 

		showBoatDaysPastView: function() {
			var self = this;
			self.handleAdminAndSignUp(function() {
				self.render(new BoatDaysPastView());
			});
		}, 

		showHostsView: function() {
			var self = this;
			self.handleAdminAndSignUp(function() {
				self.render(new HostsView());
			});
		}, 

		showProfilesView: function() {
			var self = this;
			self.handleAdminAndSignUp(function() {
				self.render(new HostProfilesView());
			});
		},

		showHelpCenterView: function() {
			var self = this;
			self.handleAdminAndSignUp(function() {
				self.render(new HelpCenterView());
			});
		}, 

		showReportView: function() {
			var self = this;
			self.handleAdminAndSignUp(function() {
				self.render(new ReportView());
			});
		},

		showGuestsView: function() {
			var self = this;
			self.handleAdminAndSignUp(function() {
				self.render(new GuestProfilesView());
			});
		},

		showSeatRequestsView: function() {
			var self = this;
			self.handleAdminAndSignUp(function() {
				self.render(new SeatRequestsView());
			});
		},

		showCouponsView: function() {
			var self = this;
			self.handleAdminAndSignUp(function() {
				self.render(new CouponsView());
			});
		}, 

		showBoatsView: function() {
			var self = this;
			self.handleAdminAndSignUp(function() {
				self.render(new BoatsView());
			});
		},

		showSendNotificationView: function() {
			var self = this;
			self.handleAdminAndSignUp(function() {
				var NotificationModel = Parse.Object.extend('Notification');
				self.render(new SendNotificationView({ model: new NotificationModel() }));
			});
		}, 

		showProfileView: function( profileid ) {
			var self = this;
			self.handleAdminAndSignUp(function() {
				new Parse.Query(Parse.Object.extend('Profile')).get(profileid).then(function( profile ) {
					self.render(new ProfileView({ model: profile }));
				});
			});
		},

		showProfileValidationView: function( profileid ){
			var self = this;
			self.handleAdminAndSignUp(function() {
				new Parse.Query(Parse.Object.extend('Profile')).get(profileid).then(function( profile ) {
					self.render(new ProfileValidationView({ model: profile }));
				});
			});
		},

		showHostView: function( hostid ) {
			var self = this;
			self.handleAdminAndSignUp(function() {
				var query = new Parse.Query(Parse.Object.extend('Host'));
				query.include('user');
				query.get(hostid).then(function( host ) {
					self.render(new HostView({ model: host }));
				});
			});
		},

		showCouponView: function( couponid ) {
			var self = this;
			self.handleAdminAndSignUp(function() {
				new Parse.Query(Parse.Object.extend('Coupon')).get(couponid).then(function( coupon ) {
					self.render(new CouponView({ model: coupon }));
				});
			});
		}, 

		showHostValidationView: function( hostid ) {
			var self = this;
			self.handleAdminAndSignUp(function() {
				new Parse.Query(Parse.Object.extend('Host')).get(hostid).then(function( host ) {
					self.render(new HostValidationView({ model: host }));
				});
			});
		}, 

		showBoatDayView: function( boatdayid ) {
			var self = this;
			self.handleAdminAndSignUp(function() {
				new Parse.Query(Parse.Object.extend('BoatDay')).get(boatdayid).then(function( boatday ) {
					self.render(new BoatDayView({ model: boatday }));
				});
			});
		},


		showSeatRequestView: function( requestid ) {

			var self = this;
			self.handleAdminAndSignUp(function() {
		
				var query = new Parse.Query(Parse.Object.extend('SeatRequest'));
				query.include('boatday');
				query.include('profile');
				query.include('user');
				query.include('promoCode');
				
				query.get(requestid).then(function( request ) {
					self.render(new SeatRequestView({ model: request }));
				});
			});
			
		}, 

		showBoatDayNewView: function() {
			var self = this;
			self.handleAdminAndSignUp(function() {
				self.render(new BoatDayNewView());
			});
		}, 

		showCouponNewView: function() {
			var self = this;
			self.handleAdminAndSignUp(function() {
				self.render(new CouponNewView());
			});
		},

		showBoatView: function( boatid ) {
			var self = this;
			self.handleAdminAndSignUp(function() {
				new Parse.Query(Parse.Object.extend('Boat')).get(boatid).then(function( boat ) {
					self.render(new BoatView({ model: boat }));
				});
			});
		},

		showBoatValidationView: function( boatid ) {
			var self = this;
			self.handleAdminAndSignUp(function() {
				new Parse.Query(Parse.Object.extend('Boat')).get(boatid).then(function( boat ) {
					self.render(new BoatValidationView({ model: boat }));
				});
			});
		}, 

		showDashboardView: function() {
			var self = this;
			self.handleAdminAndSignUp(function() {
				self.render(new DashboardView());
			});
		},

		handleAdminAndSignUp: function( cb ) {
			if( !Parse.User.current() ) {
				this.showHomeView();
				return ;
			} else {
				cb();
			}
		},

		render: function(view) {
			if(this.currentView != null) {
				this.currentView.teardown();
			}
			$("#app").html( view.render().el );
			view.afterRender();
			this.currentView = view;
		}
		
	});
	return AppRouter;
});
