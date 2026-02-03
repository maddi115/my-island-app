/**
 * Coordinates multiple notification types
 * Ensures only one notification shows at a time
 * Manages priority between different notification sources
 */
export class NotificationCoordinator {
  constructor(stateMachine) {
    this.stateMachine = stateMachine;
    this.notifications = [];
  }

  /**
   * Register a notification module
   */
  register(notification) {
    this.notifications.push(notification);
    console.log(`📋 Registered notification: ${notification.constructor.name}`);
  }

  /**
   * Get all registered notifications
   */
  getNotifications() {
    return this.notifications;
  }
}
