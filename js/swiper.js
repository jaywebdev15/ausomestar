let index = 0;

const frame   = document.querySelector('#testimonial .swiper');
const wrapper = frame.querySelector('.swiper-wrapper');
const slides  = frame.querySelectorAll('.swiper-slide');

function showSlide(i) {
  slides.forEach((slide, idx) => {
    slide.classList.remove('active');
    if (idx === i) slide.classList.add('active');
  });

  const w = frame.clientWidth;
  wrapper.style.transform = `translateX(${-i * w}px)`;
  wrapper.style.transition = 'transform .45s ease';
}

document.querySelector('.next').addEventListener('click', () => {
  index = (index + 1) % slides.length;
  showSlide(index);
});

document.querySelector('.prev').addEventListener('click', () => {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
});

window.addEventListener('resize', () => {
  showSlide(index);
});

showSlide(index);
