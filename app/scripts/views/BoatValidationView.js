define([
'views/BaseView',
'text!templates/BoatValidationTemplate.html',
'text!templates/BoatValidationPictureRowTemplate.html', 
'text!templates/BoatValidationInsuranceRowTemplate.html'
], function(BaseView, BoatValidationTemplate, BoatValidationPictureRowTemplate, BoatValidationInsuranceRowTemplate){
	var BoatValidationView = BaseView.extend({

		className: "view-boat-validate",
		
		template: _.template(BoatValidationTemplate),

		boatPictures: {},

		proofOfInsurance: {},

		events : {
			"submit form": "save",
			"click .delete-insurance": "deleteProofOfInsurance",
			"click .delete-picture": "deleteBoatPicture",
			"click .update-picture": "updateBoatPicture",
			"change .upload": "uploadNewFile",
			"click .notify-host": "sendBoatNotification"
		},

		
		render: function() {

			BaseView.prototype.render.call(this);

			this.displayBoatPictures();
			this.displayProofsOfInurance();

			return this;
		},

		save: function( event ) {

			event.preventDefault();

			var self = this;

			this.model.save({
				status : this._in('status').val(), 
				validationText : this._in('validationText').val(), 
				validationTextInternal : this._in('validationTextInternal').val()
			}).then(function( boat ) {
				self.render();
			});

		},

		displayBoatPictures: function() {

			var self = this;

			self.boatPictures = {};
			this.$el.find('#boatPictures').html('');

			var query = self.model.relation('boatPictures').query();
			query.ascending('order');
			query.find().then(function(matches) {
				_.each(matches, self.appendBoatPicture, self);
			});
		}, 

		appendBoatPicture: function(FileHolder) {

			this.$el.find('#boatPictures').append(_.template(BoatValidationPictureRowTemplate)({ 
				file: FileHolder
			}));

			this.boatPictures[FileHolder.id] = FileHolder;
		}, 

		deleteBoatPicture: function(event) {

			event.preventDefault();

			var self = this;
			var e = $(event.currentTarget);
			var id = e.closest('tr').attr('data-id');
			var order = self.boatPictures[id].get('order');

			if( confirm("Do you really want to delete picture #"+order+"?") ) {
				this.model.relation('boatPictures').remove(self.boatPictures[id]);
				this.model.save().then(function() {
					delete this.boatPictures[id];
					self.displayBoatPictures();
				});
			}

		},

		updateBoatPicture: function(event) {

			event.preventDefault();

			var self = this;
			var e = $(event.currentTarget);
			var parent = e.closest('tr');

			self.boatPictures[parent.attr('data-id')].save({ 
				order: parseInt(parent.find('[name="order"]').val())
			}).then(function() {
				self.displayBoatPictures();
			}, function(e) {
				console.log(e);
			});

		},

		displayProofsOfInurance: function() {

			var self = this;
			self.proofOfInsurance = {};
			this.$el.find('#proofOfInsurance').html('');

			var query = self.model.relation('proofOfInsurance').query();
			query.ascending("createdAt");
			query.find().then(function(matches) {
				_.each(matches, self.appendInsurance, self);
			});
		}, 

		appendInsurance: function(FileHolder) {

			this.$el.find('#proofOfInsurance').append(_.template(BoatValidationInsuranceRowTemplate)({ 
				id : FileHolder.id,
				file: FileHolder,
			}));

			this.proofOfInsurance[FileHolder.id] = FileHolder;
		},

		deleteProofOfInsurance: function(event) {

			event.preventDefault();

			var self = this;
			var e = $(event.currentTarget);
			var id = e.closest('tr').attr('data-id');

			if( confirm("Do you really want to delete "+id+"?") ) {
				this.model.relation('proofOfInsurance').remove(self.proofOfInsurance[id]);
				this.model.save().then(function() {
					delete this.proofOfInsurance[id];
					self.displayProofsOfInurance();
				});
			}

		},

		uploadNewFile: function (event) {

			var self = this;
			var e = $(event.currentTarget);
			var opts = {};
			var cb = null;
			var FileHolderModel = Parse.Object.extend('FileHolder');

			if( e.attr('name') == 'boat-picture' ) {
				cb = function(file) {
					new FileHolderModel({ file: file }).save().then(function(fh) {
						self.model.relation('boatPictures').add(fh);
						self.model.save().then(function() {
							self.displayBoatPictures();
						});
					});
				};
				opts.pdf = false;
			} else {
				cb = function(file) {
					new FileHolderModel({ file: file }).save().then(function(fh) {
						self.model.relation('proofOfInsurance').add(fh);
						self.model.save().then(function() {
							self.displayProofsOfInurance();
						});
					});
				};
			}

			this.uploadFile(event, cb, opts);

		},

		sendBoatNotification: function() {

			event.preventDefault();

			var NotificationModel = Parse.Object.extend("Notification");
			var status = this.model.get('status');

			if( confirm("Are you sure you want to send a notification ?") ) {
				if( status == 'approved' ) {
					new NotificationModel({
						from: Parse.User.current().get('profile'),
						to: this.model.get('profile'),
						action: "boat-approved",
						boat: this.model,
						fromTeam: true,
						sendEmail: true,
					}).save().then(function() {
						alert('Notification Sent');	
					});
				} else if( status == 'denied' ) {
					new NotificationModel({
						from: Parse.User.current().get('profile'),
						to: this.model.get('profile'),
						action: "boat-denied",
						boat: this.model,
						fromTeam: true,
						sendEmail: true,
					}).save().then(function() {
						alert('Notification Sent');
					});
				} else {
					alert('Boat must be approved or denied to receive a notification');
				}
			}
		}
	});
	return BoatValidationView;
});
