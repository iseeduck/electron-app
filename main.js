const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})
// variables
const cols = 10
const rows = 10
let seeds = []; // makes queue of seeds
const fieldDiv = document.getElementById('field');
const moneyDisplay = document.getElementById('money-display');
function updateMoney(){
  moneyDisplay.textContent = `Money: $$(Money)`;
}

function renderField(){
  fieldDiv.innerHTML = ''; //clears existing grid

  // makes grid :)
  for (let col = 0; col < cols; col++) {
    const colDiv = document.createElement('div');
    colDiv.classlist.add('column');

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
  fieldDiv.apendChild(colDiv);
  }
}

//
renderField();
updateMoney();