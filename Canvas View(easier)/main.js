const canvas = document.getElementById('GameCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const fullwidth = 1280;
const fullheight = 1280;
let obstacles = [];
let obstaclerows = 9;
let currentframe = {xstart: 320, xend: 960, ystart: fullheight, yend: 640};
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let gravity = 0.016;

class Obstacle{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 20;
    }
    draw(){
        ctx.beginPath();
        ctx.rect(this.x - currentframe.xstart, this.y - currentframe.yend, this.width, this.height);
        ctx.fillStyle = 'gray';
        ctx.fill();
        ctx.closePath();
    }
}

class Player{
    constructor(x, y, l, w, dx, dy){
        this.x = x;
        this.y = y;
        this.worldx = 640;
        this.worldy = fullheight;
        this.h = l;
        this.w = w;
        this.dx = dx;
        this.dy = dy;
    }
    draw(){
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
    move(){
        frameMove();
        this.dx = 0;
        if(this.dy != 0 || this.y != currentframe.ystart) player.dy += gravity;
        if (rightPressed == true) {
            if (this.x + this.w > canvas.width) {
              this.dx = 0;
            } else {
              this.dx = 3;
            }
          }
          if (leftPressed == true) {
            if (this.x - this.w < 0) {
              this.dx = 0;
            } else {
                this.dx = -3;
            }
          }
        if (this.y - this.h < 0) {
            this.dy += gravity;
        }
        if (this.y + this.h > canvas.height) {
            this.dy = 0;
        }
    }
}

for(let i = 0; i <= obstaclerows; i++){
    if(i % 2 == 0){
        for(let j = 160; j <= 1200; j += 160){
            let obj = new Obstacle(j, fullheight - fullheight / obstaclerows * (i + 1));
            obstacles.push(obj);
        }
    } else{
        for(let j = 240; j < 1200; j += 160){
            let obj = new Obstacle(j, fullheight - fullheight / obstaclerows * (i + 1));
            obstacles.push(obj);
        }
    }
}

let player = new Player(width / 2, height - 30, 30, 30, 0, 0);

function drawObjects(){
    for(let i = 0; i < obstacles.length; i++){
        obstacles[i].draw();
    }
    player.draw();
}

function frameMove(){
    //FOR X
    if(currentframe.xstart > 0 && currentframe.xend < fullwidth){
        currentframe.xstart += player.dx;
        currentframe.xend += player.dx;
    } else if (currentframe.xstart <= 0){
        currentframe.xstart = 0;
        player.x += player.dx;
        if(player.x >= 320){
            player.x = 320;
            currentframe.xstart += player.dx;
            currentframe.xend += player.dx;
        }
    } else {
        currentframe.xend = fullwidth;
        player.x += player.dx;
        if(player.x <= 320){
            player.x = 320;
            currentframe.xstart += player.dx;
            currentframe.xend += player.dx;
        }
    }
    //FOR Y, only raise canvas view if player is above middle
    if(player.worldy < 960 && player.worldy > 320){
            currentframe.ystart += player.dy;
            currentframe.yend += player.dy;
            player.worldy += player.dy;
    } else{
        player.y += player.dy;
        player.worldy += player.dy;
    }

}

function detectCollisions() {
    for (let i = 0; i < obstacles.length; i++) {
        if (
            player.x + player.w > obstacles[i].x - currentframe.xstart &&
            player.x < obstacles[i].x - currentframe.xstart + obstacles[i].width &&
            player.y + player.h > obstacles[i].y - currentframe.yend &&
            player.y < obstacles[i].y - currentframe.yend + obstacles[i].height
        ) {
            let inity = player.y;
            player.y = obstacles[i].y - currentframe.yend - player.h;
            player.dy = 0;
            currentframe.ystart += player.y - inity;
            currentframe.yend += player.y - inity;
            break;
        }
    }
}

function draw(){
    ctx.clearRect(0, 0, width, height);
    drawObjects();
    player.move();
    detectCollisions();
    requestAnimationFrame(draw);
}
draw();

document.addEventListener('keydown', keyDown, true);
document.addEventListener('keyup', keyUp, true);

function keyDown(e) {
    if (e.keyCode == 68) {
        rightPressed = true;
    } else if (e.keyCode == 65) {
        leftPressed = true;
    } else if (e.keyCode == 87) {
        if(player.dy == 0){
            player.dy = -3;
        }
    }
}

function keyUp(e) {
    if (e.keyCode == 68) {
        rightPressed = false;
    } else if (e.keyCode == 65) {
        leftPressed = false;
    }
}