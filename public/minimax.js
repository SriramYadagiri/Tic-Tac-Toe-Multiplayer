function bestMove() {
  // AI to make its turn
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // Is the spot available?
      if (board[i][j] == '') {
        board[i][j] = ai;
        let score = minimax(board, false);
        board[i][j] = '';
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }
  board[move.i][move.j] = ai;
}
  
function eval(board) {
    var winner = checkWinner(board);
    if(winner !== null) {
      if(winner == "tie") {
        return 0;
      } else {
        var available = 0;
        for(var i = 0; i<3; i++) {
          for(var j = 0; j<3; j++) {
            if(board[i][j] == '') {
              available++;
            }
          }
        }
        if(winner == ai) {
          return 1*(available+1);
        } else if(winner == human) {
          return -1*(available+1);
        }
      }
    } else {
      return null;
    }
}
  
function minimax(board, isMax) {
  var evalualtion = eval(board);
  if(evalualtion !== null) {
      return evalualtion;
  }

  if (isMax) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == '') {
          board[i][j] = ai;
          let score = minimax(board, false);
          board[i][j] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == '') {
          board[i][j] = human;
          let score = minimax(board, true);
          board[i][j] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}  