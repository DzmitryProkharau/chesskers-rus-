'use strict';

function GameChecker() {
  var pos1, pos2A, pos2B, pos2C, pos2D, playerArr, colorPlayer, step = 0, ind, attack = false;

function Board() {
  var self = this;
  var plane = document.getElementById('board');
  self.widthBoard = 'abcdefgh';
  var height = '12345678';
  self.arrPlayer1 = [];
  self.arrPlayer2 = [];

  (function layoutField(val) {
    if (val!==0) {
      for (var i = 0; i < 8; i++) {
        if (val%2 === 0) {
          i%2 === 0?plane.insertAdjacentHTML("beforeEnd", "<div class='cell notActive'></div>"):plane.insertAdjacentHTML("beforeEnd", "<div class='cell active'></div>");
        }else {
          i%2 === 0?plane.insertAdjacentHTML("beforeEnd", "<div class='cell active'></div>"):plane.insertAdjacentHTML("beforeEnd", "<div class='cell notActive'></div>");
        }
      }
      val-=1;
      layoutField(val);
    }
  }(8));

  self.arrField = document.querySelectorAll('.active');

  (function coordinatsCell() {
    var x = 4;
    var l = 1;
    var h = 8;
    for (var i = 0; i < self.arrField.length; i++) {
      if (i === x) {
        x+=4;
        h-=1;
      }
      self.arrField[i].id = i;
      self.arrPlayer1[i] = [self.widthBoard.charAt(l)+h];
      self.arrPlayer2.splice(0, 0, [self.widthBoard.charAt(l)+h]);
      l+=2;
      if (l === 8) {
        l = 1;
      }
      if (l === 9) {
        l = 0;
      }
    }
  })();

  (function startPosition() {
    for (var i = 0; i < self.arrField.length; i++) {
      if (i < 12) {
        var checker = new Checker();
        checker.color = 'dark';
        checker.status = 'simple';
        self.arrPlayer1[i].push(checker);
        self.arrPlayer2[i].push(checker);
        var child = document.createElement('div');
        child.className = 'checkers dark';
        self.arrField[i].appendChild(child);
      }
      if (i > 19) {
        var checker = new Checker();
        checker.color = 'white';
        checker.status = 'simple';
        self.arrPlayer1[i].push(checker);
        self.arrPlayer2[i].push(checker);
        var child = document.createElement('div');
        child.className = 'checkers white';
        self.arrField[i].appendChild(child);
      }
    }
  })();

  self.clickEvent = function ( ev, func ) {
    return ev.addEventListener( 'click', func );
  };

  self.idStepSimple = function(e) {
    if (attack === false) {
      console.log("id***step");
      var id;
      if (e.target.id === "") {
        id = e.target.offsetParent.id;
      }else {
        id = e.target.id;
      }
      checker.selectChecker(+id);
    }
  };
  self.attackSimple = function (e) {
    if (attack === true) {
      // console.log('id attack***');
      var id;
      if (e.target.id === "") {
        id = e.target.offsetParent.id;
      }else {
        id = e.target.id;
      }
      checker.selectAttackSimple(+id);
    }
  };

}//board

function Checker() {
  var self = this;
  var status;
  var color;
  var name;

  self.selectChecker = function (arg) {
    if (attack === false) {
      if (arg !== null) {
        if (pos1 === undefined) {
          if (playerArr[arg].length === 2&&playerArr[arg][1].color === colorPlayer) {//???????
            var id = playerArr[arg][0];
            var x = board.widthBoard.indexOf(id.charAt(0));
            pos2A = board.widthBoard.charAt(x-1)+(+id.charAt(1)+1);
            pos2B = board.widthBoard.charAt(x+1)+(+id.charAt(1)+1);
            for (var i = 0; i < playerArr.length; i++) {
              if (playerArr[i][0] === pos2A && !playerArr[i][1]||
                playerArr[i][0] === pos2B && !playerArr[i][1]) {
                  pos1 = arg;
                  document.getElementById(pos1).style.backgroundColor = 'orange'
              }
            }
          }
        }else {
          if (!playerArr[arg][1]&&(playerArr[arg][0] === pos2A||playerArr[arg][0] === pos2B)) {
            var elem = document.getElementById(pos1);
            elem.removeChild(elem.firstChild);
            var child = document.createElement('div');
            child.className = 'checkers '+colorPlayer;
            document.getElementById(arg).appendChild(child);
            document.getElementById(pos1).style.backgroundColor = '#494949';
            x = board.arrPlayer1[pos1].pop();
            board.arrPlayer1[arg].push(x);
            x = board.arrPlayer2[pos1].pop();
            board.arrPlayer2[arg].push(x);
            pos2A = undefined;pos2B = undefined;
            pos1 = undefined; arg = null; step++;
            game.checkerAttack();
          }else {
            document.getElementById(pos1).style.backgroundColor = '#494949'
            pos1 = undefined;arg = null;
          }
        }
      }else if(arg === null){
        if (pos1 === undefined) {
          if (step%2 === 0) {
            playerArr = board.arrPlayer1;
            colorPlayer = 'white';
          }
          if (step%2 !== 0) {
            playerArr = board.arrPlayer2;
            colorPlayer = 'dark';
          }
          for (var i = 0; i < board.arrField.length; i++) {
            board.clickEvent(board.arrField[i], board.idStepSimple);
          }
        }
      }


    }
  };

  self.selectAttackSimple = function (arg) {
    console.log('*** start attack ***');
    if (arg !== null) {console.log('null');
      if (pos1 === undefined) {console.log('pos1 und');
        if (playerArr[arg][1]&&playerArr[arg][1].color === colorPlayer) {
          this.id = playerArr[arg][0];
          self.x = board.widthBoard.indexOf(this.id.charAt(0));
          (function checking(a, b) {
            pos2A = board.widthBoard.charAt(self.x-a)+(+self.id.charAt(1)+b);
            pos2B = board.widthBoard.charAt(self.x+a)+(+self.id.charAt(1)+b);
            pos2C = board.widthBoard.charAt(self.x-a)+(+self.id.charAt(1)-b);
            pos2D = board.widthBoard.charAt(self.x+a)+(+self.id.charAt(1)-b);
            if (a === 1) {
              for (var j = 0; j < playerArr.length; j++) {
                  if ((playerArr[j][1]&&playerArr[j][1].color !== colorPlayer)&&(playerArr[j][0] === pos2A
                    ||playerArr[j][0] === pos2B
                    ||playerArr[j][0] === pos2C
                    ||playerArr[j][0] === pos2D)) {
                      checking(2, 2);
                  }
                }
              }
              if (a === 2) {
                for (var l = 0; l < playerArr.length; l++) {
                  if (!playerArr[l][1]
                    &&(playerArr[l][0] === pos2A
                    ||playerArr[l][0] === pos2B
                    ||playerArr[l][0] === pos2C
                    ||playerArr[l][0] === pos2D)) {
                      pos1 = arg;console.log(pos1);
                      document.getElementById(pos1).style.backgroundColor = 'orange';
                  }
                }
              }
          }(1, 1));
        }
      }else {
        if (!playerArr[arg][1]
          &&playerArr[arg][0] === pos2A
          ||playerArr[arg][0] === pos2B
          ||playerArr[arg][0] === pos2C
          ||playerArr[arg][0] === pos2D) {console.log(self.x);
          (function checking(a, b) {
            console.log(pos2A+' '+pos2B+' '+pos2C+' '+pos2D);
            pos2A = board.widthBoard.charAt(self.x-a)+(+self.id.charAt(1)+b);
            pos2B = board.widthBoard.charAt(self.x+a)+(+self.id.charAt(1)+b);
            pos2C = board.widthBoard.charAt(self.x-a)+(+self.id.charAt(1)-b);
            pos2D = board.widthBoard.charAt(self.x+a)+(+self.id.charAt(1)-b);
            console.log(pos2A+' '+pos2B+' '+pos2C+' '+pos2D);
          }(1, 1));
          for (var i = 0; i < playerArr.length; i++) {
            if (playerArr[i][1]&&playerArr[i][1].color !== colorPlayer
              &&(playerArr[i][0] === pos2A
              ||playerArr[i][0] === pos2B
              ||playerArr[i][0] === pos2C
              ||playerArr[i][0] === pos2D)) {
                var duff = i;
                var elem1 = document.getElementById(duff);
                var elem2 = document.getElementById(pos1);
                elem1.removeChild(elem1.firstChild);
                elem2.removeChild(elem2.firstChild);
                var child = document.createElement('div');
                child.className = 'checkers '+colorPlayer;
                document.getElementById(arg).appendChild(child);
                document.getElementById(pos1).style.backgroundColor = '#494949';

                var z = board.arrPlayer1[pos1].pop();
                board.arrPlayer1[arg].push(z);
                board.arrPlayer1[duff].pop();

                var t = board.arrPlayer2[pos1].pop();
                board.arrPlayer2[arg].push(t);
                board.arrPlayer2[duff].pop();
                console.log(board.arrPlayer1);
                console.log(board.arrPlayer2);
                pos1 = undefined; pos2A = undefined;
                pos2B = undefined; pos2C = undefined;
                pos2D = undefined;
                attack = false;
                step++;
                game.checkerAttack();
            }
          }
        }
      }
    }
    if (pos1 === undefined) {console.log('selector attac of null !!!');
    for (var i = 0; i < board.arrField.length; i++) {
      board.clickEvent(board.arrField[i], board.attackSimple);
    }
    }

  };

}

var board = new Board();
var checker = new Checker();



var self = this;
self.checkerAttack = function () {
  if (step%2 === 0) {
    playerArr = board.arrPlayer1;
    colorPlayer = "white";
  }
  if (step%2 !== 0) {
    playerArr = board.arrPlayer2;
    colorPlayer = "dark";
  }
  console.log(colorPlayer);
  for (var i = 0; i < playerArr.length; i++) {
    try {
      if (playerArr[i][1].color === colorPlayer) {
        this.id = playerArr[i][0];
        self.x = board.widthBoard.indexOf(this.id.charAt(0));

        (function checking(a, b) {
          pos2A = board.widthBoard.charAt(self.x-a)+(+self.id.charAt(1)+b);
          pos2B = board.widthBoard.charAt(self.x+a)+(+self.id.charAt(1)+b);
          pos2C = board.widthBoard.charAt(self.x-a)+(+self.id.charAt(1)-b);
          pos2D = board.widthBoard.charAt(self.x+a)+(+self.id.charAt(1)-b);
          if (a === 1) {
            for (var j = 0; j < playerArr.length; j++) {
                if ((playerArr[j][1]&&playerArr[j][1].color !== colorPlayer)
                  &&(playerArr[j][0] === pos2A
                  ||playerArr[j][0] === pos2B
                  ||playerArr[j][0] === pos2C
                  ||playerArr[j][0] === pos2D)) {
                  checking(2, 2);
                }
              }
            }
            if (a === 2) {
              for (var l = 0; l < playerArr.length; l++) {
                if (!playerArr[l][1]
                  &&(playerArr[l][0] === pos2A
                  ||playerArr[l][0] === pos2B
                  ||playerArr[l][0] === pos2C
                  ||playerArr[l][0] === pos2D)) {console.log('длжна бить '+i);
                    attack = true;
                }
              }
            }
        }(1, 1));

      }

    } catch (e) {

    } finally {

    }
  }

  if (attack === true) {console.log('нашел аттаку');
    checker.selectAttackSimple(null);
  }else {
    console.log('dont have attack !!!');
    checker.selectChecker(null);
  }
}

}//game

// pos2A = board.widthBoard.charAt(x-1)+(+id.charAt(1)+1);
// pos2B = board.widthBoard.charAt(x+1)+(+id.charAt(1)+1);
// pos2C = board.widthBoard.charAt(x-1)+(+id.charAt(1)-1);
// pos2D = board.widthBoard.charAt(x+1)+(+id.charAt(1)-1);












var game = new GameChecker();
game.checkerAttack();
