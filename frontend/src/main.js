import "./style.css";
document.querySelector("#app").innerHTML = `
    <section class="maddies-little-island">
      <div class="inner-wrapper">
        <div class="app-title">Hover to explore</div>
        <div class="default-profile">
          <div class="app-icon" data-app="maddie"></div>
        </div>
        <div class="apps-container">
          <div class="app-icon" data-app="maddie"></div>
          <div class="app-icon"><i>📅</i></div>
          <div class="app-icon"><i>🎵</i></div>
          <div class="app-icon"><i>📷</i></div>
          <div class="app-icon"><i>⚙️</i></div>
        </div>
      </div>
    </section>
`;
