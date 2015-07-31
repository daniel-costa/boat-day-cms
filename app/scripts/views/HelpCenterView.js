define([
'views/BaseView',
'text!templates/HelpCenterTemplate.html', 
'text!templates/HelpCenterRowTemplate.html'
], function(BaseView, HelpCenterTemplate, HelpCenterRowTemplate){
	var HelpCenterView = BaseView.extend({

		className: "view-help-center",
		
		template: _.template(HelpCenterTemplate),

		events : {
			"blur .searchFilter": "renderRows",
			"keyup .searchFilter": "watchForReturn"
		},

		render: function() {

			BaseView.prototype.render.call(this);
			this.renderRows();
			
			return this;

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
						category: result.get('category'),
						displayName: result.get('user').get('profile').get('displayName'), 
						feedback: result.get('feedback'), 
						status: result.get('status'),
						file1: result.get('file1'),
						file2: result.get('file2'),
						file3: result.get('file3')
					}

					self.$el.find('tbody').append( tpl(data) );

				});

			};

			query.find().then(cbSuccess);
		}
		
	});
	return HelpCenterView;
});
