# Premium Registration Form - Project 4

A professional registration form with custom JavaScript validation, regex patterns, ARIA accessibility, and premium UI design.

## 🎯 Project Objectives

- Implement custom form validation without relying on browser defaults
- Use regex patterns for email and password validation
- Create accessible forms following WCAG guidelines with ARIA attributes
- Design a modern, premium user interface with glassmorphism effects
- Provide real-time validation feedback to users
- Integrate form submission with REST API
- Ensure responsive design across all devices

## 🌟 Overview

This project demonstrates advanced frontend development skills including form validation, accessibility implementation, and modern UI/UX design. Built entirely with vanilla HTML, CSS, and JavaScript without any frameworks or libraries.

## ✨ Key Features

**Validation & Functionality**
- Custom JavaScript validation (no browser defaults)
- Real-time validation with debouncing
- Regex patterns for email and password
- Password strength meter with 5 levels
- Show/hide password toggle
- Form submission to REST API
- Loading states during submission

**Premium UI Design**
- Glassmorphism effects with backdrop blur
- Vibrant gradient backgrounds
- Smooth animations and transitions
- Visual validation indicators (✓/✕)
- Responsive design for all devices
- Modern color palette and typography

**Accessibility (WCAG 2.1 AA)**
- ARIA attributes for screen readers
- Live regions for dynamic announcements
- Keyboard navigation support
- Focus management on errors
- Semantic HTML structure

## 🛠️ Technologies Used

- **HTML5** - Semantic markup, ARIA attributes
- **CSS3** - Custom properties, flexbox, animations, glassmorphism
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **Regex** - Email and password pattern matching
- **Fetch API** - Asynchronous form submission
- **JSONPlaceholder** - Demo REST API endpoint

## 📦 Installation & Usage

1. Clone or download the repository
2. Open `index.html` in a web browser
3. Fill in the form fields with valid data
4. Submit to see validation and API response

**No build process or dependencies required!**

## 🔒 Validation Rules

**Full Name:** Required, non-empty

**Email:** Required, must match pattern `user@domain.com`
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

**Password:** Required, minimum 8 characters with:
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character: `# ? ! @ $ % ^ & * -`
- Regex: `/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/`

**Confirm Password:** Must match password field

**Terms & Conditions:** Must be checked

## ♿ Accessibility Features

- `aria-required`, `aria-invalid`, `aria-describedby` attributes
- `aria-live="polite"` for status announcements
- Semantic HTML with proper labels
- Keyboard navigation support
- Focus management on validation errors
- WCAG 2.1 Level AA compliant

## 📁 Project Structure

```
├── index.html          # HTML structure with ARIA attributes
├── styles.css          # Premium UI styling and animations
├── script.js           # Validation logic and interactions
└── README.md           # Documentation
```

## � Learning Outcomes

This project demonstrates proficiency in:
- Custom form validation without browser defaults
- Regular expressions for pattern matching
- ARIA implementation for accessibility
- Modern CSS techniques (glassmorphism, animations)
- Asynchronous JavaScript with Fetch API
- Event handling and DOM manipulation
- Responsive web design principles
- User experience best practices

## 🌐 Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 👨‍💻 Author

**[kamlesh kumar]**
-
  

## 📝 License

This project is open source and available under the MIT License.

---

**DecodeLabs - Frontend Development Project 4**
