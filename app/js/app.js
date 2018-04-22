import hamburger from './hamburger';
import ImageLoader from './ImageLoad.js';

const swishImages = document.querySelectorAll('.swish');
swishImages.forEach(swishImg => {
  const img = new ImageLoader(swishImg);
});
