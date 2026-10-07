(() => {
  'use strict';
  const key = 'before-the-rain-chapter-one-v1:';
  const native = window.RainAndroid;
  const panel = document.getElementById('panel');
  function size() { document.documentElement.style.setProperty('--rain-height', window.innerHeight + 'px'); }
  size(); window.addEventListener('resize', size);
  function toast(message) {
    const el = document.getElementById('toast'); el.textContent = message; el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 4000);
  }
  window.RainMobile = {
    back() {
      if (panel.open) { panel.close(); return 'handled'; }
      if (!document.getElementById('game-screen').hidden) { document.getElementById('menu-button').click(); return 'handled'; }
      if (!document.getElementById('ending-screen').hidden) { document.getElementById('ending-home-button').click(); return 'handled'; }
      return 'exit';
    },
    receiveBackup(text) {
      const input = document.getElementById('backup-file');
      if (!input) { toast('请打开设置，再导入备份。'); return; }
      const transfer = new DataTransfer();
      transfer.items.add(new File([text], '故事备份.json', { type: 'application/json' }));
      input.files = transfer.files; input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    message: toast
  };
  document.addEventListener('click', event => {
    if (!native || !(event.target instanceof Element)) return;
    const button = event.target.closest('button');
    if (!button) return;
    if (['export-backup', 'import-backup', 'fullscreen-button'].includes(button.id)) {
      event.preventDefault(); event.stopImmediatePropagation();
      try {
        if (button.id === 'export-backup') {
          const backup = window.RainSaveBackup.create(window.RainStory, window.RainEngine, name => JSON.parse(localStorage.getItem(key + name)));
          native.exportBackup(JSON.stringify(backup, null, 2));
        } else if (button.id === 'import-backup') native.importBackup();
        else native.toggleFullscreen();
      } catch (error) { toast(error.message); }
    }
  }, true);
  // Settings are created dynamically; keep the mobile instructions with their controls.
  new MutationObserver(() => {
    if (!document.getElementById('fullscreen-button')) return;
    const fullscreenHint = document.getElementById('fullscreen-button').parentElement.querySelector('small');
    if (fullscreenHint.textContent !== '隐藏或显示系统状态栏和导航栏。') fullscreenHint.textContent = '隐藏或显示系统状态栏和导航栏。';
    const note = document.querySelector('#panel-content .panel-note');
    const text = '点击对话继续；系统返回键可打开菜单或关闭弹窗。自动阅读会在选项处暂停。横竖屏切换保留当前进度，备份可与电脑版互通。';
    if (note && note.textContent !== text) note.textContent = text;
  }).observe(document.getElementById('panel-content'), { childList: true, subtree: true });
})();
