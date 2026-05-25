// Form validation and submission handler
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const submitBtn = document.querySelector('.submit-btn');

  // Create error message containers for each field
  const fields = {
    name: { input: nameInput, errorMsg: null },
    email: { input: emailInput, errorMsg: null },
    message: { input: messageInput, errorMsg: null }
  };

  // Insert error message elements after each field
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.id = `${key}-error`;
    field.input.parentNode.appendChild(errorDiv);
    field.errorMsg = errorDiv;
  });

  // Validation rules
  const validators = {
    name: (value) => {
      if (!value.trim()) return 'Full name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return null;
    },
    email: (value) => {
      if (!value.trim()) return 'Email address is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Please enter a valid email address';
      return null;
    },
    message: (value) => {
      if (!value.trim()) return 'Message is required';
      if (value.trim().length < 10) return 'Message must be at least 10 characters';
      return null;
    }
  };

  // Validate single field
  function validateField(fieldName) {
    const field = fields[fieldName];
    const value = field.input.value;
    const error = validators[fieldName](value);

    if (error) {
      field.input.classList.add('error');
      field.errorMsg.textContent = error;
      field.errorMsg.classList.add('show');
      return false;
    } else {
      field.input.classList.remove('error');
      field.errorMsg.classList.remove('show');
      field.errorMsg.textContent = '';
      return true;
    }
  }

  // Real-time validation on blur
  Object.keys(fields).forEach(fieldName => {
    fields[fieldName].input.addEventListener('blur', () => {
      validateField(fieldName);
    });

    // Clear error on input
    fields[fieldName].input.addEventListener('input', () => {
      if (fields[fieldName].input.classList.contains('error')) {
        fields[fieldName].input.classList.remove('error');
        fields[fieldName].errorMsg.classList.remove('show');
        fields[fieldName].errorMsg.textContent = '';
      }
    });
  });

  // Form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Validate all fields
    const isNameValid = validateField('name');
    const isEmailValid = validateField('email');
    const isMessageValid = validateField('message');

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      return;
    }

    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      // Submit form via Formspree
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });

      // Remove any previous messages
      const oldSuccess = document.getElementById('form-success');
      const oldError = document.querySelector('.form-error');
      if (oldSuccess) oldSuccess.remove();
      if (oldError) oldError.remove();

      if (response.ok) {
        // Success message
        const successMsg = document.createElement('div');
        successMsg.id = 'form-success';
        successMsg.className = 'form-message show';
        successMsg.innerHTML = '✓ Thank you! We\'ve received your inquiry and will be in touch within 24 hours.';
        form.parentNode.insertBefore(successMsg, form);

        // Reset form
        form.reset();

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          successMsg.classList.remove('show');
          setTimeout(() => successMsg.remove(), 300);
        }, 5000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      // Error message
      const errorMsg = document.createElement('div');
      errorMsg.className = 'form-message show form-error';
      errorMsg.innerHTML = '✗ There was an issue sending your message. Please try again or contact us directly at info@imdt-solutions.co.za';
      form.parentNode.insertBefore(errorMsg, form);

      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        errorMsg.classList.remove('show');
        setTimeout(() => errorMsg.remove(), 300);
      }, 5000);
    } finally {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Technical Brief Request';
    }
  });
});
