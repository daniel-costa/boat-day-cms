define([
'views/BaseView',
'text!templates/HostValidationTemplate.html'
], function(BaseView, HostValidationTemplate){
	var HostValidationView = BaseView.extend({

		className: "view-host-validate",
		
		template: _.template(HostValidationTemplate),

		events : {
			'submit form': 'save',
			'click .btn-send-cert-noti': 'sendCertNotification',
			'click .btn-send-host-noti': 'sendHostNotification'
		},

		render: function() {

			BaseView.prototype.render.call(this);

			return this;
		},


		save: function( event ) {

			event.preventDefault();

			var self = this;

			var data = {
				status: this._in('status').val(), 
				validationText: this._in('validationText').val(), 
				validationTextInternal: this._in('validationTextInternal').val(), 
				certStatusBSC: this._in('certStatusBSC').val(), 
				certResponseBSC: this._in('certResponseBSC').val(), 
				certStatusCCL: this._in('certStatusCCL').val(), 
				certResponseCCL: this._in('certResponseCCL').val(), 
				certStatusMCL: this._in('certStatusMCL').val(), 
				certResponseMCL: this._in('certResponseMCL').val(), 
				certStatusFL: this._in('certStatusFL').val(), 
				certResponseFL: this._in('certResponseFL').val(), 
				certStatusSL: this._in('certStatusSL').val(), 
				certResponseSL: this._in('certResponseSL').val(), 
				certStatusFAC: this._in('certStatusFAC').val(), 
				certResponseFAC: this._in('certResponseFAC').val()
			};

			this.model.save(data).then(function( profile ) {
				self.render();
			});
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
	return HostValidationView;
});
