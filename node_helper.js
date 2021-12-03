var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
	start: function () {
		console.log('MMM-jira-table helper started');
	},

	getJira: function (payload) {
		var parent = this; // save this object

		request({
			url: payload.url + '/rest/agile/1.0/board/',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Basic ' + payload.authString,
				'Accept': 'application/json',
				'User-Agent': 'MMM-jira-table'
			},
			method: 'GET'
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var result = JSON.parse(response.body);
				parent.sendSocketNotification('JIRA_RESULT', result);
			}
		});
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification == 'GET_JIRA') {
			this.getJira(payload);
		}
	}
});