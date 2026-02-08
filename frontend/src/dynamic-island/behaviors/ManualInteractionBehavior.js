import { STATES } from '../core/NotificationStateMachine';

export class ManualInteractionBehavior {
  constructor(stateMachine, island, emailAutoBehavior) {
    this.stateMachine = stateMachine;
    this.island = island;
    this.emailAutoBehavior = emailAutoBehavior;
    this.hoverTimeout = null;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.island.addEventListener('mouseenter', () => {
      this.handleMouseEnter();
    });

    this.island.addEventListener('mouseleave', () => {
      this.handleMouseLeave();
    });
  }

  handleMouseEnter() {
    clearTimeout(this.hoverTimeout);

    const currentState = this.stateMachine.getState();

    if (currentState === STATES.AUTO_NOTIFICATION) {
      this.emailAutoBehavior.cancelAutoDismiss();
    }

    if (currentState === STATES.COLLAPSED) {
      console.log('Mouse entered island (MANUAL)');
      this.stateMachine.requestStateChange(STATES.MANUAL_HOVER, 'manual');
    }
  }

  handleMouseLeave() {
    clearTimeout(this.hoverTimeout);

    this.hoverTimeout = setTimeout(() => {
      const currentState = this.stateMachine.getState();

      console.log('Mouse left island (MANUAL) - collapsing from:', currentState);

      // DONT collapse if chat is expanded (require explicit close)
      if (currentState === STATES.CHAT_EXPANDED) {
        console.log('Chat expanded - ignoring mouseleave');
        return;
      }

      this.stateMachine.requestStateChange(STATES.COLLAPSED, 'manual');

      const popup = document.querySelector('.email-popup');
      if (popup && popup.style.display === 'block') {
        popup.style.display = 'none';
      }
    }, 150);
  }
}
