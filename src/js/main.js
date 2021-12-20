(function () {
  'use strict';

  const btnReset = document.querySelector('.btn-reset');
  const btnStart = document.querySelector('.btn-start');
  const stepsSelect = document.querySelector('.steps-select');
  const taskBox = document.getElementById('task-box');
  const repeatBox = document.getElementById('repeat-box');
  const blockCongrats = document.querySelector('.section-congrats');

  let randomValuesArray, currentStep, numberOfSteps, numberOfSelectedBoxes;

  Array.prototype.isEqual = function(array) {
    return array instanceof Array && JSON.stringify(this) === JSON.stringify(array) ;
  }

  const sleep = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

  const setRandomArray = (length) => {
    let arr = [];

    while(arr.length < length){
      const curElem = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
      !arr.length || (arr.length && !arr[arr.length - 1].isEqual(curElem)) ? arr.push(curElem) : null;
    }

    return arr;
  }

  const initGame = () => {
    randomValuesArray = [];
    currentStep = 1;
    numberOfSteps = 0;

    btnStart.addEventListener("click", startGame);
    btnReset.addEventListener("click", resetGame);
    blockCongrats.addEventListener("click", function(){
      this.classList.remove('visible');
      resetGame();
    });
  }

  const resetGame = () => {
    btnReset.classList.add('hidden');
    btnStart.classList.remove('hidden');

    stepsSelect.value = 1;
    stepsSelect.classList.remove('disabled');

    randomValuesArray = [];
    currentStep = 1;
    numberOfSteps = 0;

    repeatBox.removeEventListener('click', repeatClickEvent);
  }

  const startGame = () => {
    btnStart.classList.add('hidden');
    stepsSelect.classList.add('disabled');
    btnReset.classList.remove('hidden');

    numberOfSteps = stepsSelect.options[stepsSelect.selectedIndex].value;
    randomValuesArray = setRandomArray(numberOfSteps);

    playGame();
  }

  const playGame = async () => {
    numberOfSelectedBoxes = 0;

    if (currentStep <= numberOfSteps) {
        for(let i = 0; i < currentStep; i++) {
          const coordinate = randomValuesArray[i];
          const cell = taskBox.rows[coordinate[0]].cells[coordinate[1]];

          cell.classList.add('shine');
          await sleep(500).then(() => cell.classList.remove('shine'));
        }

        repeatBox.addEventListener('click', repeatClickEvent);
    } else {
      blockCongrats.classList.add('visible');
    }
  }

  const repeatClickEvent = async (e) => {
    const cell = e.target.closest('td');
    if (!cell) {return;}

    var selectedCell = [cell.parentElement.rowIndex, cell.cellIndex];
    repeatBox.classList.add('disabled'); //prevent dblclick

    if (randomValuesArray[numberOfSelectedBoxes].isEqual(selectedCell)) {
      numberOfSelectedBoxes++;

      cell.classList.add('shine');
      await sleep(300).then(() => {
        cell.classList.remove('shine');
      })

      if (currentStep === numberOfSelectedBoxes) {
        currentStep++;
        repeatBox.removeEventListener('click', repeatClickEvent);

        sleep(1000).then(() => {
          playGame();
        })
      }
    } else {
      repeatBox.removeEventListener('click', repeatClickEvent);
      currentStep !== 1 ? currentStep-- : null;

      cell.classList.add('error');
      await sleep(300).then(() => {
        cell.classList.remove('error');
      })

      sleep(1000).then(() => {
        playGame();
      })
    }

    repeatBox.classList.remove('disabled');
  }

  initGame();

})();