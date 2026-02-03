import { WindowSetSize } from '../../../wailsjs/runtime/runtime';
import { STATES } from './NotificationStateMachine';

/**
 * Default window resize behavior for dynamic island
 * Handles only COLLAPSED and MANUAL_HOVER states
 * Notification-specific states are handled by notification modules
 */

const DEFAULT_WINDOW_SIZES = {
  [STATES.COLLAPSED]: { width: 104, height: 40 },
  [STATES.MANUAL_HOVER]: { width: 300, height: 45 }
};

export class WindowResizeStatesDefault {
  constructor(stateMachine) {
    this.stateMachine = stateMachine;
    this.setupStateListener();
  }

  setupStateListener() {
    // Listen to state changes
    this.stateMachine.subscribe(({ newState }) => {
      this.resizeForState(newState);
    });
  }

  resizeForState(state) {
    // Only handle default states (COLLAPSED, MANUAL_HOVER)
    const size = DEFAULT_WINDOW_SIZES[state];
    if (size) {
      WindowSetSize(size.width, size.height);
      console.log(`🏝️ Default window resize: ${size.width}x${size.height} (state: ${state})`);
    }
  }
}
