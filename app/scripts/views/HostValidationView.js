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
			'click .btn-send-host-noti': 'sendHostNotification',
			"change .upload": "uploadBgScreen"
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
				certResponseFAC: this._in('certResponseFAC').val(), 
				bgCheck: self.tempBinaries.bgCheck ? self.tempBinaries.bgCheck : null, 
				bgCheckQ1: Boolean(this._in('bgCheckQ1').val()),
				bgCheckQ2: Boolean(this._in('bgCheckQ2').val()),
				bgCheckQ3: Boolean(this._in('bgCheckQ3').val()),
				bgCheckQ4: Boolean(this._in('bgCheckQ4').val()),
				bgCheckQ5: Boolean(this._in('bgCheckQ5').val()),
				bgCheckQ6: Boolean(this._in('bgCheckQ6').val()),
				bgCheckQ7: Boolean(this._in('bgCheckQ7').val()),
				bgCheckQ8: Boolean(this._in('bgCheckQ8').val()),
				bgCheckQ9: Boolean(this._in('bgCheckQ9').val())
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
						fromTeam: true,
						sendEmail: true,
					}).save().then(function() {
						alert('Notification Sent');	
					});
				} else if( status == 'denied' ) {
					new NotificationModel({
						from: Parse.User.current().get('profile'),
						to: this.model.get('profile'),
						action: "host-denied",
						fromTeam: true,
						sendEmail: true,
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
						message: e.attr('data-cert-name'),
						sendEmail: true,
					}).save().then(function() {
						alert('Notification Sent');
					});
				} else if( status == 'denied' ) {
					new NotificationModel({
						from: Parse.User.current().get('profile'),
						to: this.model.get('profile'),
						action: "certification-denied",
						fromTeam: true,
						message: e.attr('data-cert-name'),
						sendEmail: true,
					}).save().then(function() {
						alert('Notification Sent');
					});
				} else {
					alert('Certification must be approved or denied to receive a notification');
				}
			}	
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

	});
	return HostValidationView;
});
