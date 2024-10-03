`use strict`;


//問題文リスト
const questions = [question1, question2, question3, question4, question5, question6, question7, question8, question9, question10, 
    question11, question12, question13];
const numOfQuestions = questions.length;


const entered = document.getElementById("entered");
const remained = document.getElementById("remained");
const inputText = document.getElementById("inputText");
const game = document.getElementById("game");
const message = document.getElementById("message");
const replayzBtn = document.getElementById("replayBtn");
const misstype = document.getElementById("misstype");
const missTypeCount = document.getElementById("missTypeCount");
const resultMessage = document.getElementById("resultMessage");
const startBtn = document.getElementById("startBtn");
const titlePage = document.getElementById("titlePage");
const wpm = document.getElementById("wpm");
const para1 = document.getElementById("paragraphl-link1");
const para2 = document.getElementById("paragraphl-link2");
const link1 = document.getElementById("link1");
const link2 = document.getElementById("link2");
const time = document.getElementById("time");
const numinput = document.getElementById("numinput");
const setBtn = document.getElementById("setBtn");
const setNum = document.getElementById("set-num")

const wrongSound = new Audio("./audio/wrong.mp3");

let remainedTextWords = remained.textContent.split("");
let enteredTextWords = [];
let misstypeTextWords = [];
let currentKey;
let currentText;
let misscount = 0;
let clearCount = 0;
let timeCount = 0;
let enterCount = 0;
let missKey = 0;
let challenge = 1;

console.log(!game.classList.contains("hidden"))
setNum.textContent = `何問挑戦する？(デフォルト1問  全${numOfQuestions}問)`;

function setQuestion() {
    currentKey = Math.floor(Math.random() * questions.length);
    currentText = questions[currentKey]["word"];

    para1.textContent = questions[currentKey]["supplement"];
    link1.setAttribute('href', questions[currentKey]["link"]);
    para2.textContent = questions[currentKey]["supplement2"];
    link2.setAttribute('href', questions[currentKey]["link2"]);
    link2.innerText = "";
    if (questions[currentKey]["supplement2"] !== "") {
        link2.innerText = "詳細はここをチェック！(MDNの解説ページに飛びます)"
    }
  
    questions.splice(currentKey, 1);

    entered.textContent = "";
    remained.textContent = currentText;

    inputText.value = "";

    enteredTextWords = [];
    misstypeTextWords = [];
    remainedTextWords = currentText.split("");

};


document.addEventListener("input", (event) => {
    if (misstype.textContent === "") {  //ミスタイプしたときの配列に何もないかチェック
        if (remainedTextWords[0] === event.data) {  //問題表記の配列と入力したキーがあっているかチェック
            enteredTextWords.push(remainedTextWords[0]);
            remainedTextWords.shift();
            clearCount++;

            entered.textContent = enteredTextWords.join("");
            remained.textContent = remainedTextWords.join("");

            //お試し
            if ((remainedTextWords[0] === "\n")) {
                enteredTextWords.push(remainedTextWords[0]);
                remainedTextWords.shift();
            }

            if (remainedTextWords.length <= 0) {
                if (questions.length <= numOfQuestions - challenge) {
                    game.classList.add("hidden");
                    time.classList.add("hidden")
                    message.classList.remove("hidden");
                    stopShowing();
                    missTypeCount.textContent = `ミス回数：${misscount}回   クリアタイム${timeCount}秒`
                    wpm.textContent = `wpm : ${Math.floor(clearCount / (timeCount / 60) / 5)}  acc : ${Math.floor(clearCount / (clearCount + misscount) * 100)}%`;
                } else {
                    setQuestion();
                }
            }
        } else { //ミスしたときの記述
            misstypeTextWords.push(remainedTextWords[0]);
            misstype.textContent = misstypeTextWords.join("");
            remainedTextWords.shift();
            remained.textContent = remainedTextWords.join("");
            misscount++;
            if (!game.classList.contains("hidden")) {
                wrongSound.volume = 0.2;
                wrongSound.play();
                wrongSound.currentTime = 0;
            }

            //お試し
            if (enteredTextWords[enteredTextWords.length - 1] === "\n") {
                misstypeTextWords.unshift("\n");
                misstype.textContent = misstypeTextWords.join("");
                missKey = 1;
            }

        }
    } else {
        if (misstypeTextWords[missKey] === event.data) {
            enteredTextWords.push(misstypeTextWords[missKey]);
            entered.textContent = enteredTextWords.join("");
            misstype.textContent = "";
            misstypeTextWords = [];
            clearCount++;
            missKey = 0;

            //お試し
            if ((remainedTextWords[0] === "\n")) {
                enteredTextWords.push(remainedTextWords[0]);
                remainedTextWords.shift();
            }            

            if (remainedTextWords.length <= 0 && misstypeTextWords <= 0) {
                if (questions.length <= numOfQuestions - challenge) {
                    game.classList.add("hidden");
                    time.classList.add("hidden")
                    message.classList.remove("hidden");
                    missTypeCount.textContent = `ミス回数：${misscount}回   クリアタイム${timeCount}秒`
                    wpm.textContent = `wpm : ${Math.floor(clearCount / (timeCount / 60) / 5)}  acc : ${Math.floor(clearCount / (clearCount + misscount) * 100)}%`;             
                } else {
                    setQuestion();
                }
            }
        } else {
            misscount++;
            wrongSound.volume = 0.2;
            wrongSound.play();
            wrongSound.currentTime = 0;
        }
    }
});

replayzBtn.addEventListener("click", () => {
    window.location.reload();
});


startBtn.addEventListener("click", () => {
    enterCount = 1;
    game.classList.remove("hidden");
    time.classList.remove("hidden")
    titlePage.classList.add("hidden");
    inputText.focus();
    startShowing();
    setQuestion();
    misscount = 0;
});

document.addEventListener("keydown", (event) => {
    if (game.classList.contains("hidden") && enterCount === 0) {
        if (event.code === "Enter") {
            enterCount = 1;
            game.classList.remove("hidden");
            time.classList.remove("hidden")
            titlePage.classList.add("hidden")
            inputText.focus();
            startShowing();
            setQuestion();
            misscount = 0;
        }
    }
});

setBtn.addEventListener("click", () => {
    if (Number(numinput.value) <= numOfQuestions && numinput.value !== "" && Number(numinput.value) > 0) {
        challenge = Number(numinput.value);
        setNum.textContent = challenge + "問セット完了！";
    } 
});


// 繰り返し処理の中身
function timeCounter() {
    timeCount++;   // カウントアップ
    let msg = "タイム" + timeCount + "秒";   // 表示文作成
    time.innerHTML = msg;   // 表示更新
 }

 // 繰り返し処理の開始
function startShowing() {
    timeCount = 0;   // カウンタのリセット
    PassageID = setInterval('timeCounter()',1000);   // タイマーをセット(1000ms間隔)
 }

 // 繰り返し処理の中止
function stopShowing() {
    clearInterval( PassageID );   // タイマーのクリア
 }
