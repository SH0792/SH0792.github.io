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

const leadForm = document.querySelector('#lead-form');
const formStatus = document.querySelector('#form-status');
const formStarted = document.querySelector('#form-started');
const formSubmit = leadForm?.querySelector('.form-submit');
let formStartedAt = Date.now();

if (formStarted) formStarted.value = new Date(formStartedAt).toISOString();

leadForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  formStatus.className = 'form-status';
  formStatus.textContent = '';

  if (!leadForm.checkValidity()) {
    leadForm.reportValidity();
    formStatus.classList.add('error');
    formStatus.textContent = 'Please complete the required fields before sending.';
    return;
  }

  const honeypot = leadForm.querySelector('[name="_gotcha"]');
  if (honeypot?.value) {
    leadForm.reset();
    formStatus.classList.add('success');
    formStatus.textContent = 'Thank you. Your enquiry has been received.';
    return;
  }

  if (Date.now() - formStartedAt < 3000) {
    formStatus.classList.add('error');
    formStatus.textContent = 'Please review your details, then send the enquiry again.';
    return;
  }

  const defaultLabel = formSubmit.textContent;
  formSubmit.disabled = true;
  formSubmit.textContent = 'Sending...';

  try {
    const response = await fetch(leadForm.action, {
      method: 'POST',
      body: new FormData(leadForm),
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) throw new Error('Submission failed');

    leadForm.reset();
    formStartedAt = Date.now();
    formStarted.value = new Date(formStartedAt).toISOString();
    formStatus.classList.add('success');
    formStatus.textContent = 'Thank you. Your enquiry has been sent successfully. I will respond within one business day.';
  } catch (error) {
    formStatus.classList.add('error');
    formStatus.textContent = 'The form could not be sent. Please use email or WhatsApp above and try again later.';
  } finally {
    formSubmit.disabled = false;
    formSubmit.textContent = defaultLabel;
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();
