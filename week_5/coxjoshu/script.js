let state = {
  x: 0,
  y: 0,
  size: 4,
  selected: {x: 0, y: 0},
  marked: []
};


function create(elem) {
  return document.createElement(elem);
}


// Create table and add to DOM
function createTable() {
  const { size } = state;
  const body = document.getElementsByTagName('body')[0];

  // Create table
  const table = create('table');

  // Create header
  const thead = create('thead');
  const headRow = create('tr');
  thead.appendChild(headRow);
  for (var hi = 1 ; hi < size+1 ; hi++) {
    const th = create('th');
    th.textContent = `Header ${hi}`;
    headRow.appendChild(th);
  }
  table.appendChild(thead);

  // Create body
  const tbody = create('tbody');
  for (var ri = 1 ; ri < size+1 ; ri++) {
    // Create rows
    const tr = create('tr');
    for (var di = 1 ; di < size+1 ; di++) {
      const td = create('td');
      td.textContent = `${ri},${di}`;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  // Add table to dom
  body.appendChild(table);
}


// Create directional and mark buttons and add to DOM
function createButtons() {
  const body = document.getElementsByTagName('body')[0];

  const buttonGroup = create('div');

  const btnUp = create('button');
  btnUp.textContent = 'Up';
  buttonGroup.appendChild(btnUp);
  btnUp.onclick = function() {
    let {y, size} = state;
    let newY = y - 1 < 0 ? 0 : y - 1;
    state = {...state, y: newY};
    console.log(state);
    updateSelected();
  }

  const btnDown = create('button');
  btnDown.textContent = 'Down';
  buttonGroup.appendChild(btnDown);
  btnDown.onclick = function() {
    let {y, size} = state;
    let newY = y + 1 >= size ? size - 1 : y + 1;
    state = {...state, y: newY};
    console.log(state);
    updateSelected();
  }

  const btnLeft = create('button');
  btnLeft.textContent = 'Left';
  buttonGroup.appendChild(btnLeft);
  btnLeft.onclick = function() {
    let {x, size} = state;
    let newX = x - 1 < 0 ? 0 : x - 1;
    state = {...state, x: newX};
    console.log(state);
    updateSelected();
  }

  const btnRight = create('button');
  btnRight.textContent = 'Right';
  buttonGroup.appendChild(btnRight);
  btnRight.onclick = function() {
    let {x, size} = state;
    let newX = x + 1 >= size ? size - 1 : x + 1;
    state = {...state, x: newX};
    updateSelected();
  }

  const btnMark = create('button');
  btnMark.textContent = 'Mark Cell';
  buttonGroup.appendChild(btnMark);
  btnMark.onclick = markSelected;

  body.appendChild(buttonGroup);
}


// Add currently selected cell to marked array
function markSelected() {
  const tbody = document.getElementsByTagName('tbody')[0];
  let {x, y, marked} = state;
  marked.push({x,y});

  state = {...state, marked: marked};
  updateSelected();
}


// Style marked and selected cells
function updateSelected() {
  const tbody = document.getElementsByTagName('tbody')[0];
  let {x, y, selected, marked} = state;

  // Remove last selected
  const lastSelectedElem = tbody.children[selected.y].children[selected.x];
  lastSelectedElem.style = `border: 0`;

  // Update new selected
  const newSelectedElem = tbody.children[y].children[x];
  newSelectedElem.style = `border: 1px solid black`;

  // Style all marked cells
  marked.forEach(mark => {
    const elem = tbody.children[mark.y].children[mark.x];
    elem.style = `background-color: yellow`;

    if (mark.x == x && mark.y == y) elem.style = `background-color: yellow; border: 1px solid black`;
  });

  // Updated last selected
  state = {...state, selected: {y, x}};
}


function main() {
  createTable();
  createButtons();
  updateSelected();
}

document.addEventListener('DOMContentLoaded', main);
