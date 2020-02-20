const appid = '7b172a56909fc3e2ce508e35b865e452';


function submitGet(e) {
  e.preventDefault();

  const { name, country, zip } = e.target;

  console.log('name: ', name.value);
  console.log('country: ', country.value);
  console.log('zip: ', zip.value);

  if (!name.value) {
    if (!country.value || !zip.value) return;

    let url = `http://api.openweathermap.org/data/2.5/weather?zip=${zip.value},${country.value}&appid=${appid}`;
    getRequest(url);

  } else {
    if (!country.value) return;

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${name.value},${country.value}&appid=${appid}`;
    getRequest(url);
  }
}


function submitPost(e) {
  e.preventDefault();

  let url = `http://httpbin.org/post`;
  const { name, country, zip } = e.target;

  console.log('name: ', name.value);
  console.log('country: ', country.value);
  console.log('zip: ', zip.value);

  let payload = {
    name: name.value,
    country: country.value,
    zip: zip.value
  };

  postRequest(url, payload);
}


function getRequest(url) {
  let req = new XMLHttpRequest();
  req.open('get', url, true);
  req.addEventListener('load', () => {
    let res = JSON.parse(req.responseText);
    displayWeather(res);
  });
  req.send(null);
}


function postRequest(url, payload) {
  let req = new XMLHttpRequest();
  req.open('POST', url, true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.addEventListener('load', () => {
    let res = JSON.parse(req.responseText);
    displayPost(res);
  })
  req.send(JSON.stringify(payload));
}


function displayWeather(res) {
  const cityElem = document.getElementById('city');
  const temperatureElem = document.getElementById('temperature');
  const humidityElem = document.getElementById('humidity');

  cityElem.textContent = `City: ${res.name}`;
  temperatureElem.textContent = `Temperature: ${Math.round(res.main.temp - 273.15)}°C;`;
  humidityElem.textContent = `Humidity: ${res.main.humidity}%`;
}


function displayPost(res) {
  const cityElem = document.getElementById('name');
  const countryElem = document.getElementById('country');
  const zipElem = document.getElementById('zip');

  const { name, country, zip } = res.json;

  cityElem.textContent = `City: ${name}`;
  countryElem.textContent = `Country: ${country}`;
  zipElem.textContent = `Zip Code: ${zip}`;
}


function main() {
  const getForm = document.getElementById('getForm');
  getForm.addEventListener('submit', submitGet);

  const postForm = document.getElementById('postForm');
  postForm.addEventListener('submit', submitPost)
}


document.addEventListener('DOMContentLoaded', main);