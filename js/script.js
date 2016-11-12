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
  // this.random = Math.floor((Math.random() * 6) + 1);
  this.row = 11;
  this.pos = 61;
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
    self.flag = 0;
    // console.log('Transition complete!  This is the callback, no library needed!');
  });

  for(var i = 0; i < this.itemsLength; i++) {
    this.items[i].setAttribute('data-index', i);
    this.items[i].addEventListener('click', this.moveFunc.bind(this), false);
  }
  this.randomActive();
  this.resetButton.addEventListener('click', this.reset.bind(this), false);
}

myClass.prototype.reset = function() {
  this.pos = 61;
  for(var i = 0; i < this.itemsLength; i++) {
    this.items[i].className = "cell";
  }
  this.randomActive();
  // this.random = Math.floor((Math.random() * 6) + 1);
  this.ball.className = "ball";
  this.ball.style.left = this.initialX + "px";
  this.ball.style.top = this.initialY + "px";
}

myClass.prototype.randomActive = function() {
  for(var k = 0; k < 9; k++) {
    var randomActiveCells = Math.floor((Math.random() * 120) + 1);
    if(randomActiveCells == this.pos){
      randomActiveCells++;
    }
    this.items[randomActiveCells].className = this.items[randomActiveCells].className + " active";
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
  // console.log(this.pos);
  // this.items[this.pos].className = this.items[this.pos].className + " punk";
};

myClass.prototype.moveRight = function() {
  console.log("right");
  this.move = this.ballLeft + this.ballWidth;
  this.moveTop = this.ballTop;
  this.getNextIndex();
}

myClass.prototype.moveLeft = function(){
  console.log("left");
  this.move = this.ballLeft - this.ballWidth;
  this.moveTop = this.ballTop;
  this.getNextIndex();
};

myClass.prototype.moveRightTop = function(){
  console.log("right top");
  this.move = this.ballLeft + (this.ballWidth / 2);
  this.moveTop = this.ballTop - this.ballWidth;
  this.getNextIndex();

};

myClass.prototype.moveLeftBottom = function(){
  console.log("left bottom");
  this.move = this.ballLeft - (this.ballWidth / 2);
  this.moveTop = this.ballTop + this.ballWidth;
  this.getNextIndex();

};

myClass.prototype.moveRightBottom = function(){
  console.log("right bottom");
  this.move = this.ballLeft + (this.ballWidth / 2);
  this.moveTop = this.ballTop + this.ballWidth;
  this.getNextIndex();
};

myClass.prototype.moveLeftTop = function(){
  console.log("left top");
  this.move = this.ballLeft - (this.ballWidth / 2);
  this.moveTop = this.ballTop - this.ballWidth;
  this.getNextIndex();
};

myClass.prototype.moveFunc = function(e) {
  if(this.flag == 0) {
    var curCell = e.currentTarget;
    var index = parseInt(curCell.getAttribute("data-index"));
    // console.log("index: ", index);
    if(curCell.className.indexOf("active") == -1){
      curCell.className = curCell.className + " active";
      this.flag = 1;
      this.getPos();
      for(var j = 1; j <= 6; j++){
        if(j == 1){
          this.moveRightTop();
          if(this.items[this.pos].className.indexOf("active") == -1){
            this.setPos();
            if(this.moveTop < 0 || this.move == this.containerWidth) {
              console.log("You lose");
            }
            break;
          };
        }
        if(j == 2){
          this.moveRight();
          if(this.items[this.pos].className.indexOf("active") == -1){
            this.ball.style.left = this.move + "px";
            if(this.move == this.containerWidth) {
              console.log("You lose");
            }
            break;
          };
        }
        if(j == 3){
          this.moveRightBottom();
          if(this.items[this.pos].className.indexOf("active") == -1){
            this.setPos();
            if(this.moveTop == this.containerHeight) {
              console.log("You lose");
            }
            break;
          };
        }
        if(j == 4){
          this.moveLeftBottom();
          if(this.items[this.pos].className.indexOf("active") == -1){
            this.setPos();
            if(this.moveTop == this.containerHeight) {
              console.log("You lose");
            }
            break;
          };
        }
        if(j == 5){
          this.moveLeft();
          if(this.items[this.pos].className.indexOf("active") == -1){
            this.ball.style.left = this.move + "px";
            if(this.move < 0) {
              console.log("You lose");
            };
            break;
          };
        }
        if(j == 6){
          this.moveLeftTop();
          if(this.items[this.pos].className.indexOf("active") == -1){
            this.setPos();
            // console.log(this.move, this.moveTop);
            if(this.moveTop < 0 || this.move < 0) {
              console.log("You lose");
              // this.ball.className = this.ball.className + " hidden";
            }
          } else {
            console.log("You win");
          }
        }
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


