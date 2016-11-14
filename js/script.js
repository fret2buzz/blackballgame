

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
  this.possibleMovesButton = document.querySelectorAll('#' + buttons +' .possible-moves')[0];
  this.end = 0;
  this.stop = 0;
  this.row = 11;
  this.pos = 60;
  this.prev = this.pos;
  this.newArray = [];

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
  this.possibleMovesButton.addEventListener('click', this.possibleMoves.bind(this), false);
  this.ball.setAttribute("data-pos", this.pos);
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
  this.ball.setAttribute("data-pos", this.pos);
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

myClass.prototype.getPos = function() {
  this.ballLeft = getCssProperty(this.ball, "left");
  this.ballTop = getCssProperty(this.ball, "top");
  console.log(this.ballLeft, this.ballTop);
}

myClass.prototype.setPos = function(a) {
  if(this.stop == 0) {
    console.log(a);
    this.containerPositionLeft = this.container.getBoundingClientRect().left;
    this.containerPositionTop = this.container.getBoundingClientRect().top;
    var cellPosition = this.items[a].getBoundingClientRect();
    this.x = cellPosition.left - this.containerPositionLeft;
    this.y = cellPosition.top - this.containerPositionTop;
    this.ball.setAttribute("data-pos", a);
  } else {
    this.ball.setAttribute("data-pos", "");
  }
  
  this.ball.style.left = this.x + "px";
  this.ball.style.top = this.y + "px";
}

// myClass.prototype.prevFunc = function(){
//   if(this.items[this.pos].className.indexOf("active") > 0){
//     this.pos = this.prev;
//     this.transitionFlag = 0;
//   }
// };

myClass.prototype.loseFunc = function(a){
  var loseFuncRight = ((a + 1) % this.row == 0);
  var loseFuncLeft = (a % this.row == 0 || a == 0);
  var loseFuncTop = (a / this.row < 1);
  var loseFuncBottom = ((a + 1) / this.row > (this.row - 1));

  if(this.end == 1) {
    console.log("You lose");
    this.stop = 1;

    this.getPos();

    if(loseFuncRight){
      this.x = this.ballLeft + this.ballWidth;
    }
    if(loseFuncLeft){
      this.x = this.ballLeft - this.ballWidth;
    }
    if(loseFuncTop){
      this.y = this.ballTop - this.ballWidth;
    }
    if(loseFuncBottom){
      this.y = this.ballTop + this.ballWidth;
    }
    this.ball.className = this.ball.className + " hidden";

  } else {
    // getting the last row or col. this is the end
    // if(dir == "right"){
      if(loseFuncRight){
        console.log("hor last");
        this.end = 1;
      };
    // }
    // if(dir == "left"){
      if(loseFuncLeft){
        console.log("hor first");
        this.end = 1;
      };
    // }
    // if(dir.indexOf("top") > 0){
      if(loseFuncTop){
        console.log("vert first");
        this.end = 1;
      };
    // }
    // if(dir.indexOf("bottom") > 0){
      if(loseFuncBottom){
        console.log("vert last");
        this.end = 1;
      };
    // }
  }
}


myClass.prototype.getNextIndex = function(dir){
  if(this.end == 0) {

    var parentIndex = parseInt(this.items[this.pos].parentNode.getAttribute("data-index"));
    // console.log("------------------------------------");
    // console.log("parentIndex", parentIndex);

    if(dir == "left"){
      this.prev = this.pos;
      this.pos = this.pos - 1;
      // this.prevFunc();
    }
    if(dir == "right"){
      this.prev = this.pos;
      this.pos = this.pos + 1;
      // this.prevFunc();
    }
    if(dir == "left top"){
      this.prev = this.pos;
      if(parentIndex % 2 == 0){
        this.pos = this.pos - this.row - 1;
      } else {
        this.pos = this.pos - this.row;
      }
      // this.prevFunc();
    }
    if(dir == "right top"){
      this.prev = this.pos;
      if(parentIndex % 2 == 0){
        this.pos = this.pos - this.row;
      } else {
        this.pos = this.pos - this.row + 1;
      }
      // this.prevFunc();
    }
    if(dir == "left bottom"){
      this.prev = this.pos;
      if(parentIndex % 2 == 0){
        this.pos = this.pos + this.row - 1;
      } else {
        this.pos = this.pos + this.row;
      }
      // this.prevFunc();
    }
    if(dir == "right bottom"){
      this.prev = this.pos;
      if(parentIndex % 2 == 0){
        this.pos = this.pos + this.row;
      } else {
        this.pos = this.pos + this.row + 1;
      }
      // this.prevFunc();
    }
    // console.log("this.pos", this.pos);

  }
};

myClass.prototype.move = function(a) {
  this.loseFunc(a);
  this.setPos(a);
  // console.log(a);
}

myClass.prototype.moveFunc = function(e) {
   
  if(this.transitionFlag == 0 && this.stop == 0) {
    
    this.pos = parseInt(this.ball.getAttribute("data-pos"));
    var curCell = e.currentTarget;
    // var index = parseInt(curCell.getAttribute("data-index"));
    // console.log("index: ", index);
    if(curCell.className.indexOf("active") == -1){
      curCell.className = curCell.className + " active";
      this.transitionFlag = 1;

      this.possibleMoves();
      console.log(this.newArray);
      if(this.newArray.length == 0){
        console.log("You won");
        this.stop = 1;
      }

      console.log("this.prev: ", this.prev);
      this.move(this.newArray[Math.floor(Math.random() * this.newArray.length)]);

    };
  };
}

myClass.prototype.check = function(a){
  this.pos = parseInt(this.ball.getAttribute("data-pos"));
  this.getNextIndex(a);
  
  if(this.items[this.pos].className.indexOf("active") == -1){
    // this.items[this.pos].className = this.items[this.pos].className + " punk";
    this.newArray.push(this.pos);
  }
};

myClass.prototype.possibleMoves = function(e) {
  // console.log(this.pos);
  for(var i = 0; i < this.itemsLength; i++) {
    // this.items[i].className = this.items[i].className.replace(" punk", "");
  }
  
  if(this.end == 0) {
    this.newArray = [];
    for(var i = 1; i < 7; i++){
      switch(i){
        case 1:
          this.check("left");
          break;
        case 2:
          this.check("right");
          break;
        case 3:
          this.check("left top");
          break;
        case 4:
          this.check("right top");
          break;
        case 5:
          this.check("left bottom");
          break;
        case 6:
          this.check("right bottom");
          break;
      }
    }
    
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


