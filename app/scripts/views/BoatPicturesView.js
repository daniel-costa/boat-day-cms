define([
'views/BaseView',
'text!templates/BoatPicturesTemplate.html', 
'text!templates/ThumbPictureTemplate.html'
], function(BaseView, BoatPicturesTemplate, ThumbPictureTemplate){
	var BoatPicturesView = BaseView.extend({

		className: "view-boat-pictures-lists",
		
		template: _.template(BoatPicturesTemplate),

		profilePicture: null, 

		events : {
			
		},

		render: function() {

			BaseView.prototype.render.call(this);
			this.listOfBoatPic();
			this.listOfPOF();
			//this.displayBoatPictures();
			return this;

		},

		// displayBoatPictures: function() {
			
		// 	var self = this;

		// 	self.$el.find('.boatPictures').html('');
		// 	self.boatPictures = {};

		// 	var tpl = _.template(ThumbPictureTemplate);

		// 	var displayAll = function(matches) {
		// 		_.each(matches, function( fh ) {	
		// 			self.$el.find('.boatPictures').append(tpl({ 
		// 				id: fh.id, 
		// 				url: fh.get('file').url(),
		// 				canDelete: self.model.get('status') == 'editing',
		// 				fullWidth: false
		// 			}));
		// 			self.boatPictures[fh.id] = fh;
		// 		});
		// 	};

		// 	var query = self.model.relation('boatPictures').query();
		// 	query.descending("createdAt");
		// 	query.find().then(displayAll);
		// },


		listOfBoatPic: function() {

			var Boats = Parse.Object.extend("Boat");
			var query = new Parse.Query(Boats);
			query.find({

				success: function(Boats) {

					for(var i = 0; i < Boats.length; i++) {

						var boat = Boats[i];
						var relation = boat.relation("boatPictures");
	
						relation.query().find({

							success: function(boatPics) {

								var output = '';

								for(var j = 0; j < boatPics.length; j++) {

									var boatPic = boatPics[j];
									
									//console.log(boatPic.get('file').url());
									output += '<li class="list-group-item list-group-item-info"><img src="' + boatPic.get('file').url() + '"style="max-width:40px; max-height:40px;"/></li>';
									//output += '<li class="list-group-item ">' + boatPic.get('file').url() + '</li>';


								}
								$('#boatPics').html(output);
							}
						});
					}
				}, 
				error: function(error) {

					alert("Error: " + error.code + " " + error.message);
				}
			});
		},

		listOfPOF: function() {

			var Boats = Parse.Object.extend("Boat");
			var query = new Parse.Query(Boats);
			query.find({

				success: function(Boats) {

					for(var i = 0; i < Boats.length; i++) {

						var boat = Boats[i];
						var relation = boat.relation("proofOfInsurance");
	
						relation.query().find({

							success: function(results) {

								var output = '';

								for(var j = 0; j < results.length; j++) {

									var proofOFIns = results[j];
									
									console.log("Proof of insurance:-" + proofOFIns.get('file').url());
									//output += '<li class="list-group-item "><img src="' + proofOFIns.get('file').url() + '"style="max-width:40px; max-height:40px;"/></li>';
									output += '<li class="list-group-item "><a href="' + proofOFIns.get('file').url() + '" target="_blank"></a></li>';

								}
								$('#insurance').html(output);

							}
						});
					}
				}, 
				error: function(error) {

					alert("Error: " + error.code + " " + error.message);
				}
			});
		}

	});
	return BoatPicturesView;
});
