// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger icon
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
});

// ============================================
// SMOOTH SCROLLING
// ============================================

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');

    if (targetId.startsWith('#')) {
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  });
});

// ============================================
// ACTIVE SECTION HIGHLIGHTING
// ============================================

const sections = document.querySelectorAll('.section');

function highlightActiveSection() {
  const scrollPosition = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', highlightActiveSection);

// ============================================
// DYNAMIC YEAR IN FOOTER
// ============================================

function updateFooterYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ============================================
// EMAILJS CONTACT FORM SUBMISSION
// ============================================

function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.btn-submit');
      const submitBtnText = submitBtn.querySelector('span');
      const submitBtnIcon = submitBtn.querySelector('i');
      
      // Set loading state
      submitBtn.disabled = true;
      const originalText = submitBtnText.textContent;
      submitBtnText.textContent = 'Sending...';
      const originalIconClass = submitBtnIcon.className;
      submitBtnIcon.className = 'fas fa-spinner fa-spin';
      
      formStatus.style.display = 'none';
      formStatus.className = 'form-status';
      
      const params = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
      };
      
      const serviceID = "service_uhtulac";
      const templateID = "template_2r4huuv";
      
      emailjs.send(serviceID, templateID, params)
        .then((res) => {
          // Reset form
          contactForm.reset();
          
          // Show success status
          // formStatus.className = 'form-status success';
          // formStatus.textContent = 'Your message has been sent successfully! Thank you.';
          
          // // Reset button
          // submitBtn.disabled = false;
          // submitBtnText.textContent = originalText;
          // submitBtnIcon.className = originalIconClass;

          formStatus.style.display = "block";
          formStatus.className = "form-status success";
          formStatus.innerHTML = "✅ Your message has been sent successfully!";

          submitBtn.disabled = false;
          submitBtnText.textContent = originalText;
          submitBtnIcon.className = originalIconClass;
        })
        .catch((err) => {
          console.error("Email sending failed:", err);
          
          // Show error status
          formStatus.className = 'form-status error';
          formStatus.textContent = 'Failed to send message. Please try again later.';
          
          // Reset button
          submitBtn.disabled = false;
          submitBtnText.textContent = originalText;
          submitBtnIcon.className = originalIconClass;
        });
    });
  }
}

// ============================================
// VESTIQUE AI CHAT ASSISTANT
// ============================================

function initAIChat() {
  const launcher = document.getElementById('ai-chat-launcher');
  const chatBox = document.getElementById('ai-chat-box');
  const closeBtn = document.getElementById('ai-chat-close');
  const sendBtn = document.getElementById('ai-chat-send');
  const inputEl = document.getElementById('ai-chat-input');
  const messagesContainer = document.getElementById('ai-chat-messages');
  const tryDemoBtns = document.querySelectorAll('.try-demo-btn');

  let sessionId = null;
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2);
    localStorage.setItem('guestId', guestId);
  }

  // Toggle chat window
  function toggleChat() {
    chatBox.classList.toggle('open');
    if (chatBox.classList.contains('open')) {
      inputEl.focus();
    }
  }

  if (launcher) launcher.addEventListener('click', toggleChat);
  if (closeBtn) closeBtn.addEventListener('click', toggleChat);

  // Trigger from project card "Try Demo"
  tryDemoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!chatBox.classList.contains('open')) {
        chatBox.classList.add('open');
      }
      inputEl.focus();
      // Scroll to chat box
      chatBox.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  });

  // Add a message bubble
  function addMessage(role, text) {
    const msg = document.createElement('div');
    msg.className = `ai-message ${role}`;
    msg.textContent = text;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return msg;
  }

  // Fallback responses if backend is offline
  function getMockResponse(query) {
    const q = query.toLowerCase();
    if (q.includes('designer') || q.includes('tailor') || q.includes('rating') || q.includes('review')) {
      return "Vestique has 6 registered designers/tailors and multiple reviews indexed in ChromaDB. Designers have rating metrics calculated from reviews. Try asking the real AI to list the top designers!";
    }
    if (q.includes('fcm') || q.includes('push') || q.includes('notification') || q.includes('lambda')) {
      return "FCM Push Notifications are triggered using AWS Lambda and Django signals. When a designer uploads a post, it sends bulk push notifications to all logged-in user tokens in chunks of 500.";
    }
    if (q.includes('chromadb') || q.includes('vector') || q.includes('rag') || q.includes('ollama')) {
      return "Vestique uses a RAG (Retrieval-Augmented Generation) pipeline. Django models (designers, reviews, posts) are indexed as vector embeddings in ChromaDB, which Ollama queries to answer user questions contextually.";
    }
    if (q.includes('mongodb') || q.includes('mongo') || q.includes('data')) {
      return "MongoDB is running as container 'vestique_mongo' storing ai_sessions and ai_messages, allowing users to save and resume their AI Chat conversations.";
    }
    return "This is a local demo fallback. If you start your docker backend (vestique_auth, vestique_chat, vestique_mongo, vestique_redis, vestique_ollama), this widget will query your real RAG model! Ask me about: 'designers', 'push notifications', or 'ChromaDB vector indexing'.";
  }

  // Handle message sending
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    // Display user message
    addMessage('user', text);
    inputEl.value = '';

    // Typing indicator
    const typingIndicator = addMessage('ai typing', 'Typing...');

    try {
      // Attempt to contact local FastAPI AI chat API
      const response = await fetch('http://localhost/ai-chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          session_id: sessionId,
          guest_id: guestId
        })
      });

      // Remove typing indicator
      typingIndicator.remove();

      if (response.ok) {
        const data = await response.json();
        if (data.session_id) sessionId = data.session_id;
        addMessage('ai', data.ai_response || "No response received.");
      } else {
        throw new Error("Local server error");
      }
    } catch (error) {
      console.warn("FastAPI server offline, falling back to mock response.", error);
      typingIndicator.remove();
      
      // Simulate typing delay
      setTimeout(() => {
        const reply = getMockResponse(text);
        addMessage('ai', reply);
      }, 500);
    }
  }

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  updateFooterYear();
  highlightActiveSection();
  initContactForm();
  initAIChat();
});
