/**
 * Detects new emails by comparing previous vs current state
 * Emits events when new emails are detected
 */
export class EmailDetector {
  constructor(emailManager) {
    this.emailManager = emailManager;
    this.previousEmailIds = new Set();
    this.listeners = [];
    this.pollInterval = null;
    this.isFirstCheck = true;
  }

  startPolling(intervalMs = 3000) { // 3 SECONDS
    console.log('🔄 Email polling started - checking EVERY 3 SECONDS');
    
    this.pollInterval = setInterval(() => {
      this.checkForNewEmails();
    }, 3000); // HARDCODED 3 SECONDS

    this.checkForNewEmails();
  }

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  async checkForNewEmails() {
    console.log('📥 Checking for new emails... (3 sec interval)');
    const currentEmails = await this.emailManager.fetchEmails();
    this.emailManager.updateEmails(currentEmails);

    console.log('📬 Found', currentEmails.length, 'total emails');

    const currentEmailIds = new Set(
      currentEmails.map(e => `${e.from}:${e.title}`)
    );

    if (this.isFirstCheck) {
      console.log('📋 Initial email check - loaded', currentEmails.length, 'email(s)');
      this.previousEmailIds = currentEmailIds;
      this.isFirstCheck = false;
      return;
    }

    const newEmails = currentEmails.filter(email => {
      const id = `${email.from}:${email.title}`;
      return !this.previousEmailIds.has(id);
    });

    this.previousEmailIds = currentEmailIds;

    if (newEmails.length > 0) {
      console.log(`🔔 ${newEmails.length} NEW email(s) just arrived!`);
      console.log('New emails:', newEmails);
      this.notifyListeners(newEmails);
    } else {
      console.log('✅ No new emails');
    }
  }

  onNewEmails(callback) {
    this.listeners.push(callback);
  }

  notifyListeners(newEmails) {
    this.listeners.forEach(listener => {
      listener(newEmails);
    });
  }
}
