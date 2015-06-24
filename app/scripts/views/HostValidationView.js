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

			var NotificationModel = Parse.Object.extend("Notification");

			var status = this.model.get('status');

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
		},

		sendCertNotification: function(event) {
			var e = $(event.currentTarget);
			var name = e.attr('data-cert-name');
			var cert = e.attr('data-cert');
			var from = Parse.User.current().get('profile');
			var to = this.model.get('profile');
			var status = this.model.get('certStatus'+cert);

			if( status == 'approved' ) {
				// certification-approved
			} else if( status == 'denied' ) {
				// certification-denied
				alert('send denied')
			} else {
				alert('Host must be approved or denied to receive a notification');
			}
		}

	});
	return HostValidationView;
});
