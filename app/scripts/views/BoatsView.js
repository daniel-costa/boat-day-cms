define([
'jquery', 
'underscore', 
'parse',
'views/BaseView',
'text!templates/BoatsTemplate.html'
], function($, _, Parse, BaseView, BoatsTemplate){
	var BoatsView = BaseView.extend({

		className: "view-boats-lists",
		
		template: _.template(BoatsTemplate),

		events : {
			"blur .searchFilter": "renderBoats",
			"keyup .searchFilter": "watchForReturn"
		},

		render: function() {

			BaseView.prototype.render.call(this);
			this.renderBoats();
			
			return this;

		},

		renderBoats: function() {

			var boats = Parse.Object.extend("Boat");
			var query = new Parse.Query(boats);

			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
			}

			if( this._in("searchName").val() != "" ) {
				query.contains("name", this._in("searchName").val());
			}

			if( this._in("searchStatus").val() != "" ) {
				query.contains("status", this._in("searchStatus").val());
			}

			if( this._in("searchType").val() != "" ) {
				query.contains("type", this._in("searchType").val());
			}

			$("#tbody").html("");

			query.include("host");
			query.find({

				success: function(boats) {

					var json = JSON.stringify(boats);
					var boats = JSON.parse(json);

					var output = '';

					$.each (boats, function(i,boats) {

						var host = boats.host;
						//<td class='info'><a href='"+ boats.proofOfInsurance.url +"' target='_blank' class='btn btn-primary'>POF</a></td>

						$("#tbody").append("<tr><td class='info'>" + boats.objectId + "</td><td class='info'>" + boats.buildYear 
							+ "</td><td class='info'>" + boats.hullID + "</td><td class='info'>" + boats.name + "</td><td class='info'>"
							+ boats.status + "</td><td class='info'>" + boats.type + 
							"</td><td class='info'><a href='#/host/"+ host.objectId+"'class='btn btn-primary'>Host</a></td><td class='info'><a href='#/boat/" + boats.objectId + 
							"'><span class='glyphicon glyphicon-pencil'></span></a></td></tr>");

					});

				}

			});

		},

	});
	return BoatsView;
});
