// variables
const cols = 10;
const rows = 10;

let money = 100;
let seeds = []; // makes queue of seeds
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


    var myButton = document.getElementById('tomato');
    myButton.addEventListener('click', function(){
       // Assign an ID to your button
      if (myButton && isOpen) {
          myButton.addEventListener('click', buySeed('tomato'));
      }
    });
    var myButton = document.getElementById('strawberry');
      myButton.addEventListener('click', function(){
       // Assign an ID to your button
      if (myButton && isOpen) {
          myButton.addEventListener('click', buySeed('strawberries'));
      }
    });
    var myButton = document.getElementById('grapes');
    myButton.addEventListener('click', function(){
       // Assign an ID to your button
      if (myButton && isOpen) {
          myButton.addEventListener('click', buySeed('grapes'));
      }
    })
    var myButton = document.getElementById('lettuce');
    myButton.addEventListener('click', function(){
       // Assign an ID to your button
      if (myButton && isOpen) {
          myButton.addEventListener('click', buySeed('lettuce'));
      }
    })
      





function buySeed(type) {
    if (money >= 10) {
      seeds.push({type, stage: 0});
      money -= 10;
      console.log("seed was bought");
      updateMoney();
    }
  }

  function updateInventoryUI(){
    const inv = inventory;
    document.getElementById('inventory-display').textContent = `Inventory: Grape(s): ${inv.grape} | Lettuce: ${inv.lettuce} | Tomato(es): ${inv.tomato} | Strawberries: ${inv.strawberry}`;

  }

function renderSellOptions(){
  const container = document.getElementById('sell-options');
  container.innerHTML = '';
  for (const crop in inventory) {
    const amount = inventory[crop];
    if (amount > 0) {
      const btn = document.createElement('button');
      btn.textContent = 'Sell 1 ${crop} ($5)';
      btn.onclick = () =>{
        inventory[crop] --;
        money += 5;
        updateMoney();
        updateInventoryUI();
        renderSellOptioins(); //refreshes the ui
      }
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

      const plant = field[col][row];
      if (plant) {
        if (plant.fire) {
          cellDiv.classList.add('fire');
        }
        else {
        // THESE IMAGES NEED TO BE NAMED USING THIS FORMAT plants/{type}-{stage}.png
          const img = document.createElement('img');
          img.src = 'plant/${plant.type}_${plant.stage}.png';
          img.onerror = () => {
            img.src = 'images/plants/sapling_allplants.png';
          };
          cellDiv.appendChild(img);
        }
      }
      // plants a seed when you click an empty cell 
      cellDiv.onclick = () => {
        const plot = field[col][row];

        const isBurnedCooling = plot && plot.burned && plot.cooldown > 0;
        // HARVEST IF PLANT IS READY
        if (plot && plot.stage == 3 && !plot.fire){
          inventory[plot.type]++;
          field[col][row = null];
          renderField();
          updateInventoryUI();
          return;
        }
        // PLANT IF EMPTY OR BURND
        if (!isBurnedCooling && (!plot || plot.burned) && seeds.length > 0){
          field[col][row] = seeds.pop();
          renderField();
        }
      };


      if (plant){
        if (plant.fire) {
          cellDiv.classList.add('fire');
        } else if (plant.burned) {
          cellDiv.classList.add('burned');
          if (plant.cooldown > 0) {
            cellDiv.classList.add('cooling');
          }
        } else {
          const img = document.createElement('img');
          img.src = `images/plants/${plant.type}-${plant.stage}.png`;
          img.alt = plant.type;
          cellDiv.appendChild(img);
        }
      }
    
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
  const col = Math.floor(Math.random() * cols);
  const row = Math.floor(Math.random() * rows);
  activeFires.push ({col, row, radius: 0, affectedCells: [] }); 
}
function growActiveFires(){
  const nextFires = [];
  for (const fire of activeFires) {
    const {col, row, radius, affectedCells} = fire;
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (Math.abs(dx) + Math.abs(dy) === radius){
          const x = col +dx;
          const y = row + dy;
        

        if (x >= 0 && x < cols && y >= 0 && y < rows) {
          const plant = field[x][y];
          if (plant) {
            plant.fire = true;
            affectedCells.push({x,y}) // accumulate
          }
        }
      }
    }
  }
    if (radius <4) {
      nextFires.push ({col, row, radius: radius +1, affectedCells}); // pass it forward

    } else {
      //after max radius, store full fire aresa to burn
      burningCells.push({cells: affectedCells, timeLeft: 5});
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
  burningcells = stillBurning;
  renderField();

}

function updateCooldownCells() {
  const stillCooling = [];

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const cell = field[col][row];
      if (cell && cell.bruned && cell.cooldown > 0) {
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