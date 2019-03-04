/*
作者：张晓雷
邮箱：zhangxiaolei@outlook.com
*/


let canvas = document.querySelector("#canvas");
let pix = canvas.getContext("2d");
let scanvas = document.querySelector("#scanvas");
let pix2 = scanvas.getContext("2d");
let scoreDisplay = document.querySelector("#digtalNumber").children;
let fineshLineDisplay = document.querySelector("#line").children;
let levalDisplay = document.querySelector("#leval").children;
let startAndPause = document.querySelector("#startPause");
let reset = document.querySelector("#reset");
let timer = new CreateTimer();

function toNegative (n) {
    return n <= 0 ? n : -n;
}

function create4Arr () {
    return [[0,0], [0,0], [0,0], [0,0]];
}

function toLower(t) {
    if (t.length === 1) {
        if (/^[A-Z]$/.test(t)) {
            return t.toLowerCase();
        } else {
            return t;
        }
    } else {
        return t;
    }
}



function createColor(c) {
    switch (c) {
        case 0: return "#FFF";
        case 1: return "#F60";
        case 2: return "#CF93B2";
        case 3: return "#0C0";
        case 4: return "#699";
        case 5: return "#06C";
        case 6: return "#909";
        case 7: return "#F00";
        case 9: return "gold";
        default:
            console.error("createColor Error");
    }
}

// 每队数组最后一位是旋转的中心点，不能改变次序
// 第一队数组是四方块，没有中心
let tetris = {
    1: [[1, 4], [1, 5], [2, 5], [2, 4]],  // 四方
    2: [[2, 3], [2, 5], [2, 6], [2, 4]],  // 长条
    3: [[1, 3], [1, 5], [2, 4], [1, 4]],  // 三 
    4: [[1, 3], [1, 4], [2, 5], [2, 4]],  // 顺二
    5: [[1, 4], [1, 5], [2, 3], [2, 4]],  // 负二
    6: [[1, 3], [1, 5], [2, 3], [1, 4]],  // 负七
    7: [[1, 3], [1, 5], [2, 5], [1, 4]]   // 顺七
}


function copyAtoB(a, b) {
    if (a.length === b.length) {
        let i = a.length;
        while (i--) {
            b[i][0] = a[i][0];
            b[i][1] = a[i][1];
        }
    } else {
        console.warn("copyAtoB Error : [" + a + "], [" + b + "]");
    }
}

function digtalNumber (n, el) {

    n = n.toString().split("");

    let len = n.length;

    let arr = [];

    for (let i = 0; i < 6 - len; i++) {
        arr[i] = "s";
    }

    arr = arr.concat(n);

    arr.forEach(function (n,i) {
        el[i].setAttribute("class", "n" + n);
    })
}


function smallDisplay(t, c) {
    let tmp = create4Arr();
    copyAtoB(t, tmp);
    tmp = tmp.map(function (n) {
        return [n[0], Math.abs(n[1]) - 3];
    })
    pix2.clearRect(0, 0, 80, 40);
    tmp.forEach(function (n) {
        pix2.beginPath();
        pix2.lineWidth = 1;
        /*pix2.strokeStyle = "#EEE";*/
        pix2.fillStyle = createColor(c);
        pix2.rect(c === 1 || c === 2 ? n[1] * 20 + 1 : n[1] * 20 + 11, n[0] * 20 - 20 + 1, 19, 19);
        /*pix2.stroke();*/
        pix2.fill();
    })
}


//存储所有信息数据的table
const table = [];

//绘制游戏方块区域函数
function drawTable() {

    pix.clearRect(0, 0, 200, 400);
    let size = 20;
    let tmp;

    for (let j = 2; j <= 22; j++) {
        
        for (let i = 0; i <= 9; i++) {

            tmp = Math.abs(table[j][i]);
            pix.beginPath();
            pix.lineWidth = 1;
            
            if (sMov.some(function (s) {
                return s[0] === j && s[1] === i;
            })) {
                //绘制阴影
                //如果tmp等于0，说明当前方块为空，可以显示阴影。相反，则说明方块区域有正在移动的方块，给予优先显示。
                if (tmp === 0) {
                    pix.strokeStyle = "#FFF";
                    pix.rect(i * size + 1, j * size - 60 + 1, 18, 18);
                    pix.stroke();
                } else {
                    //pix.strokeStyle = createColor(tmp);
                    pix.fillStyle = createColor(tmp);
                    pix.rect(i * size + 1, j * size - 60 + 1, 19, 19);
                    //pix.stroke();
                    pix.fill();
                }
               
                //只绘制不为0的方块，这样可以空出背景。
            } else if (tmp !== 0) {
                //绘制常规图形
                //pix.strokeStyle = createColor(tmp);
                pix.fillStyle = createColor(tmp);
                pix.rect(i * size + 1, j * size - 60 + 1, 19, 19);
                //pix.stroke();
                pix.fill();
            }
        }
    }
    sMov = create4Arr();
}


let moving = [];
let old = [];
let line = [];
let colorId = [];

function createNewCube () {

    colorId.push(rand());

    line.push(tetris[colorId[colorId.length - 1]]);
    
    if (line.length < 2) {
        colorId.push(rand());
        line.push(tetris[colorId[1]])
    }

    smallDisplay(line[1], colorId[1]);

    for (let i of line.shift()) {
        table[i[0]][i[1]] = colorId[0];
        moving.push([i[0],i[1]]);
        old.push([i[0],i[1]]);
    }

    colorId.shift();

    moveDone = false;
}


let sMov = create4Arr();

function shadow () {

    if (!moving.length) return;
 
    copyAtoB(moving, sMov);

    for (let x = 2; x <= 22; x++) {
      
        for (let i of sMov) {
            
            if (i[0] === 22 || table[i[0] + 1][i[1]] < 0) {

                return;

            } 
        }

        sMov = sMov.map(function (n) {
            return [n[0] += 1, n[1]];
        })
    }
}


let animateLook = false;

function downLoop() {

    //此处不能有 if (!moving.length)

    if (!gameStart) { return };
   
    let t = 0;

    if (moving.length === 4) {
        moveOneStep(moving, "down");
    }
   
    moving.forEach(function (i) {
        if (i[0] <= 22 && table[i[0]][i[1]] >= 0) {
            t += 1;
        }
    })

    if (t === 4) {

        refreshData();

        copyAtoB(moving, old);

    } else {

        old.forEach(function (i) {
         table[i[0]][i[1]] = toNegative(table[i[0]][i[1]]);
        })

        !animateLook && checkAndCreate();   
    
        return;
    }

};


function moveToLeftOrRight(to) {

    if (!gameStart) { return };
    if (!moving.length) { return };

    if (to === "left") {

        moveOneStep(moving, "left");

    } else if (to === "right") {

        moveOneStep(moving, "right");
    }

    for (let i of moving) {
        if (i[1] < 0 || i[1] > 9 || table[i[0]][i[1]] < 0) {
            copyAtoB(old, moving);
            return;
        }
    }

    refreshData();

    copyAtoB(moving, old);
}


function checkEnd () {
    if(table[2].some(function (i) {
        return (i < 0);
    })) {
        stopLoop();
        gameOver = true;
        gameStart = false;
        startAndPause.innerText = "开始";
        inTop10Check();
        return;
    }
}

let distanceTop10 = document.querySelector("#u-distancetop10");

function inTop10Check () {
    if (localData.data.length < 10 || gameScore > localData.data[9][1]) {
        $("#u-score").text(gameScore);
        $("#u-level").text(gameLeval);
        $("#u-lines").text(finishLine);
        ui.enterTop10.style.display = "block";
        screenCover("open");
    } else {
        ui.gameover.style.display = "block";
        distanceTop10.innerText = localData.data[9][1] - gameScore;
        screenCover("open");
    }
}

let deepLock = false;

function movoToDeep() {

    if (!gameStart) { return };
    if (!moving.length) { return };
    if (deepLock) { return };

    copyAtoB(moving, old);

    let tmp = create4Arr();

    copyAtoB(old, tmp);

    let tmpValue = [];
    //将 old 坐标对应的数值给 tmpValue
    old.forEach(function (i) {
        tmpValue.push(table[i[0]][i[1]]);
    })

    for (let x = 0; x <= 22; x++) {
        for (let i of moving) {
            if (i[0] === 22 || table[i[0] + 1][i[1]] < 0) {
                //将 old 的数值清零
                old.forEach(function (i) {
                    table[i[0]][i[1]] = 0;
                })
                // 将 old 之前交给 tmpValue 的数值复制到 moving 对应的table
                moving.forEach(function (i, index) {
                 table[i[0]][i[1]] = toNegative(tmpValue[index]);
                })

                !animateLook && checkAndCreate();
                deepLock = true;
                return;
            }
        }
        moveOneStep(moving, "down");
    }
}

//次函数的目的是在得分的时候，能有0.3毫秒的延时停顿，搞一个删除得分方块的“动画”。
//没有产生得分，进入正常的产生新的方块流程
//如果有的分，则先将数组数据替换为临时过度色，然后0.3秒后删除、补充，重绘。接着完成后续标准流程。

function checkAndCreate() {

    //直接返回的是checkSave数组
    let arr = getScore();

    let h = arr.length;
    //如果h为0，则进入正常的创造新的方块流程
    if (!h) {

        drawTable();
        checkEnd();

        moving = [];
        old = [];

        stopLoop();
        createNewCube();
        restartLoop();

    } else {
        //进入延时显示流程

        animateLook = true;

        stopLoop();

        arr.forEach(function (i) {
            table.splice(i, 1, [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]);
        })

        drawTable();

        moving = [];

        old = [];

        setTimeout(function () {

            finishLine += h;

            switch (h) {

                case 1: {
                    gameScore += 100 * gameLeval;
                } break;

                case 2: {
                    gameScore += 400 * gameLeval;
                } break;

                case 3: {
                    gameScore += 900 * gameLeval;
                } break;

                case 4: {
                    gameScore += 1600 * gameLeval;
                } break;

                default: {
                    console.warn("score error");
                }
            }

            arr.forEach(function (i) {
                table.splice(i, 1);
            })

            while (h--) {
                table.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            }

            drawTable();

            checkEnd();

            createNewCube();

            restartLoop();

            digtalNumber(gameScore, scoreDisplay);

            digtalNumber(finishLine, fineshLineDisplay);

            changeLevalAndDisplay();

            animateLook = false;

        }, 200)
    }
}


function refreshData() {
    shadow();
    let tmp;
    tmp = table[old[0][0]][old[0][1]];
    old.forEach(function (i) {
        table[i[0]][i[1]] = 0;
    })
    moving.forEach(function (i) {
        table[i[0]][i[1]] = tmp;
    })
    drawTable();
}

function moveOneStep(m, to) {
    if (m.length === 4) {
        let len = 4;
        if (to === "left") {
            while (len --) {
                m[len][1] -= 1;
            }
        } else if ( to === "right" ) {
            while (len --) {
                m[len][1] += 1;
            }
        } else if ( to === "down") {
            while (len --) {
                m[len][0] += 1;
            }
        }
    } else {
        console.error("function error : moveOneStep")
    }
}

function rotate() {

    if (!gameStart) { return }

    if (!moving.length) { return }

    let tetrisType = getType(moving);

    if (tetrisType === 1) {
        //四方直接退出
        return;

    } else if (tetrisType === 2) {
        //长条，判断是否靠墙，如果靠墙，变形时偏移出空间来
        //长条靠右侧墙需要特殊处理
        if (moving[3][1] === 0) {

            moveOneStep(moving, "right");

        } else if (moving[3][1] == 8) {

            moveOneStep(moving, "left");

        } else if (moving[3][1] == 9) {
            //移动两格才能空出位置
            moveOneStep(moving, "left");
            moveOneStep(moving, "left");
        }

    } else {
        //其它方块
        if (moving[3][1] === 0) {

            moveOneStep(moving, "right");

        } else if (moving[3][1] === 9) {

            moveOneStep(moving, "left");

        }
    }
    
    let c = [];

    let tmp = create4Arr();

    copyAtoB(moving, tmp);

    c = tmp.pop();

    let xtmp = [];

    if (c.length) {

        for (let i of tmp) {

            if (i[0] - c[0] === 2 && i[1] === c[1] ) {
                xtmp.push([i[0] - 2, i[1] + 2]);
            } else if (i[0] > c[0] && i[1] === c[1]) {
                xtmp.push([i[0] - 1, i[1] - 1]);
            }

            if ( i[0] === c[0] && i[1] - c[1] === 2) {
                xtmp.push([i[0] + 2, i[1] - 2])
            } else if (i[0] === c[0] && i[1] > c[1] ) {
                xtmp.push([i[0] + 1, i[1] - 1]);
            }

            i[0] < c[0] && i[1] < c[1] && xtmp.push([i[0], i[1] + 2]); // 1 -3
            i[0] < c[0] && i[1] === c[1] && xtmp.push([i[0] + 1, i[1] + 1]); //2-4
            i[0] < c[0] && i[1] > c[1] &&  xtmp.push([i[0] + 2, i[1]]); //3-5
            i[0] > c[0] && i[1] > c[1] && xtmp.push([i[0], i[1] - 2]); //5-7
            i[0] > c[0] && i[1] < c[1] && xtmp.push([i[0] - 2, i[1]]); //7-1
            i[0] === c[0] && i[1] < c[1] && xtmp.push([i[0] - 1, i[1] + 1]); //8-2
        }

        xtmp.push(c);
 
        for (let i of xtmp) {
            if (i[1] < 0 || i[1] > 9 || table[i[0]][i[1]] < 0) {
                return;
            }
        }  

        copyAtoB(xtmp, moving);
        refreshData();
        copyAtoB(moving, old);        
    }
};

let gameStart = false;
let gameOver = true;
//屏蔽系统连续触发锁
let leftLock = false;
let rightLock = false;
let downLock = false;
//定时
let leftStop;
let rightStop;
let donwStop;

let left1stStop;
let right1stStop;
let down1stStop;

document.onkeydown = function (k) {

    let key = toLower(k.key);

    if ( key === keyboard.left ) {

        if (!leftLock) {
            clearTimeout(right1stStop);
            clearInterval(rightStop);
            moveToLeftOrRight("left");
            moveLeftPlus("left");
            leftLock = true;
        }

    } else if ( key === keyboard.right) {

        if (!rightLock) {
            clearTimeout(left1stStop);
            clearInterval(leftStop);
            moveToLeftOrRight("right");
            moveRightPlus("right");
            rightLock = true;
        }

    } else if ( key === keyboard.down ) {
    
        if (!downLock) {
            stopLoop();  //防止downloop循环和向下按钮的动作相互重合
            downLoop();
            moveDownPlus();
            downLock = true;
        }

    } else if ( key === keyboard.deep ) {

        movoToDeep();
        deepLock = true;

    } else if ( key === keyboard.rotate ) {

        rotate();

    }
}



document.onkeyup = function (k) {

    let key = toLower(k.key);
    
    if (key === keyboard.deep) {
        deepLock = false;
    } else if (key === keyboard.left) {
        clearTimeout(left1stStop);
        clearInterval(leftStop);
        leftLock = false;
    } else if (key === keyboard.right) {
        clearTimeout(right1stStop);
        clearInterval(rightStop);
        rightLock = false;
    } else if (key === keyboard.down) {
        clearTimeout(down1stStop);
        clearInterval(donwStop);
        restartLoop();
        downLock = false;
    }
}


function moveLeftPlus(val) {
    left1stStop = setTimeout(function () {
        leftStop = setInterval(function () {
            moveToLeftOrRight(val)
        }, keyboard.repeDelay)
    }, keyboard.firstDelay)
}

function moveRightPlus(val) {
    right1stStop = setTimeout(function () {
        rightStop = setInterval(function () {
            moveToLeftOrRight(val)
        }, keyboard.repeDelay)
    }, keyboard.firstDelay)
}

function moveDownPlus () {
    down1stStop = setTimeout(function () {
        donwStop = setInterval(function () {
            downLoop();
        }, keyboard.repeDelay)
    }, keyboard.firstDelay);
}


function resetGame () {
    for (let row = 0; row <= 22; row ++) {
        table[row] = [];
        for (let col = 0; col <= 9; col ++) {
            table[row].push(0);
        }
    }
    moving = [];
    old = [];
    line = [];
    colorId = [];
    finishLine = 0;
    digtalNumber(0, scoreDisplay);
    digtalNumber(0, fineshLineDisplay);
    digtalNumber(0, levalDisplay);
    smallDisplay(create4Arr(), 0);
    stopLoop();
    timeSpeed = 1000;
    gameScore = 0;
    lockStop = false;
    gameStart = false;
    gameOver = true;
    drawTable();
}

startAndPause.addEventListener("click", function () {
    //游戏开始
    if (!gameStart) {
        gameOver && resetGame();
        gameStart = true;
        gameOver = false;
        this.innerText = "暂停";
        this.setAttribute("style", "background-color : white");
        changeLevalAndDisplay();
        restartLoop();
    } else {
        //游戏暂停
        clearInterval(stopGame);
        gameStart = false;
        this.innerText = "继续";
        this.setAttribute("style", "background-color : gold");
    }
}, false);

reset.addEventListener("click", function () {

    if (!gameOver) {

        areYouSure();
        //次函数的目的仅仅是弹出窗口，后续的操作有按键触发驱动
       
    } else {
        resetGame();
        startAndPause.innerText = "开始";
    }

}, false);


let finishLine = 0;

let timeSpeed;

let stopGame;

let lockStop = false;

function mainLoop () {
    stopGame = setInterval (function () {
        !lockStop && downLoop();
    }, timeSpeed);
}
//lockStop的目的是为了直接终止mainLoop循环内的所有内容
function stopLoop () {
    clearInterval(stopGame);
    lockStop = true;
}

function changeLoopSpeed (t) {
    clearInterval(stopGame);
    timeSpeed = t;
    mainLoop();
}

function restartLoop () {
    lockStop = false;
    clearInterval(stopGame);
    mainLoop();
}

let gameLeval = 0;

function compara (begin,end) {
    if (finishLine > begin && finishLine <= end) {
        return true;
    }
}

function changeLevalAndDisplay () {

    if (finishLine >=0 && finishLine <= 20) {
        //level 1
        gameLeval = 1;
        changeLoopSpeed(1000);
    } else if (compara(20, 40)) {
        //leval 2
        gameLeval = 2
        changeLoopSpeed(900);
    } else if (compara(40, 60)) {
        //leval 3
        gameLeval = 3;
        changeLoopSpeed(800);
    } else if (compara(60, 80)) {
        //leval 4
        gameLeval = 4;
        changeLoopSpeed(700);
    } else if (compara(80, 100)) {
        //leval 5
        gameLeval = 5;
        changeLoopSpeed(600);
    } else if (compara(100, 120)) {
        //leval 6
        gameLeval = 6;
        changeLoopSpeed(500);
    } else if (compara(120, 140)) {
        //leval 7
        gameLeval = 7;
        changeLoopSpeed(400);
    } else if (compara(140, 160)) {
        //leval 8
        gameLeval = 8;
        changeLoopSpeed(300);
    } else if (compara(160, 180)) {
        //leval 9
        gameLeval = 9;
        changeLoopSpeed(200);
    } else if (compara(180, 200)) {
        //leval 10
        gameLeval = 10;
        changeLoopSpeed(100);
    } else {
        //leval 233
        gameLeval = 666666
        changeLoopSpeed(66);
    }

    digtalNumber(gameLeval, levalDisplay);

}


let gameScore = 0;

function getScore () {

    let checkSave = [], h = 0;

    for (let i = 22; i > 1 ; i--) {
        if (table[i].every(function (n) {
            return ( n < 0 );
        })) {
            checkSave.push(i);
        }
    }
    
    return checkSave;

}

//初始游戏网格界面
resetGame();

function getType (m4) {
    if (m4.length === 4) {
        return table[m4[0][0]][m4[0][1]];
    } else {
        console.error("function error : getType");
    }
}

//-----------------------------按钮背景掩盖函数-------------------------------------//

function screenCover (c) {
    let w = window.innerWidth + "px";
    let h = window.innerHeight + "px";
    if (c === "open") {
        $("#backGroundCover").css({
            display : "block",
            width : w,
            height : h
        })
    } else if (c === "close") {
        $("#backGroundCover").css({
            display : "none",
            width : "0px",
            height : "0px"
        })
    }
}


//----------------------------------窗口DOM对应的变量存储-------------------------------------

let ui = Object.create(null);
ui.reset = document.querySelector("#u-reset");
ui.gameover = document.querySelector("#u-gameOver");
ui.enterTop10 = document.querySelector("#u-enterTop10");
ui.info = document.querySelector("#u-info");


//------------------------------点击t-close标签，关闭窗口-------------------------------------

document.querySelectorAll((".t-win")).forEach(function (item) {
    item.querySelectorAll(".t-close").forEach(function (i) {
        i.addEventListener("click", function () {
            item.style.display = "none";
            screenCover("close");
        }, false);
    })
})

//-------------------------------------是否重置功能区域-----------------------------------------

//打开窗口
function areYouSure () {
    ui.reset.style.display = "block";
    screenCover("open");
}

//"确认" 按钮事件
document.querySelector("#u-resetBT").addEventListener("click", function () {
    resetGame();
    startAndPause.innerText = "开始";
    startAndPause.style.backGroundColor = "white";
    ui.reset.style.display = "none";
    screenCover("close");
})


//-----------------------------------------信息板区域----------------------------------------------


//初始数据
let initGameDate = {
    data : [],
    keyboard : {
        deep : "w",
        left : "a",
        right : "d",
        down : "s",
        rotate : "k",
        firstDelay : 100,
        repeDelay : 65
    }
} 
//载入数据

let localData;


localData = JSON.parse(localStorage.getItem("TetrisGameData"));

if (!localData) {
    localData = initGameDate;
}


let keyboard = localData.keyboard;

//将比赛记录保存到浏览器
function saveData() {
    if (window.localStorage) {
        if (localData) {
            localStorage.setItem("TetrisGameData", JSON.stringify(localData))
        }
    } else {
        console.error("存储数据失败 程序未找到 window.localStorage")
    }
}

function checkDataAndSave (data) {

    let len = localData.data.length;

    let local = localData.data;

    if (len < 10) {

        local.push(data); 
        local.sort(function (a, b) {
            return b[1] - a[1];
        })

    } else {

        for (let i = 0; i < len; i ++) {
            if (data[1] > local[i][1]) {
                local.splice(i , 0, data);
                local.pop();
                break;
            }
        }
    }

    saveData();
}

ui.trList = document.querySelectorAll("#table-list tr");
//清除比赛记录板Element里的数据
function clearInfo () {
    let len = ui.trList.length;
    for (let j = 1; j < len; j++) {
        for (let i = 0; i < ui.trList[j].children.length; i ++) {
            ui.trList[j].children[i].innerText = "";
        }
    }
}
//将localData的数据展示到记录板
function displayinfoFunc(data) {
    let len = data.length + 1;
    for (let j = 1; j < len; j ++) {
        for (let i = 0; i < ui.trList[j].children.length; i ++) {
            if (i === 0) {
                ui.trList[j].children[i].innerText = j;
            } else {
                ui.trList[j].children[i].innerText = data[j - 1][i - 1];
            }
        }
    }
}


$("#infotest").click(function () {
    displayinfoFunc(localData.data);
    ui.info.style.display = "block";
    screenCover("open");
})

ui.deep = document.querySelector("#opt-deep");
ui.left = document.querySelector("#opt-left");
ui.down = document.querySelector("#opt-down");
ui.right = document.querySelector("#opt-right");
ui.rotate = document.querySelector("#opt-rotate");
ui.firstDelay = document.querySelector("#opt-firstdelay");
ui.repeDelay = document.querySelector("#opt-repedelay");


document.querySelector("#optiontest").addEventListener("click", function () {
    document.querySelector("#option").style.display = "block";
    ui.deep.value = keyboard.deep;
    ui.left.value = keyboard.left;
    ui.down.value = keyboard.down;
    ui.right.value = keyboard.right;
    ui.rotate.value = keyboard.rotate;
    ui.firstDelay.value = keyboard.firstDelay;
    ui.repeDelay.value = keyboard.repeDelay;
    screenCover("open");
})

document.querySelector("#clearData").addEventListener("click", function () {
    if (confirm("清除所有数据 ?")) {
        localData.data = [];
        localStorage.clear();
        clearInfo();
    }
},false)


//------------------------top10 录入区域------------------------


document.querySelector("#u-enterNameBT").addEventListener("click", function () {
    let name = document.querySelector("#u-enterName").value;
    checkDataAndSave([name || "匿名", gameScore, gameLeval, finishLine]);
    screenCover("close");
    ui.enterTop10.style.display = "none";
},false);


//-----------------------关于-------------------------------

ui.about = document.querySelector("#about-win");
document.querySelector("#aboutme").addEventListener("click", function () {
    ui.about.style.display = "block";
}, false)


let inputTmp = "";

//按键录入，主要目的是能够支持方向键录入
document.querySelectorAll(".opt-i").forEach(function (item) {
    item.addEventListener("click", function () {
        inputTmp = this.value;
        this.value = "";
        this.onkeydown = function (k) {
            if (k.key.length === 1) {
                this.value = "";
            } else {
                this.value = k.key;
            }
        }
    })
})

document.querySelectorAll(".opt-i").forEach(function (item) {
    item.onblur = function () {
        if (this.value === "") {
            this.value = inputTmp;
        }
    }
})


document.querySelector("#opt-bt-yes").addEventListener("click", function () {
    keyboard.deep = toLower(ui.deep.value);
    keyboard.left = toLower(ui.left.value);
    keyboard.down = toLower(ui.down.value);
    keyboard.right = toLower(ui.right.value);
    keyboard.rotate = toLower(ui.rotate.value);
    keyboard.firstDelay = parseInt(ui.firstDelay.value);
    keyboard.repeDelay = parseInt(ui.repeDelay.value);
    document.querySelector("#option").style.display = "none";
    saveData();
    screenCover("close");
})


