/**
 * ============================================================================
 * BREW & BEAN CAFE - SCRIPT.JS
 * Vanilla JavaScript for Mobile Navigation, Menu Filtering, Form Validation,
 * Lightbox Image Viewer, Smooth Scrolling, and Toast Alerts.
 * ============================================================================
 */

// Wait until DOM is completely loaded
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMenuFilters();
  initContactForm();
  initGalleryLightbox();
  initScrollToTop();
  initDynamicYear();
});

/* --------------------------------------------------------------------------
   1. Responsive Navigation & Sticky Header
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.getElementById('header');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Add background shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Highlight current active navigation link based on scroll position
    let currentId = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Toggle mobile navigation menu
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      hamburgerBtn.classList.toggle('active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking on any navigation link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   2. Menu Category Filtering
   -------------------------------------------------------------------------- */
function initMenuFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and add to the clicked one
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedFilter = btn.getAttribute('data-filter');

      menuCards.forEach((card) => {
        const category = card.getAttribute('data-category');

        if (selectedFilter === 'all' || category === selectedFilter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/**
 * Global function called when user clicks "Order Item" on any menu card
 * @param {string} itemName - Name of the item
 * @param {number} price - Price in Rupees
 */
function orderItem(itemName, price) {
  showToast(`Added ${itemName} (₹${price}) to your order! ☕ Visit our counter or call to confirm.`);
}

/* --------------------------------------------------------------------------
   3. Contact Form Validation & Friendly Feedback
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('cafeContactForm');
  const submitBtn = document.getElementById('formSubmitBtn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent standard page reload

    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const messageInput = document.getElementById('userMessage');

    let isValid = true;
    clearFormErrors();

    // 1. Name validation
    if (!nameInput.value.trim()) {
      showError('name', 'Please enter your name.');
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      showError('name', 'Name must have at least 2 characters.');
      isValid = false;
    }

    // 2. Email validation (RFC standard regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      showError('email', 'Please enter your email address.');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      showError('email', 'Please provide a valid email format (e.g. name@example.com).');
      isValid = false;
    }

    // 3. Message validation
    if (!messageInput.value.trim()) {
      showError('message', 'Please enter your message or question.');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showError('message', 'Message must be at least 10 characters long.');
      isValid = false;
    }

    // If valid, simulate sending with loading state
    if (isValid) {
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';

      // Simulate a small delay for user feedback
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        form.reset();
        showToast('Thank you! Your message has been received. We will get back to you soon. ☕');
      }, 1000);
    }
  });

  // Helper to show error below an input
  function showError(field, message) {
    let inputEl;
    if (field === 'name') inputEl = document.getElementById('userName');
    if (field === 'email') inputEl = document.getElementById('userEmail');
    if (field === 'message') inputEl = document.getElementById('userMessage');

    const errorEl = document.getElementById(`${field}Error`);
    if (inputEl) inputEl.classList.add('input-error');
    if (errorEl) errorEl.textContent = message;
  }

  // Helper to clear error highlights
  function clearFormErrors() {
    ['userName', 'userEmail', 'userMessage'].forEach((id) => {
      const input = document.getElementById(id);
      if (input) input.classList.remove('input-error');
    });

    ['nameError', 'emailError', 'messageError'].forEach((id) => {
      const errorEl = document.getElementById(id);
      if (errorEl) errorEl.textContent = '';
    });
  }
}

/* --------------------------------------------------------------------------
   4. Gallery Lightbox Modal
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');

  if (!lightbox) return;

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('h4');

      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = title ? title.textContent : '';
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
      }
    });
  });

  // Close lightbox handler
  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  // Close when clicking backdrop
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   5. Toast Notification System
   -------------------------------------------------------------------------- */
function showToast(message) {
  const toast = document.getElementById('toastMessage');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  // Automatically fade out after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* --------------------------------------------------------------------------
   6. Scroll-to-Top Floating Button
   -------------------------------------------------------------------------- */
function initScrollToTop() {
  const scrollBtn = document.getElementById('scrollToTopBtn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   7. Dynamic Current Year
   -------------------------------------------------------------------------- */
function initDynamicYear() {
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}
