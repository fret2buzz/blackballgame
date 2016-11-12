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
  this.flag = 0;
  this.resetButton = document.querySelectorAll('#' + buttons +' .reset')[0];
  this.random = Math.floor((Math.random() * 6) + 1);
  this.row = 11;
  this.pos = 61;
}

myClass.prototype.initialize = function() {
  var self = this;
  console.log(this.container);
  console.log(this.items);
  console.log(this.itemsLength);
  console.log(this.resetButton);

  // Listen for a transition
  var transitionEvent = whichTransitionEvent();
  transitionEvent && ball.addEventListener(transitionEvent, function() {
    self.flag = 0;
    // console.log('Transition complete!  This is the callback, no library needed!');
  });

  for(var i = 0; i < this.itemsLength; i++) {
    this.items[i].setAttribute('data-index', i);
    this.items[i].addEventListener('click', this.moveFunc.bind(this), false);
  }

  this.resetButton.addEventListener('click', this.reset.bind(this), false);
}

myClass.prototype.reset = function() {
  for(var i = 0; i < this.itemsLength; i++) {
    this.items[i].className = "cell";
  }
  this.random = Math.floor((Math.random() * 6) + 1);
  this.ball.className = "ball";
  this.ball.style.left = this.initialX + "px";
  this.ball.style.top = this.initialY + "px";
}

myClass.prototype.getPos = function() {
  this.ballLeft = getCssProperty(this.ball, "left");
  this.ballTop = getCssProperty(this.ball, "top");
  console.log("x: ", this.ballLeft, " y: ", this.ballTop);
  var x = 0;
  var y = 0;
  if(this.ballLeft % this.ballWidth != 0){
    x = (this.ballLeft - this.ballWidth + (this.ballWidth / 2)) / this.ballWidth;
  } else {
    x = this.ballLeft / this.ballWidth;
  }
  y = this.ballTop / this.ballWidth;
  // console.log(x);
  // console.log(y);
  this.pos = (y * this.row) + x;
  console.log(this.pos);
  this.items[this.pos].className = this.items[this.pos].className + " punk";
}

myClass.prototype.setPos = function() {
  this.ball.style.left = this.move + "px";
  this.ball.style.top = this.moveTop + "px";
}

myClass.prototype.moveRight = function() {
  console.log("right");
  this.move = this.ballLeft + this.ballWidth;
  this.ball.style.left = this.move + "px";
  // console.log(this.move, this.moveTop);
  if(this.move == this.containerWidth) {
    console.log("You lose");
  }
}

myClass.prototype.moveLeft = function(){
  console.log("left");
  this.move = this.ballLeft - this.ballWidth;
  this.ball.style.left = this.move + "px";
  // console.log(this.move, this.moveTop);
  if(this.move < 0) {
    console.log("You lose");
  }
};

myClass.prototype.moveRightTop = function(){
  console.log("right top");
  this.move = this.ballLeft + (this.ballWidth / 2);
  this.moveTop = this.ballTop - this.ballWidth;
  this.setPos();
  // console.log(this.moveTop, this.moveTop);
  if(this.moveTop < 0 || this.move == this.containerWidth) {
    console.log("You lose");
  }
};

myClass.prototype.moveLeftBottom = function(){
  console.log("left bottom");
  this.move = this.ballLeft - (this.ballWidth / 2);
  this.moveTop = this.ballTop + this.ballWidth;
  this.setPos();
  // console.log(this.move, this.moveTop);
  if(this.moveTop == this.containerHeight) {
    console.log("You lose");
  }
};

myClass.prototype.moveRightBottom = function(){
  console.log("right bottom");
  this.move = this.ballLeft + (this.ballWidth / 2);
  this.moveTop = this.ballTop + this.ballWidth;
  this.setPos();
  // console.log(this.move, this.moveTop);
  if(this.moveTop == this.containerHeight) {
    console.log("You lose");
  }
};

myClass.prototype.moveLeftTop = function(){
  console.log("left top");
  this.move = this.ballLeft - (this.ballWidth / 2);
  this.moveTop = this.ballTop - this.ballWidth;
  this.setPos();
  // console.log(this.move, this.moveTop);
  if(this.moveTop < 0 || this.move < 0) {
    console.log("You lose");
    // this.ball.className = this.ball.className + " hidden";
  }
};

myClass.prototype.moveFunc = function(e) {
  if(this.flag == 0) {
    var curCell = e.currentTarget;
    var index = parseInt(curCell.getAttribute("data-index"));
    console.log("index: ", index);
    if(curCell.className.indexOf("active") == -1){
      curCell.className = curCell.className + " active";
      this.flag = 1;
      this.getPos();
      switch(this.random) {
        case 1:
          this.moveRightTop();
          break;
        case 2:
          this.moveRight();
          break;
        case 3:
          this.moveRightBottom();
          break;
        case 4:
          this.moveLeftBottom();
          break;
        case 5:
          this.moveLeft();
          break;
        case 6:
          this.moveLeftTop();
          break;
      };
      
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


