Module.register("MMM-jira-table", {

    result: { joke: "loading jira table..." },

    defaults: {
        title: "Jira Sprint",
        updateInterval: 60 * 60 * 1000, // every hour
        fadeSpeed: 1 * 1000, // one seconds
    },

    start: function () {
        this.getJoke();
        this.scheduleUpdate();
    },

    getDom: function () {
        var wrapper = document.createElement("div");

        var joke = document.createElement("div");
        joke.className = "bright light medium";
        joke.style.textAlign = "center";
        joke.style.margin = "0 auto";
        joke.innerHTML = this.result["joke"];

        wrapper.appendChild(joke);
        return wrapper;
    },

    getJoke: function () {
        this.sendSocketNotification("GET_JOKE");
    },

    scheduleUpdate: function () {
        setInterval(() => {
            this.getJoke();
        }, this.config.updateInterval);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification == "JOKE_RESULT") {
            this.result = payload;
            this.updateDom(this.config.fadeSpeed);
        }
    },
});