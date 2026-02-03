import { GetGoogleEmails } from '../../../../wailsjs/go/main/App';

/**
 * Manages email fetching and rendering
 */
export class EmailManager {
  constructor() {
    this.emails = [];
    this.popup = null;
    this.badge = null;
    this.emailIcon = null;
  }

  /**
   * Fetch emails from backend
   */
  async fetchEmails() {
    try {
      const newEmails = await GetGoogleEmails();
      return newEmails || [];
    } catch (err) {
      console.error('Failed to fetch emails:', err);
      return [];
    }
  }

  /**
   * Update current email list (ONLY if new emails exist)
   */
  updateEmails(emails) {
    // CRITICAL: Only update if we actually got emails
    // Don't clear the list if Gmail returns empty
    if (emails && emails.length > 0) {
      this.emails = emails;
      this.updateBadge();
    }
  }

  /**
   * Update badge count
   */
  updateBadge() {
    if (this.badge) {
      if (this.emails.length > 0) {
        this.badge.textContent = this.emails.length;
        this.badge.style.display = 'flex';
      } else {
        this.badge.style.display = 'none';
      }
    }
  }

  /**
   * Render email popup
   */
  renderPopup() {
    if (!this.popup) return;
    
    const emailList = this.popup.querySelector('.email-list');
    
    if (this.emails.length === 0) {
      emailList.innerHTML = '<div class="no-emails">No emails</div>';
    } else {
      emailList.innerHTML = this.emails.map(email => `
        <div class="email-item">
          <div class="email-from">${email.from}</div>
          <div class="email-subject">${email.title}</div>
          <div class="email-snippet">${email.summary}</div>
        </div>
      `).join('');
    }
  }

  /**
   * Show popup
   */
  showPopup() {
    if (this.popup) {
      this.renderPopup();
      this.popup.style.display = 'block';
    }
  }

  /**
   * Hide popup
   */
  hidePopup() {
    if (this.popup) {
      this.popup.style.display = 'none';
    }
  }

  /**
   * Initialize UI elements
   */
  initUI(island) {
    // Add email icon
    const appsContainer = island.querySelector('.apps-container');
    this.emailIcon = document.createElement('div');
    this.emailIcon.className = 'app-icon email-icon';
    this.emailIcon.innerHTML = '<i>📧</i><span class="email-badge">0</span>';
    appsContainer.appendChild(this.emailIcon);
    
    this.badge = this.emailIcon.querySelector('.email-badge');
    
    // Add popup
    this.popup = document.createElement('div');
    this.popup.className = 'email-popup';
    this.popup.innerHTML = `
      <div class="popup-header">Emails</div>
      <div class="email-list"></div>
    `;
    island.appendChild(this.popup);

    return this.emailIcon;
  }

  /**
   * Get current emails
   */
  getEmails() {
    return this.emails;
  }
}
