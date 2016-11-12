function myClass(id, ball) {

  this.container = document.getElementById(id);
  this.ball = document.getElementById(ball);
  this.containerWidth = this.container.offsetWidth;
  this.containerHeight = this.container.offsetHeight;
  this.ballLeft = 0;
  this.ballTop = 0;

  this.ballWidth = this.ball.offsetWidth;
  this.move = 0;
  this.moveTop = getCssProperty(this.ball, "top");
  this.items = this.container.getElementsByClassName("cell");
  this.itemsLength = this.items.length;
  this.flag = 0;
  
}

myClass.prototype.initialize = function() {
  var self = this;
  console.log(this.container);
  console.log(this.items);
  console.log(this.itemsLength);

  // Listen for a transition
  var transitionEvent = whichTransitionEvent();
  transitionEvent && ball.addEventListener(transitionEvent, function() {
    self.flag = 0;
    console.log('Transition complete!  This is the callback, no library needed!');
  });

  this.step();
}

myClass.prototype.getPos = function() {
  this.ballLeft = getCssProperty(this.ball, "left");
  this.ballTop = getCssProperty(this.ball, "top");
}

myClass.prototype.setPos = function() {
  this.ball.style.left = this.move + "px";
  this.ball.style.top = this.moveTop + "px";
}

myClass.prototype.step = function() {
  var self = this;

  var moveRight = function() {
    console.log("right");
    self.move = self.ballLeft + self.ballWidth;
    self.ball.style.left = self.move + "px";
    console.log(self.move, self.moveTop);
    if(self.move == self.containerWidth) {
      console.log("You lose");
    }
  }

  var moveLeft = function(){
    console.log("left");
    self.move = self.ballLeft - self.ballWidth;
    self.ball.style.left = self.move + "px";
    console.log(self.move, self.moveTop);
    if(self.move < 0) {
      console.log("You lose");
    }
  };

  // top right
  var moveRightTop = function(){
    console.log("right top");
    self.move = self.ballLeft + (self.ballWidth / 2);
    self.moveTop = self.ballTop - self.ballWidth;
    self.setPos();
    console.log(self.moveTop, self.moveTop);
    if(self.moveTop < 0 || self.move == self.containerWidth) {
      console.log("You lose");
    }
  };

  // bottom left
  var moveLeftBottom = function(){
    console.log("left bottom");
    self.move = self.ballLeft - (self.ballWidth / 2);
    self.moveTop = self.ballTop + self.ballWidth;
    self.setPos();
    console.log(self.move, self.moveTop);
    if(self.moveTop == self.containerHeight) {
      console.log("You lose");
    }
  };

  // bottom right
  var moveRightBottom = function(){
    console.log("right bottom");
    self.move = self.ballLeft + (self.ballWidth / 2);
    self.moveTop = self.ballTop + self.ballWidth;
    self.setPos();
    console.log(self.move, self.moveTop);
    if(self.moveTop == self.containerHeight) {
      console.log("You lose");
    }
  };

  var moveLeftTop = function(){
    console.log("left top");
    self.move = self.ballLeft - (self.ballWidth / 2);
    self.moveTop = self.ballTop - self.ballWidth;
    self.setPos();
    console.log(self.move, self.moveTop);
    if(self.moveTop < 0 || self.move < 0) {
      console.log("You lose");
      // self.ball.className = "ball hidden";
    }
  };
  
  var random = Math.floor((Math.random() * 6) + 1);

  for(var i = 0; i < this.itemsLength; i++) {
    this.items[i].addEventListener('click', function(e){
      if(self.flag == 0) {
        var curCell = e.currentTarget;
        if(curCell.className.indexOf("active") == -1){
          curCell.className = "cell active";
          self.flag = 1;
          self.getPos();
          
          switch(random) {
            case 1:
              moveRightTop();
              break;
            case 2:
              moveRight();
              break;
            case 3:
              moveRightBottom();
              break;
            case 4:
              moveLeftBottom();
              break;
            case 5:
              moveLeft();
              break;
            case 6:
              moveLeftTop();
              break;
          };
        };
      };
    }, false);
  }
  
};

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
  var game = new myClass("container", "ball");
  game.initialize();
}


