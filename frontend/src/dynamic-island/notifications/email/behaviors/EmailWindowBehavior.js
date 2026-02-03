import { WindowSetSize } from '../../../../../wailsjs/runtime/runtime';
import { STATES } from '../../../core/NotificationStateMachine';

/**
 * Email-specific window resize behavior
 * Handles window sizing for email notifications
 */

const EMAIL_WINDOW_SIZES = {
  [STATES.MANUAL_POPUP]: { width: 320, height: 460 },
  [STATES.AUTO_NOTIFICATION]: { width: 320, height: 460 }
};

export class EmailWindowBehavior {
  constructor(stateMachine) {
    this.stateMachine = stateMachine;
    this.setupStateListener();
  }

  setupStateListener() {
    // Listen for email-related state changes
    this.stateMachine.subscribe(({ newState, source }) => {
      // Only handle email-specific states
      if (newState === STATES.MANUAL_POPUP || newState === STATES.AUTO_NOTIFICATION) {
        this.resizeForEmailState(newState);
      }
    });
  }

  resizeForEmailState(state) {
    const size = EMAIL_WINDOW_SIZES[state];
    if (size) {
      WindowSetSize(size.width, size.height);
      console.log(`📧 Email window resize: ${size.width}x${size.height} (state: ${state})`);
    }
  }
}
