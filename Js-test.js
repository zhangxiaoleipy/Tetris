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

function toNegative (n) {
    return n <= 0 ? n : -n;
}

function random (begin, end) {
    return parseInt(Math.random () * (end - begin + 1) + begin);
}

function rand () {
    return random(1, 7);
}

function create4Arr () {
    return [[0,0], [0,0], [0,0], [0,0]];
}

function createColor(c) {
    switch (c) {
        case 0: return "#EEE";
        case 1: return "#F60";
        case 2: return "#CF93B2";
        case 3: return "#0C0";
        case 4: return "#699";
        case 5: return "#06C";
        case 6: return "#909";
        case 7: return "#F00";
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
        pix2.strokeStyle = "#EEE";
        pix2.fillStyle = createColor(c);
        pix2.rect(c === 1 || c === 2 ? n[1] * 20 + 1 : n[1] * 20 + 11, n[0] * 20 - 20 + 1, 18, 18);
        pix2.stroke();
        pix2.fill();
    })
}



let table = [];

function drawTable() {

    pix.clearRect(0, 0, 200, 400);

    let size = 20;

    for (let j = 2; j <= 22; j++) {

        for (let i = 0; i <= 9; i++) {

            tmp = Math.abs(table[j][i]);
            pix.beginPath();
            pix.lineWidth = 1;

            if (sMov.some(function (s) {
                return s[0] === j && s[1] === i;
            })) {
                if (table[j][i] <= 0) {
                    pix.strokeStyle = "black";
                    pix.fillStyle = createColor(0);
                } else {
                    pix.strokeStyle = "#FFF";
                    pix.fillStyle = createColor(Math.abs(table[j][i]));
                }
            } else {
                pix.strokeStyle = "#FFF";
                pix.fillStyle = createColor(Math.abs(table[j][i]));
            }
            //临时解决方案，搞不懂修改后图形为什么向右上移动一个像素
            pix.rect(i * size + 1, j * size - 60 + 1, 18, 18);
            pix.stroke();
            pix.fill();
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

        getScore();

        drawTable();
 
        checkEnd();

        moving = [];

        old = [];

        stopLoop();                //暂停，并终止循环的所有loop
        createNewCube();           //直接创建一个新的方块
        restartLoop(); 
        

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
        //ui.gameover.style.display = "block";
        $("#u-score").text(gameScore);
        $("#u-level").text(gameLeval);
        $("#u-lines").text(finishLine);
        ui.enterTop10.style.display = "block";
        screenCover("open");
        return;
    }
}


let deepLock = false;

function movoToDeep() {

    /*
    old 将自己的坐标和对应的table的数据交给tmp和tmpValue保管
    然后自己负责清理旧的坐标
    然后tmp和tmpValue将自己的坐标和数据求负交给已经生成的moving新坐标
    此操作的目的是，当一个方块下降到自己和自己的投影交叉的位置时，可以先清理掉旧数据，避免了moving和old数据重合引起的问题
    */


    if (!gameStart) { return };
    if (!moving.length) { return };
    if (deepLock) { return };

    copyAtoB(moving, old);

    let tmp = create4Arr();

    let tmpValue = [];

    copyAtoB(old, tmp);

    old.forEach(function (i) {
        tmpValue.push(table[i[0]][i[1]]);
    })

    for (let x = 2; x <= 22; x++) {
        for (let i of moving) {
            if (i[0] === 22 || table[i[0] + 1][i[1]] < 0) {

                old.forEach(function (i) {
                    table[i[0]][i[1]] = 0;
                })

                moving.forEach(function (i, index) {
                 table[i[0]][i[1]] = toNegative(tmpValue[index]);
                })
               
                getScore();
                drawTable();
                checkEnd();
                moving = [];
                old = [];
                stopLoop();                
                createNewCube();           
                restartLoop();             
                deepLock = true;
                return;
            }
        }
        moveOneStep(moving, "down");
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

let leftLock = false;
let rightLock = false;
let downLock = false;

/*
移动函数
*/

document.onkeypress = function (k) {

    if (k.key === "a" || k.key === "A") {

        if (!leftLock) {
            moveToLeftOrRight("left");
            moveLeftPlus("left");
            leftLock = true;
        }

    } else if (k.key === "d" || k.key === "D") {

        if (!rightLock) {
            moveToLeftOrRight("right");
            moveRightPlus("right");
            rightLock = true;
        }

    } else if (k.key === "s" || k.key === "S") {
    
        if (!downLock) {
            stopLoop();  //防止downloop循环和向下按钮的动作相互重合
            downLoop();
            moveDownPlus();
            downLock = true;
        }

    } else if (k.key === "w" || k.key === "W") {
        movoToDeep();
        deepLock = true;
    } else if (k.key === "k" || k.key === "K") {
        rotate();
    }
}

let leftStop;
let rightStop;
let donwStop;

document.onkeyup = function (k) {
    if (k.key === "w" || k.key === "W") {
        deepLock = false;
    } else if (k.key === "a" || k.key === "A") {
        clearInterval(leftStop);
        leftLock = false;
    } else if (k.key === "d" || k.key === "D") {
        clearInterval(rightStop);
        rightLock = false;
    } else if (k.key === "s" || k.key === "S") {
        clearInterval(donwStop);
        restartLoop();
        downLock = false;
    }
}


function moveLeftPlus(val) {
    leftStop = setInterval(function () {
        moveToLeftOrRight(val)
    }, 100)
}

function moveRightPlus(val) {
    rightStop = setInterval(function () {
        moveToLeftOrRight(val)
    }, 100)
}


function moveDownPlus () {
    donwStop = setInterval(function () {
        downLoop();
    }, 100)
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

    h = checkSave.length;

    if (h) {

        //h为真，说明 score 和 line 的必然刷新

        finishLine += h;

        switch (h) {

            case 1 : {
                gameScore += 100 * gameLeval;
            } break;

            case 2 : {
                gameScore += 400 * gameLeval;
            } break;

            case 3 : {
                gameScore += 900 * gameLeval;
            } break;

            case 4 : {
                gameScore += 1600 * gameLeval;
            } break;

            default : {
                console.warn("score error");
            }
        }

        digtalNumber(gameScore, scoreDisplay);

        digtalNumber(finishLine, fineshLineDisplay);

        changeLevalAndDisplay();

        checkSave.forEach(function (i) {
            table.splice(i, 1);
        })

        while (h --) {
            table.unshift([0,0,0,0,0,0,0,0,0,0])
        }
    }
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
    data : []
} 
//载入数据
let saveGameData = JSON.parse(localStorage.getItem("TetrisGameData"));
//如果载入的数据为空，则将其指向初始的数据
if (!saveGameData) {
    saveGameData = initGameDate;
}

function saveData() {
    if (window.localStorage) {
        if (saveGameData) {
            localStorage.setItem("TetrisGameData", JSON.stringify(saveGameData))
        }
    }
}

function loadGameData (data) {
    if (saveGameData.data.length < 10) {
        saveGameData.data.push(data);
        saveGameData.data.sort(function (a, b) {
            return a[1] - a[2];
        })
    }
}

ui.tdlist = document.querySelectorAll("td");

function displayinfoFunc (data) {
    if (data) {
        let index = 0;
        for (let item of data) {
            for (i of item) {
                ui.tdlist[index].innerText = i;
                index += 1;
            }
        }
    }
}



$("#infotest").click(function () {
    displayinfoFunc(saveGameData.data, table);
    ui.info.style.display = "block";
    screenCover("open");
})



document.querySelector("#clearData").addEventListener("click", function () {
    if (confirm("清除所有数据 ?")) {
        saveGameData.data = [];
        saveData();
    }
},false)


//------------------------top10 录入区域------------------------


document.querySelector("#u-enterNameBT").addEventListener("click", function () {
    let name = document.querySelector("#u-enterName").value;
    loadGameData([name, gameScore, gameLeval, finishLine]);
    saveData();
    screenCover("close");
    ui.enterTop10.style.display = "none";
},false);





