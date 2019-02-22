

function CreateTimer() {

    let second = 0, timerStop;

    let loop = function () {
        second += 1;
    };

    this.start = function () {
        timerStop = setInterval(loop.bind(this), 1000);
    };

    this.pause = function () {
        clearInterval(timerStop);
    };

    this.reset = function () {
        clearInterval(timerStop);
        second = 0;
    };

    this.getTime = function () {

        if (second < 60) {
            return second + "s"
        } else {
            return parseInt(second / 60) + ":" + (second % 60) + "s"
        }
    }
}

