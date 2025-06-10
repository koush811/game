const stage = document.getElementById("stage");
const masutemplate = document.getElementById("masutemplate");
let stoneStateList = [];
const black = 1; 
const white = 2;
let currentColor = black;

const getReversibleStones = (index) => {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];
  const result = [];
  const myColor = currentColor;
  const enemyColor = myColor === black ? white : black;
  const x = index % 8;
  const y = Math.floor(index / 8);
  for (const [dx, dy] of directions) {
    let nx = x + dx;
    let ny = y + dy;
    let tmp = [];
    while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
      const ni = ny * 8 + nx;
      if (stoneStateList[ni] === enemyColor) {
        tmp.push(ni);
      } 
      else if (stoneStateList[ni] === myColor) {
        if (tmp.length > 0) result.push(...tmp);
        break;
      } 
      else {
        break;
      }
      nx += dx;
      ny += dy;
    }
  }
  return result;
};
const updateBoard = () => {
  const stones = document.querySelectorAll('.stone');
  for (let i = 0; i < 64; i++) {
    stones[i].setAttribute("data-state", stoneStateList[i]);
  }
};

const onClickmasu = (index) => {
  if (stoneStateList[index] !== 0) {
    masuhantei.textContent="置けません";
    setTimeout(function() {
      masuhantei.textContent="";
    }, 1500);
    return;
  }
  const reversible = getReversibleStones(index);
  if (reversible.length === 0) {
    masuhantei.textContent="置けません";
    setTimeout(function() {
      masuhantei.textContent="";
    }, 1500);
    return;
  }

  stoneStateList[index] = currentColor;

  for (const idx of reversible) {
    stoneStateList[idx] = currentColor;
  }
  updateBoard();
  currentColor = currentColor === 1 ? 2 : 1;
  checkGameEnd();
  updateturn();
  colorcanput();
};

const createmasu = () => {
  for (let i = 0; i < 64; i++) {
    const masu = masutemplate.content
      ? masutemplate.content.cloneNode(true).children[0]
      : masutemplate.cloneNode(true);
    masu.removeAttribute("id");
    stage.appendChild(masu);
    const stone = masu.querySelector('.stone');
    let defaultState;
    if (i == 27 || i == 36) {
      defaultState = 1;
    } else if (i == 28 || i == 35) {
      defaultState = 2;
    } else {
      defaultState = 0;
    }
    stone.setAttribute("data-state", defaultState);
    stoneStateList.push(defaultState);
    masu.addEventListener('click', () => {
      onClickmasu(i);
    })
  }
};

function resetBoard() {
  stoneStateList = [];
  stage.innerHTML = "";
  createmasu();
  currentColor = 1;
  updateturn();
  kekka.textContent = "";  
  colorcanput();
}

window.onload = () => {
  createmasu();
  document.getElementById('resetBtn').addEventListener('click', resetBoard);
  updateturn();
  checkGameEnd();
  colorcanput();
};

function canPutStone(color) {
  const tmp = currentColor;
  currentColor = color;
  for (let i = 0; i < 64; i++) {
    if (stoneStateList[i] === 0 && getReversibleStones(i).length > 0) {
      currentColor = tmp;
      return true;
      }
    }
  currentColor = tmp;
  return false;
}

document.getElementById('passBtn').addEventListener('click', () => {
  if (canPutStone(currentColor)) {
    masuhantei.textContent="置ける場所があります。パスできません。";
    setTimeout(function() {
      masuhantei.textContent="";
    }, 1500);
    return;
    return;
  }
  currentColor = currentColor === 1 ? 2 : 1;
  updateBoard();
  checkGameEnd();
  updateturn();
  colorcanput();
  masuhantei.textContent="パスしました。相手の番です。";
  setTimeout(function() {
      masuhantei.textContent="";
    }, 1500);
    return;
});

function checkGameEnd() {
  if (!canPutStone(1) && !canPutStone(2)) {
    let blackcount = 0;
    let whitecount = 0;
    for (let i = 0; i < 64; i++) {
      if (stoneStateList[i] === black) blackcount++;
      if (stoneStateList[i] === white) whitecount++;
    }
    let message = `黒: ${blackcount}個\n白: ${whitecount}個\n`;
    if (blackcount > whitecount) {
      message += "黒の勝ち！";
    } else if (whitecount > blackcount) {
      message += "白の勝ち！";
    } else {
      message += "引き分け！";
    }
    kekka.textContent=message;
  }
}

function updateturn(){
  const turn = document.getElementById('turn');
  if(currentColor == black){
    turn.textContent="黒";
  }else{
    turn.textContent="白";
  }
}

function colorcanput() {
  const stones = document.querySelectorAll('.masu');
  stones.forEach(stone => stone.classList.remove('can-put'));
  for (let i = 0; i < 64; i++) {
    if (stoneStateList[i] === 0 && getReversibleStones(i).length > 0) {
      stones[i].classList.add('can-put');
      alert
    }
  }
}
