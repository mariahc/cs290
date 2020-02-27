let _CarouselHandler; // timer handler


function nextImage() {
  const images = document.getElementsByClassName('image');
  for (let i = images.length - 1; i >= 0; i--) {
    let currentIndex = Number(images[i].dataset.index);
    let newIndex = currentIndex + 1 >= images.length ? 0 : currentIndex + 1;
    images[i].style.opacity = newIndex === 0 ? 1 : 0;
    images[i].dataset.index = newIndex;
  }

  if (_CarouselHandler) {
    clearTimeout(_CarouselHandler);
    _CarouselHandler = setTimeout(nextImage, 5000);
  }
}


function prevImage() {
  const images = document.getElementsByClassName('image');
  for (let i = images.length - 1; i >= 0; i--) {
    let currentIndex = Number(images[i].dataset.index);
    let newIndex = currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1;
    images[i].style.opacity = newIndex === 0 ? 1 : 0;
    images[i].dataset.index = newIndex;
  }
}


function setupCarousel() {
  const nextBtn = document.getElementById('next');
  nextBtn.onclick = nextImage;
  const prevBtn = document.getElementById('prev');
  prevBtn.onclick = prevImage;

  const images = document.getElementsByClassName('image');
  for (let i = images.length - 1; i >= 0; i--) {
    images[i].style.opacity = i === 0 ? 1 : 0;
    images[i].dataset.index = i;
  }

  _CarouselHandler = setTimeout(nextImage, 5000);
}


function main() {
  setupCarousel();
}


document.addEventListener('DOMContentLoaded', main);