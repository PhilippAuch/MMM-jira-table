Module.register("MMM-jira-table", {

    result: { jira: [{ summary: 'loading jira table...', status: 'To Do' }] },

    defaults: {
        title: "Jira Sprint",
        updateInterval: 60 * 60 * 1000, // every hour
        fadeSpeed: 1 * 1000, // one seconds
    },

    start: function () {
        this.getJira();
        this.scheduleUpdate();
    },

    getDom: function () {
        var wrapper = document.createElement("div");

        for (let i = 0; i < this.result.jira.length; i++) {
            var line = document.createElement('div');
            line.className = 'small light checklist-item';
            var ticketName = document.createElement('span');
            ticketName.innerHTML = ' ' + this.result.jira[i].summary;
            var tickBox = document.createElement('span');
            tickBox.className = this.result.jira[i].status === 'Done' ? 'fa fa-check-square-o' : 'fa fa-square-o';
            line.appendChild(tickBox);
            line.appendChild(ticketName);
            wrapper.appendChild(line);
        }
        return wrapper;
    },

    getJira: function () {
        this.sendSocketNotification("GET_JIRA", {
            url: this.config.url,
            authString: this.config.authString
        });
    },

    scheduleUpdate: function () {
        setInterval(() => {
            this.getJira();
        }, this.config.updateInterval);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification == "JIRA_RESULT") {
            this.result.jira = [];
            for (let i = 0; i < payload.length; i++) {
                this.result.jira.push({
                    summary: payload[i].fields.summary,
                    status: payload[i].fields.status.name
                });
            }
            this.updateDom(this.config.fadeSpeed);
        }
    },
});