import { STATES } from '../../../core/NotificationStateMachine';

export class ChatManualBehavior {
  constructor(stateMachine, chatIcon, container) {
    this.stateMachine = stateMachine;
    this.chatIcon = chatIcon;
    this.container = container;
    this.messages = [];
    this.input = null;
    this.sendBtn = null;
    this.messagesArea = null;
    this.clickHandler = null;
    this.blurHandler = null;

    this.initUI();
    this.setupEventListeners();
    this.setupStateListener();
  }

  initUI() {
    this.input = this.container.querySelector('.chat-input');
    this.sendBtn = this.container.querySelector('.chat-send-btn');
    this.messagesArea = this.container.querySelector('.chat-messages');
  }

  setupEventListeners() {
    this.chatIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleChatIconClick();
    });

    this.sendBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.sendMessage();
    });

    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.stopPropagation();
        this.sendMessage();
      }
    });

    this.container.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Click inside document but outside island
    this.clickHandler = (e) => {
      const island = document.querySelector('.maddies-little-island');
      const isClickInsideIsland = island && island.contains(e.target);
      
      if (!isClickInsideIsland) {
        console.log('Click inside window but outside island - collapsing');
        this.forceCollapse();
      }
    };

    document.addEventListener('mousedown', this.clickHandler);

    // CRITICAL: Window loses focus (click outside window entirely)
    this.blurHandler = () => {
      console.log('Window lost focus (click outside) - collapsing chat');
      this.forceCollapse();
    };
  }

  setupStateListener() {
    this.stateMachine.subscribe(({ oldState, newState }) => {
      if (newState === STATES.CHAT_EXPANDED) {
        this.showChat();
        // Add blur listener when chat opens
        window.addEventListener('blur', this.blurHandler);
      } else if (oldState === STATES.CHAT_EXPANDED) {
        this.hideChat();
        // Remove blur listener when chat closes
        window.removeEventListener('blur', this.blurHandler);
      }
    });
  }

  handleChatIconClick() {
    console.log('User clicked chat icon');
    const currentState = this.stateMachine.getState();
    
    if (currentState === STATES.CHAT_EXPANDED) {
      this.forceCollapse();
    } else {
      // Close email popup if open
      const emailPopup = document.querySelector('.email-popup');
      if (emailPopup) {
        emailPopup.style.display = 'none';
      }
      
      this.stateMachine.requestStateChange(STATES.COLLAPSED, 'manual');
      
      const success = this.stateMachine.requestStateChange(
        STATES.CHAT_EXPANDED,
        'manual'
      );
      
      if (success) {
        this.chatIcon.classList.add('active');
        setTimeout(() => this.input.focus(), 100);
      }
    }
  }

  forceCollapse() {
    console.log('Force collapsing chat');
    
    const currentState = this.stateMachine.getState();
    if (currentState !== STATES.CHAT_EXPANDED && currentState !== STATES.MANUAL_HOVER) {
      return; // Already collapsed or in other state
    }

    this.stateMachine.requestStateChange(STATES.COLLAPSED, 'manual');
    
    const innerWrapper = document.querySelector('.inner-wrapper');
    if (innerWrapper) {
      innerWrapper.classList.remove('chat-expanded');
    }
    
    this.chatIcon.classList.remove('active');
    
    // Force window resize via runtime
    import('../../../../../wailsjs/runtime/runtime').then(({ WindowSetSize }) => {
      WindowSetSize(104, 40);
    });
  }

  showChat() {
    const innerWrapper = document.querySelector('.inner-wrapper');
    innerWrapper.classList.add('chat-expanded');
    this.chatIcon.classList.add('active');
    this.renderMessages();
    setTimeout(() => this.input.focus(), 100);
  }

  hideChat() {
    const innerWrapper = document.querySelector('.inner-wrapper');
    innerWrapper.classList.remove('chat-expanded');
    this.chatIcon.classList.remove('active');
  }

  sendMessage() {
    const text = this.input.value.trim();
    if (!text) return;

    this.messages.push({
      text: text,
      isUser: true,
      timestamp: new Date().toISOString()
    });

    this.input.value = '';
    this.renderMessages();
    this.scrollToBottom();
  }

  renderMessages() {
    const html = this.messages.map(function(msg) {
      const userClass = msg.isUser ? 'user' : '';
      const escapedText = this.escapeHtml(msg.text);
      return '<div class=\"chat-message ' + userClass + '\">' + escapedText + '</div>';
    }.bind(this)).join('');
    this.messagesArea.innerHTML = html;
  }

  scrollToBottom() {
    this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
