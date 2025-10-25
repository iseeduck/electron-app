// variables
const cols = 10;
const rows = 10;

let money = 100;
let seeds = []; // makes queue of seeds
let activeFires = [];
let burningCells = [];
let isWatering = false;
let inventory = {
  grapes: 0,
  strawberries: 0,
  lettuce: 0,
  tomato: 0
};

const fieldDiv = document.getElementById('field');
const moneyDisplay = document.getElementById('money-display');

const field = Array.from({length: cols}, () => Array.from({length: rows}, () => null));

function updateMoney(){
  moneyDisplay.textContent = `Money: $${money}`;
}

  let isOpen = false;
//toggles shop menu visibility
 document.addEventListener('DOMContentLoaded', function() {

        var myButton = document.getElementById('farm-stand'); // Assign an ID to your button
        if (myButton) {
            myButton.addEventListener('click', function() {
                // Your event handler logic here
                document.getElementById('shop-menu').classList.toggle('hidden');
                console.log('Button clicked!');
                isOpen = !isOpen;
            });
        }
    });
  
  let uOpen = false;
   document.addEventListener('DOMContentLoaded', function() {

        var myButton = document.getElementById('sell-stand'); // Assign an ID to your button
        if (myButton) {
            myButton.addEventListener('click', function() {
                // Your event handler logic here
                document.getElementById('sell-menu').classList.toggle('hidden');
                console.log('Button clicked!');
                uOpen = !uOpen;
                renderSellOptions();
            });
        }
    });

    document.getElementById('tomatoes').addEventListener('click', () => {
      if (isOpen) {
        buySeed('tomato');
      }
    });
    document.getElementById('strawberries').addEventListener('click', () => {
      if (isOpen) {
        buySeed('strawberries');

      }
    });
   document.getElementById('grapes').addEventListener('click', () => {
    if (isOpen) {
      buySeed('grapes');
     }
   });
   document.getElementById('lettuce').addEventListener('click', () => {
    if (isOpen) {
      buySeed('lettuce');
    }
   });

      
const pondElement = document.getElementById('pond');
const containerElement = document.getElementById('container');

pondElement.addEventListener('click', () => {
  isWatering = !isWatering; 
  containerElement.classList.toggle('watering-cursor', isWatering);
  pondElement.classList.toggle('active', isWatering);
  
});


let fireAnimationState= 0;
setInterval(() => {
  // This toggelest the state to alternate between one and zero
  fireAnimationState = (fireAnimationState + 1) % 2;
  // Find all elements that currentl have the fire class
  const fireElements = document.querySelectorAll('.fire');
  fireElements.forEach(element => {
    if (fireAnimationState === 0) {
      element.style.backgroundImage = "url(images/Fire part one.png)";
    } else {
      element.style.backgroundImage = "url(images/fire part two.png)";
    }
  })
}, 400); // Animation frame changes every 0.4 seconds


function buySeed(type) {
    if (money >= 5) {
      seeds.push({type, stage: 0});
      money -= 5;
      console.log("seed was bought");
      updateMoney();
    }
  }

  function updateInventoryUI(){
    const inv = inventory;
    document.getElementById('inventory-display').textContent = `Inventory: Grape(s): ${inv.grapes} | Lettuce: ${inv.lettuce} | Tomato(es): ${inv.tomato} | Strawberries: ${inv.strawberries}`;

  }

function renderSellOptions(){
  const container = document.getElementById('sell-options');
  container.innerHTML = '';
  for (const crop in inventory) {
    const amount = inventory[crop];
    if (amount > 0) {
      const btn = document.createElement('button');
      btn.textContent = `Sell 1 ${crop} ($10)`;
      btn.onclick = () =>{
        inventory[crop] --;
        money += 10;
        updateMoney();
        updateInventoryUI();
        renderSellOptions(); //refreshes the ui
      }
      container.appendChild(btn); //appned the button
    }
    else {
        const label = document.createElement('div');
        label.textContent = `no ${crop} to sell`;
        container.appendChild(label);
      }
  }
}
function renderField(){
  fieldDiv.innerHTML = ''; //clears existing grid

  // makes grid :)
  for (let col = 0; col < cols; col++) {
    const colDiv = document.createElement('div');
    colDiv.classList.add('col');

    for (let row = 0; row < rows; row++) {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');
      cellDiv.id = `cell-${col}-${row}`;

      const plant = field[col][row];

      if (plant) {
        if (plant.fire) {
          cellDiv.classList.add('fire');
        }
        else if (plant.burned) {
          cellDiv.classList.add('burned');
          if (plant.cooldown > 0) {
            cellDiv.classList.add('cooling');
          }
        } else {
        // CONSOLATED AND CORRECTeD IMAGE LOGIC
          const img = document.createElement('img');
          if (plant.stage == 0){
            img.src = `images/plants/sapling_allplants.png`;
          }
          // otherwise, for stages 1 and 2, use the specific plant image.
          else {
            img.src = `images/plants/${plant.type}_${plant.stage}.png`;
          }

          img.alt = plant.type;
          cellDiv.appendChild(img);
        }
      }
      // plants a seed when you click an empty cell 
      cellDiv.onclick = () => {
        const plot = field[col][row];

        if (isWatering) {
          if (plot && plot.fire) {
            const cellsToExtinguish = [{col, row}];
            const neighbors = [[-1, 0], [1, 0], [0, -1], [0, 1]];

            for (const [dx, dy] of neighbors) {
              const nx = col + dx;
              const ny = row + dy;
              if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                const neighborPlot = field[nx][ny];
                if (neighborPlot && neighborPlot.fire){
                  cellsToExtinguish.push({col: nx, row: ny});
                }
              }
            }

            for (let i = 0; i < Math.min(cellsToExtinguish.length, 4); i++){
              const cell = cellsToExtinguish[i];
              field[cell.col][cell.row] = { burned: true, cooldown: 5};

              const splashedCellDiv = document.getElementById(`cell-${cell.col}-${cell.row}`);
              if(splashedCellDiv) {
                splashedCellDiv.classList.remove('fire');
                splashedCellDiv.classList.add('splash');

                setTimeout(() => {
                  splashedCellDiv.classList.remove('splash');
                }, 500);
              }
            }
          isWatering = false;
          containerElement.classList.remove('watering-cursor');
          pondElement.classList.remove('active');
          }
          return;
        }
        const isBurnedCooling = plot && plot.burned && plot.cooldown > 0;
        // HARVEST IF PLANT IS READY
        if (plot && plot.stage >= 2 && !plot.fire){
          inventory[plot.type]++;
          field[col][row] = null;
          renderField();
          updateInventoryUI();
          return;
        }
        // PLANT IF EMPTY OR BURNED
        if (!isBurnedCooling && (!plot || plot.burned) && seeds.length > 0){
          field[col][row] = seeds.pop();
          renderField();
        }
      }; 
    colDiv.appendChild(cellDiv);
  }
  fieldDiv.appendChild(colDiv);
  }
}

function growPlants() {
  for (let col = 0; col <cols; col++) {
    for (let row = 0; row <rows; row++) {
      const plant = field [col][row];
      if (plant && plant.stage < 2 && !plant.fire) {
        plant.stage++; //make it grow one
      }
    }
  }
  renderField();
}
//picks place fire
function spawnFire() {

  let currentFireCount = 0;
  for (let c = 0; r < rows; r++) {
    for (let r = 0; r < rows; r++) {
      if (field[c][r] && field[c][r].fire) {
        currentFireCount++;
      }
    }
  }

  if (currentFireCount < 4) {
      const plantCells = [];
      for (let col =  0; col < cols;col++) {
      for (let row = 0; row < rows;row++) {
        const plant = field[col][row];
        if (plant && !plant.burned && !plant.fire) {
          plantCells.push({ col, row });
          }
        }
      }

       if (plantCells.length > 0) {
    const targetCell = plantCells[Math.floor(Math.random() * plantCells.length)];
    activeFires.push({ col: targetCell.col, row: targetCell.row, radius: 0, affectedCells: [] });

  }
    }

 
}
function growActiveFires(){
  const nextFires = [];
  let currentFireCount = 0;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      if (field[c][r] && field[c][r].fire) {
        currentFireCount++;
      }
    }
  }
 
  for (const fire of activeFires) {
    const { col, row, radius, affectedCells } = fire;


    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (Math.abs(dx) + Math.abs(dy) === radius ) {
          const x = col + dx;
          const y = row + dy;


          if (x >= 0 && x < cols && y >= 0 && y < rows) {
            const plant = field[x][y];
            if( plant && !plant.fire && currentFireCount < 4 ) {
            plant.fire = true;
            affectedCells.push({ x, y });
            currentFireCount++; 
            }
          }
        }
      }
    }
  

  if (radius < 4) {
    nextFires.push({col, row, radius: radius +1, affectedCells });
   }
    else {
      burningCells.push({ cells: affectedCells, timeleft: 5});
    }
  }

  activeFires = nextFires;
  renderField();
}

function updateBurningCells() {
  const stillBurning = [];

  for (const group of burningCells) {
    group.timeLeft--;

    if (group.timeLeft <= 0) {
      for (const {x, y} of group.cells) {
        field[x][y] = { burned: true, cooldown: 5};
    
     }
    }

    else{
      stillBurning.push(group);
    }
  }
  burningCells = stillBurning;
  renderField();

}

function updateCooldownCells() {
  const stillCooling = [];

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const cell = field[col][row];
      if (cell && cell.burned && cell.cooldown > 0) {
        cell.cooldown--;
        if (cell.cooldown > 0) {
          stillCooling.push({ col, row });
        } else {
          field[col][row] = null;
        }
      }
    }
  }

  renderField();
}

//
renderField();
updateMoney();


setInterval(growPlants, 4000);
setInterval(spawnFire, 10000);
setInterval(growActiveFires, 2000);
setInterval(updateBurningCells, 3000);
setInterval(updateCooldownCells, 2000);