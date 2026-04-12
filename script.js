document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = navMenu.querySelectorAll('a');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioGrid = document.getElementById('portfolioGrid');
  const portfolioModal = document.getElementById('portfolioModal');
  const portfolioModalOverlay = document.getElementById('portfolioModalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const yearElement = document.getElementById('currentYear');
  const statNumbers = document.querySelectorAll('.stat-number');

  yearElement.textContent = new Date().getFullYear();

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });

  function filterPortfolio(category) {
    const cards = portfolioGrid.querySelectorAll('.portfolio-card');
    cards.forEach(card => {
      const cardCategory = card.dataset.category;
      const show = category === 'all' || cardCategory === category;
      card.style.display = show ? 'grid' : 'none';
      if (show) {
        card.classList.add('fade-in');
        setTimeout(() => card.classList.remove('fade-in'), 500);
      }
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      filterPortfolio(button.dataset.filter);
    });
  });

  function openPortfolioModal(card) {
    const imageUrl = card.dataset.image;
    const title = card.dataset.title;
    const description = card.dataset.description;
    const link = card.dataset.link;
    modalImage.src = imageUrl;
    modalImage.alt = title;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    const modalLink = document.getElementById('modalLink');
    if (link && link.trim() !== '') {
      modalLink.href = link;
      modalLink.style.display = 'inline-block';
    } else {
      modalLink.style.display = 'none';
    }
    portfolioModal.classList.add('active');
    portfolioModal.setAttribute('aria-hidden', 'false');
  }

  portfolioGrid.addEventListener('click', event => {
    const card = event.target.closest('.portfolio-card');
    if (!card) return;
    openPortfolioModal(card);
  });

  const closeModal = () => {
    portfolioModal.classList.remove('active');
    portfolioModal.setAttribute('aria-hidden', 'true');
  };

  modalClose.addEventListener('click', closeModal);
  portfolioModalOverlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
  });

  function validateEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = form.user_name.value.trim();
    const email = form.user_email.value.trim();
    const phone = form.user_phone.value.trim();
    const message = form.message.value.trim();

    formStatus.textContent = '';

    if (!name || !email || !phone || !message) {
      formStatus.textContent = 'Por favor completa todos los campos.';
      return;
    }

    if (!validateEmail(email)) {
      formStatus.textContent = 'Ingresa un correo válido.';
      return;
    }

    formStatus.textContent = 'Enviando mensaje...';

    fetch('http://localhost:3000/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_name: name, user_email: email, user_phone: phone, message })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          formStatus.textContent = '¡Mensaje enviado con éxito! Te contactaremos pronto.';
          form.reset();
        } else {
          formStatus.textContent = 'Error: ' + (data.error || 'No se pudo enviar.');
        }
      })
      .catch(() => {
        formStatus.textContent = 'Error de conexión. Asegúrate de que el servidor está activo.';
      });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section__header, .service-card, .hero-card, .why-us__visual, .portfolio-card, .about__image, .testimonial-card, .contact-card, .contact-form').forEach(element => {
    element.classList.add('reveal');
    observer.observe(element);
  });

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const number = entry.target;
        const target = parseInt(number.dataset.target, 10);
        let current = 0;
        const increment = Math.ceil(target / 60);
        const updateCounter = () => {
          current += increment;
          if (current < target) {
            number.textContent = current;
            requestAnimationFrame(updateCounter);
          } else {
            number.textContent = target;
          }
        };
        updateCounter();
        counterObserver.unobserve(number);
      }
    });
  }, { threshold: 0.4 });

  statNumbers.forEach(number => counterObserver.observe(number));

  filterPortfolio('all');
});
