(function (root) {
  'use strict';
  const VERSION = 2;
  function create(story) { return { version: VERSION, storyId: story.id, node: story.start, flags: {}, choices: [], history: [], ending: null }; }
  function endingFor(state, story) {
    if (story && story.nodes[state.node].chapter === 'self7') return 'self_' + state.flags.s7Outcome;
    if (story && story.nodes[state.node].chapter === 'ye10') return 'ye_' + state.flags.y10Outcome;
    if (story && story.nodes[state.node].chapter === 'ye9') return 'y9_' + state.flags.y9Outcome;
    if (story && story.nodes[state.node].chapter === 'ye8') return 'y8_' + state.flags.y8Outcome;
    if (story && story.nodes[state.node].chapter === 'ye7') return 'y7_' + state.flags.y7Outcome;
    if (story && story.nodes[state.node].chapter === 'zhou10') return 'zhou_' + state.flags.z10Outcome;
    if (story && story.nodes[state.node].chapter === 'zhou9') return 'z9_' + state.flags.z9Outcome;
    if (story && story.nodes[state.node].chapter === 'zhou8') return 'z8_' + state.flags.z8Outcome;
    if (story && story.nodes[state.node].chapter === 'zhou7') return 'z7_' + state.flags.z7Outcome;
    if (story && story.nodes[state.node].chapter === 'xu10') return 'xu_' + state.flags.xu10Outcome;
    if (story && story.nodes[state.node].chapter === 'xu9') return 'x9_' + state.flags.xu9Outcome;
    if (story && story.nodes[state.node].chapter === 'xu8') return 'x8_' + state.flags.xu8Outcome;
    if (story && story.nodes[state.node].chapter === 'xu7') return 'x7_' + state.flags.xu7Outcome;
    if (story && story.nodes[state.node].chapter === 10) return 'lin_' + state.flags.lin10Outcome;
    if (story && story.nodes[state.node].chapter === 9) return 'l9_' + state.flags.lin9Outcome;
    if (story && story.nodes[state.node].chapter === 8) return 'l8_' + state.flags.lin8Outcome;
    if (story && story.nodes[state.node].chapter === 7) return 'l7_' + state.flags.lin7Outcome;
    if (story && story.nodes[state.node].chapter === 6) return 'c6_' + state.flags.selectedRoute;
    if (story && story.nodes[state.node].chapter === 5) return 'c5_' + state.flags.workflow;
    if (story && story.nodes[state.node].chapter === 4) return 'c4_' + state.flags.priorityInvite;
    if (story && story.nodes[state.node].chapter === 3) return 'c3_' + state.flags.confidant;
    if (story && story.nodes[state.node].chapter === 2) return 'c2_' + [state.flags.activityFirst, state.flags.activitySecond].sort().join('_');
    return ({ lin: 'lin_memory', ye: 'ye_memory', lu: 'lu_memory' })[state.flags.firstEvening] || null;
  }
  function normalize(story, state) {
    let node = story.nodes[state.node], guard = 0;
    while (node && node.redirectBy) {
      if (++guard > Object.keys(story.nodes).length) throw new Error('剧情回流出现循环。');
      if (node.flags) state = { ...state, flags: { ...state.flags, ...node.flags } };
      const value = state.flags[node.redirectBy];
      const target = Object.prototype.hasOwnProperty.call(node.targets, value) ? node.targets[value] : node.targets.default;
      if (!target || !story.nodes[target]) throw new Error('缺少有效的剧情回流目标。');
      state = { ...state, node: target }; node = story.nodes[target];
    }
    if (!node) throw new Error('剧情节点不存在。');
    if (node.resolve) { const ending = endingFor(state, story); if (!ending || !story.endings[ending]) throw new Error('章节收束信息不完整。'); state = { ...state, ending }; }
    return state;
  }
  function advance(story, state, index) {
    const current = story.nodes[state.node];
    if (!current || state.ending || current.resolve) return state;
    const selected = current.choices ? Number.isInteger(index) && current.choices[index] : null;
    if (current.choices && !selected) throw new Error('请选择一个有效选项。');
    const history = [...state.history, { speaker: current.speaker, text: current.text }];
    if (selected) history.push({ speaker: '你的选择', text: selected.text });
    return normalize(story, {
      ...state, node: selected ? selected.next : current.next,
      flags: { ...state.flags, ...current.flags, ...(selected ? selected.flags : {}) },
      choices: selected ? [...state.choices, { node: state.node, index }] : [...state.choices], history
    });
  }
  function nextChapterNode(story, state) {
    const current = story.nodes[state.node];
    if (!state.ending || !current || !current.resolve) return null;
    const next = current.nextBy ? current.nextTargets?.[state.flags[current.nextBy]] : current.next;
    return next && story.nodes[next] ? next : null;
  }
  function continueChapter(story, state) {
    const next = nextChapterNode(story, state);
    if (!next) return state;
    return normalize(story, { ...state, node: next, ending: null });
  }
  function restore(story, raw) {
    if (!raw || raw.version !== VERSION || raw.storyId !== story.id || !story.nodes[raw.node] || !raw.flags || typeof raw.flags !== 'object' || Array.isArray(raw.flags) || !Array.isArray(raw.choices) || !Array.isArray(raw.history)) return null;
    let state = create(story), decision = 0, steps = 0;
    const replayLimit = Object.keys(story.nodes).length * 2;
    try {
      while (!(state.node === raw.node && state.choices.length === raw.choices.length) && steps++ <= replayLimit) {
        const node = story.nodes[state.node];
        if (state.ending) {
          const next = continueChapter(story, state);
          if (next === state) return null;
          state = next;
        } else if (node.choices) {
          const choice = raw.choices[decision++];
          if (!choice || choice.node !== state.node || !Number.isInteger(choice.index) || !node.choices[choice.index]) return null;
          state = advance(story, state, choice.index);
        } else state = advance(story, state);
      }
      const equalFlags = Object.keys(state.flags).length === Object.keys(raw.flags).length && Object.keys(state.flags).every(k => state.flags[k] === raw.flags[k]);
      if (state.node !== raw.node || !equalFlags || JSON.stringify(state.choices) !== JSON.stringify(raw.choices) || state.ending !== raw.ending) return null;
      return state;
    } catch (_) { return null; }
  }
  function rewind(story, raw, target) {
    const current = restore(story, raw);
    if (!current || !story.nodes[target]) return null;
    let state = create(story), decision = 0;
    const limit = Object.keys(story.nodes).length * 2;
    for (let step = 0; step < limit; step++) {
      if (state.node === target) return state;
      if (state.node === current.node && state.choices.length === current.choices.length) return null;
      if (state.ending) {
        const next = continueChapter(story, state);
        if (next === state) return null;
        state = next;
      } else {
        const node = story.nodes[state.node];
        const choice = node.choices ? current.choices[decision++] : null;
        if (node.choices && (!choice || choice.node !== state.node)) return null;
        state = advance(story, state, choice ? choice.index : undefined);
      }
    }
    return null;
  }
  const engine = { create, advance, restore, endingFor, continueChapter, nextChapterNode, rewind };
  if (typeof module !== 'undefined' && module.exports) module.exports = engine;
  else root.RainEngine = engine;
})(typeof window !== 'undefined' ? window : globalThis);
