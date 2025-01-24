'use strict';

const nav = document.querySelector('.nav');

// Modal
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// Features (content)
showModal();
learnMoreBtn();
tabbedComponent();
animateNavbar();
stickyNavbar();
fluidSections();
lazyImgs();
slider();

///////////////////////////////////////
// Modal window

function showModal() {
  const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });
}

///////////////////////////////////////
// Smooth Scrolling (on clicking <a>)

function learnMoreBtn() {
  document
    .querySelector('.btn--scroll-to')
    .addEventListener('click', function () {
      const target = this.getAttribute('data-scroll-to');
      document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
    });
}

///////////////////////////////////////
// Tabbed Component (OPERATION)

function tabbedComponent() {
  document
    .querySelector('.operations__tab-container')
    .addEventListener('click', function (e) {
      /* This won't work if we click on number (span).
		const tab = e.target;

		.closest(.operations__tab) -> always gives the tab even when child elements are clicked or the element itself , and null if we click the parent of the element */
      const tab = e.target.closest('.operations__tab');

      /* Guard class; if tab === null func will terminated.
		It'll avoid extra block eg: if (tab) { } */
      if (!tab) return;

      const activeTab = 'operations__tab--active';
      const activeContent = 'operations__content--active';

      // Removing active classes from tab and content
      document.querySelector(`.${activeTab}`).classList.remove(activeTab);
      document
        .querySelector(`.${activeContent}`)
        .classList.remove(activeContent);

      // Making new tab and content active
      // const id = tab.dataset.tab;
      const id = tab.getAttribute('data-tab');

      document
        .querySelector(`.operations__tab--${id}`)
        .classList.add(activeTab);

      document
        .querySelector(`.operations__content--${id}`)
        .classList.add(activeContent);
    });
}

///////////////////////////////////////
// Menu Fade Animation

/* 
mouseenter -> Doesn't triggred by child element (no bubbling)
mouseleave -> opposite

mouseover -> Triggered by child elements (bubble)
mouseout -> opposite
*/

function animateNavbar() {
  const hoverNav = function (e) {
    const link = e.target;

    if (link.classList.contains('nav__link')) {
      // ThIS = e.currentTarget -> el on which event handler is added (nav)
      // Logo
      nav.querySelector('.nav__logo').style.opacity = this;

      // All Nav Link
      nav.querySelectorAll('.nav__link').forEach(l => (l.style.opacity = this));

      // Targetter Nav Link
      link.style.opacity = '1';
    }
  };

  // Bind new function defining where THIS to point
  nav.addEventListener('mouseover', hoverNav.bind(0.5));
  nav.addEventListener('mouseout', hoverNav.bind(1));

  // nav.addEventListener('mouseover', (e) => hoverNav(e, '.5'));
  // nav.addEventListener('mouseout', (e) => hoverNav(e, '1'));
}

///////////////////////////////////////
// STICK NAVBAR - by IntersectionObserver API

/* window.pageYOffset === window.scrollY */

function stickyNavbar() {
  const header = document.querySelector('.header');

  const stickyNav = enteries => {
    const [entry] = enteries; // enteries[0] -> only 1 threshold value

    if (entry.isIntersecting) {
      nav.classList.remove('sticky');
    } else {
      nav.classList.add('sticky');
    }
  };

  // Will call the callback each time intersection happens
  const observer = new IntersectionObserver(stickyNav, {
    root: null, // viewport
    rootMargin: `-${nav.clientHeight}px`,
    threshold: 0, //as soon as visible / invisible
  });

  observer.observe(header);
}

///////////////////////////////////////
// Reveal Section - FAV

function fluidSections() {
  const revealSection = enteries => {
    const [entry] = enteries;

    if (entry.isIntersecting) {
      entry.target.classList.remove('section--hidden');
    } else {
      entry.target.classList.add('section--hidden');
    }
  };

  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.2,
  });

  const allSections = document.querySelectorAll('.section');

  allSections.forEach(section => {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
  });
}

///////////////////////////////////////
// lazy Image - FAV

function lazyImgs() {
  // Function of OBSERVER API
  const loadImg = enteries => {
    const [entry] = enteries;

    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.getAttribute('data-src');

    // remove blur only when enlarged img is loaded
    entry.target.addEventListener('load', function () {
      this.classList.remove('lazy-img');
    });

    imgObserver.unobserve(entry.target);
  };

  const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0.5,
    // rootMargin: '200px',
  });

  const secImgs = document.querySelectorAll('img[data-src]');
  secImgs.forEach(img => imgObserver.observe(img));
}

///////////////////////////////////////
// Carousel / Slider

function slider() {
  const slides = document.querySelectorAll('.slide ');
  const sliderBtnLeft = document.querySelector('.slider__btn--left');
  const sliderBtnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  const totalSlides = slides.length - 1;
  let currentSlide = 0;

  // createDots
  (function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  })();

  const activateDot = slide => {
    const active = 'dots__dot--active';
    const dots = document.querySelectorAll('.dots__dot');

    dots.forEach(dot => dot.classList.remove(active));
    dots[slide].classList.add(active);
  };

  const gotoSlide = slide => {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
    activateDot(slide);
  };
  gotoSlide(currentSlide);
  // 0% 100% 200% ....

  const nextSlide = () => {
    if (currentSlide === totalSlides) currentSlide = 0;
    else currentSlide++;
    gotoSlide(currentSlide);
    // -100% 0% 100%....
  };

  const prevSlide = () => {
    if (currentSlide === 0) currentSlide = totalSlides;
    else currentSlide--;
    gotoSlide(currentSlide);
  };

  // NEXT
  sliderBtnRight.addEventListener('click', nextSlide);
  // PREV
  sliderBtnLeft.addEventListener('click', prevSlide);

  // Keyboard Controls
  document.addEventListener('keydown', e => {
    // True && Will Run ... True (run) || (default if false)
    e.key === 'ArrowLeft' && prevSlide(currentSlide);
    e.key === 'ArrowRight' && nextSlide(currentSlide);
  });

  // Dot Controls
  dotContainer.addEventListener('click', e => {
    const dot = e.target;
    if (!dot.classList.contains('dots__dot')) return;
    // gotoSlide(dot.getAttribute('data-slide'));
    gotoSlide(dot.dataset.slide);
  });

  // Slide after 5s
  setInterval(nextSlide, 5000);
}