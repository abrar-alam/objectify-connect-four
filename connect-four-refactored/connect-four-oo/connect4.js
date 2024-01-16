/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */




class Game{

  #HEIGHT;
  #WIDTH; 
  #currPlayer = 1;// active player: 1 or 2
  #board = []; // array of rows, each row is array of cells  (board[y][x])
  #gameover = false;
  constructor(height, width){
    this.#HEIGHT = height;
    this.#WIDTH = width;
    // this. currPlayer = 1; 
    // this.board = []; // array of rows, each row is array of cells  (board[y][x])
    //             // AA: Instance variable

    this.#initialize();
    // this.#setupGame();
    
  }


  /** initialize: Load the new game button and add the click event listener to it which allows the user to start a new game */
  #initialize(){
    const startButton = document.getElementById('newgame-button'); 
    // At the beginning the game board will be invisible unless the start game button is clicked
    document.querySelector("#game").style.display = "none";
    // add the event listener to the button
    startButton.addEventListener("click", this.#handleButtonClick.bind(this));
  }

  /** setupGame: initializes the instance vars and HTML doms to start a new game */

  #setupGame(){
    this.#makeBoard();
    this.#makeHtmlBoard();
  }
  /** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */
  #makeBoard() {
    for (let y = 0; y < this.#HEIGHT; y++) {
      this.#board.push(Array.from({ length: this.#WIDTH }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  #makeHtmlBoard() {
    const board = document.getElementById('board');
    

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.#handleClick.bind(this));

    for (let x = 0; x < this.#WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.#HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.#WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }

    // // At the beginning the game board will be invisible unless the start game button is clicked
    // board.style.display = "none";
    // // add the event listener to the button
    // startButton.addEventListener("click", this.#handleButtonClick.bind(this));
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  #findSpotForCol(x) {
    for (let y = this.#HEIGHT - 1; y >= 0; y--) {
      if (!this.#board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  #placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.#currPlayer}`);
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  #endGame(msg) {
    alert(msg);
  }

  /** eraseGameBoard: Removes the game board HTML elements to give the game board the default look */

  #eraseGameBoard(){
    const board = document.getElementById("board");
    
    // const parent = document.getElementById("foo")
    while (board.firstChild) {
      board.firstChild.remove();
    }
  }

  /** handleButtonClick: handle click on the new game button. New game starts if this is clicked on */

  #handleButtonClick(evt){
    // First remove the doms
    this.#eraseGameBoard();

    // COnfigure the instance properties to default vals
    this.#currPlayer = 1;
    this.#board = [];
    this.#gameover = false;

    // Start a new game
    this.#setupGame();

    // Make the game board visible
    document.querySelector("#game").style.display = "block";

  }
  /** handleClick: handle click of column top to play piece */

  #handleClick(evt) {
    if (!this.#gameover){
      // get x from ID of clicked cell
      const x = +evt.target.id;

      // get next spot in column (if none, ignore click)
      const y = this.#findSpotForCol(x);
      if (y === null) {
        return;
      }

      // place piece in board and add to HTML table
      this.#board[y][x] = this.#currPlayer;
      this.#placeInTable(y, x);

      // check for win
      if (this.#checkForWin()) {
        this.#gameover = true;
        return this.#endGame(`Player ${this.#currPlayer} won!`);
      }

      // check for tie
      if (this.#board.every(row => row.every(cell => cell))) {
        this.#gameover = true;
        return this.#endGame('Tie!');
      }

      // switch players
      this.#currPlayer = this.#currPlayer === 1 ? 2 : 1;
    }
    
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  #checkForWin() {
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.#HEIGHT &&
          x >= 0 &&
          x < this.#WIDTH &&
          this.#board[y][x] === this.#currPlayer
      );
    }

    const bindedWin = _win.bind(this);

    for (let y = 0; y < this.#HEIGHT; y++) {
      for (let x = 0; x < this.#WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (bindedWin(horiz) || bindedWin(vert) || bindedWin(diagDR) || bindedWin(diagDL)) {
          return true;
        }
      }
    }

  }
}

new Game(6, 7);
