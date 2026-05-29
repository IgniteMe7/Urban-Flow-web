// Form Handler for Urban Flow Tutoring Website

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.contact-form');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Mobile Menu Toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      navMenu.style.display = isExpanded ? 'none' : 'flex';
      navMenu.style.flexDirection = 'column';
      navMenu.style.position = 'absolute';
      navMenu.style.top = '100%';
      navMenu.style.left = '0';
      navMenu.style.right = '0';
    });

    // Close menu when nav link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.style.display = 'none';
      });
    });
  }

  // Form Validation and Submission
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const interest = document.getElementById('interest').value;
      const message = document.getElementById('message').value.trim();

      // Validation
      if (!name || !email || !interest || !message) {
        showMessage('Please fill in all required fields.', 'error');
        return;
      }

      // Email validation
      if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Phone validation (if provided)
      if (phone && !isValidPhone(phone)) {
        showMessage('Please enter a valid phone number.', 'error');
        return;
      }

      // If using Formspree, the form will submit automatically
      // Otherwise, handle custom submission
      submitForm(name, email, phone, interest, message);
    });
  }
});

// Email Validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone Validation (South African format)
function isValidPhone(phone) {
  const phoneRegex = /^(\+27|0)[0-9]{9,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Show Message
function showMessage(message, type) {
  // Remove existing message if any
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create message element
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message ${type}`;
  messageDiv.textContent = message;
  messageDiv.style.padding = '15px';
  messageDiv.style.marginBottom = '15px';
  messageDiv.style.borderRadius = '8px';
  messageDiv.style.fontWeight = '500';

  if (type === 'error') {
    messageDiv.style.backgroundColor = '#ffebee';
    messageDiv.style.color = '#c62828';
    messageDiv.style.border = '1px solid #ef5350';
  } else if (type === 'success') {
    messageDiv.style.backgroundColor = '#e8f5e9';
    messageDiv.style.color = '#2e7d32';
    messageDiv.style.border = '1px solid #66bb6a';
  }

  // Insert message at the top of the form
  const form = document.querySelector('.contact-form');
  form.insertBefore(messageDiv, form.firstChild);

  // Remove message after 5 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Submit Form (if not using Formspree)
function submitForm(name, email, phone, interest, message) {
  // Option 1: Send to a backend service
  // Option 2: Send via email API
  // For now, show success message
  
  console.log('Form submitted:', {
    name,
    email,
    phone,
    interest,
    message
  });

  // Clear form
  document.querySelector('.contact-form').reset();
  
  // Show success message
  showMessage('Thank you! Your inquiry has been sent successfully. We\'ll contact you soon.', 'success');
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});
