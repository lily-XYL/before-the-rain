(() => {
  'use strict';
  const desktop = window.RainDesktop;
  if (!desktop) return;
  const group = document.createElement('div');
  group.className = 'window-controls';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', '窗口操作');
  group.innerHTML = '<button id="window-minimize" title="最小化" aria-label="最小化"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 11h12"/></svg></button><button id="window-maximize" title="最大化" aria-label="最大化"><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="3" width="10" height="10"/></svg></button><button id="window-close" title="关闭游戏" aria-label="关闭游戏"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 3 10 10M13 3 3 13"/></svg></button>';
  document.querySelector('.topbar').append(group);
  document.getElementById('window-minimize').onclick = () => desktop.minimize();
  document.getElementById('window-maximize').onclick = () => desktop.maximize();
  document.getElementById('window-close').onclick = () => desktop.close();
  let fullscreen = false;
  // CDP keyboard events and native keyboard events take different paths in Electron.
  document.addEventListener('keydown', event => {
    if (event.repeat) return;
    if (event.key === 'F11' || (event.key === 'Escape' && fullscreen)) {
      event.preventDefault(); event.stopImmediatePropagation(); desktop.fullscreen();
    }
  }, true);
  document.addEventListener('click', event => {
    if (event.target.closest('#fullscreen-button')) {
      event.preventDefault(); event.stopImmediatePropagation(); desktop.fullscreen();
    }
  }, true);
  function update(state) {
    if (!state) return;
    fullscreen = state.fullscreen;
    const expanded = state.maximized || state.fullscreen;
    const button = document.getElementById('window-maximize');
    button.title = expanded ? '还原窗口' : '最大化';
    button.setAttribute('aria-label', button.title);
    button.setAttribute('aria-pressed', String(expanded));
    button.querySelector('svg').innerHTML = expanded ? '<path d="M5 3V1h10v10h-2"/><rect x="1" y="5" width="10" height="10"/>' : '<rect x="3" y="3" width="10" height="10"/>';
  }
  desktop.onState(update);
  desktop.state().then(update);
})();
