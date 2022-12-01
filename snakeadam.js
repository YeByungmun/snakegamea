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

/*
trail(snakeParts), tailLength 변수 만들기
뱀의 몸은 여러 개의 블럭으로 이루어져 있습니다. 
뱀이 상하좌우로 움직일 때 이전의 위치들을 추적하는 것이 중요합니다. 
trail(snakeParts)이라는 배열을 만들어 저장하도록 하겠습니다.
현재 꼬리의 길이를 저장하는 tailLength라는 변수도 생성하도록 하겠습니다. 
초기값으로 5를 지정하면 게임을 시작할 때 뱀의 블럭 수는 5개가 됩니다.

뱀 길이 늘리기
snakeParts 우리는 뱀의 일부를 담을 이름이 지정된 배열 과 
tailLength뱀의 길이를 추적할 이름이 지정된 변수를 정의해야 합니다.
이렇게 하면 아래 코드 스니펫에 설명된 대로 스네이크가 의도한 부분을 갖게 됩니다.
*/

// 뱀꼬리부분을 배열로 선언
const snakeParts = [];

// 꼬리길이를 2로 선언
let tailLength = 8;

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
  let result = isGameOver();  // isGgameOver 함수를 변수에 할당.
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
  // 머리부분 먼저 그리고
  ctx.fillStyle = 'orange'; // 머리색상
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize); // 위치(200,200) 및 크기(20,20)

  // 같은 자리에 꼬리 부분 그려서 덮어쓰기
  ctx.fillStyle = 'green';  // 몸통 색상
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    // part.x * tileCount
    //   0  *  20 = 0
    //   1  *  20 = 20
    //   2  *  20 = 40
    //   3  *  20 = 60
    // 즉, 20 만큼 이동하면서 뱀을 그린다.

  }

  /*
  trail(snakeParts) 배열에 headX, headY의 위치를 객체 형태로 저장하는 원소들을 채워넣도록 하겠습니다. 
  단, tailLength 만큼의 원소를 저장하며, trail 배열의 길이가 tailLength를 초과하면 shift()를 
  통해 배열의 맨 앞 원소를 제거하는 작업을 해야 합니다.
  */

  snakeParts.push(new SnakePart(headX, headY)); 

  // new + 뱀클래스(SnakePart) 를 사용해서 새로운 객체(뱀)을 만들어 뱀배열(snakeParts)에 요소 추가
  // 뱀 부분의 머리에 추가(push 배열의 마지막에 요소추가)
  // push() 메서드는 배열의 끝에 하나 이상의 요소를 추가하고, 배열의 새로운 길이를 반환
  // if (snakeParts.length > tailLength){
  while (snakeParts.length > tailLength){
    snakeParts.shift();  // 뱀 배열의 길이가 꼬리보다 길이보다 크면  가장 먼 항목 제거
    // shift() 메서드는 while 문의 조건으로 사용되기도 합니다. 아래 코드에서는 
    // while 문을 한번 돌 때 마다 배열의 다음 요소를 제거하고, 이는 빈 배열이 될 때까지 반복
    // shift() 메서드는 배열에서 첫 번째 요소를 제거하고, 제거된 요소를 반환합니다. 
    // 이 메서드는 배열의 길이를 변하게 합니다.

    // 위 조건에 따르자면 우선 몸의 길이를 한 칸 늘리고, 코인을 먹지 못할 시 꼬리를 잘라내는 것이다.

    /*
    https://yjyoon-dev.github.io/project/2020/11/13/jsgame-snake/
    뱀 로직
    이 게임에서 뱀은 기본적으로 앞으로 전진 한다. 그 도중에 방향키를 통해 왼쪽과 오른쪽 방향 전환이 그낭하다. 
    따라서 비동기 프로그래밍 기법을 이용할 필요가 있었다. javascript 에서는 setinterval 을 통해 이를 구현할 수 있다.
    그리고 코인을 먹을 시 뱀은 한 칸 늘어난다. 움직이고 있는 뱀이 한 칸 늘어난다는 것이 약간 까다롭게 느껴질 수 있지만 
    백준 문제를 풀던 도중 이 문제에서 로직에 관한 힌트를 얻었다. 이는 다음과 같다.
    먼저 뱀은 몸길이를 늘려(push) 머리를 다음칸에 위치시킨다.
    만약 이동한 칸에 코인이 있다면, 그 칸에 있던 코인 없어지고 꼬리는 움직이지 않는다.
    만약 이동한 칸에 사과가 없다면, 몸길이를 줄여서(shift) 꼬리가 위치한 칸을 비워준다. 즉, 몸길이는 변하지 않는다.
    */

    /*
    http://yoonbumtae.com/?p=3214
    ctx.fillStyle = "lime"
    // 삭제: ctx.fillRect(positionX * gridSize, positionY * gridSize, gridSize - 2, gridSize - 2)
              for(let i = 0; i < trail.length; i++) {
              ctx.fillRect(trail[i].x * gridSize, trail[i].y * gridSize, gridSize - 2, gridSize - 2)
    }
    기존의 단일 position을 렌더링하던 것이 for문으로 변경되어 trail의 배열을 순회하도록 바뀌었습니다. 
    사이즈 부분은 변함이 없고, 프레임 당 trail의 배열을 따라 블럭을 여러 개 그립니다. 
    이렇게 하면 드디어 뱀 모양으로 이동하는 효과가 나타나게 됩니다.
    그리고 뱀의 머리와 꼬리가 부딪혔을 때 게임오버가 되도록 합니다. 
    게임오버가 되면 tailLength 가 5인 처음 상황으로 돌아가도록 만듭니다.
    */

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

let click = document.getElementById("btn1");
    click.onclick = function(){
      
        if(xVelocity == 1)
          return;
        yVelocity = 0;
        xVelocity = -1;   // 타일 한칸 왼쪽으로 이동
      
    }
let click2 = document.getElementById("btn2");
    click2.onclick = function(){
      
        if(xVelocity == -1)
          return;
        yVelocity = 0;
        xVelocity = 1;   // 타일 한칸 왼쪽으로 이동
      
    }
let click3 = document.getElementById("btn3");
    click3.onclick = function(){
      
        if(yVelocity == 1)
          return;
        yVelocity = -1;
        xVelocity = 0;   // 타일 한칸 왼쪽으로 이동
      
    }
let click4 = document.getElementById("btn4");
    click4.onclick = function(){
      
        if(yVelocity == -1)
          return;
        yVelocity = 1;
        xVelocity = 0;   // 타일 한칸 왼쪽으로 이동
      
    }

drawGame();