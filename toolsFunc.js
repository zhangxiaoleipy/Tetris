

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

//方块随机算法

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


//对象工厂模式的选择器函数，用来最简单的模拟jQuery

function $(selector, context) {

    let core = Object.create(null);
    core.element = Object.create(null);

    if (typeof selector === "string") {
        core.element = (context || document).querySelector(selector);
    } else {
        core.element = selector;
    }

    core.ele = function () {
        return this.element;
    }

    core.hide = function () {
        this.element.style.display = "none";
    };

    core.show = function () {
        this.element.style.display = "block";
    };

    core.click = function (fn) {
        this.element.addEventListener("click", fn, false);
    };

    core.css = function (val) {

        let tmp;
        if (typeof val === "string") {
            val = val.split(" ").join("");
            tmp = val.split(":");
            this.element.style[tmp[0]] = tmp[1];
        } else {
            for (let key in val) {
                this.element.style[key] = val[key];
            }
        }
    }

    core.text = function (val) {
        this.element.innerText = val;
    };

    core.empty = function () {
        this.element.innerHTML = "";
    }

    return core;

}



