"use strict";

const MARU = "o";
const BATSU = "x";
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
const info = document.getElementById("info");
button.addEventListener("click", () => Play.start());

let playBoard = new Array(9);
let isMatch = false;
let numOfTurn = 0;

class Play {
	static start() {
		playBoard = new Array(9);
		isMatch = false;
		numOfTurn = 0;
		info.innerHTML = `<p>${this.who()}'s Turn</p>`;
		cells.forEach((cell) => {
			//初期化
			cell.classList.remove("selected");
			cell.innerHTML = "";
			cell.addEventListener("click", (e) => this.clickAction(e, cell));
		});
	}
	static who() {
		return numOfTurn % 2 === 0 ? MARU : BATSU;
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
		this.setTurn(this.who(), "Turn");
	}
	static setTurn(who, progress) {
		info.innerHTML = ``;
		let string = ``;
		switch (progress) {
			case "Turn":
			case "Win":
				string = `<p>${who}'s ${progress}</p>`;
				break;
			case "Draw":
				string = `<p>Draw...</p>`;
				break;
		}
		info.innerHTML = string;
		return;
	}
	static result(who, isMatch) {
		if (isMatch) {
			this.setTurn(who, "Win");
		} else {
			this.setTurn(who, "Draw");
		}
		const str = isMatch ? `${who} is Win!` : `draw...`;
		alert(str);
		return;
	}
}

Play.start();
