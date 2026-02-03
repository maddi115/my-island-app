/**
 * Central state manager for all dynamic island states
 * Enforces valid state transitions and prevents conflicts
 */

export const STATES = {
  COLLAPSED: 'COLLAPSED',
  MANUAL_HOVER: 'MANUAL_HOVER',
  MANUAL_POPUP: 'MANUAL_POPUP',
  AUTO_NOTIFICATION: 'AUTO_NOTIFICATION'
};

export class NotificationStateMachine {
  constructor() {
    this.currentState = STATES.COLLAPSED;
    this.listeners = [];
  }

  /**
   * Request a state change
   * Returns true if transition allowed, false otherwise
   */
  requestStateChange(newState, source = 'unknown') {
    // Validate state exists
    if (!Object.values(STATES).includes(newState)) {
      console.error(`Invalid state: ${newState}`);
      return false;
    }

    // Already in this state
    if (this.currentState === newState) {
      return true;
    }

    // Check if transition is valid
    if (!this.isValidTransition(this.currentState, newState, source)) {
      console.warn(`Invalid transition: ${this.currentState} → ${newState} (source: ${source})`);
      return false;
    }

    // Execute transition
    const oldState = this.currentState;
    this.currentState = newState;
    
    console.log(`State transition: ${oldState} → ${newState} (source: ${source})`);
    
    // Notify listeners
    this.notifyListeners(oldState, newState, source);
    
    return true;
  }

  /**
   * Validate state transitions
   * RULE: Manual interactions ALWAYS override automatic
   */
  isValidTransition(from, to, source) {
    // Manual always wins - can interrupt anything
    if (source === 'manual') {
      return true;
    }

    // Auto cannot interrupt manual states
    if (source === 'auto' && 
        (from === STATES.MANUAL_HOVER || from === STATES.MANUAL_POPUP)) {
      return false;
    }

    // All other transitions allowed
    return true;
  }

  /**
   * Subscribe to state changes
   */
  subscribe(callback) {
    this.listeners.push(callback);
  }

  /**
   * Notify all listeners of state change
   */
  notifyListeners(oldState, newState, source) {
    this.listeners.forEach(listener => {
      listener({ oldState, newState, source });
    });
  }

  /**
   * Get current state
   */
  getState() {
    return this.currentState;
  }
}
