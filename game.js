// variables
const cols = 10;
const rows = 10;

let money = 3830;
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
//toggles shop menu visibility
function toggleShop() {
  document.getElementById('shop-menu').classList.toggle('hidden');
}

function buySeed(type) {
    if (money >= 10) {
      seeds.push({type, stage: 0});
      money -= 10;
      updateMoney();
    }
  }

  function updateInventoryUI(){
    const inv = inventory;
    document.getElementById('inventory-display').textContent = `Inventory: Grape(s): ${inv.grape} | Lettuce: ${inv.lettuce} | Tomato(es): ${inv.tomato} | Strawberries: ${inv.strawberry}`;

  }

function renderSellOptions(){
  const container = document.G=getElementById('sell-options');
  container.innerHTML = '';
  for (const crop in inventory) {
    const amunt = inventory[crop];
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
          const img = document.createElement('img');
          img.src = 
          'plant/${plant.type}-${plant.stage}.png';
          cellDiv.appendChild(img);
        }
      }
      // plants a seed when you click an empty cell 
      cellDiv.onclick = () => {
        if (!field[col][row] && seeds.length > 0){
          field[col][row] = seeds.pop();
          renderField();
        }
      };
    
    colDiv.appendChild(cellDiv);
  }
  fieldDiv.appendChild(colDiv);
  }
}

//
renderField();
updateMoney();