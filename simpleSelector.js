
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

