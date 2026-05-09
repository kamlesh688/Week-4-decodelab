/**
 * Project 4 - Form validation engine (semantic HTML + JS + regex + ARIA).
 * Enhanced with real-time validation, password strength, show/hide toggle, and loading states.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/;

const form = document.getElementById("registration-form");
const statusEl = document.getElementById("form-status");
const resultPanel = document.getElementById("result-panel");
const resultJson = document.getElementById("result-json");
const submitButton = form.querySelector('button[type="submit"]');

const fields = {
  fullName: {
    input: document.getElementById("fullName"),
    error: document.getElementById("fullName-error"),
    validate: (v) => {
      const t = v.trim();
      if (t === "") return "Please enter your name.";
      return "";
    },
  },
  email: {
    input: document.getElementById("email"),
    error: document.getElementById("email-error"),
    validate: (v) => {
      const t = v.trim();
      if (t === "") return "Please enter your email.";
      if (!EMAIL_REGEX.test(t))
        return "Enter a valid email (e.g. name@domain.com).";
      return "";
    },
  },
  password: {
    input: document.getElementById("password"),
    error: document.getElementById("password-error"),
    validate: (v) => {
      if (v === "") return "Please enter a password.";
      if (!PASSWORD_REGEX.test(v)) {
        return (
          "Error: Password must contain at least one uppercase letter, one lowercase letter, " +
          "one number, one special character from [#?!@$%^&*-], and be at least 8 characters."
        );
      }
      return "";
    },
  },
  confirmPassword: {
    input: document.getElementById("confirmPassword"),
    error: document.getElementById("confirmPassword-error"),
    validate: (v, all) => {
      if (v === "") return "Please confirm your password.";
      if (all.password !== v) return "Passwords must match.";
      return "";
    },
  },
  terms: {
    input: document.getElementById("terms"),
    error: document.getElementById("terms-error"),
    validate: (v) => {
      if (!v) return "You must agree to the terms to continue.";
      return "";
    },
  },
};

function getIndicator(fieldKey) {
  const wrap = fields[fieldKey].input.closest(".form__field");
  return wrap ? wrap.querySelector("[data-indicator]") : null;
}

function setFieldState(fieldKey, message, values) {
  const { input, error, validate } = fields[fieldKey];
  const vals = values || collectValues();
  const msg =
    message !== undefined
      ? message
      : validate(
          getValue(fieldKey, input),
          fieldKey === "confirmPassword" ? vals : undefined
        );
  const invalid = msg !== "";

  input.setAttribute("aria-invalid", invalid ? "true" : "false");
  error.textContent = invalid ? msg : "";
  error.setAttribute("role", invalid ? "alert" : "status");

  const ind = getIndicator(fieldKey);
  if (ind) {
    if (!input.value && fieldKey !== "terms") {
      ind.removeAttribute("data-state");
      ind.setAttribute("aria-hidden", "true");
    } else if (invalid) {
      ind.setAttribute("data-state", "invalid");
      ind.setAttribute("aria-hidden", "true");
    } else {
      ind.setAttribute("data-state", "valid");
      ind.setAttribute("aria-hidden", "true");
    }
  }

  return invalid;
}

function getValue(key, input) {
  if (input.type === "checkbox") return input.checked;
  return input.value;
}

function collectValues() {
  return {
    fullName: fields.fullName.input.value.trim(),
    email: fields.email.input.value.trim(),
    password: fields.password.input.value,
    confirmPassword: fields.confirmPassword.input.value,
    terms: fields.terms.input.checked,
  };
}

function validateAll() {
  const v = collectValues();
  const order = [
    "fullName",
    "email",
    "password",
    "confirmPassword",
    "terms",
  ];
  let firstMessage = "";
  let firstKey = null;
  let hasError = false;

  for (const key of order) {
    const msg = fields[key].validate(
      getValue(key, fields[key].input),
      key === "confirmPassword" ? v : undefined
    );
    const invalid = setFieldState(key, msg, v);
    if (invalid) {
      hasError = true;
      if (!firstMessage) {
        firstMessage = msg;
        firstKey = key;
      }
    }
  }

  return { hasError, firstMessage, firstKey };
}

function setStatus(text, tone) {
  statusEl.textContent = text;
  if (!text) {
    statusEl.removeAttribute("data-tone");
    return;
  }
  statusEl.setAttribute("data-tone", tone);
}

function announce(message, tone) {
  setStatus(message, tone);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  resultPanel.hidden = true;
  resultJson.textContent = "";

  const { hasError, firstMessage, firstKey } = validateAll();

  if (hasError) {
    announce(firstMessage || "Please fix the errors below.", "error");
    if (firstKey) fields[firstKey].input.focus();
    return;
  }

  const values = collectValues();
  const payload = {
    fullName: values.fullName,
    email: values.email,
    termsAccepted: values.terms,
  };

  setLoadingState(true);
  announce("Success: your details passed validation. Sending to demo API...", "success");

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "DecodeLabs P4 registration",
        body: JSON.stringify(payload),
        userId: 1,
      }),
    });
    const data = await res.json();

    resultPanel.hidden = false;
    resultJson.textContent = JSON.stringify(
      {
        packagedPayload: payload,
        apiResponse: data,
      },
      null,
      2
    );

    announce(
      "Form submitted successfully. Validated data was packaged as JSON and sent to the demo backend endpoint.",
      "success"
    );
    
    // Reset form after successful submission
    setTimeout(() => {
      resetForm();
    }, 1000);
    
  } catch {
    announce(
      "Validation passed, but the demo network request failed. Check your connection.",
      "error"
    );
    resultPanel.hidden = false;
    resultJson.textContent = JSON.stringify({ packagedPayload: payload }, null, 2);
  } finally {
    setLoadingState(false);
  }
});

function fieldLabel(key) {
  const el = fields[key].input;
  const lbl = el.labels && el.labels[0];
  return (lbl && lbl.textContent.trim()) || key;
}

function attachBlur(key) {
  const { input } = fields[key];
  input.addEventListener("blur", () => {
    const v = collectValues();
    const msg = fields[key].validate(
      getValue(key, input),
      key === "confirmPassword" ? v : undefined
    );
    setFieldState(key, msg, v);
    if (msg) announce(msg, "error");
    else {
      const hasValue =
        key === "terms" ? input.checked : String(input.value).trim() !== "";
      if (hasValue) announce(`${fieldLabel(key)} looks good.`, "success");
    }
  });
}

["fullName", "email", "password", "confirmPassword", "terms"].forEach(attachBlur);

// Real-time validation on input
function attachInput(key) {
  const { input } = fields[key];
  let timeout;
  input.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const v = collectValues();
      const msg = fields[key].validate(
        getValue(key, input),
        key === "confirmPassword" ? v : undefined
      );
      setFieldState(key, msg, v);
    }, 300); // Debounce for 300ms
  });
}

["fullName", "email", "password", "confirmPassword"].forEach(attachInput);

// Password strength calculator
function calculatePasswordStrength(password) {
  if (!password) return { strength: 0, text: "None" };
  
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[#?!@$%^&*-]/.test(password),
  };
  
  // Calculate strength
  if (checks.length) strength++;
  if (checks.uppercase && checks.lowercase) strength++;
  if (checks.number) strength++;
  if (checks.special) strength++;
  
  const labels = ["None", "Weak", "Fair", "Good", "Strong"];
  return { strength, text: labels[strength] };
}

// Update password strength indicator
const passwordInput = document.getElementById("password");
const strengthBar = document.querySelector(".password-strength__fill");
const strengthText = document.querySelector(".password-strength__text strong");

passwordInput.addEventListener("input", () => {
  const { strength, text } = calculatePasswordStrength(passwordInput.value);
  strengthBar.setAttribute("data-strength", strength);
  strengthText.textContent = text;
});

// Password toggle functionality
document.querySelectorAll(".form__toggle-password").forEach((button) => {
  button.addEventListener("click", () => {
    const control = button.closest(".form__control--password");
    const input = control.querySelector("input");
    const icon = button.querySelector(".toggle-icon");
    
    if (input.type === "password") {
      input.type = "text";
      icon.textContent = "🙈";
      button.setAttribute("aria-label", "Hide password");
    } else {
      input.type = "password";
      icon.textContent = "👁️";
      button.setAttribute("aria-label", "Show password");
    }
  });
});

// Loading state management
function setLoadingState(isLoading) {
  submitButton.setAttribute("data-loading", isLoading);
  submitButton.disabled = isLoading;
  
  const buttonText = submitButton.querySelector(".button__text");
  const buttonLoader = submitButton.querySelector(".button__loader");
  
  if (isLoading) {
    buttonText.style.display = "none";
    buttonLoader.hidden = false;
  } else {
    buttonText.style.display = "inline-flex";
    buttonLoader.hidden = true;
  }
}

// Enhanced form reset
function resetForm() {
  form.reset();
  Object.keys(fields).forEach((key) => {
    setFieldState(key, "", collectValues());
    const ind = getIndicator(key);
    if (ind) {
      ind.removeAttribute("data-state");
    }
  });
  
  // Reset password strength
  strengthBar.setAttribute("data-strength", "0");
  strengthText.textContent = "None";
  
  // Clear status
  setStatus("", "");
}

// Add keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + Enter to submit
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    form.dispatchEvent(new Event("submit"));
  }
});
