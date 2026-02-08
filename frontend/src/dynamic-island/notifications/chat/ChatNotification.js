import { ChatManualBehavior } from './behaviors/ChatManualBehavior';
import { ChatWindowBehavior } from './behaviors/ChatWindowBehavior';

export class ChatNotification {
  constructor(stateMachine) {
    this.stateMachine = stateMachine;
    this.manualBehavior = null;
    this.windowBehavior = null;
    this.container = null;
  }

  init(island) {
    const chatIcon = island.querySelector('.app-icon[data-app="chat"]');
    if (!chatIcon) {
      console.error('Chat icon not found');
      return;
    }

    this.container = this.createChatContainer();
    const innerWrapper = island.querySelector('.inner-wrapper');
    innerWrapper.appendChild(this.container);

    this.windowBehavior = new ChatWindowBehavior(this.stateMachine);
    this.manualBehavior = new ChatManualBehavior(
      this.stateMachine,
      chatIcon,
      this.container
    );

    console.log('Chat notification system initialized');
  }

  createChatContainer() {
    const container = document.createElement('div');
    container.className = 'chat-container';
    
    container.innerHTML = `
      <div class="chat-messages"></div>
      <div class="chat-input-container">
        <input type="text" class="chat-input" placeholder="Type a message..." />
        <button class="chat-send-btn">?</button>
      </div>
    `;
    
    return container;
  }

  destroy() {
  }
}
