// variables
const cols = 10;
const rows = 10;

let money = 3830;
let seeds = []; // makes queue of seeds


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