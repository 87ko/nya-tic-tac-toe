"use strict";

const SENKOU = "O";
const KOUKOU = "X";
const WINNING_PATTERN = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

const board = document.getElementById("board");
const cells = document.querySelectorAll(".board-cell");
const button = document.getElementById("continue");
const playInfo = document.getElementById("playInfo");
const logInfo = document.getElementById("logInfo");
button.addEventListener("click", () => Play.start());

let playBoard = new Array(9);
let logBoard = new Array();
let isMatch = false;
let numOfTurn = 0;

class Play {
	static start() {
		LogControl.getLog();
		LogControl.setView();
		playBoard = new Array(9);
		isMatch = false;
		numOfTurn = 0;
		playInfo.innerHTML = `<p>${this.who()}'s Turn</p>`;
		cells.forEach((cell) => {
			//初期化
			cell.classList.remove("selected");
			cell.innerHTML = "";
			cell.addEventListener("click", (e) => this.clickAction(e, cell));
		});
	}
	static who() {
		return numOfTurn % 2 === 0 ? SENKOU : KOUKOU;
	}
	static clickAction(e, cell) {
		//勝敗が決まっているor入力済みは無効
		if (isMatch || cell.textContent) {
			e.preventDefault();
			return;
		}
		//だれのたーん？
		const who = this.who();
		const index = cell.getAttribute("data-index");
		cell.innerHTML = who;
		cell.classList.add("selected");
		//playする
		playBoard[index] = who;
		this.playOrDraw(who);
	}
	static playOrDraw(who) {
		//winningPatternをみにいく
		const currentIndex = [];
		playBoard.forEach((val, i) => {
			if (val === who) currentIndex.push(i);
		});
		//index番号順にソートする
		currentIndex.sort((a, b) => a - b);
		//winningPatternにあうかどうかチェックする
		WINNING_PATTERN.forEach((pattern) => {
			//patternの値にcurrentIndexがあればOK
			let matchCount = 0;
			for (let i = 0; i < pattern.length; i++) {
				if (!currentIndex.includes(pattern[i])) continue;
				matchCount += 1;
			}
			if (matchCount === 3) isMatch = true;
		});
		//勝敗決定or9個埋まってたら結果ページへ..
		if (isMatch || numOfTurn === 8) {
			return this.result(who, isMatch);
		}
		//play続行ならカウント
		numOfTurn += 1;
		this.setInfo(this.who(), "Turn");
	}
	static setInfo(who, progress) {
		playInfo.innerHTML = ``;
		let string = ``;
		switch (progress) {
			case "Turn":
				string = `<p>${who}'s ${progress}</p>`;
				break;
			case "Win":
				string = `<h2>${who}'s ${progress}!!</h2>`;
				break;
			case "Draw":
				string = `<p>Draw...</p>`;
				break;
		}
		playInfo.innerHTML = string;
		return;
	}
	static result(who, isMatch) {
		if (isMatch) {
			this.setInfo(who, "Win");
		} else {
			this.setInfo(who, "Draw");
		}
		LogControl.setLog();
		return;
	}
}

class Log {
	logBoard;
	time;
	constructor(board) {
		this.logBoard = board;
		this.time = new Date();
	}
}

class LogControl {
	static setView() {
		//logInfoで過去プレーを選択できる
		logInfo.innerHTML = "";
		logBoard.forEach((_log, i) => {
			const logButton = document.createElement("button");
			logButton.setAttribute("id", i);
			logButton.innerHTML = i + 1;
			logButton.addEventListener("click", () => this.setLogBoard(i));
			logInfo.append(logButton);
		});
	}
	static setLogBoard(index) {
		//boardを描画する..
		cells.forEach((cell) => {
			const cellIndex = cell.getAttribute("data-index");
			const selectedCell = logBoard[index][cellIndex];
			cell.innerHTML = selectedCell;
			cell.classList.add("selected");
		});
		return;
	}

	static getLog() {
		const logs = JSON.parse(localStorage.getItem("logs"));
		//初期化
		logBoard = new Array();
		// localStorage.removeItem("logs");
		if (!logs) return;
		logs.forEach((log) => {
			logBoard.push(log.logBoard);
		});
		console.log(logBoard);
		return logBoard;
	}
	static setLog() {
		const newLogs = JSON.parse(localStorage.getItem("logs")) || [];
		newLogs.push(new Log(playBoard));

		if (newLogs.length > 5) newLogs.shift();
		localStorage.setItem("logs", JSON.stringify(newLogs));
	}
}

Play.start();
