/*
  Send button handler
  Adds a random chat response
 */
function send(e) {
  e.preventDefault();

  const form = document.getElementById('form');
  if (form.message.value == '') {
    return;
  }

  postRequest('/send', {
    sender: 'sent',
    user: form.user.value,
    text: form.message.value
  }).then(res => {
    showMessages(res.chat);
  });

  form.message.value = '';

  setTimeout(response, Math.floor(Math.random()*3000));
}


/*
  Automatic random chat responses
 */
function response() {
  const form = document.getElementById('form');

  const messages = [
    'neigh',
    'huff',
    'clop clop',
    '*aggressive snorting*',
    '*whinny*'
  ];
  const randMessage = messages[Math.floor(Math.random()*messages.length)];

  postRequest('/send', {
    sender: 'got',
    user: form.user.value,
    text: randMessage
  }).then(res => {
    showMessages(res.chat);
  });
}


/*
  Append given messages to the chat window
  Attempts to add only new messages
 */
function showMessages(messages) {
  const chatbox = document.getElementById('chatbox');

  // append new messages
  for (let i = chatbox.children.length ; i < messages.length ; i++) {
    const message = messages[i];
    const msgElem = document.createElement('div');
    const textElem = document.createElement('span');
    msgElem.classList.add('message');
    msgElem.classList.add(message.sender);
    textElem.textContent = message.text;
    msgElem.appendChild(textElem);
    chatbox.appendChild(msgElem);
  }

  // scroll chat window to the newest messages
  chatbox.scrollBy({top: chatbox.scrollHeight, behavior: 'smooth'});
}


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
    })
    req.send(JSON.stringify(payload));
  })
}


function main() {
  const form = document.getElementById('form');
  form.addEventListener('submit', send);
}


document.addEventListener('DOMContentLoaded', main);