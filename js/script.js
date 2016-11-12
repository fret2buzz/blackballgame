function myClass(id, buttons) {
  this.container = document.getElementById(id);
  this.ball = document.querySelectorAll('#' + id +' .ball')[0];
  this.containerWidth = this.container.offsetWidth;
  this.containerHeight = this.container.offsetHeight;
  this.ballLeft = 0;
  this.ballTop = 0;

  this.ballWidth = this.ball.offsetWidth;
  this.move = 0;
  
  this.initialX = getCssProperty(this.ball, "left");
  this.initialY = getCssProperty(this.ball, "top");

  this.moveTop = getCssProperty(this.ball, "top");
  this.items = this.container.getElementsByClassName("cell");
  this.itemsLength = this.items.length;
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
  // this.randomActive();
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
  // this.randomActive();
  // this.random = Math.floor((Math.random() * 6) + 1);
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
    this.ball.className = this.ball.className + " hidden";
  }
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

myClass.prototype.getPos = function() {
  this.ballLeft = getCssProperty(this.ball, "left");
  this.ballTop = getCssProperty(this.ball, "top");
}

myClass.prototype.setPos = function() {
  this.ball.style.left = this.move + "px";
  this.ball.style.top = this.moveTop + "px";
}

myClass.prototype.getNextIndex = function(){
  // console.log("x: ", this.move, " y: ", this.moveTop);
  var x = 0;
  var y = 0;
  if(this.move % this.ballWidth != 0){
    x = (this.move - this.ballWidth + (this.ballWidth / 2)) / this.ballWidth;
  } else {
    x = this.move / this.ballWidth;
  }
  y = this.moveTop / this.ballWidth;
  // console.log(x);
  // console.log(y);
  this.pos = (y * this.row) + x;
  console.log("this.pos", this.pos);
  // this.items[this.pos].className = this.items[this.pos].className + " punk";

  this.setPos();

};

myClass.prototype.moveRight = function() {
  this.move = this.ballLeft + this.ballWidth;
  this.moveTop = this.ballTop;
  this.getNextIndex();
  this.loseFunc("right");
  console.log("right");
}

myClass.prototype.moveLeft = function(){
  this.move = this.ballLeft - this.ballWidth;
  this.moveTop = this.ballTop;
  this.getNextIndex();
  this.loseFunc("left");
  console.log("left");
};

myClass.prototype.moveRightTop = function(){
  this.move = this.ballLeft + (this.ballWidth / 2);
  this.moveTop = this.ballTop - this.ballWidth;
  this.getNextIndex();
  this.loseFunc("top");
  console.log("right top");
};

myClass.prototype.moveLeftBottom = function(){
  this.move = this.ballLeft - (this.ballWidth / 2);
  this.moveTop = this.ballTop + this.ballWidth;
  this.getNextIndex();
  this.loseFunc("bottom");
  console.log("left bottom");
};

myClass.prototype.moveRightBottom = function(){
  this.move = this.ballLeft + (this.ballWidth / 2);
  this.moveTop = this.ballTop + this.ballWidth;
  this.getNextIndex();
  this.loseFunc("bottom");
  console.log("right bottom");
};

myClass.prototype.moveLeftTop = function(){
  this.move = this.ballLeft - (this.ballWidth / 2);
  this.moveTop = this.ballTop - this.ballWidth;
  this.getNextIndex();
  this.loseFunc("top");
  console.log("left top");
};

myClass.prototype.moveFunc = function(e) {
  if(this.transitionFlag == 0 && this.stop == 0) {

    var curCell = e.currentTarget;
    var index = parseInt(curCell.getAttribute("data-index"));
    console.log("index: ", index);
    if(curCell.className.indexOf("active") == -1){
      curCell.className = curCell.className + " active";
      this.transitionFlag = 1;
      this.getPos();
      // this.moveRight();
      // this.moveLeft();
      // this.moveRightTop();
      // this.moveLeftBottom();
      // this.moveRightBottom();
      this.moveLeftTop();
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


