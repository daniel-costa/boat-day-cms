define([
'views/BaseView',
'text!templates/HelpCenterTemplate.html', 
'text!templates/HelpCenterRowTemplate.html'
], function(BaseView, HelpCenterTemplate, HelpCenterRowTemplate){
	var HelpCenterView = BaseView.extend({

		className: "view-help-center",
		
		template: _.template(HelpCenterTemplate),

		helpcenter: {},

		events : {
			"blur .searchFilter": "renderRows",
			"keyup .searchFilter": "watchForReturn", 
			"click .btn-read": "statusUpdate"
		},

		render: function() {

			BaseView.prototype.render.call(this);
			this.renderRows();
			
			return this;

		},

		statusUpdate: function(event) {
			event.preventDefault();

			var self = this;
			var e = $(event.currentTarget);
			var parent = e.closest('tr').attr('data-id');
			var currentStatus = e.closest('a').attr('data-status');
			var newStatus;

			if(currentStatus == "read"){
				newStatus = "unread";
			} else {
				newStatus = "read";
			}
			
			console.log(currentStatus);

			if(confirm("Do you want to change status to " + newStatus + "?")) {
				var query = new Parse.Query(Parse.Object.extend("HelpCenter"));
				query.equalTo("objectId", parent);
				query.first({
					success: function(object) {
						object.set("status", newStatus).save().then(function(){
							self.render();

							console.log(newStatus);
						});
					}, 
					error: function(error) {
						console.log("Error: " + error.code + " " + error.message);
					}
				});
			}
		}, 

		renderRows: function() {

			var self = this;
			var query = new Parse.Query(Parse.Object.extend("HelpCenter"));
			query.include('user.profile');
			query.descending('createdAt');

			var tpl = _.template(HelpCenterRowTemplate);



			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
			}

			if( this._in("searchCategory").val() != "" ) {
				query.contains("category", this._in("searchCategory").val());
			}

			// if( this._in("searchName").val() != "" ) {
			// 	query.contains("lastname", this._in("searchName").val());
			// }

			this.$el.find('tbody').html("");

			var cbSuccess = function(helpCenter) {

				_.each(helpCenter, function(result) {

					var data = {
						id: result.id, 
						createdAt: result.createdAt.toUTCString().substring(0, 26),
						category: result.get('category'),
						displayName: result.get('user').get('profile').get('displayName'), 
						feedback: result.get('feedback'), 
						status: result.get('status'),
						file1: result.get('file1'),
						file2: result.get('file2'),
						file3: result.get('file3'), 
						updatedAt: result.updatedAt.toUTCString().substring(0, 26)
					}

					self.$el.find('tbody').append( tpl(data) );

				});

			};

			query.find().then(cbSuccess);
		}
		
	});
	return HelpCenterView;
});
