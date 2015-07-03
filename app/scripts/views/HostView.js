define([
'views/BaseView',
'text!templates/HostPastBoatDaysRowTemplate.html',
'text!templates/HostTemplate.html'
], function(BaseView, HostPastBoatDaysRowTemplate, HostTemplate){
	var HostView = BaseView.extend({

		className: "view-host-update",
		
		template: _.template(HostTemplate),

		events : {

			"submit form" : "update", 
			'click .btn-send-cert-noti': 'sendCertNotification',
			'click .btn-send-host-noti': 'sendHostNotification',
			"change .upload": "uploadBgScreen" 
		},

		initialize: function() {

			if( this.model.get("bgCheck") ) {
				this.tempBinaries.bgCheck = this.model.get("bgCheck");
			}
			
		},

		render: function() {

			BaseView.prototype.render.call(this);

			this.renderPastBoatDays();

			return this;
		},

		renderPastBoatDays: function() {

			var self = this;
			this.$el.find('#pastBoatDays').html("");
			var query = self.model.relation('boatdays').query();
			query.lessThan("date", new Date());
			var tpl = _.template(HostPastBoatDaysRowTemplate);

			query.find().then(function(matches) {
				_.each(matches, function(pastBoatDay){
					console.log(pastBoatDay.id);

					var datas = {

						id: pastBoatDay.id, 
						name: pastBoatDay.get('name'), 
						category: pastBoatDay.get('category'),
						date: pastBoatDay.get('date').toUTCString().substring(0, 16)
					}
					self.$el.find('#pastBoatDays').append( tpl(datas) );
				});
			});

		}, 

		uploadBgScreen: function(event) {

			var self = this;
			
			var cb = function(file) {
				
				var parent = $(event.currentTarget).closest('div');
				var preview = parent.find('.preview');

				if( preview.length == 1 ) {
					preview.attr('href', file.url());
				} else {
					
					var link = $('<a>').attr({ 'href': file.url(), target: '_blank' }).text('Background Check').addClass('preview');
					parent.append($('<p>').append(link));	
					self.model.set('bgCheckDate', new Date());

				}

			}

			this.uploadFile(event, cb);
		},

		sendHostNotification: function() {

			event.preventDefault();

			var NotificationModel = Parse.Object.extend("Notification");
			var status = this.model.get('status');

			if( confirm("Are you sure you want to send a notification to '" + this.model.get('firstname') + ' ' + this.model.get('lastname') +"'?") ) {
				if( status == 'approved' ) {
					new NotificationModel({
						from: Parse.User.current().get('profile'),
						to: this.model.get('profile'),
						action: "host-approved",
						fromTeam: true
					}).save().then(function() {
						alert('Notification Sent');	
					});
				} else if( status == 'denied' ) {
					new NotificationModel({
						from: Parse.User.current().get('profile'),
						to: this.model.get('profile'),
						action: "host-denied",
						fromTeam: true
					}).save().then(function() {
						alert('Notification Sent');
					});
				} else {
					alert('Host must be approved or denied to receive a notification');
				}
			}
		}, 

		update: function(event) {
			
			event.preventDefault();
			var self = this;

			var data = {

				SSN: this._in('ssn').val(),
				accountHolder: this._in('accountHolder').val(),
				street: this._in('street').val(),
				accountRouting: this._in('accountRout').val(), 
				accountNumber: this._in('accountNum').val(),  
				//birthdate: this._in('birthDate').val(),
				validationText: this._in('validationText').val(), 
				validationTextInternal: this._in('validationTextInternal').val(), 
				city: this._in('city').val(),
				firstname: this._in('firstname').val(), 
				lastname: this._in('lastname').val(), 
				phone: this._in('phone').val(), 
				state: this._in('state').val(), 
				status: this._in('status').val(), 
				street: this._in('street').val(), 
				type: this._in('hostType').val(), 
				zipCode: this._in('zipcode').val(), 
				certStatusBSC: this._in('certStatusBSC').val(), 
				certStatusCCL: this._in('certStatusCCL').val(), 
				certStatusFAC: this._in('certStatusFAC').val(), 
				certStatusFL: this._in('certStatusFL').val(), 
				certStatusMCL: this._in('certStatusMCL').val(), 
				certStatusSL: this._in('certStatusSL').val(), 
				certResponseBSC: this._in('certResponseBSC').val(), 
				certResponseCCL: this._in('certResponseCCL').val(), 
				certResponseMCL: this._in('certResponseMCL').val(), 
				certResponseFL: this._in('certResponseFL').val(), 
				certResponseSL: this._in('certResponseSL').val(), 
				certResponseFAC: this._in('certResponseFAC').val(), 
				bgCheck: self.tempBinaries.bgCheck ? self.tempBinaries.bgCheck : null,
				coupon: this._in('coupon').val()
			
			};
			
			var hostUpdateSuccess = function( profile ) {

				//Parse.history.navigate('hosts', true);
				self.render();

			};
			
			this.model.save(data).then(hostUpdateSuccess);

		},

		sendCertNotification: function(event) {

			event.preventDefault();

			var e = $(event.currentTarget);
			var NotificationModel = Parse.Object.extend("Notification");
			var status = this.model.get('certStatus'+e.attr('data-cert'));

			if( confirm("Are you sure you want to send a notification '" + e.attr('data-cert-name') + "' to '" + this.model.get('firstname') + ' ' + this.model.get('lastname') +"'?") ) {

				if( status == 'approved' ) {
					new NotificationModel({
						from: Parse.User.current().get('profile'),
						to: this.model.get('profile'),
						action: "certification-approved",
						fromTeam: true,
						message: e.attr('data-cert-name')
					}).save().then(function() {
						alert('Notification Sent');
					});
				} else if( status == 'denied' ) {
					new NotificationModel({
						from: Parse.User.current().get('profile'),
						to: this.model.get('profile'),
						action: "certification-denied",
						fromTeam: true,
						message: e.attr('data-cert-name')
					}).save().then(function() {
						alert('Notification Sent');
					});
				} else {
					alert('Certification must be approved or denied to receive a notification');
				}

			}	

		}

	});
	return HostView;
});
