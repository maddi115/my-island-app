import { STATES } from '../../../core/NotificationStateMachine';

export class EmailManualBehavior {
  constructor(stateMachine, emailManager, emailIcon) {
    this.stateMachine = stateMachine;
    this.emailManager = emailManager;
    this.emailIcon = emailIcon;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.emailIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleEmailIconClick();
    });

    const popup = this.emailManager.popup;
    if (popup) {
      popup.addEventListener('click', (e) => {
        if (e.target.classList.contains('email-popup')) {
          this.handlePopupClose();
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.email-icon') && !e.target.closest('.email-popup')) {
        this.handleClickOutside();
      }
    });
  }

  handleEmailIconClick() {
    console.log('User clicked email icon (MANUAL)');

    // CLOSE CHAT IF EXPANDED
    const currentState = this.stateMachine.getState();
    if (currentState === STATES.CHAT_EXPANDED) {
      this.stateMachine.requestStateChange(STATES.COLLAPSED, 'manual');
      // Remove chat-expanded class forcefully
      const innerWrapper = document.querySelector('.inner-wrapper');
      if (innerWrapper) {
        innerWrapper.classList.remove('chat-expanded');
      }
      const chatIcon = document.querySelector('.app-icon[data-app="chat"]');
      if (chatIcon) {
        chatIcon.classList.remove('active');
      }
    }

    const success = this.stateMachine.requestStateChange(
      STATES.MANUAL_POPUP,
      'manual'
    );

    if (success) {
      this.emailManager.showPopup();
    }
  }

  handlePopupClose() {
    console.log('User closed popup (MANUAL)');

    const island = document.querySelector('.maddies-little-island');
    const targetState = island && island.matches(':hover')
      ? STATES.MANUAL_HOVER
      : STATES.COLLAPSED;

    this.stateMachine.requestStateChange(targetState, 'manual');
    this.emailManager.hidePopup();
  }

  handleClickOutside() {
    const currentState = this.stateMachine.getState();
    if (currentState === STATES.MANUAL_POPUP) {
      this.handlePopupClose();
    }
  }
}
