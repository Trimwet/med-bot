// MedBot Embed Widget v1.0
// Usage:
// <script
//   src="https://embed.medbot.ng/v1.js"
//   data-tenant="clinic_public_id"
//   data-theme="light"
//   data-locale="en-NG">
// </script>

(function() {
  'use strict';

  const CONFIG = {
    tenantId: null,
    theme: 'light',
    locale: 'en-NG',
    position: 'bottom-right',
    primaryColor: '#00A8A8',
    secondaryColor: '#073B4C',
    welcomeMessage: 'Hello! How can I help you today?',
    title: 'Medical Triage',
    subtitle: 'AI-powered health assessment',
  };

  // Parse script tag attributes
  function parseConfig() {
    const script = document.currentScript || document.querySelector('script[data-tenant]');
    if (!script) return;

    CONFIG.tenantId = script.getAttribute('data-tenant');
    CONFIG.theme = script.getAttribute('data-theme') || CONFIG.theme;
    CONFIG.locale = script.getAttribute('data-locale') || CONFIG.locale;
    CONFIG.position = script.getAttribute('data-position') || CONFIG.position;
    CONFIG.primaryColor = script.getAttribute('data-primary-color') || CONFIG.primaryColor;
    CONFIG.secondaryColor = script.getAttribute('data-secondary-color') || CONFIG.secondaryColor;
    CONFIG.welcomeMessage = script.getAttribute('data-welcome') || CONFIG.welcomeMessage;
    CONFIG.title = script.getAttribute('data-title') || CONFIG.title;
    CONFIG.subtitle = script.getAttribute('data-subtitle') || CONFIG.subtitle;
  }

  // Generate a session token for this widget instance
  function generateSessionToken() {
    const payload = {
      tenantId: CONFIG.tenantId,
      sessionId: 'widget_' + Math.random().toString(36).substr(2, 9),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    };
    // In production, this would be a signed JWT
    return btoa(JSON.stringify(payload));
  }

  // Create the widget container
  function createWidget() {
    const container = document.createElement('div');
    container.id = 'medbot-widget';
    container.innerHTML = `
      <style>
        #medbot-widget {
          position: fixed;
          ${CONFIG.position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;'}
          bottom: 20px;
          z-index: 9999;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        #medbot-widget * {
          box-sizing: border-box;
        }
        
        .medbot-fab {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: ${CONFIG.primaryColor};
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .medbot-fab:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }
        
        .medbot-fab svg {
          width: 28px;
          height: 28px;
        }
        
        .medbot-window {
          display: none;
          position: absolute;
          ${CONFIG.position === 'bottom-left' ? 'left: 0;' : 'right: 0;'}
          bottom: 70px;
          width: 380px;
          height: 560px;
          background: ${CONFIG.theme === 'dark' ? '#1a1a1a' : 'white'};
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          flex-direction: column;
        }
        
        .medbot-window.open {
          display: flex;
        }
        
        .medbot-header {
          background: ${CONFIG.secondaryColor};
          color: white;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .medbot-header-logo {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: ${CONFIG.primaryColor};
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .medbot-header-text h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .medbot-header-text p {
          margin: 0;
          font-size: 12px;
          opacity: 0.8;
        }
        
        .medbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .medbot-message {
          max-width: 85%;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .medbot-message.bot {
          background: ${CONFIG.theme === 'dark' ? '#2a2a2a' : '#f0f0f0'};
          color: ${CONFIG.theme === 'dark' ? 'white' : '#333'};
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }
        
        .medbot-message.user {
          background: ${CONFIG.primaryColor};
          color: white;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }
        
        .medbot-message.emergency {
          background: #dc2626;
          color: white;
        }
        
        .medbot-input-area {
          padding: 12px;
          border-top: 1px solid ${CONFIG.theme === 'dark' ? '#333' : '#eee'};
          display: flex;
          gap: 8px;
        }
        
        .medbot-input {
          flex: 1;
          padding: 12px;
          border: 1px solid ${CONFIG.theme === 'dark' ? '#333' : '#ddd'};
          border-radius: 8px;
          font-size: 14px;
          background: ${CONFIG.theme === 'dark' ? '#2a2a2a' : 'white'};
          color: ${CONFIG.theme === 'dark' ? 'white' : '#333'};
          outline: none;
        }
        
        .medbot-input:focus {
          border-color: ${CONFIG.primaryColor};
        }
        
        .medbot-send {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background: ${CONFIG.primaryColor};
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .medbot-send:hover {
          opacity: 0.9;
        }
        
        .medbot-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .medbot-typing {
          display: none;
          padding: 8px 12px;
          font-size: 12px;
          color: #666;
        }
        
        .medbot-typing.show {
          display: block;
        }
        
        .medbot-powered {
          text-align: center;
          padding: 8px;
          font-size: 10px;
          color: #999;
          background: ${CONFIG.theme === 'dark' ? '#1a1a1a' : '#f9f9f9'};
        }
      </style>
      
      <button class="medbot-fab" aria-label="Open medical triage">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
      
      <div class="medbot-window">
        <div class="medbot-header">
          <div class="medbot-header-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div class="medbot-header-text">
            <h3>${CONFIG.title}</h3>
            <p>${CONFIG.subtitle}</p>
          </div>
        </div>
        
        <div class="medbot-messages">
          <div class="medbot-message bot">${CONFIG.welcomeMessage}</div>
        </div>
        
        <div class="medbot-typing">
          <span>MedBot is typing...</span>
        </div>
        
        <div class="medbot-input-area">
          <input type="text" class="medbot-input" placeholder="Describe your symptoms..." />
          <button class="medbot-send" aria-label="Send message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        
        <div class="medbot-powered">
          Powered by MedBot
        </div>
      </div>
    `;

    document.body.appendChild(container);
    return container;
  }

  // API client
  const API = {
    baseUrl: 'https://api.medbot.ng',
    token: null,

    async init() {
      this.token = generateSessionToken();
      // In production, exchange the widget token for a session
      // For now, we'll use the demo endpoint
    },

    async sendMessage(message) {
      try {
        const response = await fetch(`${this.baseUrl}/api/demo/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-widget-token': this.token,
          },
          body: JSON.stringify({ message }),
        });
        
        if (!response.ok) throw new Error('Failed to send message');
        return await response.json();
      } catch (error) {
        console.error('MedBot API error:', error);
        throw error;
      }
    }
  };

  // Widget controller
  let widget = null;
  let isOpen = false;

  function toggleWidget() {
    if (!widget) {
      widget = createWidget();
      setupEventListeners();
    }
    
    isOpen = !isOpen;
    const window = widget.querySelector('.medbot-window');
    window.classList.toggle('open', isOpen);
    
    if (isOpen) {
      widget.querySelector('.medbot-input').focus();
    }
  }

  function setupEventListeners() {
    const fab = widget.querySelector('.medbot-fab');
    const input = widget.querySelector('.medbot-input');
    const sendBtn = widget.querySelector('.medbot-send');
    const messages = widget.querySelector('.medbot-messages');
    const typing = widget.querySelector('.medbot-typing');

    fab.addEventListener('click', toggleWidget);

    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;

      // Add user message
      messages.innerHTML += `<div class="medbot-message user">${escapeHtml(text)}</div>`;
      input.value = '';
      sendBtn.disabled = true;
      typing.classList.add('show');

      // Scroll to bottom
      messages.scrollTop = messages.scrollHeight;

      try {
        const response = await API.sendMessage(text);
        
        // Add bot response
        const isEmergency = response.triage === 'emergency';
        messages.innerHTML += `<div class="medbot-message bot ${isEmergency ? 'emergency' : ''}">${escapeHtml(response.reply)}</div>`;
        
        // Emit event for parent page
        window.dispatchEvent(new CustomEvent('medbot:message', {
          detail: {
            sessionId: response.sessionId,
            triage: response.triage,
            message: response.reply,
          }
        }));
      } catch (error) {
        messages.innerHTML += `<div class="medbot-message bot">Sorry, I'm having trouble connecting. Please try again.</div>`;
      } finally {
        typing.classList.remove('show');
        sendBtn.disabled = false;
        messages.scrollTop = messages.scrollHeight;
      }
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize
  parseConfig();
  if (CONFIG.tenantId) {
    API.init();
    
    // Expose global API
    window.MedBot = {
      open: () => { if (!isOpen) toggleWidget(); },
      close: () => { if (isOpen) toggleWidget(); },
      toggle: toggleWidget,
      config: CONFIG,
    };
  } else {
    console.error('MedBot: data-tenant attribute is required');
  }
})();
