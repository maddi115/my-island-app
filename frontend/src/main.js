import './reset.css';
import './style.css';
import './dynamic-island/core/DynamicIslandBehavior.css';
import './dynamic-island/notifications/email/styles/email.css';
import './dynamic-island/notifications/email/styles/email-popup.css';
import './dynamic-island/notifications/email/styles/email-notification.css';
import { initDynamicIsland } from './dynamic-island/DynamicIslandController';

document.querySelector('#app').innerHTML = `
  <section class="maddies-little-island">
    <div class="inner-wrapper">
      <div class="app-title">Hover to explore</div>
      <div class="default-profile">
        <div class="app-icon" data-app="maddie"></div>
      </div>
      <div class="apps-container">
        <div class="app-icon" data-app="maddie"></div>
        <div class="app-icon"><i>📅</i></div>
      </div>
    </div>
  </section>
`;

// Initialize dynamic island
initDynamicIsland();
