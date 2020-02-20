thisWorks();

function thisWorks() {
  console.log('yay');
}

thisBreaks();

var thisBreaks = function () {
  console.log('oh no');
}