function myClass(id, buttons) {
  this.container = document.getElementById(id);
  this.containerPositionLeft = 0;
  this.containerPositionTop = 0;
  
  this.ball = document.querySelectorAll('#' + id +' .ball')[0];
  
  this.containerWidth = this.container.offsetWidth;
  this.containerHeight = this.container.offsetHeight;
  
  this.ballLeft = 0;
  this.ballTop = 0;
  this.x = 0;
  this.y = 0;

  this.ballWidth = this.ball.offsetWidth;
  
  this.initialX = getCssProperty(this.ball, "left");
  this.initialY = getCssProperty(this.ball, "top");

  this.items = this.container.getElementsByClassName("cell");
  this.itemsLength = this.items.length;

  this.lines = this.container.getElementsByClassName("line");
  this.linesLength = this.lines.length;

  this.transitionFlag = 0;
  this.resetButton = document.querySelectorAll('#' + buttons +' .reset')[0];
  this.end = 0;
  this.stop = 0;
  this.row = 11;
  this.pos = 60;
}

myClass.prototype.initialize = function() {
  var self = this;
  // console.log(this.container);
  // console.log(this.items);
  // console.log(this.itemsLength);
  // console.log(this.resetButton);

  // Listen for a transition
  var transitionEvent = whichTransitionEvent();
  transitionEvent && ball.addEventListener(transitionEvent, function() {
    self.transitionFlag = 0;
    // console.log('Transition complete!  This is the callback, no library needed!');
  });

  for(var i = 0; i < this.itemsLength; i++) {
    this.items[i].setAttribute('data-index', i);
    this.items[i].addEventListener('click', this.moveFunc.bind(this), false);
  }
  for(var k = 1; k < this.linesLength; k++) {
    this.lines[k].setAttribute('data-index', k);
  }
  this.randomActive();
  this.resetButton.addEventListener('click', this.reset.bind(this), false);
}

myClass.prototype.reset = function() {
  this.pos = 60;
  this.stop = 0;
  this.end = 0;
  this.transitionFlag = 0;
  for(var i = 0; i < this.itemsLength; i++) {
    this.items[i].className = "cell";
  }
  this.randomActive();
  this.ball.className = "ball";
  this.ball.style.left = this.initialX + "px";
  this.ball.style.top = this.initialY + "px";
}

myClass.prototype.randomActive = function() {
  for(var k = 0; k < 9; k++) {
    var randomActiveCells = Math.floor((Math.random() * 120) + 1);
    if(randomActiveCells == this.pos){
      randomActiveCells = randomActiveCells + 1;
    }
    this.items[randomActiveCells].className = this.items[randomActiveCells].className + " active";
  }
}

myClass.prototype.loseFunc = function(dir) {
  if(this.end == 1) {
    console.log("You lose");
    this.stop = 1;

    this.getPos();

    if(dir == "right"){
      this.x = this.ballLeft + this.ballWidth;
    }
    if(dir == "left"){
      this.x = this.ballLeft - this.ballWidth;
    }
    if(dir == "top"){
      this.y = this.ballTop - this.ballWidth;
    }
    if(dir == "bottom"){
      this.y = this.ballTop + this.ballWidth;
    }

    this.ball.className = this.ball.className + " hidden";

  } else {
    if(dir == "right"){
      if((this.pos + 1) % this.row == 0){
        console.log("hor last");
        this.end = 1;
      };
    }
    if(dir == "left"){
      if((this.pos) % this.row == 0 || this.pos == 0){
        console.log("hor first");
        this.end = 1;
      };
    }
    if(dir == "top"){
      if((this.pos) / this.row < 1){
        console.log("vert first");
        this.end = 1;
      };
    }
    if(dir == "bottom"){
      if((this.pos + 1) / this.row > (this.row - 1)){
        console.log("vert last");
        this.end = 1;
      };
    }
  }
}

myClass.prototype.getPos = function() {
  this.ballLeft = getCssProperty(this.ball, "left");
  this.ballTop = getCssProperty(this.ball, "top");
}

myClass.prototype.setPos = function() {
  if(this.stop == 0) {
    this.containerPositionLeft = this.container.getBoundingClientRect().left;
    this.containerPositionTop = this.container.getBoundingClientRect().top;
    var cellPosition = this.items[this.pos].getBoundingClientRect();
    this.x = cellPosition.left - this.containerPositionLeft;
    this.y = cellPosition.top - this.containerPositionTop;
  }
  
  // console.log(" x: ", x, " y: ", y);
  this.ball.style.left = this.x + "px";
  this.ball.style.top = this.y + "px";
}

myClass.prototype.getNextIndex = function(dir){
  if(this.end == 0) {
    var parentIndex = parseInt(this.items[this.pos].parentNode.getAttribute("data-index"));
    console.log("parentIndex", parentIndex);

    if(dir == "left"){
      this.pos = this.pos - 1;
    }
    if(dir == "right"){
      this.pos = this.pos + 1;
    }
    if(dir == "left top"){
      if(parentIndex % 2 == 0){
        this.pos = this.pos - this.row - 1;
      } else {
        this.pos = this.pos - this.row;
      }
    }
    if(dir == "right top"){
      if(parentIndex % 2 == 0){
        this.pos = this.pos - this.row;
      } else {
        this.pos = this.pos - this.row + 1;
      }
    }
    if(dir == "left bottom"){
      if(parentIndex % 2 == 0){
        this.pos = this.pos + this.row - 1;
      } else {
        this.pos = this.pos + this.row;
      }
    }
    if(dir == "right bottom"){
      if(parentIndex % 2 == 0){
        this.pos = this.pos + this.row;
      } else {
        this.pos = this.pos + this.row + 1;
      }
    }
    console.log("this.pos", this.pos);
  }
};

myClass.prototype.moveRight = function() {
  this.getNextIndex("right");
  this.loseFunc("right");
  this.setPos();
  // console.log("right");
}

myClass.prototype.moveLeft = function(){
  this.getNextIndex("left");
  this.loseFunc("left");
  this.setPos();
  // console.log("left");
};

myClass.prototype.moveRightTop = function(){
  this.getNextIndex("right top");
  this.loseFunc("top");
  this.setPos();
  // console.log("right top");
};

myClass.prototype.moveLeftBottom = function(){
  this.getNextIndex("left bottom");
  this.loseFunc("bottom");
  this.setPos();
  // console.log("left bottom");
};

myClass.prototype.moveRightBottom = function(){
  this.getNextIndex("right bottom");
  this.loseFunc("bottom");
  this.setPos();
  // console.log("right bottom");
};

myClass.prototype.moveLeftTop = function(){
  this.getNextIndex("left top");
  this.loseFunc("top");
  this.setPos();
  // console.log("left top");
};

myClass.prototype.moveFunc = function(e) {
  if(this.transitionFlag == 0 && this.stop == 0) {

    var curCell = e.currentTarget;
    var index = parseInt(curCell.getAttribute("data-index"));
    // console.log("index: ", index);
    if(curCell.className.indexOf("active") == -1){
      curCell.className = curCell.className + " active";
      this.transitionFlag = 1;
      
      this.moveRight();
      // this.moveLeft();
      // this.moveRightTop();
      // this.moveLeftBottom();
      // this.moveRightBottom();
      // this.moveLeftTop();
    };
  };
}

/* From Modernizr */
function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}

function getCssProperty(elem, property){
   return parseInt(window.getComputedStyle(elem,null).getPropertyValue(property).replace("px", ""));
}

window.onload = function () {
  var game = new myClass("container", "buttons");
  game.initialize();
}


