var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
	start: function () {
		console.log('MMM-jira-table helper started');
	},

	getJira: function (payload) {
		var parent = this; // save this object

		console.log('payload', payload);

		request({
			url: payload.url + '/rest/api/2/search?jql=filter%3Dmirror%20ORDER%20BY%20rank%20ASC&maxResults=100',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Basic ' + payload.authString,
				'Accept': 'application/json',
				'User-Agent': 'MMM-jira-table'
			},
			method: 'GET'
		}, function (error, response, body) {
			console.log('return from jira call:', body);
			if (!error && response.statusCode == 200) {
				var result = JSON.parse(body);
				parent.sendSocketNotification('JIRA_RESULT', result.issues);
			}
		});
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification == 'GET_JIRA') {
			this.getJira(payload);
		}
	}
});