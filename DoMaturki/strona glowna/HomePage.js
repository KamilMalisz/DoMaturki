
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.navigation');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('hamburger--active');
  nav.classList.toggle('navigation--active');
});
