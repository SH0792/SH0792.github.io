const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.primary-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  navigation.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealElements.forEach((element) => observer.observe(element));
}

const projectDialog = document.querySelector('#project-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogTitle = document.querySelector('#dialog-title');

document.querySelectorAll('.work-preview').forEach((button) => {
  button.addEventListener('click', () => {
    const title = button.dataset.title || 'Project preview';
    dialogTitle.textContent = title;
    dialogImage.src = button.dataset.image;
    dialogImage.alt = `${title} full page preview`;
    projectDialog.showModal();
  });
});

document.querySelector('.dialog-close')?.addEventListener('click', () => projectDialog.close());
projectDialog?.addEventListener('click', (event) => {
  if (event.target === projectDialog) projectDialog.close();
});

document.querySelector('#year').textContent = new Date().getFullYear();
