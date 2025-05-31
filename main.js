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
const cols = 10
const rows = 10
const fieldDiv = document.getElementById

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
    }
  }
}