define([
'views/BaseView',
'text!templates/BoatsTemplate.html', 
'text!templates/BoatsRowTemplate.html'
], function(BaseView, BoatsTemplate, BoatsRowTemplate){
	var BoatsView = BaseView.extend({

		className: "view-boats-lists",
		
		template: _.template(BoatsTemplate),

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
			var query = new Parse.Query(Parse.Object.extend("Boat"));
			query.include('Host');
			var tpl = _.template(BoatsRowTemplate);

			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
			}

			if( this._in("searchName").val() != "" ) {
				query.contains("name", this._in("searchName").val());
			}

			if( this._in("searchBuildYear").val() != "" ) {
				query.equalTo("buildYear", parseInt(this._in("searchBuildYear").val()));
			}

			if( this._in("searchbelow15").val() != "" ) {
				query.lessThan("length", 15);
			}

			if( this._in("searchbetween15-30").val() != "" ) {
				query.greaterThan("length", 15);
				query.lessThan("length", 30);
			}

			if( this._in("searchbetween30-45").val() != "" ) {
				query.greaterThan("length", 30);
				query.lessThan("length", 45);
			}

			if( this._in("searchabove45").val() != "" ) {
				query.greaterThan("length", 45);
			}
			

			if( this._in("searchStatus").val() != "" ) {
				query.contains("status", this._in("searchStatus").val());
			}

			if( this._in("searchType").val() != "" ) {
				query.contains("type", this._in("searchType").val());
			}

			this.$el.find('tbody').html("");

			var cbSuccess = function(boats) {

				_.each(boats, function(boat) {

					var host = boat.get('host');

					var data = {
						id: boat.id,
						build: boat.get('buildYear'), 
						length: boat.get('length'),
						hullId: boat.get('hullID'), 
						name: boat.get('name'), 
						status: boat.get('status'), 
						type: boat.get('type'), 
						hostId: host.id

					}

					self.$el.find('tbody').append( tpl(data) );

				});

			};

			query.find().then(cbSuccess);
		}

	});
	return BoatsView;
});
