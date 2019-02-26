

//一个简单的定时器构造函数

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


/*

方块随机算法

玩的时候发现有时候方块能连续重复三四个，感觉可能随机算法有问题,所以在知乎上提问了关于俄罗斯方块随机的算法。根据 farter yang 所说的 Bag7算法，我做了简单的实现。

    “目前的官方做法叫Bag7算法，简单讲就是每次出7块，一样一块，这样出得就异常均匀，某块连续出最多2个，连续不出次数不会超过12次（7*2-2）。”

*/

function random (begin, end) {
    return parseInt(Math.random () * (end - begin + 1) + begin);
}

let tetrisRandCache = [0, 0, 0, 0, 0, 0, 0];

function rand() {

    let t;

    do {

        t = random(0, 6);

        if (tetrisRandCache[t] < 2) {

            tetrisRandCache[t] += 1;

        } else {

            t = false;

        }

    } while ( t === false );

    if (tetrisRandCache.every(function (n) {

        return n >= 1;

    })) {

        tetrisRandCache = [0, 0, 0, 0, 0, 0, 0];

    }

    return t + 1;

}

