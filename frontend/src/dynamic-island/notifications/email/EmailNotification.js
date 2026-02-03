import { EmailManager } from './EmailManager';
import { EmailDetector } from './EmailDetector';
import { EmailManualBehavior } from './behaviors/EmailManualBehavior';
import { EmailAutoBehavior } from './behaviors/EmailAutoBehavior';
import { EmailWindowBehavior } from './behaviors/EmailWindowBehavior';

/**
 * Main Email Notification module
 * Coordinates all email-related functionality
 */
export class EmailNotification {
  constructor(stateMachine) {
    this.stateMachine = stateMachine;
    this.manager = new EmailManager();
    this.detector = new EmailDetector(this.manager);
    this.manualBehavior = null;
    this.autoBehavior = null;
    this.windowBehavior = null;
  }

  /**
   * Initialize email notification system
   */
  init(island) {
    // Setup UI
    const emailIcon = this.manager.initUI(island);
    
    // Setup window behavior for email notifications
    this.windowBehavior = new EmailWindowBehavior(this.stateMachine);
    
    // Setup behaviors
    this.manualBehavior = new EmailManualBehavior(
      this.stateMachine,
      this.manager,
      emailIcon
    );

    this.autoBehavior = new EmailAutoBehavior(
      this.stateMachine,
      this.manager,
      this.detector
    );

    // Start polling for new emails
    this.detector.startPolling(3000);

    console.log('✅ Email notification system initialized');
    console.log('   📧 Email window behavior registered');
  }

  /**
   * Clean up
   */
  destroy() {
    this.detector.stopPolling();
  }
}
