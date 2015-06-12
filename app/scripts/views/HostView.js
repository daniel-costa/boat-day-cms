define([
'views/BaseView',
'text!templates/HostTemplate.html'
], function(BaseView, HostTemplate){
	var HostView = BaseView.extend({

		className: "view-host-update",
		
		template: _.template(HostTemplate),

		events : {

			"submit form" : "update", 
			"change .upload": "uploadBgScreen", 
			"click .btn-upload": "clickUpload"
		},

		uploadBgScreen: function(event) {

			var cb = function(file) {
				
				var parent = $(event.currentTarget).closest('div');
				var preview = parent.find('.preview');

				if( preview.length == 1 ) {
					preview.attr('href', file.url());

				} else {
					
					var link = $('<a>').attr({ 'href': file.url(), target: '_blank' }).text('Bg Check').addClass('preview');
					parent.append($('<p>').append(link));	
				}

			}

			this.uploadFile(event, cb);
		},

		render: function() {

			BaseView.prototype.render.call(this);
			
			return this;

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
				bgCheck: self.tempBinaries.bgCheck ? self.tempBinaries.bgCheck : null,

			
			};
			
			var hostUpdateSuccess = function( profile ) {

				Parse.history.navigate('hosts', true);

			};
			
			this.model.save(data).then(hostUpdateSuccess);

		},

	});
	return HostView;
});
