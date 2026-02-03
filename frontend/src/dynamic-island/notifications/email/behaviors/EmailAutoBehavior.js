import { STATES } from '../../../core/NotificationStateMachine';

/**
 * Handles AUTOMATIC email notification behavior
 * - Auto-expands when new email arrives
 * - Auto-shows notification
 * - Auto-dismisses after timeout
 */
export class EmailAutoBehavior {
  constructor(stateMachine, emailManager, emailDetector) {
    this.stateMachine = stateMachine;
    this.emailManager = emailManager;
    this.emailDetector = emailDetector;
    this.autoDismissTimeout = null;
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for new emails
    this.emailDetector.onNewEmails((newEmails) => {
      this.handleNewEmails(newEmails);
    });
  }

  handleNewEmails(newEmails) {
    console.log(`🔔 AUTO: ${newEmails.length} new email(s) - attempting auto-notification`);
    
    // Request AUTO_NOTIFICATION state
    const success = this.stateMachine.requestStateChange(
      STATES.AUTO_NOTIFICATION, 
      'auto'
    );

    if (success) {
      // Show ONLY the new email(s), not all emails
      this.showNewEmailNotification(newEmails);
      
      // Auto-dismiss after 5 seconds
      this.scheduleAutoDismiss();
    } else {
      console.log('⚠️ AUTO: Could not show notification (manual interaction in progress)');
    }
  }

  /**
   * Show notification with ONLY the new email(s)
   */
  showNewEmailNotification(newEmails) {
    const popup = this.emailManager.popup;
    if (!popup) return;
    
    const emailList = popup.querySelector('.email-list');
    
    // Render ONLY the new email(s)
    emailList.innerHTML = newEmails.map(email => `
      <div class="email-item new-email">
        <div class="email-from">${email.from}</div>
        <div class="email-subject">${email.title}</div>
        <div class="email-snippet">${email.summary}</div>
      </div>
    `).join('');
    
    popup.style.display = 'block';
  }

  scheduleAutoDismiss() {
    // Clear any existing timeout
    if (this.autoDismissTimeout) {
      clearTimeout(this.autoDismissTimeout);
    }

    // Dismiss after 5 seconds
    this.autoDismissTimeout = setTimeout(() => {
      console.log('⏰ AUTO: Auto-dismissing notification');
      
      const success = this.stateMachine.requestStateChange(
        STATES.COLLAPSED, 
        'auto'
      );

      if (success) {
        this.emailManager.hidePopup();
      }
    }, 5000);
  }

  /**
   * Cancel auto-dismiss (called when user interacts)
   */
  cancelAutoDismiss() {
    if (this.autoDismissTimeout) {
      clearTimeout(this.autoDismissTimeout);
      this.autoDismissTimeout = null;
      console.log('🛑 AUTO: Auto-dismiss canceled (user interaction)');
    }
  }
}
