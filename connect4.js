"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

//removing global variables
// const WIDTH = 7;
// const HEIGHT = 6;

//let currPlayer = 1; // active player: 1 or 2
//const board = []; // array of rows, each row is array of cells  (board[y][x])
// (board[5][0] would be the bottom-left spot on the board)

/** makeBoard: fill in global `board`:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
//is this redundant??
class Game {
  constructor(p1, p2, height = 6, width = 7) {
    this.height = height;
    this.width = width;
    this.p1 = p1
    this.p2 = p2
    // this.currPlayer = 1;
    this.currPlayer = p1
    this.board = [];
    this.start();
    this.gameOver = false;


  }

  start() {
    this.makeBoard();
    this.makeHtmlBoard();
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      const emptyRow = Array.from({ length: this.width }).fill(null);
      this.board.push(emptyRow);
    }
  }
  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const htmlBoard = document.getElementById("board");
    htmlBoard.innerText = "";
    // TODO: add comment for this code
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    for (let x = 0; x < this.width; x++) {

      const headCell = document.createElement("td");
      headCell.setAttribute("id", `top-${x}`);
      headCell.addEventListener("click", this.handleClick.bind(this));
      top.append(headCell);
    }
    htmlBoard.append(top);

    // dynamically creates the main part of html board
    // uses HEIGHT to create table rows
    // uses WIDTH to create table cells for each row
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `c-${y}-${x}`);
        row.append(cell);
      }

      htmlBoard.append(row);
    }
  }

  /** findSpotForCol: given column x, return y coordinate of furthest-down spot
   *    (return null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (this.board[y][x] === null) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color

    const spot = document.getElementById(`c-${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end , set delay to allow for piece to show before alert*/

  endGame(msg) {
    setTimeout(() => {
      alert(msg);
    }, 0)

  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {

    const _win = cells =>
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

        cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );


    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
    return false;
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    //if game is over, ignore click to prevent additional moves
    if(this.gameOver){
      return;
    }
    // get x from ID of clicked cell
    const x = Number(evt.target.id.slice("top-".length));
    // const x = Number(evt.target.id);
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`Player ${this.currPlayer.color} won!`);

    }
    // check for tie: if top row is filled, board is filled
    if (this.board[0].every(cell => cell !== null)) {
      this.gameOver = true;
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
  }
}
new Game (6, 7)
/** create Player class and assign color property */
class Player{
  constructor(color){
    this.color = color
  }
}

/**create listener for start game. create new instance with p1 & p2 */
document.getElementById("start-game").addEventListener('click', function(e){
  e.preventDefault();
  let p1 = new Player(document.getElementById("player-1").value);
  let p2 = new Player(document.getElementById("player-2").value);
  new Game(p1, p2);
})