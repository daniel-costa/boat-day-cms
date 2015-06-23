define([
'parse',
'text!templates/NavigationTopTemplate.html'
], function(Parse, NavigationTopTemplate){
	var BaseView = Parse.View.extend({

		className: "view-base",

		subViews: [],

		debug: true,

		tempBinaries: { },
	
		topNav: _.template(NavigationTopTemplate),

		__ANIMATION_ENDS__: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',

		render: function() {
			console.log("### Render by BaseView (" + this.className + ") ###");

			var data = {
				self: this
			};

			if(this.model) {
				_.extend(data, this.model._toFullJSON());
			}

			if(this.collection) {
				_.extend(data, { collection: this.collection.toJSON() });
			} 

			this.$el.html(this.template(data));

			this.displayTopNav();

			return this;
		},


		tagFieldValue: function(event) {

			$(event.currentTarget).attr('base-text', $(event.currentTarget).val());

		},

		leaveField: function(event) {

			if( $(event.currentTarget).attr('base-text') != $(event.currentTarget).val() ) {

				this.renderRows();

			}
			
		},

		watchForReturn: function(event) {

			event.preventDefault();

			if(event.keyCode == 13) {
				$(event.currentTarget).blur();
			}
			
		},

		dateParseToDisplayDate: function (date) {

			return new Date(date.iso).toLocaleDateString();

		},

		departureTimeToDisplayTime: function(time) {

			var h = parseInt(time);
			var mm = (time-h) * 60;
			var dd = 'AM';

			if( h >= 12 ) {
				dd = 'PM';
				h -= 12;
			}

			return (h==0?12:h)+':'+(mm==0?'00':+(mm < 10 ? '0'+mm : mm))+' '+dd;
			
		},

		isEmailValid: function(email) {

			var emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			return emailPattern.test(email);

		},

		displayTopNav: function() {

			var tn = this.$el.find('.top-nav');

			if( tn.length == 1 ) {
				tn.html(this.topNav());
			}

		},

		getRandomNumber: function(min, max) {
		
			return Math.round(Math.random() * (max - min) + min);
		
		},

		afterRender: function() {

			if( this.debug ) {
				this.debugAutofillFields();
			}
			
		},

		scorePassword: function(pass) {
			var score = 0;

			if (!pass)
				return score;

			// award every unique letter until 5 repetitions
			var letters = new Object();
			for (var i=0; i<pass.length; i++) {
				letters[pass[i]] = (letters[pass[i]] || 0) + 1;
				score += 5.0 / letters[pass[i]];
			}

			// bonus points for mixing it up
			var variations = {
				digits: /\d/.test(pass),
				lower: /[a-z]/.test(pass),
				upper: /[A-Z]/.test(pass),
				nonWords: /\W/.test(pass),
			}

			var variationCount = 0;
			for (var check in variations) {
				variationCount += (variations[check] == true) ? 1 : 0;
			}
			score += (variationCount - 1) * 10;

			return parseInt(score);
		},

		fieldError: function(name, message) {

			var field = this._in(name);

			field.closest('.form-group').addClass("has-error has-feedback");

			$('<span>').addClass('glyphicon glyphicon-remove form-control-feedback field-error-auto').insertAfter(field);
			
			if(message) {

				var show = function() { $(this).popover('show'); };
				var hide = function() { $(this).popover('hide'); };

				var params = { 
					container: 'body',
					content: message,
					trigger: 'manual'
				};

				if( field.hasClass('field-error-flag') ) {

					field.data('bs.popover').options.content = message;

				} else {

					field.addClass('field-error-flag').popover(params);	

				}

				field.focus(show).blur(hide).hover(show, hide)
			}

		},

		cleanForm: function() {

			this.$el.find('.field-error-auto').remove();
			this.$el.find('.has-error').removeClass('has-error has-feedback');
			this.$el.find('.field-error-flag').popover('hide').unbind('focus mouseenter mouseleave hover blur');

		},

		clickUpload: function(event) {

			this.$el.find('input[name="'+$(event.currentTarget).attr('for')+'"]').click();
			
		},

		uploadFile: function(event, cb, opts) {

			if( typeof opts === "undefined" ) {
				opts = {};
			}

			var _opts = {
				png: typeof opts.png === "undefined" || opts.png,
				jpg: typeof opts.jpg === "undefined" || opts.jpg,
				pdf: typeof opts.pdf === "undefined" || opts.pdf
			};

			var self = this;
			var files = event.target.files;
			var parseFile = null;
			var fieldName = $(event.currentTarget).attr('name');
			var btn = self.$el.find('.btn[for="'+fieldName+'"]');
			
			self.cleanForm();
			self.buttonLoader('Uploading');

			if( btn.length === 1 ) {

				self.buttonLoader('Uploading', btn);

			}

			if( files.length == 1) {

				if( _opts.png && files[0].type == 'image/png' ) {
					
					parseFile = new Parse.File(fieldName+'.png', files[0]);

				} else if( _opts.jpg && files[0].type == 'image/jpeg' ) {

					parseFile = new Parse.File(fieldName+'.jpg', files[0]);

				} else if( _opts.pdf && files[0].type == 'application/pdf') {

					parseFile = new Parse.File(fieldName+'.pdf', files[0]);

				} else {

					var formats = "";
					formats += _opts.png ? ' PNG' : '';
					formats += _opts.jpg ? ' JPEG' : '';
					formats += _opts.pdf ? ' PDF' : '';
					self.fieldError(fieldName, 'Bad format. Supported formats:'+formats);
					self.buttonLoader();
					$(event.target).val('');
					return null;

				}

				var uploadSuccess = function(file) {
					
					self.tempBinaries[fieldName] = file;
					cb(file);
					$(event.target).val('');
					self.buttonLoader();

				};

				var uploadError = function(error) {

					self.fieldError(fieldName, 'An error occured when we tried to upload your picture, try again please.');
					self.buttonLoader();

				};
				
				parseFile.save().then(uploadSuccess, uploadError);

			}
		},

		buttonLoader: function( text, button ) {

			if( text ) {

				if( !button ) var button = this.$el.find('[type="submit"]');

				button.attr('data-loading-text', text).button('loading');

			} else {

				this.$el.find('[data-loading-text]').button('reset');

			}
		},

		debugAutofillFields: function() { },

		teardown: function() {
			if(this.model) {
				this.model.off(null, null, this);
			}
			this.remove();
		},
		
		_in: function(names) {
			var str = "";
			_.each(names.split(','), function(item) {
				if(str!="") str += ', ';
				str += '[name="' + item.trim() + '"]';
			})
			return this.$el.find(str);

		},

		_error: function(message) {

			$(document).trigger('globalError', message);

		},

		_info: function(message) {

			$(document).trigger('globalInfo', message);

		}
	});
	return BaseView;
});