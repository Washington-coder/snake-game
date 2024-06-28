(function () {
  let FPS = 10
  const SIZE = 40
  const SNAKE_COLOR = 'green'
  const FOOD_COLOR = 'red'
  const BOARD_COLOR = '#ccc'
  const INITIAL_SNAKE_POSITION = [[4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9], [4, 10], [4, 11], [4, 12], [4, 13]]
  let isWining = true
  let isGamePaused = false
  let score = 0

  let board;
  let snake;

  function init() {
    board = new Board(SIZE);
    snake = new Snake(INITIAL_SNAKE_POSITION)
    board.generateFood();
    setInterval(run, 1000 / FPS)
  }

  function handlePauseAction() {
    if (isGamePaused) {
      // close modal
      document.getElementById('pause-modal').style.display = 'none';
      isGamePaused = false;
    } else {
      // open modal
      document.getElementById('pause-modal').style.display = 'flex';
      isGamePaused = true;
    }
  }

  document.getElementById('menu-icon').addEventListener('click', (e) => {
    console.log("entrou")
    handlePauseAction();
  })

  document.getElementById('pause-modal-button-continue').addEventListener('click', (e) => {
    handlePauseAction();
  })

  document.getElementById('pause-modal-button-restart').addEventListener('click', () => {
    location.reload();
  })

  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        snake.changeDirection("up")
        break;
      case "ArrowRight":
        snake.changeDirection("right")
        break;
      case "ArrowDown":
        snake.changeDirection("down")
        break;
      case "ArrowLeft":
        snake.changeDirection("left")
        break;
      case "Escape":
        handlePauseAction();
        break;
      case "r":
        location.reload();
        break;
      default:
        break;
    }
  })

  class Board {
    constructor(size) {
      this.element = document.createElement("table")
      this.element.setAttribute("id", "board")
      this.color = BOARD_COLOR;
      document.getElementById('container').appendChild(this.element)
      for (let i = 0; i < size; i++) {
        const row = document.createElement("tr")
        this.element.appendChild(row);
        for (let j = 0; j < size; j++) {
          const field = document.createElement("td");
          row.appendChild(field)
        }
      }
    }
    generateFood() {

      let rowIndex = Math.floor(Math.random() * SIZE);
      let columnIndex = Math.floor(Math.random() * SIZE);

      let randomRow = this.element.children[rowIndex]
      let randomCellInTheRow = randomRow.children[columnIndex]

      while (randomCellInTheRow.style.backgroundColor === SNAKE_COLOR) {
        rowIndex = Math.floor(Math.random() * 40);
        columnIndex = Math.floor(Math.random() * 40);
        randomRow = this.element.children[rowIndex]
        randomCellInTheRow = randomRow.children[columnIndex]
      }

      randomCellInTheRow.style.backgroundColor = FOOD_COLOR;
    }
  }

  class Snake {
    constructor(body) {
      this.body = body;
      this.color = SNAKE_COLOR;
      this.newDirection = "right";
      this.currentDirection = "right";
      this.body.forEach(field => document.querySelector(`#board tr:nth-child(${field[0]}) td:nth-child(${field[1]})`).style.backgroundColor = this.color)
    }
    walk() {
      const head = this.body[this.body.length - 1];
      let newHead;

      function checkIfPlayerLost(newHead) {
        const headElement = document.querySelector(`#board tr:nth-child(${newHead[0]}) td:nth-child(${newHead[1]})`)
        const isSnakeEatingItself = headElement === null ? false : headElement.style.backgroundColor === SNAKE_COLOR;
        if (headElement === null || isSnakeEatingItself) {
          isWining = false;
          clearInterval(run)
        }
      }

      function moveDown() {
        return [head[0] + 1, head[1]]
      }
      function moveUp() {
        return [head[0] - 1, head[1]]
      }
      function moveLeft() {
        return [head[0], head[1] - 1]
      }
      function moveRight() {
        return [head[0], head[1] + 1]
      }

      switch (this.newDirection) {
        case "up":
          if (this.currentDirection === "down") { // blocks up direction when moving down
            newHead = moveDown()
            break;
          }
          newHead = moveUp()
          this.currentDirection = this.newDirection;
          break;
        case "right":
          if (this.currentDirection === "left") { // blocks right direction when moving left
            newHead = moveLeft()
            break;
          }
          newHead = moveRight()
          this.currentDirection = this.newDirection;
          break;
        case "down":
          if (this.currentDirection === "up") { // blocks down direction when moving up
            newHead = moveUp()
            break;
          }
          newHead = moveDown()
          this.currentDirection = this.newDirection;
          break;
        case "left":
          if (this.currentDirection === "right") { // blocks left direction when moving right
            newHead = moveRight()
            break;
          }
          newHead = moveLeft()
          this.currentDirection = this.newDirection;
          break;
        default:
          break;
      }
      this.body.push(newHead)
      const oldTail = this.body.shift()

      checkIfPlayerLost(newHead);

      if (document.querySelector(`#board tr:nth-child(${newHead[0]}) td:nth-child(${newHead[1]})`).style.backgroundColor === FOOD_COLOR) {
        snake.eat(newHead);
      }

      document.querySelector(`#board tr:nth-child(${newHead[0]}) td:nth-child(${newHead[1]})`).style.backgroundColor = this.color
      document.querySelector(`#board tr:nth-child(${oldTail[0]}) td:nth-child(${oldTail[1]})`).style.backgroundColor = board.color
    }
    changeDirection(direction) {
      this.newDirection = direction
    }
    eat(newHead) {
      score += 1;
      document.getElementById('score').innerHTML = score;
      this.body.push(newHead)
      board.generateFood();
    }
  }
  function run() {
    if (isWining && !isGamePaused) {
      snake.walk()
    }
  }
  init()
})()