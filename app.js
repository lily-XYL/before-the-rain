/* 雨停之前 — dependency-free browser visual novel. */
(function () {
  'use strict';
  const story = window.RainStory, engine = window.RainEngine;
  const $ = id => document.getElementById(id);
  const key = 'before-the-rain-chapter-one-v1:';
  const cast = window.RainCast || [];
  const memory = new Map();
  let storageWarning = false;
  function read(name) {
    if (memory.has(name)) return memory.get(name);
    try { return JSON.parse(localStorage.getItem(key + name) || 'null'); }
    catch (_) { return memory.get(name) || null; }
  }
  function write(name, value) {
    memory.set(name, value);
    try { localStorage.setItem(key + name, JSON.stringify(value)); return true; }
    catch (_) { if (!storageWarning) { storageWarning = true; toast('浏览器禁止本地存储，存档仅在本次打开期间保留。'); } return false; }
  }
  const rawSettings = read('settings') || {};
  const settings = { speed: ['slow', 'normal', 'instant'].includes(rawSettings.speed) ? rawSettings.speed : 'normal', music: rawSettings.music === true, volume: typeof rawSettings.volume === 'number' ? Math.max(0, Math.min(100, rawSettings.volume)) : 25 };
  let state = engine.create(story), view = 'title', typing = false, typeTimer, autoTimer, toastTimer, auto = false;
  let audioContext, musicTimer, noteIndex = 0;
  const panel = $('panel');
  const escape = str => String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  function toast(message) { $('toast').textContent = message; $('toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('show'), 2800); }
  function envelope() { return { savedAt: new Date().toISOString(), state }; }
  function validSave(name) { const saved = read(name); return saved && typeof saved.savedAt === 'string' && Number.isFinite(Date.parse(saved.savedAt)) && engine.restore(story, saved.state) ? saved : null; }
  function persist() { write('auto', envelope()); $('continue-button').disabled = false; }
  function refreshContinue() { $('continue-button').disabled = !validSave('auto'); }
  function stopTimers() { clearInterval(typeTimer); clearTimeout(autoTimer); typing = false; }
  function showView(name) {
    view = name;
    $('title-screen').hidden = name !== 'title'; $('game-screen').hidden = name !== 'game'; $('ending-screen').hidden = name !== 'ending';
    document.body.classList.toggle('playing', name !== 'title');
  }
  function scheduleAuto() {
    clearTimeout(autoTimer);
    if (auto && view === 'game' && !panel.open && !typing && !story.nodes[state.node].choices) autoTimer = setTimeout(advance, 1700 + Math.min(2300, story.nodes[state.node].text.length * 35));
  }
  function finishTyping() {
    clearInterval(typeTimer); typing = false;
    $('dialogue-text').textContent = story.nodes[state.node].text;
    $('next-indicator').hidden = Boolean(story.nodes[state.node].choices);
    scheduleAuto();
  }
  function render() {
    stopTimers();
    if (state.ending) { showEnding(); return; }
    showView('game');
    const node = story.nodes[state.node], chapter = story.chapters[node.chapter];
    const location = story.locations[node.location];
    document.body.dataset.scene = location.scene;
    document.querySelector('.scenery').style.backgroundImage = `url("${location.image}")`;
    const time = node.chapter === 2 && node.time === '六月五日 · 下午' ? '六月五日 · ' + (state.flags.activityStage === 'second' ? '15:00' : '13:30') : node.time;
    $('chapter-label').textContent = chapter.title; $('location-label').textContent = time + ' / ' + location.name;
    $('chapter-number').textContent = String(chapter.number || node.chapter).padStart(2, '0');
    $('bond-label').textContent = node.chapter === 5 ? state.flags.workflow ? '留下的空白' : '重新听你说' : node.chapter === 4 ? state.flags.priorityInvite ? '今天的邀约' : '毕业这一天' : node.chapter === 3 ? state.flags.confidant ? '今晚的倾诉' : '一起读信' : node.chapter === 2 ? state.flags.activitySecond ? '两段相处' : '新的约定' : ({ lin: '书店相处', ye: '老街同行', lu: '毕业友情' })[state.flags.firstEvening] || '雨中重逢';
    if (node.chapter === 6) $('bond-label').textContent = state.flags.selectedRoute ? '想走的方向' : '今天想见谁';
    if (node.chapter >= 7) $('bond-label').textContent = '今日林晚';
    if (chapter.route === 'xu') $('bond-label').textContent = '今日见微';
    if (chapter.route === 'zhou') $('bond-label').textContent = '今日周栀';
    if (chapter.route === 'ye') $('bond-label').textContent = '今日叶澄';
    if (chapter.route === 'self') $('bond-label').textContent = '自己的日子';
    $('speaker').textContent = node.speaker;
    const person = cast.find(c => c.name === node.speaker.split(' · ')[0]);
    renderStage(node, person);
    $('choices').replaceChildren();
    $('route-review-button').hidden = !(node.routeSelector && node.choices);
    if (node.routeSelector && node.choices) write('routeBookmark', envelope());
    $('choice-box').dataset.count = node.choices ? node.choices.length : 0;
    $('game-screen').classList.toggle('many-choices', Boolean(node.choices && node.choices.length > 4));
    $('choice-box').hidden = !node.choices;
    $('advance-button').disabled = Boolean(node.choices);
    if (node.choices) node.choices.forEach((choice, index) => {
      const button = document.createElement('button');
      const number = document.createElement('span'); number.textContent = String(index + 1).padStart(2, '0');
      button.append(number, document.createTextNode(choice.text));
      button.addEventListener('click', () => { state = engine.advance(story, state, index); persist(); render(); });
      $('choices').append(button);
    });
    $('dialogue-text').textContent = ''; $('next-indicator').hidden = true;
    if (node.choices || settings.speed === 'instant' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) finishTyping();
    else {
      typing = true; let chars = 0; const text = Array.from(node.text);
      typeTimer = setInterval(() => { $('dialogue-text').textContent = text.slice(0, ++chars).join(''); if (chars >= text.length) finishTyping(); }, settings.speed === 'slow' ? 65 : 30);
    }
  }
  function renderStage(node, speaker) {
    const otherId = speaker && speaker.id !== 'shen_zhixia' ? speaker.id : node.cast.find(id => id !== 'shen_zhixia');
    ['shen_zhixia', otherId].forEach((id, index) => {
      const img = $(index ? 'sprite-right' : 'sprite-left'), character = cast.find(c => c.id === id);
      img.hidden = !character;
      if (!character) return;
      const variant = node.spriteVariants?.[id];
      const src = 'assets/characters/v1/' + character.id + (variant === 'no_camera' ? '_no_camera' : '') + '.png';
      if (img.getAttribute('src') !== src) img.src = src;
      img.alt = character.name + '立绘';
      img.classList.toggle('speaking', Boolean(speaker && speaker.id === character.id));
      img.classList.toggle('listening', Boolean(speaker && speaker.id !== character.id));
    });
  }
  function advance() {
    if (view !== 'game' || panel.open) return;
    if (typing) { finishTyping(); return; }
    if (story.nodes[state.node].choices) return;
    state = engine.advance(story, state); persist(); render();
  }
  function showEnding() {
    showView('ending'); setAuto(false);
    const ending = story.endings[state.ending]; document.body.dataset.scene = ending.scene;
    $('ending-type').textContent = ending.type; $('ending-title').textContent = ending.title;
    $('ending-description').textContent = ending.description; $('ending-quote').textContent = ending.quote;
    if (story.nodes[state.node].chapter === 6) {
      const status = { tryingDates: '你们都愿意试着约会，下一次见面已有约定。', gettingToKnow: '你们约好继续了解彼此，尚未确定恋爱关系。', needsConversation: '她听见了你的心意，但希望先把未完成的调整谈清楚；约会尚未开始。', notDating: '你选择暂不恋爱，继续自己的生活与友情。' };
      $('ending-description').textContent = status[state.flags.relationshipStatus] + ' 共通线在此收束，今天的选择与尚待完成的事情将带入后续。';
    }
    const next = engine.nextChapterNode(story, state);
    $('next-chapter-button').hidden = !next;
    if (next) $('next-chapter-button').innerHTML = '继续' + escape(story.chapters[story.nodes[next].chapter].label) + ' <span>↗</span>';
    $('replay-button').className = next ? 'secondary' : 'primary';
    const chapter = story.chapters[story.nodes[state.node].chapter];
    const routeName = ({ lin: '林晚', xu: '许见微', zhou: '周栀', ye: '叶澄' })[chapter.route || 'lin'];
    $('ending-note').textContent = ending.kind === 'final' ? (chapter.route === 'self' ? '独身群像与秋日尾声' : routeName + '线与秋日尾声') + '已读完，本次结局已收入收藏。可以读取书签尝试其他走向。' : chapter.label + '已读完，经历已收入章节回忆。' + (next ? '可以带着这次的选择继续。' : '当前所选方向的后续章节尚待展开。');
    const collection = read('endings') || {};
    if (!collection[state.ending]) { collection[state.ending] = new Date().toISOString(); write('endings', collection); }
  }
  function start() { panel.close(); setAuto(false); state = engine.create(story); persist(); render(); }
  function home() { panel.close(); stopTimers(); setAuto(false); showView('title'); document.body.dataset.scene = 'rain'; document.querySelector('.scenery').style.backgroundImage = ''; refreshContinue(); }
  function load(name) {
    const saved = validSave(name);
    if (!saved) { toast('这里还没有可用的存档。'); return; }
    state = engine.restore(story, saved.state); panel.close(); persist(); render(); toast('已读取故事进度。');
  }
  function save(name) {
    if (view === 'title') { toast('开始故事后就可以存档。'); return; }
    write(name, envelope()); toast('已记下这一刻。');
  }
  function setAuto(enabled) { auto = enabled; $('auto-button').setAttribute('aria-pressed', String(auto)); $('auto-button').textContent = auto ? '自动 · 开' : '自动'; scheduleAuto(); }
  function formatDate(date) { return new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(date)); }
  function confirmPanel(title, message, action) {
    openPanel('confirm', title);
    $('panel-content').innerHTML = `<p class="confirm-message">${escape(message)}</p><div class="confirm-actions"><button id="cancel-action">取消</button><button id="confirm-action">确定</button></div>`;
    $('cancel-action').onclick = () => panel.close(); $('confirm-action').onclick = action;
  }
  function openPanel(kind, customTitle) {
    clearTimeout(autoTimer);
    $('panel-title').textContent = customTitle || ({ characters: '人物手记', gallery: '回忆与结局', settings: '一些小偏好', save: '记下这一刻', load: '回到那一页', history: '我们说过的话', menu: '故事稍作停留' })[kind];
    const content = $('panel-content'); content.replaceChildren();
    if (kind === 'characters') cast.forEach(character => {
      const card = document.createElement('article'); card.className = 'character-card cast-card';
      card.innerHTML = `<img src="assets/characters/v1/${escape(character.id)}.png" alt="${escape(character.name)}立绘"><div><small>${escape(character.role)}</small><h3>${escape(character.name)} <span>${character.age} 岁</span></h3><p>${escape(character.description)}</p><blockquote>${escape(character.theme)}</blockquote></div>`;
      content.append(card);
    });
    if (kind === 'gallery') {
      const unlocked = read('endings') || {};
      Object.entries(story.endings).forEach(([id, ending], i) => {
        const card = document.createElement('article'); card.className = 'gallery-card' + (unlocked[id] ? '' : ' locked');
        const hint = ending.kind === 'final' ? (id.startsWith('self_') ? '走完独身群像收束篇，读到写给自己的秋日回信。' : id.startsWith('ye_') ? '走完叶澄线，听见双方最后的意愿与秋日的答复。' : id.startsWith('zhou_') ? '走完周栀线，听见双方最后的意愿与秋日的答复。' : id.startsWith('xu_') ? '走完许见微线，听见双方最后的意愿与秋日的答复。' : '走完林晚线，听见双方最后的意愿与秋日的答复。') : id.startsWith('y9_') ? '在叶澄线第九章，分清维修与影片用途，回应雨夜的工作和私人需要。' : id.startsWith('y8_') ? '在叶澄线第八章，听见镜头背后的过去，也给出今天真实的关系答复。' : id.startsWith('y7_') ? '在叶澄线第七章，说清影片提案与真实感受，听见双方愿意怎样靠近。' : id.startsWith('z9_') ? '在周栀线第九章，确认雨夜音乐方案，承担各自的工作与私人回应。' : id.startsWith('z8_') ? '在周栀线第八章，回应真实改约、职业决定与双方能给出的时间。' : id.startsWith('z7_') ? '在周栀线第七章，将私人旋律、关系答复与靠近意愿分别说清。' : id.startsWith('x9_') ? '在许见微线第九章，判断暴雨后的展示与有限协助，听见新的关系答复。' : id.startsWith('x8_') ? '在许见微线第八章，尊重决定权，回应真实负担与关系期待。' : id.startsWith('x7_') ? '在许见微线第七章，给出自己的判断，听见她的期待与负担。' : id.startsWith('l9_') ? '在林晚线第九章，以不同方式回应雨夜求助与相处。' : id.startsWith('l8_') ? '在林晚线第八章，读过新信后选择自己的相处节奏。' : id.startsWith('l7_') ? '在林晚线第七章，以不同方式回应变化与靠近。' : id.startsWith('c6_') ? '在第六章选择另一个方向，收藏不同的共通线回忆。' : id.startsWith('c5_') ? '在第五章采用另一种筹备方案，留下不同形式的告别。' : id.startsWith('c4_') ? '在第四章优先回应另一位人物，经历不同的邀约。' : id.startsWith('c3_') ? '在第三章向另一位人物倾诉，听一段不同的回应。' : id.startsWith('c2_') ? '在第二章选择不同的两项活动，认识另一段下午。' : '选择另一段当晚的经历，再赴一次这场雨。';
        card.innerHTML = `<small>${unlocked[id] ? escape(ending.type) : 'UNDISCOVERED · ' + String(i + 1).padStart(2, '0')}</small><h3>${unlocked[id] ? escape(ending.title) : '尚未经历的回忆'}</h3><p>${escape(unlocked[id] ? ending.quote : hint)}</p>`;
        content.append(card);
      });
      const note = document.createElement('p'); note.className = 'panel-note'; note.textContent = '这里收藏六十一种章节回忆与十三个最终结局，共已收集 ' + Object.keys(story.endings).filter(id => unlocked[id]).length + ' / ' + Object.keys(story.endings).length + '。共通线、四条恋爱路线与独身群像收束篇已完整展开。'; content.append(note);
    }
    if (kind === 'save' || kind === 'load') {
      const slots = document.createElement('div'); slots.className = 'slots';
      const names = kind === 'load' ? ['auto', 'quick', 'slot1', 'slot2', 'slot3', 'slot4', 'routeBookmark'] : ['slot1', 'slot2', 'slot3', 'slot4'];
      names.forEach(name => {
        const saved = validSave(name), label = name === 'auto' ? '自动存档' : name === 'quick' ? '快速存档' : name === 'routeBookmark' ? '路线分歧书签' : '书签 ' + name.slice(-1);
        const slot = document.createElement('button'); slot.className = 'slot'; slot.disabled = kind === 'load' && !saved;
        slot.innerHTML = `<span>${label}</span><strong>${saved ? escape(saved.state.ending ? story.endings[saved.state.ending].title : story.chapters[story.nodes[saved.state.node].chapter].title) : '空白的一页'}</strong><small>${saved ? escape(formatDate(saved.savedAt)) : kind === 'save' ? '点击留下一个书签' : '尚未保存'}</small>`;
        slot.onclick = () => {
          if (kind === 'load') load(name);
          else if (saved) confirmPanel('替换这个书签？', '这会用当前进度替换这个存档，其他书签会保留。', () => { save(name); openPanel('save'); });
          else { save(name); openPanel('save'); }
        }; slots.append(slot);
      }); content.append(slots);
      const note = document.createElement('p'); note.className = 'panel-note'; note.textContent = '进度保存在此设备的当前浏览器中。清除浏览器数据会移除存档；自动存档会在推进故事时更新。'; content.append(note);
    }
    if (kind === 'history') {
      const entries = [...state.history];
      if (!state.ending && view === 'game') entries.push({ speaker: story.nodes[state.node].speaker, text: story.nodes[state.node].text });
      if (!entries.length) content.innerHTML = '<p class="panel-note">故事还没有开始，第一页正在等你。</p>';
      entries.forEach(entry => { const el = document.createElement('article'); el.className = 'log-entry'; el.innerHTML = `<strong>${escape(entry.speaker)}</strong><p>${escape(entry.text)}</p>`; content.append(el); });
    }
    if (kind === 'settings') {
      content.innerHTML = `<div class="setting-row"><div><span>文字出现速度</span><small>按一次空格，也可以立即显示整句话。</small></div><select id="text-speed" aria-label="文字出现速度"><option value="slow">慢一点</option><option value="normal">刚刚好</option><option value="instant">立即显示</option></select></div><div class="setting-row"><div><span>钢琴小调</span><small>一段循环的轻柔旋律，陪你等雨停。</small></div><button id="music-toggle" aria-pressed="${settings.music}">${settings.music ? '已开启' : '已关闭'}</button></div><div class="setting-row"><div><span>音乐音量</span><small id="volume-label">${settings.volume}%</small></div><input id="volume-slider" type="range" min="0" max="100" value="${settings.volume}" aria-label="音乐音量"></div><div class="setting-row"><div><span>全屏阅读</span><small>让故事占满屏幕，按 Esc 退出。</small></div><button id="fullscreen-button">切换全屏</button></div><p class="panel-note">操作：点击对话或按空格 / Enter 继续；Esc 打开菜单。自动播放会在选择处等你。所有人物均为成年女性，音乐为程序合成，当前版本没有配音。</p>`;
      $('text-speed').value = settings.speed;
      $('text-speed').onchange = event => { settings.speed = event.target.value; write('settings', settings); if (typing && settings.speed === 'instant') finishTyping(); };
      $('music-toggle').onclick = async () => { settings.music = !settings.music; write('settings', settings); $('music-toggle').textContent = settings.music ? '已开启' : '已关闭'; $('music-toggle').setAttribute('aria-pressed', String(settings.music)); await syncMusic(); };
      $('volume-slider').oninput = event => { settings.volume = Number(event.target.value); $('volume-label').textContent = settings.volume + '%'; write('settings', settings); };
      $('fullscreen-button').onclick = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch (_) { toast('当前浏览器无法切换全屏，可使用 F11。'); } };
      const backupRow = document.createElement('div'); backupRow.className = 'setting-row';
      backupRow.innerHTML = '<div><span>故事备份</span><small>带走存档与回忆，在另一个目录或浏览器里继续。</small></div><div class="backup-actions"><button id="export-backup">导出备份</button><button id="import-backup">导入备份</button></div><input id="backup-file" type="file" accept="application/json,.json" hidden aria-label="选择故事备份">';
      content.insertBefore(backupRow, content.querySelector('.panel-note'));
      $('export-backup').onclick = () => {
        try {
          const data = window.RainSaveBackup.create(story, engine, read);
          const url = URL.createObjectURL(new Blob([JSON.stringify(data,null,2)], {type:'application/json'}));
          const a = document.createElement('a'); a.href = url; a.download = '雨停之前_故事备份_' + new Date().toISOString().slice(0,10) + '.json'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),10000);
          toast('已导出存档与回忆备份。');
        } catch (error) { toast(error.message); }
      };
      $('import-backup').onclick = () => $('backup-file').click();
      $('backup-file').onchange = async event => {
        const file = event.target.files[0]; if (!file) return;
        try {
          if (file.size > 32 * 1024 * 1024) throw new Error('备份文件过大，请选择原导出的故事备份。');
          const data = window.RainSaveBackup.validate(story,engine,JSON.parse(await file.text()));
          confirmPanel('导入这份故事备份？', '将导入 ' + Object.keys(data.saves).length + ' 个存档；备份中的同名书签会替换当前书签，其他书签保留，回忆收藏合并。', () => {
            try { window.RainSaveBackup.apply(story,engine,data,read,write); home(); toast('已导入备份，可以继续故事或读取书签。'); }
            catch (error) { panel.close(); toast(error.message); }
          });
        } catch (error) { toast(error instanceof SyntaxError ? '备份文件内容无法读取。' : error.message); }
        event.target.value = '';
      };
    }
    if (kind === 'menu') {
      content.innerHTML = '<div class="menu-buttons"><button id="resume-story">继续这段故事 ↗</button><button id="menu-save">保存当前进度</button><button id="menu-home">返回标题页</button><button id="menu-restart">从第一页重新开始</button></div>';
      $('resume-story').onclick = () => panel.close(); $('menu-save').onclick = () => openPanel('save'); $('menu-home').onclick = home;
      $('menu-restart').onclick = () => confirmPanel('再赴这场雨？', '将从第一页重新开始。手动书签与结局收藏会保留。', start);
    }
    if (!panel.open) panel.showModal();
    if (kind === 'history') requestAnimationFrame(() => { panel.scrollTop = panel.scrollHeight; }); else panel.scrollTop = 0;
  }
  async function syncMusic() {
    clearInterval(musicTimer);
    if (!settings.music) { if (audioContext && audioContext.state === 'running') await audioContext.suspend(); return; }
    try {
      const Audio = window.AudioContext || window.webkitAudioContext; if (!Audio) throw new Error('unavailable');
      audioContext ||= new Audio(); await audioContext.resume();
      const melody = [261.63, 329.63, 392, 493.88, 440, 392, 329.63, 293.66, 261.63, 349.23, 440, 523.25, 493.88, 392, 329.63, 293.66];
      const note = () => {
        if (document.hidden || !settings.music) return;
        const time = audioContext.currentTime, oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
        oscillator.type = 'sine'; oscillator.frequency.value = melody[noteIndex++ % melody.length];
        gain.gain.setValueAtTime(0, time); gain.gain.linearRampToValueAtTime(settings.volume / 100 * .13, time + .04); gain.gain.exponentialRampToValueAtTime(.0001, time + 2.8);
        oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(time); oscillator.stop(time + 3);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      };
      note(); musicTimer = setInterval(note, 1200);
    } catch (_) { settings.music = false; write('settings', settings); if ($('music-toggle')) { $('music-toggle').textContent = '已关闭'; $('music-toggle').setAttribute('aria-pressed', 'false'); } toast('当前浏览器暂不支持播放音乐。'); }
  }
  $('start-button').onclick = () => { if (validSave('auto')) confirmPanel('开始新的故事？', '新的故事会更新自动存档。手动书签与结局收藏会保留。', start); else start(); };
  $('continue-button').onclick = () => load('auto'); $('advance-button').onclick = advance;
  $('auto-button').onclick = () => setAuto(!auto);
  $('quick-save-button').onclick = () => save('quick'); $('quick-load-button').onclick = () => load('quick');
  $('menu-button').onclick = () => openPanel('menu'); $('home-button').onclick = () => { if (view !== 'title') openPanel('menu'); };
  $('replay-button').onclick = start; $('ending-home-button').onclick = home;
  $('next-chapter-button').onclick = () => { state = engine.continueChapter(story, state); persist(); render(); };
  $('route-review-button').onclick = () => {
    const node = story.nodes[state.node];
    if (!node.routeSelector || !node.choices) return;
    confirmPanel('重走那段相处？', '将回到第四章的相处选择，后续剧情需要重新选择。当前第六章路线分歧已单独保存，可从读档中的「路线分歧书签」返回。手动书签与章节回忆保留。', () => {
      const earlier = engine.rewind(story, state, story.routeReviewNode);
      if (!earlier) { panel.close(); toast('暂时无法返回这处分歧。'); return; }
      write('routeBookmark', envelope()); state = earlier; panel.close(); persist(); render();
    });
  };
  $('bond-button').onclick = () => {
    if (story.nodes[state.node].chapter === 'self7') {
      toast('友情、工作和自己的日子，各有真实的下一步。');
    } else if (story.nodes[state.node].chapter === 'ye10') {
      const statuses = { he: '没有镜头的约会', ne: '下一帧见', farewell: '画面之外' };
      toast(state.flags.y10Outcome ? statuses[state.flags.y10Outcome] : '先把自己的生活过好，也给两个人真实答复的位置。');
    } else if (story.nodes[state.node].chapter === 'ye9') {
      const statuses = { together: '继续同行', reopen: '愿意再谈', paused: '保留暂停' };
      toast(state.flags.y9Outcome ? '叶澄：' + statuses[state.flags.y9Outcome] : '有些片刻不用留下证据，也仍要听当事人自己的回答。');
    } else if (story.nodes[state.node].chapter === 'ye8') {
      const statuses = { together: '成为恋人', slow: '继续了解', paused: '私人暂停' };
      toast(state.flags.y8Outcome ? '叶澄：' + statuses[state.flags.y8Outcome] : '镜头放下以后，也听见彼此真实想说的话。');
    } else if (story.nodes[state.node].chapter === 'ye7') {
      const statuses = { open: '继续约会', slow: '继续了解', distance: '私人暂停' };
      toast(state.flags.y7Outcome ? '叶澄：' + statuses[state.flags.y7Outcome] : '影片怎样完成，各自怎样相处，都先听真实的答复。');
    } else if (story.nodes[state.node].chapter === 'zhou10') {
      const statuses = { he: '返场时请叫我的名字', ne: '把副歌留到下次', farewell: '别在谢幕时答应永远' };
      toast(state.flags.z10Outcome ? statuses[state.flags.z10Outcome] : '完成告别，也留时间听见两个人自己的答复。');
    } else if (story.nodes[state.node].chapter === 10) {
      const statuses = { he: '晴天留给我们', ne: '下一封，寄给你', farewell: '把夏天还给夏天' };
      toast(state.flags.lin10Outcome ? statuses[state.flags.lin10Outcome] : '完成告别，也给两个人最后作答的位置。');
    } else if (story.nodes[state.node].chapter === 9) {
      const statuses = { steady: '继续同行', rebuilding: '愿意再谈', apart: '保留暂停' };
      toast(state.flags.lin9Outcome ? '林晚：' + statuses[state.flags.lin9Outcome] : '先说清需要什么，也听别人能给出的帮助。');
    } else if (story.nodes[state.node].chapter === 8) {
      const statuses = { together: '成为恋人', slow: '继续了解', paused: '暂停约会' };
      toast(state.flags.lin8Outcome ? '林晚：' + statuses[state.flags.lin8Outcome] : '写给现在的信，也要留给两个人真实的回答。');
    } else if (story.nodes[state.node].chapter === 7) {
      const statuses = { open: '继续约会', slow: '慢慢了解', distance: '先把没说完的话谈清楚' };
      toast(state.flags.lin7Outcome ? '林晚：' + statuses[state.flags.lin7Outcome] : '记得过去，也听她说现在想过的生活。');
    } else if (story.nodes[state.node].chapter === 6) {
      const names = { lin: '林晚', xu: '许见微', zhou: '周栀', ye: '叶澄', self: '自己的生活' };
      const status = { tryingDates: '试着约会', gettingToKnow: '继续了解', needsConversation: '先谈清楚', notDating: '暂不恋爱' };
      toast(state.flags.selectedRoute ? '想走的方向：' + names[state.flags.selectedRoute] + (state.flags.relationshipStatus ? '；' + status[state.flags.relationshipStatus] : '。') : '选择想靠近的人，也尊重她自己的答复。');
    } else if (story.nodes[state.node].chapter === 5) {
      const names = { lin: '林晚', xu: '许见微', zhou: '周栀', ye: '叶澄' };
      const forms = { collective: '共同分工', solo: '独自修改', smaller: '缩小规模' };
      toast(state.flags.workflow ? '筹备方案：' + forms[state.flags.workflow] + (state.flags.omittedPerson ? '；需要回应：' + names[state.flags.omittedPerson] : '。') : '先听清每个人的意见，再把答复写进方案。');
    } else if (story.nodes[state.node].chapter === 4) {
      const names = { lin: '林晚', xu: '许见微', zhou: '周栀', ye: '叶澄' };
      const handling = { notify: '提前说明', rebook: '另约时间', rush: '两头赶' };
      toast(state.flags.priorityInvite ? '优先邀约：' + names[state.flags.priorityInvite] + (state.flags.invitationHandling ? '；' + handling[state.flags.invitationHandling] : '。') : '毕业典礼、交稿和朋友，都需要真正留下时间。');
    } else if (story.nodes[state.node].chapter === 3) {
      const names = { lin: '林晚', xu: '许见微', zhou: '周栀', ye: '叶澄' };
      toast(state.flags.confidant ? '今晚倾诉：' + names[state.flags.confidant] : '今天的旧信，等你读完再慢慢回应。');
    } else if (story.nodes[state.node].chapter === 2 && state.flags.activityFirst) {
      const names = { lin: '林晚', xu: '许见微', zhou: '周栀', ye: '叶澄' };
      toast('本次相处：' + names[state.flags.activityFirst] + (state.flags.activitySecond ? ' → ' + names[state.flags.activitySecond] : '，第二项尚未选择。'));
    } else toast('本次经历：' + (({ lin: '与林晚整理旧书', ye: '与叶澄走过老街', lu: '陪陆遥整理毕业行李' })[state.flags.firstEvening] || '还在认识这场重逢。'));
  };
  $('close-panel').onclick = () => panel.close();
  document.querySelectorAll('[data-panel]').forEach(button => button.onclick = () => openPanel(button.dataset.panel));
  panel.addEventListener('click', event => { if (event.target === panel) { const bounds = panel.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) panel.close(); } });
  panel.addEventListener('close', scheduleAuto);
  document.addEventListener('keydown', event => {
    if (event.repeat) return;
    if (event.key === 'Escape' && !panel.open && view === 'game') { event.preventDefault(); openPanel('menu'); }
    else if ((event.key === ' ' || event.key === 'Enter') && !panel.open && view === 'game' && (document.activeElement === document.body || document.activeElement === $('advance-button'))) { event.preventDefault(); advance(); }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(autoTimer); else scheduleAuto(); });
  document.addEventListener('click', () => { if (settings.music && !audioContext) syncMusic(); }, { once: true });
  refreshContinue();
})();
