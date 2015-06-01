define([
'jquery', 
'underscore', 
'parse',
'views/BaseView',
'text!templates/HostsTemplate.html'
], function($, _, Parse, BaseView, HostsTemplate){
	var HostsView = BaseView.extend({

		className: "view-hosts-lists",
		
		template: _.template(HostsTemplate),

		events : {
			"blur .searchFilter": "renderHosts",
			"keyup .searchFilter": "watchForReturn"
		},

		render: function() {

			BaseView.prototype.render.call(this);
			this.renderHosts();
			
			return this;

		},

		renderHosts: function() {

			var hosts = Parse.Object.extend("Host");
			var query = new Parse.Query(hosts);

			if( this._in("searchobjectId").val() != "" ) {
				query.contains("objectId", this._in("searchobjectId").val());
			}

			if( this._in("searchSSN").val() != "" ) {
				query.contains("SSN", this._in("searchSSN").val());
			}

			if( this._in("searchFirstName").val() != "" ) {
				query.contains("firstname", this._in("searchFirstName").val());
			}

			if( this._in("searchLastName").val() != "" ) {
				query.contains("lastname", this._in("searchLastName").val());
			}

			if( this._in("searchPhone").val() != "" ) {
				query.contains("phone", this._in("searchPhone").val());
			}

			if( this._in("searchStatus").val() != "" ) {
				query.contains("status", this._in("searchStatus").val());
			}

			if( this._in("searchType").val() != "" ) {
				query.contains("type", this._in("searchType").val());
			}

			$("#tbody").html("");

			query.find({

				success: function(hosts) {

					var json = JSON.stringify(hosts);
					var hosts = JSON.parse(json);

					var output = '';

					$.each (hosts, function(i,hosts) {

						$("#tbody").append("<tr><td class='info'>" + hosts.objectId + "</td><td class='info'>" + hosts.SSN + "</td><td class='info'>" + (hosts.birthdate ? hosts.birthdate.iso : "not specified") + "</td><td class='info'>" 
							+ hosts.firstname + "</td><td class='info'>" + hosts.lastname + "</td><td class='info'> " + hosts.phone + "</td><td class='info'>" + hosts.status + "</td><td class='info'>"
							+ hosts.type + "</td><td class='info'><a href='#/host/" + hosts.objectId + 
							"'><span class='glyphicon glyphicon-pencil'></span></a></td></tr>");
					});
				}

			});

		}

	});
	return HostsView;
});
