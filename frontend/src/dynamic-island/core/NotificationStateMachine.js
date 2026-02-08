/**
 * Central state manager for all dynamic island states
 * Enforces valid state transitions and prevents conflicts
 */

export const STATES = {
  COLLAPSED: 'COLLAPSED',
  MANUAL_HOVER: 'MANUAL_HOVER',
  MANUAL_POPUP: 'MANUAL_POPUP',
  AUTO_NOTIFICATION: 'AUTO_NOTIFICATION',
  CHAT_EXPANDED: 'CHAT_EXPANDED'
};

export class NotificationStateMachine {
  constructor() {
    this.currentState = STATES.COLLAPSED;
    this.listeners = [];
  }

  requestStateChange(newState, source = 'unknown') {
    if (!Object.values(STATES).includes(newState)) {
      console.error('Invalid state: ' + newState);
      return false;
    }
    if (this.currentState === newState) {
      return true;
    }
    if (!this.isValidTransition(this.currentState, newState, source)) {
      console.warn('Invalid transition: ' + this.currentState + ' -> ' + newState + ' (source: ' + source + ')');
      return false;
    }
    const oldState = this.currentState;
    this.currentState = newState;
    console.log('State transition: ' + oldState + ' -> ' + newState + ' (source: ' + source + ')');
    this.notifyListeners(oldState, newState, source);
    return true;
  }

  isValidTransition(from, to, source) {
    if (source === 'manual') {
      return true;
    }
    if (source === 'auto' &&
        (from === STATES.MANUAL_HOVER || from === STATES.MANUAL_POPUP || from === STATES.CHAT_EXPANDED)) {
      return false;
    }
    return true;
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notifyListeners(oldState, newState, source) {
    this.listeners.forEach(listener => {
      listener({ oldState, newState, source });
    });
  }

  getState() {
    return this.currentState;
  }
}
