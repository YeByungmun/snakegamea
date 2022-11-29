const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// 뱀을 그리기 위해 뱀 부분을 클래스로 만들어 준다.
// 뱀그리기 drawSnake() 함수에서 사용
class SnakePart{
  constructor(x,y) {  //변화는 값(뱀의 위치)을 매개변수로 담는다
    this.x = x;   // 좌측은 속성이고 우측 x는 매개변수
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

// 뱀의 속도를 초기화
let xVelocity=0;
let yVelocity=0;

// 점수 초기화
let score = 0;

// 먹는 효과음
let gulpSound = new Audio("gulp.mp3");

// 벽 충돌음
let crashSound = new Audio("crash.mp3");

// game loop(전체 게임 컨트롤 파트)
function drawGame() {
  changeSnakePosition();  // 뱀 방향 전환

  // 게임종료 로직
  let result = isGameOver();  // is game over 함수를 변수에 할당.
  if(result){     // result 가 참이면
    return;       // return(게임 종료)
  }

  clearScreen();  // 스크린 청소
  
  checkAppleCollision();  // 사과 충돌 체크
  drawApple();    // 사과 그리기
  drawSnake();    // 뱀 그리기

  drawScore();    // 점수 그리기

  // 게임속도 조절 로직
  if (score > 4) {
    speed = 9;
  }
  if (score > 8){
    speed = 11;
  }
  setTimeout(drawGame, 1000 / speed);  // 초당 speed 번 스크린 업데이트
}



// 게임 종료 함수
function isGameOver(){
  let gameOver = false;  // 디폴트를 게임종료(멈춤=false)로 하고

  // 속도가 0 인지(즉, 게임이 시작했는지 확인)
  if(yVelocity ===0 && xVelocity === 0){
    return false;
  }

  // 벽에 충돌 체크
  if(headX < 0){    // 왼쪽 벽 충돌 체크
    crashSound.play();
    gameOver = true;
  }
  else if(headX === tileCount){   // 오른쪽 벽 충돌 체크
    crashSound.play();
    gameOver = true;
  }
  else if(headY < 0){   // 위쪽 벽 충돌 체크
    crashSound.play();
    gameOver = true;
  }
  // else if(headY == tileCount){   // 아래쪽 벽 충돌 체크 height : 400
  else if(headY == 30){   // 아래쪽 벽 충돌 체크 height : 600
    crashSound.play();
    gameOver = true;
  }

  // 뱀 자신의 몸과 충돌 체크
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

    // 게임 종료 문구 위치
    ctx.fillText("Game Over!",canvas.width / 6.5, canvas.height / 2);

  return gameOver;
  }
}

// 점수 표시 함수
function drawScore(){
  ctx.fillStyle = "white";
  ctx.font = "20px Verdana";
  ctx.fillText("Score: " + score, canvas.width - 120, 20)
}

// 화면 새로 그리기
function clearScreen(){
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 뱀 그리기
function drawSnake(){
  ctx.fillStyle = 'orange'; // 머리색상
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize); // 위치 및 크기

  ctx.fillStyle = 'green';  // 몸통 색상
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY)); 
  // new + 뱀클래스(SnakePart) 를 사용해서 새로운 객체(뱀)을 만들어 뱀배열(snakeParts)에 요소 추가
  // 뱀 부분의 머리에 추가(push 배열의 마지막에 요소추가)
  // if (snakeParts.length > tailLength){
  while (snakeParts.length > tailLength){
    snakeParts.shift();  // 뱀 배열의 길이가 꼬리보다 길이보다 크면  가장 먼 항목 제거
    // shift() 메서드는 while 문의 조건으로 사용되기도 합니다. 아래 코드에서는 
    // while 문을 한번 돌 때 마다 배열의 다음 요소를 제거하고, 이는 빈 배열이 될 때까지 반복
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
  // 사과위치와 뱀의 위치가 같으면(부딪치면) 랜덤위치로 사과 이동 발생
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
    yVelocity = -1;  // 타일 한칸 위로 이동
    xVelocity = 0;
  }
  // down
  if(event.keyCode == 40){
    if(yVelocity == -1)
      return;
    yVelocity = 1;  // 타일 한칸 아래로 이동
    xVelocity = 0;
  }
  // left
  if(event.keyCode == 37){
    if(xVelocity == 1)
      return;
    yVelocity = 0;
    xVelocity = -1;   // 타일 한칸 왼쪽으로 이동
  }
  // right
  if(event.keyCode == 39){
    if(xVelocity == -1)
      return;
    yVelocity = 0;
    xVelocity = 1;   // 타일 한칸 오른쪽으로 이동
  }
  // 게임 재시작 Spacebar 누르면.
  if(event.keyCode == 32){
    window.location.reload();
  }
}

drawGame();