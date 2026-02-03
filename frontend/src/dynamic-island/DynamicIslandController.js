import { NotificationStateMachine } from './core/NotificationStateMachine';
import { WindowResizeStatesDefault } from './core/WindowResizeStates-Default';
import { ManualInteractionBehavior } from './behaviors/ManualInteractionBehavior';
import { NotificationCoordinator } from './behaviors/NotificationCoordinator';
import { EmailNotification } from './notifications/email/EmailNotification';

/**
 * Main Dynamic Island Controller
 * Orchestrates all components
 */
export function initDynamicIsland() {
  const island = document.querySelector('.maddies-little-island');
  
  if (!island) {
    console.error('Island element not found');
    return;
  }

  // Initialize core systems
  const stateMachine = new NotificationStateMachine();
  const defaultWindowBehavior = new WindowResizeStatesDefault(stateMachine);
  const coordinator = new NotificationCoordinator(stateMachine);

  // Initialize email notification module (includes EmailWindowBehavior)
  const emailNotification = new EmailNotification(stateMachine);
  emailNotification.init(island);
  coordinator.register(emailNotification);

  // Initialize general manual interactions (hover)
  const manualBehavior = new ManualInteractionBehavior(
    stateMachine, 
    island,
    emailNotification.autoBehavior
  );

  console.log('🏝️ Dynamic Island initialized');
  console.log('📊 State Machine ready');
  console.log('🪟 Default window behavior ready');
  console.log('📧 Email notifications ready (with window behavior)');
  console.log('🔔 Automatic notifications enabled (NEW emails only)');
}
