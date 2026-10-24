(() => {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('.desktop-nav');
  menuToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  const tabs = [...document.querySelectorAll('.form-tab')];
  const audienceInput = document.getElementById('audienceType');
  const title = document.getElementById('formTitle');
  const subtitle = document.getElementById('formSubtitle');
  const countryLabel = document.getElementById('countryLabel');
  const typeLegend = document.getElementById('typeLegend');
  const message = document.getElementById('formMessage');
  const emailInput = document.getElementById('email');
  const countryInput = document.getElementById('country');
  const form = document.getElementById('waitlistForm');

  function setAudience(audience) {
    const contractor = audience === 'contractor';
    audienceInput.value = audience;
    tabs.forEach(tab => {
      const active = tab.dataset.tab === audience;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    title.textContent = contractor ? 'Join as a service provider' : 'Join as a customer';
    subtitle.textContent = contractor ? 'Tell us where you offer your services.' : 'Let us know where you’ll need a hand.';
    countryLabel.innerHTML = (contractor ? 'Country where you provide services ' : 'Country of residence ') + '<span>*</span>';
    typeLegend.textContent = contractor ? 'I work as' : 'I’m signing up as';
    message.hidden = true;
  }
  tabs.forEach(tab => tab.addEventListener('click', () => setAudience(tab.dataset.tab)));
  document.querySelectorAll('[data-audience]').forEach(link => link.addEventListener('click', () => setAudience(link.dataset.audience)));

  form?.addEventListener('submit', event => {
    event.preventDefault();
    message.hidden = false;
    message.classList.remove('error');
    if (!emailInput.checkValidity()) {
      message.classList.add('error');
      message.textContent = 'Please enter a valid email address.';
      emailInput.focus();
      return;
    }
    if (!countryInput.value) {
      message.classList.add('error');
      message.textContent = 'Please choose your country to continue.';
      countryInput.focus();
      return;
    }
    if (!document.getElementById('consent').checked) {
      message.classList.add('error');
      message.textContent = 'Please agree to receive launch updates before joining the list.';
      document.getElementById('consent').focus();
      return;
    }
    message.textContent = 'Thanks for your interest in Loqelo! Your form is validated in this preview. Connect a contact-management service before launch to securely save your sign-up.';
    // Production integration: send this form to an approved waitlist provider.
    // Never send email addresses or form field values to analytics.
    if (window.gtag && localStorage.getItem('loqelo-analytics-consent') === 'accepted') {
      window.gtag('event', audienceInput.value === 'contractor' ? 'contractor_waitlist_preview_submit' : 'customer_waitlist_preview_submit', {
        event_category: 'waitlist',
        event_label: audienceInput.value
      });
    }
    form.querySelector('.submit-button').textContent = 'Preview submitted ✓';
  });

  // Consent UI demo. Connect the analytics tag only after consent in production.
  const cookieNotice = document.getElementById('cookieNotice');
  const consentChoice = localStorage.getItem('loqelo-analytics-consent');
  if (!consentChoice) cookieNotice.hidden = false;
  function chooseCookies(choice) {
    localStorage.setItem('loqelo-analytics-consent', choice);
    cookieNotice.hidden = true;
    if (choice === 'accepted') {
      // Load/configure GA4 here after the production measurement ID and consent setup are supplied.
    }
  }
  document.getElementById('acceptCookies')?.addEventListener('click', () => chooseCookies('accepted'));
  document.getElementById('rejectCookies')?.addEventListener('click', () => chooseCookies('essential-only'));

  // Language selector is wired as a visible prototype control. Add approved translations
  // and geo-language detection before launch; never force a language without a user override.
  document.getElementById('languageSelect')?.addEventListener('change', event => {
    if (event.target.value !== 'en') {
      event.target.value = 'en';
      alert('The language selector is a prototype control. Add the approved translation files before launch.');
    }
  });
})();