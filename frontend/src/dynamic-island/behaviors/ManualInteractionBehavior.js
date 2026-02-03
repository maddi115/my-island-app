import { STATES } from '../core/NotificationStateMachine';

/**
 * Handles general manual interactions with the dynamic island
 * - Mouse hover in/out
 */
export class ManualInteractionBehavior {
  constructor(stateMachine, island, emailAutoBehavior) {
    this.stateMachine = stateMachine;
    this.island = island;
    this.emailAutoBehavior = emailAutoBehavior;
    this.hoverTimeout = null;
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Mouse enters island
    this.island.addEventListener('mouseenter', () => {
      this.handleMouseEnter();
    });

    // Mouse leaves island
    this.island.addEventListener('mouseleave', () => {
      this.handleMouseLeave();
    });
  }

  handleMouseEnter() {
    clearTimeout(this.hoverTimeout);
    
    const currentState = this.stateMachine.getState();
    
    // If auto-notification is showing, cancel its auto-dismiss
    if (currentState === STATES.AUTO_NOTIFICATION) {
      this.emailAutoBehavior.cancelAutoDismiss();
    }
    
    // Only transition to MANUAL_HOVER if collapsed
    if (currentState === STATES.COLLAPSED) {
      console.log('🖱️ Mouse entered island (MANUAL)');
      this.stateMachine.requestStateChange(STATES.MANUAL_HOVER, 'manual');
    }
  }

  handleMouseLeave() {
    clearTimeout(this.hoverTimeout);
    
    // Delay collapse slightly to prevent flickering
    this.hoverTimeout = setTimeout(() => {
      const currentState = this.stateMachine.getState();
      
      console.log('🖱️ Mouse left island (MANUAL) - collapsing from:', currentState);
      
      // ALWAYS collapse when hovering out (manual overrides auto)
      this.stateMachine.requestStateChange(STATES.COLLAPSED, 'manual');
      
      // Hide any visible popups
      const popup = document.querySelector('.email-popup');
      if (popup && popup.style.display === 'block') {
        popup.style.display = 'none';
      }
    }, 150);
  }
}
