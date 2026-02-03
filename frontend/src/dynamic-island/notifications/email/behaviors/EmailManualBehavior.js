import { STATES } from '../../../core/NotificationStateMachine';

/**
 * Handles MANUAL user interactions with email notifications
 * - User clicks email icon
 * - User closes popup
 */
export class EmailManualBehavior {
  constructor(stateMachine, emailManager, emailIcon) {
    this.stateMachine = stateMachine;
    this.emailManager = emailManager;
    this.emailIcon = emailIcon;
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Click email icon to open popup
    this.emailIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleEmailIconClick();
    });

    // Click popup background to close
    const popup = this.emailManager.popup;
    if (popup) {
      popup.addEventListener('click', (e) => {
        if (e.target.classList.contains('email-popup')) {
          this.handlePopupClose();
        }
      });
    }

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.email-icon') && !e.target.closest('.email-popup')) {
        this.handleClickOutside();
      }
    });
  }

  handleEmailIconClick() {
    console.log('📧 User clicked email icon (MANUAL)');
    
    // Request MANUAL_POPUP state
    const success = this.stateMachine.requestStateChange(
      STATES.MANUAL_POPUP, 
      'manual'
    );

    if (success) {
      this.emailManager.showPopup();
    }
  }

  handlePopupClose() {
    console.log('✖️ User closed popup (MANUAL)');
    
    // Check if still hovering island
    const island = document.querySelector('.maddies-little-island');
    const targetState = island && island.matches(':hover') 
      ? STATES.MANUAL_HOVER 
      : STATES.COLLAPSED;

    this.stateMachine.requestStateChange(targetState, 'manual');
    this.emailManager.hidePopup();
  }

  handleClickOutside() {
    // Only close if we're in a manual state
    const currentState = this.stateMachine.getState();
    if (currentState === STATES.MANUAL_POPUP) {
      this.handlePopupClose();
    }
  }
}
