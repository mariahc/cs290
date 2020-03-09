// hold last rows update for editing
let state = [];


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


/*
  DELETE HTTP request handler
 */
function deleteRequest(url, payload) {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.open('delete', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', () => {
      let res = JSON.parse(req.responseText);
      resolve(res);
    });
    req.send(JSON.stringify(payload));
  });
}


/*
  PUT HTTP request handler
 */
function putRequest(url, payload) {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.open('put', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', () => {
      let res = JSON.parse(req.responseText);
      resolve(res);
    });
    req.send(JSON.stringify(payload));
  });
}


/*
  Delete row and get new table data
 */
function onDelete(e) {
  e.preventDefault();

  console.log('id of row deleting: ' + e.target.id.value);

  deleteRequest('/', { id: e.target.id.value }).then(res => {
    if (res.err) {
      console.error(res.err);
    } else {
      refreshTable();
    }
  });
}


/*
  Handle new exercise data submission
 */
function onSubmit(e) {
  e.preventDefault();

  const exForm = document.getElementById('form');

  postRequest('/', {
    name: exForm.name.value,
    reps: exForm.reps.value,
    weight: exForm.weight.value,
    unit: exForm.unit.value === 'lbs',
    date: exForm.date.value
  }).then(res => {
    clearForm();

    if (res.err) {
      console.error(res.err);
    } else {
      addRow(res.row);
    }
  });
}


/*
  Submit updates to server and reset form
 */
function onUpdate(e) {
  e.preventDefault();

  const exForm = document.getElementById('form');
  putRequest('/', {
    id: exForm.id.value,
    name: exForm.name.value,
    reps: exForm.reps.value,
    weight: exForm.weight.value,
    unit: exForm.unit.value === 'lbs',
    date: exForm.date.value
  }).then(res => {
    if (res.err) {
      console.error(res.err);
    }

    finishEditing();
    refreshTable();
  });
}

/*
  Convert submission form to edit form
 */
function onEdit(e) {
  e.preventDefault();

  const exForm = document.getElementById('form');
  exForm.onsubmit = onUpdate;

  const submitBtn = document.getElementById('submit');
  submitBtn.textContent = 'Update';

  const cancelBtn = document.getElementById('cancel');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.onclick = finishEditing;

  const id = e.target.id.value;
  const row = state.find(r => r.id == id);

  // update form inputs
  exForm.id.value = id;
  exForm.name.value = row.name;
  exForm.reps.value = row.reps
  exForm.weight.value = row.weight;
  exForm.unit.value = row.unit ? 'lbs' : 'kg';

  // set date by cutting a formatted string
  exForm.date.value = new Date(row.date).toISOString().slice(0,10);
}


/*
  Revert edit form to submission form
 */
function finishEditing(e) {
  if (e) e.preventDefault();

  const exForm = document.getElementById('form');
  exForm.onsubmit = onSubmit;

  const submitBtn = document.getElementById('submit');
  submitBtn.textContent = 'Add';

  const cancelBtn = document.getElementById('cancel');
  cancelBtn.textContent = 'Clear';
  cancelBtn.onclick = clearForm;

  clearForm();
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
  Create form options buttons
 */
function createButtons(id) {
  const buttons = create('div');
  buttons.classList.add('buttons');

  // create edit form & button
  const editForm = create('form');
  editForm.onsubmit = onEdit;

  let idInput = create('input');
  idInput.type = 'hidden';
  idInput.name = 'id';
  idInput.value = id;
  editForm.appendChild(idInput);

  const editBtn = create('button');
  editBtn.type = 'submit';
  editBtn.textContent = 'Edit';
  editBtn.classList.add('edit');
  editForm.appendChild(editBtn);

  buttons.appendChild(editForm);

  // create delete form & button
  const delForm = create('form');
  delForm.onsubmit = onDelete;

  idInput = create('input');
  idInput.type = 'hidden';
  idInput.name = 'id';
  idInput.value = id;
  delForm.appendChild(idInput);

  const deleteBtn = create('button');
  deleteBtn.type = 'submit';
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete');
  delForm.appendChild(deleteBtn);

  buttons.appendChild(delForm);

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
  unitElem.textContent = data.lbs ? 'lbs' : 'kg';
  tr.appendChild(unitElem);

  const dateElem = create('td');
  dateElem.textContent = data.date.slice(0,10);
  tr.appendChild(dateElem);

  const optElem = create('td');
  optElem.appendChild(createButtons(data.id));
  tr.appendChild(optElem);

  table.appendChild(tr);
}


/*
  Get all rows from server and add them to table
 */
function createTable() {
  getRequest('/?load=1').then(res => {
    if (res.err) {
      console.error(res.err);
    } else {
      state = res.rows;
      res.rows.forEach(row => addRow(row));
    }
  });
}


/*
  Clear and rebuild table
 */
function refreshTable() {
  // clear table
  const table = document.getElementById('tablebody');
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  createTable();
}


/*
  Create element
 */
function create(elem) {
  return document.createElement(elem);
}


function main() {
  // set events on form buttons
  const exForm = document.getElementById('form');
  exForm.onsubmit = onSubmit;

  const cancelBtn = document.getElementById('cancel');
  cancelBtn.onclick = clearForm;

  createTable();
}


document.addEventListener('DOMContentLoaded', main);