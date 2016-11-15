function myClass(id, buttons) {
  this.container = document.getElementById(id);
  this.ball = document.querySelectorAll('#' + id +' .ball')[0];
  this.ballWidth = this.ball.offsetWidth;
  this.initialX = getCssProperty(this.ball, "left");
  this.initialY = getCssProperty(this.ball, "top");
  this.items = this.container.getElementsByClassName("cell");
  this.itemsLength = this.items.length;
  this.lines = this.container.getElementsByClassName("line");
  this.linesLength = this.lines.length;
  this.resetButton = document.querySelectorAll('#' + buttons +' .reset')[0];
  this.scoreYou = document.getElementById("scoreYou");
  this.scoreDot = document.getElementById("scoreDot");
  this.scoreYouData = 0;
  this.scoreDotData = 0;
  this.restarting = 1;
  this.win;
}

myClass.prototype.initialize = function() {
  var self = this;
  this.reset();
  // Listen for a transition
  var transitionEvent = whichTransitionEvent();
  transitionEvent && ball.addEventListener(transitionEvent, function() {
    self.transitionFlag = 0;
    // console.log('Transition complete!  This is the callback, no library needed!');
  });

  for(var i = 0; i < this.itemsLength; i++) {
    this.items[i].addEventListener('click', this.moveFunc.bind(this), false);
  }
  for(var k = 0; k < this.linesLength; k++) {
    this.lines[k].setAttribute('data-index', k);
  }
  
  this.resetButton.addEventListener('click', this.reset.bind(this), false);
}

myClass.prototype.restart = function() {
  var self = this;
  this.restarting = 0;
  setTimeout(function(){

    self.restarting = 1;
    self.reset();

  }, 1500);
}

myClass.prototype.reset = function() {
  if(this.restarting == 1) {
    if(this.win == 1) {
      this.scoreYouData++;
      this.scoreYou.innerHTML = this.scoreYouData;
    }
    if(this.win == 0) {
      this.scoreDotData++;
      this.scoreDot.innerHTML = this.scoreDotData;
    }
    this.containerWidth = this.container.offsetWidth;
    this.containerHeight = this.container.offsetHeight;
    this.containerPositionLeft = 0;
    this.containerPositionTop = 0;
    this.end = 0;
    this.stop = 0;
    this.row = 11;
    this.pos = 60;
    this.map = [];
    this.mapItem = {};
    this.path = null;
    this.movePoint = 0;
    this.endPoints = [];
    this.filtered = [];
    this.min = 1000;
    this.transitionFlag = 0;
    this.ballLeft = 0;
    this.ballTop = 0;
    this.x = 0;
    this.y = 0;
    this.bestPath;
    this.nullCounter;
    this.win = 0;

    for(var i = 0; i < this.itemsLength; i++) {
      this.items[i].className = "cell";
    }
    this.randomActive();

    this.ball.className = "ball";
    this.ball.style.left = this.initialX + "px";
    this.ball.style.top = this.initialY + "px";
    this.ball.setAttribute("data-pos", this.pos);
    this.findEndPoints();
  }
}

myClass.prototype.findEndPoints = function() {
  for(v = 1; v < (this.row - 1); v++){
    // console.log("v", v);
    this.endPoints.push(v);
  }
  for(b = (((this.row - 1)*this.row) + 1); b < ((this.row*this.row) - 1); b++){
    // console.log("b", b);
    this.endPoints.push(b);
  }
  for(a = 0; a <= (this.row * (this.row - 1)); a = a + this.row){
    // console.log("a", a);
    this.endPoints.push(a);
  }
  for(x = (this.row - 1); x <= ((this.row*this.row) - 1); x = x + this.row){
    // console.log("x", x);
    this.endPoints.push(x);
  }
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
}

myClass.prototype.setPos = function(a) {
  if(this.stop == 0) {

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

myClass.prototype.loseFunc = function(a){
  var self = this;
  // console.log(a);
  var loseFuncRight = ((a + 1) % this.row == 0);
  var loseFuncLeft = (a % this.row == 0 || a == 0);
  var loseFuncTop = (a / this.row < 1);
  var loseFuncBottom = ((a + 1) / this.row > (this.row - 1));

  if(this.end == 1) {
    console.log("You lose");
    
    this.stop = 1;
    this.win = 0;

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

    this.restart();

  } else {
    // getting the last row or col. it will be the end
    if(loseFuncRight || loseFuncLeft || loseFuncTop || loseFuncBottom){
      this.end = 1;
    };
  }
}

myClass.prototype.moveFunc = function(e) {
  var self = this;
  if(this.transitionFlag == 0 && this.stop == 0) {

    var curCell = e.currentTarget;
    if(curCell.className.indexOf("active") == -1){
      curCell.className = curCell.className + " active";
      this.transitionFlag = 1;
      this.pos = parseInt(this.ball.getAttribute("data-pos"));
      if(this.end == 0){
        this.min = 1000;
        
        this.filtered = [];
        this.nullCounter = 0;
        this.filtered = this.endPoints.filter(function(p){
          return self.items[p].className.indexOf("active") == -1;
        });

        this.possibleMoves();
        
        for(t = 0; t < this.filtered.length; t++){
          this.bestPath = graph.findShortestPath('cell-' + this.pos, 'cell-' + this.filtered[t]);
           // console.log("this.bestPath", this.bestPath);
          if(this.bestPath != null) {
            if(this.bestPath.length < this.min){
              this.min = this.bestPath.length;
              this.path = this.bestPath;
            }
          } else {
            this.nullCounter++;
          }
        }
      }

      if(this.nullCounter == this.filtered.length){
        console.log("You won");
        this.stop = 1;
        this.win = 1;
        this.restart();
      }

      if(this.path != null){
        this.movePoint = parseInt(this.path[1].split("-")[1]);
        this.loseFunc(this.movePoint);
        this.setPos(this.movePoint);
      }
    };
  };
}

myClass.prototype.possibleMoves = function() {
  if(this.end == 0){
    for(var i = 0; i < this.itemsLength; i++){
      this.mapItem = {};
      var position = 0;
      var parentIndex = parseInt(this.items[i].parentNode.getAttribute("data-index"));
      for(z = 1; z < 7; z++){
        // left
        if(z == 1){
          position = i - 1;
        }
        // right
        if(z == 2){
          position = i + 1;
        }
        // left top
        if(z == 3){
          if(parentIndex % 2 == 0){
            position = i - this.row - 1;
          } else {
            position = i - this.row;
          }
        }
        // right top
        if(z == 4){
          if(parentIndex % 2 == 0){
            position = i - this.row;
          } else {
            position = i - this.row + 1;
          }
        }
        // left bottom
        if(z == 5){
          if(parentIndex % 2 == 0){
            position = i + this.row - 1;
          } else {
            position = i + this.row;
          }
        }
        // right bottom
        if(z == 6){
          if(parentIndex % 2 == 0){
            position = i + this.row;
          } else {
            position = i + this.row + 1;
          }
        }

        if(this.items[position] != undefined){
          if(this.items[position].className.indexOf("active") == -1){
            this.mapItem["cell-"+position] = 1;
          }
        }
      }
      this.map["cell-"+i] = this.mapItem;
    }

    graph = new Graph(this.map);
  }
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

