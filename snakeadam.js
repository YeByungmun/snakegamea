const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// 뱀 부분을 클래스로 만들어 준다.
class SnakePart{
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
}

// 게임 속도 조절 변수
let speed = 7;

let tileCount = 20;
let tileSize = canvas.width / tileCount -2;

// 뱀머리 위치 변수
let headX = 10;
let headY = 10;

// 뱀부분을 배열로 선언
const snakeParts = [];
// 꼬리길이를 2로 선언
let tailLength = 2;

// 사과 위치 변수(최초는 5,5로 선언)
let appleX = 5;
let appleY = 5;

let xVelocity=0;
let yVelocity=0;

// 점수
let score = 0;

// 먹는 효과음
let gulpSound = new Audio("gulp.mp3");

// game loop
function drawGame() {
  changeSnakePosition();

  // 게임종료 로직
  let result = isGameOver();  // is game over 함수를 변수에 할당.
  if(result){     // result 가 참이면
    return;       // return(게임 종료)
  }

  clearScreen();
  

  checkAppleCollision();
  drawApple();
  drawSnake();

  drawScore();

  // 게임속도 조절 로직
  if (score > 4) {
    speed = 9;
  }
  if (score > 8){
    speed = 11;
  }
  setTimeout(drawGame, 1000 / speed);
}

// 게임 종료 함수
function isGameOver(){
  let gameOver = false;  // 디폴트를 게임종료(멈춤=false)로 하고

  if(yVelocity ===0 && xVelocity === 0){
    return false;
  }

  // 벽에 충돌 체크
  if(headX < 0){    // 왼쪽 벽 충돌 체크
    gameOver = true;
  }
  else if(headX === tileCount){   // 오른쪽 벽 충돌 체크
    gameOver = true;
  }
  else if(headY < 0){   // 위쪽 벽 충돌 체크
    gameOver = true;
  }
  else if(headY == tileCount){   // 아래쪽 벽 충돌 체크
    gameOver = true;
  }

  for(let i = 0; i < snakeParts.length; i++){
    let part = snakeParts[i];
    if(part.x === headX && part.y === headY){
      gameOver = true;
      break;
    }
  }

  if(gameOver){
    ctx.fillStyle = 'white';
    ctx.font = '50px Verdana';
    
    // 게임오버 문구에 그라데이션 주기 옵션
    var gradient = ctx.createLinearGradient(0,0,canvas.width,0);
    gradient.addColorStop("0","magenta");
    gradient.addColorStop("0.5","blue");
    gradient.addColorStop("1.0","red");
    // Fill with gradient
    ctx.fillStyle = gradient;

    // 문구 위치
    ctx.fillText("Game Over!",canvas.width / 6.5, canvas.height / 2);

  return gameOver;
  }
}

// 점수 표시 함수
function drawScore(){
  ctx.fillStyle = "white";
  ctx.font = "10px Verdana";
  ctx.fillText("Score: " + score, canvas.width - 50, 10)
}

// 화면 새로 그리기
function clearScreen(){
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 뱀 그리기
function drawSnake(){
  ctx.fillStyle = 'orange';
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);

  ctx.fillStyle = 'green';
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY)); // 뱀 부분의 머리에 추가
  // if (snakeParts.length > tailLength){
  while (snakeParts.length > tailLength){
    snakeParts.shift();  // 뱀부분이 꼬리 길이보다 크면  가장 먼 항목 제거
  }
  
}

// 뱀의 위치를 변경하기 위한 함수
function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

// 사과 그리기
function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize,tileSize);
}

// 사과와 충돌 체크
function checkAppleCollision(){
  // 사과위치와 밴위치가 같으면(부딪치면)
  if(appleX === headX && appleY === headY){
    // Math.random() : 0 이상 1 미만의 부동소숫점 의사 난수 반환
    // 즉, 0.1 * tileCount(20) = 2
    appleX = Math.floor(Math.random() * tileCount);
    // Math.floor() : 정수내림 함수 1.2 => 1
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score ++;
    gulpSound.play();
  }
}

// 이벤트 : 키를 누르면 게임이 시작
document.body.addEventListener('keydown',keyDown);

function keyDown(event){
  // up
  if(event.keyCode == 38){
    // 아래 2줄은 역방향 방지를 위함.
    if(yVelocity == 1)
      return;
    yVelocity = -1;
    xVelocity = 0;
  }
  // down
  if(event.keyCode == 40){
    if(yVelocity == -1)
      return;
    yVelocity = 1;
    xVelocity = 0;
  }
  // left
  if(event.keyCode == 37){
    if(xVelocity == 1)
      return;
    yVelocity = 0;
    xVelocity = -1;
  }
  // right
  if(event.keyCode == 39){
    if(xVelocity == -1)
      return;
    yVelocity = 0;
    xVelocity = 1;
  }
}

drawGame();