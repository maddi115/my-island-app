import { NotificationStateMachine } from './core/NotificationStateMachine';
import { WindowResizeStatesDefault } from './core/WindowResizeStates-Default';
import { ManualInteractionBehavior } from './behaviors/ManualInteractionBehavior';
import { NotificationCoordinator } from './behaviors/NotificationCoordinator';
import { EmailNotification } from './notifications/email/EmailNotification';
import { ChatNotification } from './notifications/chat/ChatNotification';

export function initDynamicIsland() {
  const island = document.querySelector('.maddies-little-island');

  if (!island) {
    console.error('Island element not found');
    return;
  }

  const stateMachine = new NotificationStateMachine();
  const defaultWindowBehavior = new WindowResizeStatesDefault(stateMachine);
  const coordinator = new NotificationCoordinator(stateMachine);

  const emailNotification = new EmailNotification(stateMachine);
  emailNotification.init(island);
  coordinator.register(emailNotification);

  const chatNotification = new ChatNotification(stateMachine);
  chatNotification.init(island);
  coordinator.register(chatNotification);

  const manualBehavior = new ManualInteractionBehavior(
    stateMachine,
    island,
    emailNotification.autoBehavior
  );

  console.log('Dynamic Island initialized');
  console.log('Chat notifications ready');
}
