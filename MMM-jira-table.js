Module.register("MMM-jira-table", {

    result: { jira: "loading jira table..." },

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

        var joke = document.createElement("div");
        joke.className = "bright light medium";
        joke.style.textAlign = "center";
        joke.style.margin = "0 auto";
        joke.innerHTML = this.result["jira"];

        wrapper.appendChild(joke);
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
            this.result = payload;
            this.updateDom(this.config.fadeSpeed);
        }
    },
});