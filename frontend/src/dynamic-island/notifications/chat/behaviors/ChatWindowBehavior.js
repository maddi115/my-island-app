import { WindowSetSize } from '../../../../../wailsjs/runtime/runtime';
import { STATES } from '../../../core/NotificationStateMachine';

const CHAT_WINDOW_SIZE = { width: 490, height: 400 };
const DEFAULT_SIZE = { width: 490, height: 40 };

export class ChatWindowBehavior {
  constructor(stateMachine) {
    this.stateMachine = stateMachine;
    this.setupStateListener();
  }

  setupStateListener() {
    this.stateMachine.subscribe(({ oldState, newState }) => {
      this.handleStateChange(oldState, newState);
    });
  }

  handleStateChange(oldState, newState) {
    if (newState === STATES.CHAT_EXPANDED) {
      this.expandWindow();
    } else if (oldState === STATES.CHAT_EXPANDED) {
      this.collapseWindow();
    }
  }

  expandWindow() {
    WindowSetSize(CHAT_WINDOW_SIZE.width, CHAT_WINDOW_SIZE.height);
    console.log('Chat window expanded: ' + CHAT_WINDOW_SIZE.width + 'x' + CHAT_WINDOW_SIZE.height);
  }

  collapseWindow() {
    WindowSetSize(DEFAULT_SIZE.width, DEFAULT_SIZE.height);
    console.log('Chat window collapsed: ' + DEFAULT_SIZE.width + 'x' + DEFAULT_SIZE.height);
  }
}
