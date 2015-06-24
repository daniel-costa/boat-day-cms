define([
'views/BaseView',
'text!templates/HostValidationTemplate.html'
], function(BaseView, HostValidationTemplate){
	var HostValidationView = BaseView.extend({

		className: "view-host-validate",
		
		template: _.template(HostValidationTemplate),

		events : {
			'submit form': 'save',
			'click .btn-send-cert-noti': 'sendCertNotification'
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

			var hostValdationSuccess = function( host ) {

				self.render();

			};

			this.model.save(data).then(hostValdationSuccess);
		},

		sendHostNotification: function() {

			var from = Parse.User.current().get('profile');
			var to = this.model.get('profile');
			var status = this.model.get('status');

			if( status == 'approved' ) {
				// host-approved
				alert('send approved')
			} else if( status == 'denied' ) {
				// host-denied
				alert('send denied')
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
