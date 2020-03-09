let state = {};


/*
  POST HTTP request handler
 */
function postRequest(url, payload) {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', () => {
      let res = JSON.parse(req.responseText);
      resolve(res);
    });
    req.send(JSON.stringify(payload));
  });
}


/*
  GET HTTP request handler
 */
function getRequest(url) {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.addEventListener('load', () => {
      let res = JSON.parse(req.responseText);
      resolve(res);
    });
    req.send(null);
  });
}


function onEdit(e) {
  e.preventDefault();

  const optForm = document.getElementById('optForm');
  console.log('id of row editing: ' + optForm.id.value);
}


function onDelete(e) {
  e.preventDefault();

  const optForm = document.getElementById('optForm');
  console.log('id of row deleting: ' + optForm.id.value);
}


/*
  Handle new exercise data submission
 */
function handleSubmit(e) {
  e.preventDefault();

  const exForm = document.getElementById('form');
  console.log('submitting exercise ' + exForm.name.value);
  console.log({
    name: exForm.name.value,
    reps: exForm.reps.value,
    weight: exForm.weight.value,
    unit: exForm.unit.value,
    date: exForm.date.value
  });

  postRequest('/', {
    name: exForm.name.value,
    reps: exForm.reps.value,
    weight: exForm.weight.value,
    unit: exForm.unit.value,
    date: exForm.date.value
  }).then(res => {
    clearForm();

    if (res.err) {
      console.error(res.err);
    }

    console.log('got new row:\n', res.row);

    addRow(res.row);
  });
}

/*
  Clear form inputs
 */
function clearForm() {
  const exForm = document.getElementById('form');
  exForm.name.value = null;
  exForm.reps.value = null;
  exForm.weight.value = null;
  exForm.unit.value = null;
  exForm.date.value = null;
}


/*
  Create options buttons
 */
function createButtons(id) {
  const buttons = create('form');
  buttons.class = 'optForm';

  const idInput = create('input');
  idInput.type = 'hidden';
  idInput.name = 'id';
  idInput.value = id;
  buttons.appendChild(idInput);

  const editBtn = create('button');
  editBtn.onclick = onEdit;
  editBtn.textContent = 'Edit';
  editBtn.class = 'edit';
  buttons.appendChild(editBtn);

  const deleteBtn = create('button');
  deleteBtn.onclick = onDelete;
  deleteBtn.textContent = 'Delete';
  deleteBtn.class = 'delete';
  buttons.appendChild(deleteBtn);

  return buttons;
}


/*
  Add row to table body
 */
function addRow(data) {
  const table = document.getElementById('tablebody');

  const tr = create('tr');

  const nameElem = create('td');
  nameElem.textContent = data.name;
  tr.appendChild(nameElem);

  const repsElem = create('td');
  repsElem.textContent = data.reps;
  tr.appendChild(repsElem);

  const weightElem = create('td');
  weightElem.textContent = data.weight;
  tr.appendChild(weightElem);

  const unitElem = create('td');
  unitElem.textContent = data.unit ? 'lbs' : 'kg';
  tr.appendChild(unitElem);

  const dateElem = create('td');
  dateElem.textContent = data.date;
  tr.appendChild(dateElem);

  const optElem = create('td');
  optElem.appendChild(createButtons(data.id));
  tr.appendChild(optElem);

  table.appendChild(tr);
}


/*
  Create table and add to DOM
 */
function createTable() {
  getRequest('/?load=1').then(res => {
    if (res.err) {
      console.error(res.err);
    } else {
      res.rows.forEach(row => addRow(row));
    }
  });
}


/*
  Create element
 */
function create(elem) {
  return document.createElement(elem);
}


function main() {
  const exForm = document.getElementById('form');
  exForm.onsubmit = handleSubmit;

  createTable();
}


document.addEventListener('DOMContentLoaded', main);