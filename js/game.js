(function () {
  let FPS = 10
  const SIZE = 40

  let board;
  let snake;

  function init() {
    board = new Board(SIZE);
    snake = new Snake([[4, 4], [4, 5], [4, 6]])
    setInterval(run, 1000 / FPS)
  }

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
      default:
        break;
    }
  })

  class Board {
    constructor(size) {
      this.element = document.createElement("table")
      this.element.setAttribute("id", "board")
      this.color = "#ccc";
      document.body.appendChild(this.element)
      for (let i = 0; i < size; i++) {
        const row = document.createElement("tr")
        this.element.appendChild(row);
        for (let j = 0; j < size; j++) {
          const field = document.createElement("td");
          row.appendChild(field)
        }
      }
    }
  }

  class Snake {
    constructor(body) {
      this.body = body;
      this.color = "#222";
      this.newDirection = "right";
      this.currentDirection = "right";
      this.body.forEach(field => document.querySelector(`#board tr:nth-child(${field[0]}) td:nth-child(${field[1]})`).style.backgroundColor = this.color)
    }
    walk() {
      const head = this.body[this.body.length - 1];
      let newHead;

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
      document.querySelector(`#board tr:nth-child(${newHead[0]}) td:nth-child(${newHead[1]})`).style.backgroundColor = this.color
      document.querySelector(`#board tr:nth-child(${oldTail[0]}) td:nth-child(${oldTail[1]})`).style.backgroundColor = board.color
    }
    changeDirection(direction) {
      this.newDirection = direction
    }
  }

  function run() {
    snake.walk()
  }
  init()
})()