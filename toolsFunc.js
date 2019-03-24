
/*
//产生随机数的对象，功能参考Python。
var random = {
    //产生0-1之间的随机数
    random: function () {
        return Math.random();
    },
    //产生n - m之间的随机浮点数
    uniform: function (begin, end) {
        if (begin > end) {
            [begin, end] = [end, begin];
        }
        return Math.random() * (end - begin) + begin;
    },
    //产生n - m之间的整数
    randint: function (begin, end) {
        if (begin > end) {
            [begin, end] = [end, begin];
        }
        return parseInt(Math.random() * (end - begin + 1) + begin);
    },
    //从数组里随机选择一个数据
    choice: function (arr) {
        return arr[this.randint(0, arr.length - 1)];
    },
    //打乱数组里的元素排列顺序，返回的是一个新的数组
    shuffle : function (arr) {
        let index, tmp = [], len = arr.length;
        for (let i = 0; i < len; i ++) {
            index = this.randint(0, arr.length - 1);
            tmp.push(arr[index]);
            arr.splice(index, 1);
        }
        return tmp;
    },

    //获得一个递增的序列
    getAscendingList: function (begin, end, step) {
        let list = [];
        for (let i = begin; i <= end; i += step) {
            list.push(i);
        }
        return list;
    },
    //从递增序列里选择一个数据
    randrange: function (begin, end, step) {
        let list = this.getAscendingList(begin, end, step);
        return this.choice(list);
    },
    //从数组里随机获得N个元素。
    sample: function (arr, num) {
        if (arr.length >= num) {
            return this.shuffle(arr).slice(0, num);
        } else {
            console.error("数组长度小于随机数个数")
        }
    }
};

let tetrisRandCache = [0,0,0,0,0,0,0];
let tetrisTmp = random.shuffle(random.getAscendingList(0, 6, 1));

function rand() {

    let t, index;

    t = random.choice(tetrisTmp);
  
    index = tetrisTmp.indexOf(t);
   
    
    if (tetrisRandCache[index] < 2) {
        tetrisRandCache[index] += 1;
    }

    for (let i = 0; i < tetrisRandCache.length; i++) {
        if (tetrisRandCache[i] >= 2) {
            tetrisRandCache.splice(i, 1);
            tetrisTmp.splice(i, 1);
            break;
        }
    }

    if (!tetrisTmp.length) {
        tetrisTmp = random.shuffle(random.getAscendingList(0, 6, 1));
        tetrisRandCache = [0,0,0,0,0,0,0];
    }

    return t + 1

}

*/




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


var runSpeedTest = {
    timerList: {},
    st: function (i) {
        this.timerList[i || "now"] = new Date();
    },
    ed: function (i) {
        if (this.timerList) {
            if (!i) {
                if (this.timerList["now"]) {
                    return new Date() - this.timerList["now"];
                } else {
                    console.error("Timer tag not found (No parameter mode)")
                }
            } else {
                if (this.timerList[i]) {
                    return new Date() - this.timerList[i];
                } else {
                    console.error("Timer tag not found");
                }
            }
        } else {
            console.error("timerlist is empty");
        }
    }
};
