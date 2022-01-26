//GAME LOOP//

//because main() is called in the second statement, main() is synchronized to framerate
//currentTime tells us when the current time is that we render the next frame
//will call the main function with the current timestamp of when that frame is rendered

let lastRender = 0;
const snake_speed = 5; // how many times the snake moves per second; depends on the secSinceLastRender in main function
const gameBoard = document.getElementById('game-board'); //gameBoard variable contains the game-board class in HTML

let direction = { x: 0, y: 0 }
function getDirection() {
    return direction;
}

function refreshPage() {
    window.location.reload();
} 


window.addEventListener('keydown', function(event){
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y !== 0) break;
            direction = { x: 0, y: -1 }
            break;
        case 'ArrowDown':
            if (direction.y !== 0) break;
            direction = { x: 0, y: 1 }
            break;
        case 'ArrowLeft':
            if (direction.x !== 0) break;
            direction = { x: -1, y: 0 }
            break;
        case 'ArrowRight':
            if (direction.x !== 0) break;
            direction = { x: 1, y: 0 }
            break;
    }
})



function main(currentTime) {
    scoreDisplay.innerText = snakeBody.length;
    if (endByWall) {
       if (confirm('You ran into the wall! Click OK to try again!')) {
           location.href=location.href
       }
       else {
           location.href="http://endoftheinternet.com"
       }
       return
    }

    if (endBySelf) {
        if (confirm('You ate yourself! Click OK to try again!')) {
            location.href=location.href
        }
        else {
            location.href="http://endoftheinternet.com"
        }
        return
    }
    window.requestAnimationFrame(main);
    const secSinceLastRender = (currentTime - lastRender) / 1000; //to see how much delay is between each render frame
   if (secSinceLastRender < 1 / snake_speed) return //if the time since our last render is less than half a second, we don't need to move the snake
    lastRender = currentTime; //we only update last render time if we get below the if statement checkpoint -- *** ?? but why does this have to be located here to work ?? ***
    
      //updates all of the logic for the game; move the snake to the correct position; update if snake ate food or not; if snake ran into its own tail, etc...
      update()

      //draws the snake based on the update logic, so if snake ate the food, makes the snake's tail longer, etc
      draw()

}


function difficultyEasy() {
    snake_speed = 5
}

function difficultyMedium() {
    snake_speed = 7.5
}

function difficultyHard() {
    snake_speed = 10
}

//start our loop for the very first time
window.requestAnimationFrame(main);
const snakeBody = [ { x: 10, y: 10 }] //where snake will begin at every new game




function updateSnake() { //we need to update the snake such that each segment of the snake follows where it was previously located while it moves in the new direction
    addSnake();
    let keyDirection = getDirection();
    for (let i = snakeBody.length - 2; i >=0; i--) { //second to last segment of snake
        snakeBody[i + 1] = { ...snakeBody[i] }; //creates a duplicate of snake, but forward one position
    }
    snakeBody[0].x += keyDirection.x
    snakeBody[0].y += keyDirection.y
}


let apple = randomizeApple();
const growth = 1;
let snakeSegments = 0;



function updateApple() {
    if (onSnake(apple)) {
        growSnake(growth)
        apple = randomizeApple()
    }
}

function drawApple(gameBoard) { //draw apple to the gameboard 
    const appleEl = document.createElement('div')
    appleEl.style.gridRowStart = apple.y
    appleEl.style.gridColumnStart = apple.x
    appleEl.classList.add('apple')
    gameBoard.appendChild(appleEl)
}

function drawSnake(gameBoard) { //we have to pass gameBoard into this function so that we can draw/add the snake to it
    snakeBody.forEach(segment => { //we are looping through the segments of the snake
        const snakeElement = document.createElement('div'); //creating the snake element 
        snakeElement.style.gridRowStart = segment.y; //at a particular x and y coordinate
        snakeElement.style.gridColumnStart = segment.x; //we are setting each x and y coordinate of the segment equal to the snakeElement that we created
        snakeElement.classList.add('snake'); //and we are linking that snakeElement to the class of 'snake' shown in our CSS
        gameBoard.appendChild(snakeElement); //and we are passing this snakeElement into the game board 

    })
}

// -------------------------//



function randomizeApple() { //after snake eats the apple, put a new apple in a random spot but NOT on a spot where the snake is
   let newApple
   while (newApple == null || onSnake(newApple)) {
       newApple = randomGrid()
   }
   return newApple
}

function randomGrid() {
    return {
        x: Math.floor(Math.random() * 24) + 1,
        y: Math.floor(Math.random() * 24) + 1
    }
}

function growSnake(amount) {
    snakeSegments += amount;
}

const scoreDisplay = document.getElementById('score')


function addSnake() {
    for (let i = 0; i < snakeSegments; i++) {
        snakeBody[snakeBody.length] = { ...snakeBody[snakeBody.length - 1] } 
    }
    snakeSegments = 0
}


function onSnake(position, { ignoreHead = false } = {}) { //The some() method tests whether at least one element in the array passes the test implemented by the provided function.
    return snakeBody.some((segment, index) => {
        if (ignoreHead && index === 0) return false
        return equalPos(segment, position) //check to see if position is equal to a segment on the snake's body
    })
}

function equalPos(pos1, pos2) {
    return (
        pos1.x === pos2.x && pos1.y === pos2.y
    )
}


//------------------//

let snakeHead = snakeBody[0];

let endByWall = false;

let endBySelf = false;

function loseByWall() {
    endByWall = hitWall(snakeHead) 
}

function loseBySelf() {
    endBySelf = intersection()
}

function hitWall(position) {
    return (
        position.x < 1 || position.x > 24 || position.y < 1 || position.y > 24
    )
}

function intersection() {
    return onSnake(snakeBody[0], { ignoreHead: true })
}


//------------------//

function update() {
    updateSnake();
    updateApple();
    loseByWall();
    loseBySelf();
}

function draw() {
    gameBoard.innerHTML = '';
    drawSnake(gameBoard);
    drawApple(gameBoard);
}