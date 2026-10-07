(function (root) {
  'use strict';
  const inNode = typeof module !== 'undefined' && module.exports;
  const chapters = [inNode ? require('./chapter-one.js') : root.RainChapterOne, inNode ? require('./chapter-two.js') : root.RainChapterTwo, inNode ? require('./chapter-three.js') : root.RainChapterThree, inNode ? require('./chapter-four.js') : root.RainChapterFour, inNode ? require('./chapter-five.js') : root.RainChapterFive, inNode ? require('./chapter-six.js') : root.RainChapterSix];
  chapters.push(inNode ? require('./chapter-seven-lin.js') : root.RainChapterSevenLin);
  chapters.push(inNode ? require('./chapter-eight-lin.js') : root.RainChapterEightLin);
  chapters.push(inNode ? require('./chapter-nine-lin.js') : root.RainChapterNineLin);
  chapters.push(inNode ? require('./chapter-ten-lin.js') : root.RainChapterTenLin);
  chapters.push(inNode ? require('./chapter-seven-xu.js') : root.RainChapterSevenXu);
  chapters.push(inNode ? require('./chapter-eight-xu.js') : root.RainChapterEightXu);
  chapters.push(inNode ? require('./chapter-nine-xu.js') : root.RainChapterNineXu);
  chapters.push(inNode ? require('./chapter-ten-xu.js') : root.RainChapterTenXu);
  chapters.push(inNode ? require('./chapter-seven-zhou.js') : root.RainChapterSevenZhou);
  chapters.push(inNode ? require('./chapter-eight-zhou.js') : root.RainChapterEightZhou);
  chapters.push(inNode ? require('./chapter-nine-zhou.js') : root.RainChapterNineZhou);
  chapters.push(inNode ? require('./chapter-ten-zhou.js') : root.RainChapterTenZhou);
  chapters.push(inNode ? require('./chapter-seven-ye.js') : root.RainChapterSevenYe);
  chapters.push(inNode ? require('./chapter-eight-ye.js') : root.RainChapterEightYe);
  chapters.push(inNode ? require('./chapter-nine-ye.js') : root.RainChapterNineYe);
  chapters.push(inNode ? require('./chapter-ten-ye.js') : root.RainChapterTenYe);
  chapters.push(inNode ? require('./chapter-self-epilogue.js') : root.RainSelfEpilogue);
  const locations = {
    self_home: { name: '知夏的新住处', image: 'assets/backgrounds/self-epilogue/self_home.png', scene: 'warm' },
    ye_home: { name: '叶澄的住处', image: 'assets/backgrounds/chapter-eight-ye/ye_home.png', scene: 'warm' },
    ye_home_morning: { name: '叶澄的住处', image: 'assets/backgrounds/chapter-eight-ye/ye_home_morning.png', scene: 'warm' },
    zhou_home: { name: '周栀的住处', image: 'assets/backgrounds/chapter-ten-zhou/zhou_home.png', scene: 'warm' },
    bookshop: { name: '归雨书屋', image: 'assets/backgrounds/chapter-one/bookshop.png', scene: 'warm' },
    old_street: { name: '大学后街', image: 'assets/backgrounds/chapter-one/old_street.png', scene: 'rain' },
    dorm: { name: '大学宿舍', image: 'assets/backgrounds/chapter-one/dorm.png', scene: 'night' },
    studio: { name: '见微的工作室', image: 'assets/backgrounds/chapter-two/studio.png', scene: 'warm' },
    rehearsal: { name: '周栀的排练室', image: 'assets/backgrounds/chapter-two/rehearsal.png', scene: 'warm' },
    campus: { name: '毕业礼堂外', image: 'assets/backgrounds/chapter-four/campus.png', scene: 'warm' },
    riverside: { name: '沿河步道', image: 'assets/backgrounds/chapter-four/riverside.png', scene: 'night' },
    venue: { name: '后街小演出场地', image: 'assets/backgrounds/chapter-four/venue.png', scene: 'warm' },
    rooftop: { name: '后街天台', image: 'assets/backgrounds/chapter-six/rooftop.png', scene: 'warm' },
    lin_home: { name: '林晚的住处', image: 'assets/backgrounds/chapter-eight/lin_home.png', scene: 'warm' },
    rain_bookshop: { name: '雨夜归雨书屋', image: 'assets/backgrounds/chapter-nine/rain_bookshop.png', scene: 'rain' },
    rain_stop: { name: '后街公交站台', image: 'assets/backgrounds/chapter-nine/rain_stop.png', scene: 'night' },
    farewell_exhibit: { name: '归雨书屋告别展', image: 'assets/backgrounds/chapter-ten/farewell_exhibit.png', scene: 'warm' },
    empty_bookshop: { name: '搬空后的归雨书屋', image: 'assets/backgrounds/chapter-ten/empty_bookshop.png', scene: 'warm' },
    train_station: { name: '临江市车站候车厅', image: 'assets/backgrounds/chapter-ten/train_station.png', scene: 'warm' },
    autumn_riverside: { name: '秋日沿河步道', image: 'assets/backgrounds/chapter-ten/autumn_riverside.png', scene: 'warm' },
    noodle_shop: { name: '后街面馆', image: 'assets/backgrounds/chapter-seven-xu/noodle_shop.png', scene: 'warm' },
    xu_home: { name: '见微的住处', image: 'assets/backgrounds/chapter-ten-xu/xu_home.png', scene: 'warm' },
    studio_night: { name: '夜间见微工作室', image: 'assets/backgrounds/chapter-eight-xu/studio_night.png', scene: 'night' }
  };
  const nodes = {};
  const target = id => !id || ['chapter_complete', 'chapter_two_complete', 'chapter_three_complete', 'chapter_four_complete', 'chapter_five_complete', 'chapter_six_complete', 'lin_seven_complete', 'lin_eight_complete', 'lin_nine_complete', 'lin_ten_complete', 'xu_seven_complete', 'xu_eight_complete', 'xu_nine_complete', 'xu_ten_complete', 'zhou_seven_complete', 'zhou_eight_complete', 'zhou_nine_complete', 'zhou_ten_complete', 'ye_seven_complete', 'ye_eight_complete', 'ye_nine_complete', 'ye_ten_complete', 'self_complete'].includes(id) ? id : id + '_0';
  chapters.forEach((data, chapterIndex) => {
   const chapter = data.chapterId || chapterIndex + 1;
   for (const scene of data.scenes) {
    const meta = { chapter, location: scene.location, time: scene.time, cast: scene.cast, sceneTitle: scene.title, ...(scene.routeSelector ? { routeSelector: true } : {}), ...(scene.spriteVariants ? { spriteVariants: scene.spriteVariants } : {}) };
    scene.lines.forEach(([speaker, text], i) => {
      const id = scene.id + '_' + i;
      const last = i === scene.lines.length - 1;
      const next = last ? scene.variants ? scene.id + '_variant' : target(scene.next) : scene.id + '_' + (i + 1);
      nodes[id] = { ...meta, speaker, text, next };
      if (last && scene.flags) nodes[id].flags = scene.flags;
      if (scene.choices && last) nodes[id].choices = scene.choices.map(c => ({ ...c, next: target(c.next) }));
    });
    if (scene.variants) {
      nodes[scene.id + '_variant'] = { ...meta, redirectBy: scene.variantBy || 'firstEvening', targets: {} };
      for (const [key, lines] of Object.entries(scene.variants)) {
        const prefix = scene.id + '_' + key;
        nodes[scene.id + '_variant'].targets[key] = prefix + '_0';
        lines.forEach(([speaker,text], i) => { nodes[prefix + '_' + i] = { ...meta, speaker, text, next: i === lines.length - 1 ? target(scene.next) : prefix + '_' + (i + 1) }; });
      }
    }
   }
   for (const gate of data.gates || []) nodes[target(gate.id)] = { chapter, redirectBy: gate.redirectBy, flags: gate.flags, targets: Object.fromEntries(Object.entries(gate.targets).map(([key, id]) => [key, target(id)])) };
  });
  nodes.chapter_complete = { chapter: 1, resolve: true, next: 'c2_morning_0' };
  nodes.chapter_two_complete = { chapter: 2, resolve: true, next: 'c3_arrival_0' };
  nodes.chapter_three_complete = { chapter: 3, resolve: true, next: 'c4_graduation_0' };
  nodes.chapter_four_complete = { chapter: 4, resolve: true, next: 'c5_morning_0' };
  nodes.chapter_five_complete = { chapter: 5, resolve: true, next: 'c6_morning_0' };
  nodes.chapter_six_complete = { chapter: 6, resolve: true, nextBy: 'selectedRoute', nextTargets: { lin: 'l7_morning_0', xu: 'x7_morning_0', zhou: 'z7_morning_0', ye: 'y7_morning_0', self: 's7_morning_0' } };
  nodes.lin_seven_complete = { chapter: 7, resolve: true, next: 'l8_morning_0' };
  nodes.lin_eight_complete = { chapter: 8, resolve: true, next: 'l9_morning_0' };
  nodes.lin_nine_complete = { chapter: 9, resolve: true, next: 'l10_start_0' };
  nodes.lin_ten_complete = { chapter: 10, resolve: true };
  nodes.xu_seven_complete = { chapter: 'xu7', resolve: true, next: 'x8_morning_0' };
  nodes.xu_eight_complete = { chapter: 'xu8', resolve: true, next: 'x9_morning_0' };
  nodes.xu_nine_complete = { chapter: 'xu9', resolve: true, next: 'x10_start_0' };
  nodes.xu_ten_complete = { chapter: 'xu10', resolve: true };
  nodes.zhou_seven_complete = { chapter: 'zhou7', resolve: true, next: 'z8_morning_0' };
  nodes.zhou_eight_complete = { chapter: 'zhou8', resolve: true, next: 'z9_morning_0' };
  nodes.zhou_nine_complete = { chapter: 'zhou9', resolve: true, next: 'z10_start_0' };
  nodes.zhou_ten_complete = { chapter: 'zhou10', resolve: true };
  nodes.ye_seven_complete = { chapter: 'ye7', resolve: true, next: 'y8_morning_0' };
  nodes.ye_eight_complete = { chapter: 'ye8', resolve: true, next: 'y9_morning_0' };
  nodes.ye_nine_complete = { chapter: 'ye9', resolve: true, next: 'y10_start_0' };
  nodes.ye_ten_complete = { chapter: 'ye10', resolve: true };
  nodes.self_complete = { chapter: 'self7', resolve: true };
  const endings = {
    lin_memory: { type: 'CHAPTER 01 · 书店回忆', kind: 'chapter', title: '书页之间的现在', scene: 'warm', description: '你留在书店，认识了一点现在的林晚。那封写给你的信还没有打开，但下一次见面的时间已经说好。', quote: '「你不用每次听见出发，就先想到告别。」' },
    ye_memory: { type: 'CHAPTER 01 · 老街回忆', kind: 'chapter', title: '取景框以外的同行', scene: 'rain', description: '你与叶澄一起走过老街，说明了自己的拍摄意愿。回到书店时，诗集里掉出一封属于你的信。还有很多故事，尚未被镜头记录。', quote: '「下一次，不当导游也可以一起出来。」' },
    lu_memory: { type: 'CHAPTER 01 · 宿舍回忆', kind: 'chapter', title: '写进日程的告别', scene: 'night', description: '你陪陆遥收好第一箱行李，开始认真记住朋友的离开。书店仍等着你回去，那封旧信也终于找到了收件人。', quote: '「我没忘。只是有时候做得不像记得。」' }
  };
  const memories = {
    lin_xu: ['书页与纸纹', '林晚与许见微', '重新认识一个人，也可以从一针线和一张纸开始。'],
    lin_zhou: ['借阅卡上的旋律', '林晚与周栀', '有的名字写在书页上，有的话还在等一段没有填满的副歌。'],
    lin_ye: ['窗边到巷口', '林晚与叶澄', '一起修好的书，和没有拍下的路，都能留在今天的记忆里。'],
    xu_zhou: ['纸样与未完成的歌', '许见微与周栀', '把一页字看清，把一句歌听清，才知道自己想给出的回应。'],
    xu_ye: ['留下的纸，没有留下的影像', '许见微与叶澄', '认真留下什么，也认真接受什么只属于写下它的人。'],
    ye_zhou: ['街口的静音与副歌', '叶澄与周栀', '有些声音不需要录下来，有些话可以在下一次见面时慢慢写完。']
  };
  for (const [pair, [title, names, quote]] of Object.entries(memories)) endings['c2_' + pair] = { type: 'CHAPTER 02 · ' + names, kind: 'chapter', title, scene: 'night', description: '你与' + names + '分别度过了一段下午的时光，也认真回应了没有赴的约。郑素琴寄出了她自己的信，你与林晚的旧信则等着下一次读起。', quote: '「' + quote + '」' };
  const thirdMemories = {
    lin: ['给今天的林晚', '林晚', '慢一点也不是退回去。想见面的时候，我们可以自己说。'],
    xu: ['版面以外的一段话', '许见微', '感受没有交稿顺序，也不必只剩一个容易整理的版本。'],
    zhou: ['把琴放下以后', '周栀', '愿意听你说的话，不需要从歌词里猜出来。'],
    ye: ['不进片子的晚上', '叶澄', '今天想记得的事，不必先证明适合给谁看。']
  };
  for (const [id, [title, name, quote]] of Object.entries(thirdMemories)) endings['c3_' + id] = { type: 'CHAPTER 03 · 与' + name + '倾诉', kind: 'chapter', title, scene: 'night', description: '你读完了林晚的旧信，把今天的感受说给' + name + '听。前两章留下的约定有了实际回应，新的试稿却与校样撞在同一个截止时间。接下来的选择，要从你真正能安排的日子开始。', quote: '「' + quote + '」' };
  const fourthMemories = {
    lin: ['河堤边的约定', '林晚', '想见你，可以约一个真的有空的日子。'],
    xu: ['校样之外的时间', '许见微', '做完一份工作，和认真回应一个人，是两件要分别记住的事。'],
    zhou: ['开场与散场之间', '周栀', '我想让你听见的，不只是最后那句谢谢。'],
    ye: ['没有镜头的一次邀约', '叶澄', '普通的见面，也需要两个人都在场。']
  };
  for (const [id, [title, name, quote]] of Object.entries(fourthMemories)) endings['c4_' + id] = { type: 'CHAPTER 04 · 优先回应' + name, kind: 'chapter', title, scene: 'night', description: '你把' + name + '的邀约放在第一位，并为相撞的安排作出了选择。试稿与活动文字已经交出；赴约的方式、给陆遥的回应、最后发给谁的私信，都分别留在这次经历里。接下来，告别活动还有现实的难题要一起面对。', quote: '「' + quote + '」' };
  const fifthMemories = {
    collective: ['分别回答过的名字', '共同分工', '册子外的纸页还在等待答复，工作表也终于有了分别说过可以的人。', '空白可以等一个真实的回答，不必先替谁填好。'],
    solo: ['没有被假装完成的十七号', '独自修改', '你接下了全部文字，却没能按原定时间完成定稿。期限得到明确协商，未完成的工作仍需要实际行动。', '说出还没完成，才知道接下来真的需要什么。'],
    smaller: ['一场可以做完的告别', '缩小规模', '四十本册子与较短的节目保留了可读的文字，也保留了预算与时间。活动的大小没有替私人关系作出决定。', '少一些，也可以让每一句话被认真读到。']
  };
  for (const [id, [title, label, description, quote]] of Object.entries(fifthMemories)) endings['c5_' + id] = { type: 'CHAPTER 05 · ' + label, kind: 'chapter', title, scene: 'night', description: description + '向被忽略者的回应、陆遥的谈话和十八号的安排，各自保存在这次经历里。', quote: '「' + quote + '」' };
  const sixthMemories = {
    lin: ['窗边，重新认识你', '林晚', '旧信读完以后，我仍想知道今天的你在看什么。'],
    xu: ['不用带校样的晚饭', '许见微', '我坐到这里，是因为想和你一起吃这顿饭。'],
    zhou: ['不需要押韵的回答', '周栀', '没有演出的时候，我也想见你。'],
    ye: ['没有题目的同行', '叶澄', '相机留在家里，我们仍有理由坐近一点。'],
    self: ['寄给自己的下一页', '自己的生活', '暂时不谈恋爱，也有值得亲自走到的明天。']
  };
  for (const [id, [title, name, quote]] of Object.entries(sixthMemories)) endings['c6_' + id] = { type: 'CHAPTER 06 · ' + name, kind: 'chapter', title, scene: 'warm', description: '你选择了接下来走向' + name + '的方向。今天得到的答复、实际经历过的相处与仍需完成的谈话，都留在这次进度里。共通线在此收束，下一段生活等待展开。', quote: '「' + quote + '」' };
  const linSeventhMemories = {
    open: ['把今天写在第一页', '继续约会', '你们谈过变化，修改了擅自替对方安排的时间，并约好交换写给现在的信。亲近的节奏由双方选择。', '现在喜欢什么，也想有机会自己告诉你。'],
    slow: ['各自翻开的本子', '慢慢了解', '你们愿意继续认识彼此，也给尚未准备好的关系答复留下时间。今天的靠近不必被催成一个称呼。', '喜欢的不一样，也能一起逛。'],
    distance: ['还没说完的那一页', '暂缓靠近', '关于变化的分歧或先前的具体调整仍未谈妥。今天先暂停私人约会，之后的回应需要真实行动。', '我可以接受你需要时间，但不会把没有回答听成我们已经谈妥。']
  };
  for (const [id, [title, label, description, quote]] of Object.entries(linSeventhMemories)) endings['l7_' + id] = { type: 'LIN · CHAPTER 07 · ' + label, kind: 'chapter', title, scene: 'warm', description, quote: '「' + quote + '」' };
  const linEighthMemories = {
    together: ['写给现在的两个人', '成为恋人', '你们读过两张新信，谈妥联系的方式，并亲口确认恋人关系。晚饭、留宿或各自回家都有各自真实的后续，第二天仍能说出自己的感受。', '有些高兴的事，我还是想今天再亲口说一次。'],
    slow: ['没有被催完的新信', '继续了解', '你们读过新信，谈过六周实习期间怎样联系。还未确认恋人身份，继续认识彼此也有具体的相处和第二天的回应。', '还没准备好的部分，也说还没准备好，不让你只剩猜。'],
    paused: ['今天停在这里的答复', '暂停约会', '新信已经被听见，但未落实的调整、未谈妥的期待或主动提出的暂停仍然保留。她没有答应的靠近，也没有被普通闲话绕过去。', '以后是否继续，我们到时分别作答。']
  };
  for (const [id, [title, label, description, quote]] of Object.entries(linEighthMemories)) endings['l8_' + id] = { type: 'LIN · CHAPTER 08 · ' + label, kind: 'chapter', title, scene: 'warm', description, quote: '「' + quote + '」' };
  const linNinthMemories = {
    steady: ['雨停后仍有普通的明天', '继续同行', '你们说过真实需要，也听过说明会之后的答复，仍愿意作为恋人继续。站台牵手、只谈话或各自休息都有独立后续；工作仍按实际协作记录。', '我们还是可以有普通的下次，不用每次都得完成一段特别的事。'],
    rebuilding: ['十分钟以外，再分别作答', '愿意再谈', '具体回应让两人愿意继续谈，关系仍按目前状态保留。晚间见过或另外问时间，都没有自动确认恋人身份或结束暂停。', '下次再问，我们再分别回答。'],
    apart: ['各自走回去的这一夜', '保留暂停', '先前未回应的分歧或今晚尚未谈清的感受仍在。她没有答应见面，知夏也没有用知道车次越过拒绝。事情由伙伴共同推进，私人约会仍暂停。', '别拿没写完当成没发生就行。']
  };
  for (const [id, [title, label, description, quote]] of Object.entries(linNinthMemories)) endings['l9_' + id] = { type: 'LIN · CHAPTER 09 · ' + label, kind: 'chapter', title, scene: 'rain', description, quote: '「' + quote + '」' };
  const xuSeventhMemories = {
    open: ['下班以后，各有自己的声音', '继续约会', '你们都愿意试着约会，也将各自的期待和负担说清。牵手、并肩或先分别都有独立答复，工作交接与下一次私人通话分别记录。', '没有人需要一直知道所有答案，也能认真想见一个人。'],
    slow: ['一页尚未装订的批注', '继续了解', '你们吃过一顿不看稿的晚饭，愿意继续认识彼此，今天还没有确认开始约会。私人批注有明确的收件人，之后的相处仍要分别询问。', '慢一点也有自己的声音，下一次想见可以直接问。'],
    distance: ['先把答复留在自己这边', '暂缓靠近', '未完成的具体调整或今天尚未谈妥的私人期待仍在。已确认的合作继续，私人约会暂停，不用知道她的安排绕过不同意愿。', '她只答应过的那一段时间，也仍然由她自己决定怎样结束。']
  };
  for (const [id, [title, label, description, quote]] of Object.entries(xuSeventhMemories)) endings['x7_' + id] = { type: 'XU · CHAPTER 07 · ' + label, kind: 'chapter', title, scene: 'warm', description, quote: '「' + quote + '」' };
  Object.assign(endings, {
    lin_he: { type: 'LIN · HE · 幸福结局', kind: 'final', title: '晴天留给我们', scene: 'warm', description: '你们在真实的求助、回应与日常里继续作为恋人相处，商定能确认也能修改的联系。林晚完成六周实习，知夏开始工作，秋天的重逢是一场普通的下班约会。', quote: '「想你的时候也饿，不想继续装作都可以。」' },
    lin_ne: { type: 'LIN · NE · 继续磨合', kind: 'final', title: '下一封，寄给你', scene: 'warm', description: '双方都愿意继续约会，也承认新期待还需要真实磨合。实习与工作各自发生，联系计划可以修改，秋天的新信不必替以后所有问题先写好答案。', quote: '「下一封仍愿意寄给你，却不用在这一封里，把以后所有的答案先写完。」' },
    lin_farewell: { type: 'LIN · 离别结局', kind: 'final', title: '把夏天还给夏天', scene: 'warm', description: '你们给出清楚的结束答复，不把旧信当作必须继续的契约。共同活动和曾经的靠近仍然真实，之后各自开始自己的日子，秋天也有值得吃饭、工作和见朋友的晚上。', quote: '「那个夏天不必被改成全都很好，才允许自己也走进之后的晴天。」' }
  });
  // Keep the released story identity and first-chapter node IDs so existing
  // bookmarks can resume, including saves at the old chapter boundary.
  const story = { id: 'rain-chapter-one-v1', start: 'arrival_0', chapters: { 1: { title: '第一章 · 百分之二十的雨', label: '第一章', place: '六月 / 归雨书屋', scene: 'rain' }, 2: { title: '第二章 · 借走的人，记得回来', label: '第二章', place: '六月四日至六日', scene: 'warm' }, 3: { title: '第三章 · 收件人', label: '第三章', place: '六月七日至十日', scene: 'warm' }, 4: { title: '第四章 · 同一把伞以外', label: '第四章', place: '六月十一日至十四日', scene: 'warm' }, 5: { title: '第五章 · 不是所有空白都要填满', label: '第五章', place: '六月十五日至十七日', scene: 'warm' } }, locations, endings, nodes };
  story.chapters[6] = { title: '第六章 · 我想见的是你', label: '第六章', place: '六月十八日', scene: 'warm' };
  story.chapters[7] = { title: '林晚线 · 第七章 · 我们已经不是那年夏天', label: '林晚线第七章', place: '六月十九日至二十一日', scene: 'warm' };
  story.chapters[8] = { title: '林晚线 · 第八章 · 那封信没有写完的部分', label: '林晚线第八章', place: '六月二十二日至二十三日', scene: 'warm' };
  story.chapters[9] = { title: '林晚线 · 第九章 · 雨夜的站台', label: '林晚线第九章', place: '六月二十四日至二十五日', scene: 'rain' };
  story.chapters[10] = { title: '林晚线 · 第十章 · 晴天留给我们', label: '林晚线第十章', place: '六月二十五日至三十日 / 秋日尾声', scene: 'warm' };
  story.chapters.xu7 = { number: 7, route: 'xu', title: '许见微线 · 第七章 · 校样上的私人批注', label: '许见微线第七章', place: '六月十九日至二十一日', scene: 'warm' };
  story.chapters.xu8 = { number: 8, route: 'xu', title: '许见微线 · 第八章 · 可靠的人也会失眠', label: '许见微线第八章', place: '六月二十二日至二十三日', scene: 'night' };
  story.chapters.xu9 = { number: 9, route: 'xu', title: '许见微线 · 第九章 · 这一页不必独自完成', label: '许见微线第九章', place: '六月二十四日至二十五日', scene: 'rain' };
  story.chapters.xu10 = { number: 10, route: 'xu', title: '许见微线 · 第十章 · 与你一起留白', label: '许见微线第十章', place: '六月二十五日至三十日 / 秋日尾声', scene: 'warm' };
  story.chapters.zhou7 = { number: 7, route: 'zhou', title: '周栀线 · 第七章 · 只给你听的副歌', label: '周栀线第七章', place: '六月十九日至二十一日', scene: 'warm' };
  story.chapters.zhou8 = { number: 8, route: 'zhou', title: '周栀线 · 第八章 · 别把自由写成失约', label: '周栀线第八章', place: '六月二十二日至二十三日', scene: 'warm' };
  story.chapters.zhou9 = { number: 9, route: 'zhou', title: '周栀线 · 第九章 · 没有舞台的晚上', label: '周栀线第九章', place: '六月二十四日至二十五日', scene: 'rain' };
  story.chapters.zhou10 = { number: 10, route: 'zhou', title: '周栀线 · 第十章 · 返场时请叫我的名字', label: '周栀线第十章', place: '六月二十五日至三十日 / 七月与秋日', scene: 'warm' };
  story.chapters.ye7 = { number: 7, route: 'ye', title: '叶澄线 · 第七章 · 请先问过我', label: '叶澄线第七章', place: '六月十九日至二十一日', scene: 'warm' };
  story.chapters.ye8 = { number: 8, route: 'ye', title: '叶澄线 · 第八章 · 镜头背后的人', label: '叶澄线第八章', place: '六月二十二日至二十四日早晨', scene: 'warm' };
  story.chapters.ye9 = { number: 9, route: 'ye', title: '叶澄线 · 第九章 · 有些片刻不需要证据', label: '叶澄线第九章', place: '六月二十四日至二十五日', scene: 'rain' };
  story.chapters.ye10 = { number: 10, route: 'ye', title: '叶澄线 · 第十章 · 没有镜头的约会', label: '叶澄线第十章', place: '六月二十五日至三十日、七月与秋日', scene: 'warm' };
  Object.assign(endings, {
    ye_he: { type: 'YE · HE · 幸福结局', kind: 'final', title: '没有镜头的约会', scene: 'warm', description: '你们继续做女朋友，在具体联系、真实改约与日常需要里相处。叶澄完成四周影像项目，知夏开始自己的编辑工作；秋日不带相机，也愿意来到彼此的生活里。', quote: '「先一起生活，之后想记录也可以先问。」' },
    ye_ne: { type: 'YE · NE · 继续磨合', kind: 'final', title: '下一帧见', scene: 'warm', description: '双方愿意继续，也给不确定留一个真实的范围。原女朋友有限试行保留称呼，原约会继续、新开始从实际答应之后起算；各自工作完成，秋日仍愿意回来听下一次的回答。', quote: '「画面停下来以后，也愿意回到生活里。」' },
    ye_farewell: { type: 'YE · 离别结局', kind: 'final', title: '画面之外', scene: 'warm', description: '旧回应、职业决定权或不同期待尚未谈妥，或本人选择结束，私人发展在这里告别。作品与送站、关灯和各自职业都真实完成，原来喜欢与靠近不被抹去，秋日也有自己的下一天。', quote: '「雨停以后，画面之外也仍有属于自己的下一天。」' }
  });
  const yeNinthMemories = {
    together: ['雨停以后，仍愿意听你', '继续同行', '双方真实回应后愿意继续做女朋友。维修片段与影片用途分别处理，发生过的越界不因删除消失；私人继续不替当事人写原谅，身体接触与有限帮助各自询问。', '不让一个好看的结尾替别人答应。'],
    reopen: ['十分钟以外，再自己问', '愿意再谈', '原约会或了解继续，原暂停者实际回应后仅愿意再谈。站台十分钟或休息都有独立后续，没有自动确认恋人、身体接触或新的影像用途。', '下一次的时间，仍由两个人自己答。'],
    paused: ['留白里，各自走回去', '保留暂停', '旧问题、今晚私人回应或本人意愿仍停在暂停，合作和各自交件真实继续。原见面保留，未获准者没有站台等待或虚构取消；原维修片段已按真实范围处理。', '没有留下照片，也不意味着这个晚上没有发生。']
  };
  for (const [id, [title, label, description, quote]] of Object.entries(yeNinthMemories)) endings['y9_' + id] = { type: 'YE · CHAPTER 09 · ' + label, kind: 'chapter', title, scene: 'rain', description, quote: '「' + quote + '」' };
  const yeEighthMemories = {
    together: ['今天，听见你说喜欢', '成为恋人', '双方亲口确认排他的女朋友，接触、新共同照片、晚饭与留宿分别答应。次日真实回应过感受，不拍、不留宿或不接触均保留恋人身份。', '没有相机，我也想直接问你愿不愿意。'],
    slow: ['灯亮着，也可以慢慢说', '继续了解', '听过镜头背后的过去，也说出自己的需要，愿意继续相处。已有约会保留，新的了解从真实答复开始，今天没有确认女朋友。', '你可以只说今天愿意讲的部分。'],
    paused: ['没有被剪掉的停顿', '私人暂停', '未完成的旧回应或当前私人暂停仍在，工作按实际范围继续。发生过的相处保留，没有替未赴过的邀约补照片、童年故事或住处。', '有些话还没有说完，今天也可以先到这里。']
  };
  for (const [id, [title, label, description, quote]] of Object.entries(yeEighthMemories)) endings['y8_' + id] = { type: 'YE · CHAPTER 08 · ' + label, kind: 'chapter', title, scene: 'warm', description, quote: '「' + quote + '」' };
  Object.assign(endings, {
  "y7_open": {
    "type": "YE · CHAPTER 07 · 继续约会",
    "kind": "chapter",
    "title": "先问过，再走近",
    "scene": "warm",
    "description": "你们把真实感受和相处需要说清，原约会继续，或从今天双方同意后开始新的约会。影片没有用私人片段或解释字幕，牵手、并肩或回家均各有答复，明晚私人通话仍待实际发生。",
    "quote": "「想见你，不是因为这里缺一个怎样的镜头。」"
  },
  "y7_slow": {
    "type": "YE · CHAPTER 07 · 继续了解",
    "kind": "chapter",
    "title": "没有标题的下午",
    "scene": "warm",
    "description": "你们看过植物、喝过茶，也听过彼此的不确定，愿意继续了解，尚未开始约会或确认女朋友。工作与私人通话各自另约，不急着将喜欢剪成一个完整答案。",
    "quote": "「没有很好的题目，也想知道你今天怎样。」"
  },
  "y7_distance": {
    "type": "YE · CHAPTER 07 · 私人暂停",
    "kind": "chapter",
    "title": "留在画面之外的话",
    "scene": "warm",
    "description": "旧回应尚未落实、当前私人谈话暂缓，或本人选择先暂停。已发生的见面保留，未获准的影片内容仍不用；合作继续，新的私人靠近没有被工作或一句含糊话绕过。",
    "quote": "「不拍不公开，不需要等关系更好才成立。」"
  }
});
  Object.assign(endings, {
    zhou_he: { type: 'ZHOU · HE · 幸福结局', kind: 'final', title: '返场时请叫我的名字', scene: 'warm', description: '你们愿意作为女朋友继续，在真实的通知、新时间与日常回应里相处。周栀完成三城五场巡演，知夏开始自己的编辑工作，秋日重逢是一场普通的下班约会。', quote: '「没有舞台的晚上，我也想来见你。」' },
    zhou_ne: { type: 'ZHOU · NE · 继续磨合', kind: 'final', title: '把副歌留到下次', scene: 'warm', description: '双方愿意继续，也保留有限试行的真实量。原女朋友保留称呼，新约会从实际同意开始；巡演与工作完成，秋日仍愿意回来听对方下一次的答复。', quote: '「今天真实说过以后，下一次仍愿意回来听。」' },
    zhou_farewell: { type: 'ZHOU · 离别结局', kind: 'final', title: '别在谢幕时答应永远', scene: 'warm', description: '旧回应、职业决定权或不同生活期待尚未谈妥，或任一方选择结束，私人关系在这里告别。活动、送站、书店关灯与各自职业仍完成，秋日也有各自的下一句。', quote: '「不在最难告别的时候，用一句永远盖住未回应的地方。」' }
  });
  Object.assign(endings, {
    z9_together: { type: 'ZHOU · CHAPTER 09 · 继续同行', kind: 'chapter', title: '没有舞台，也有你的声音', scene: 'rain', description: '你们保留女朋友的共同答复，按各自能力完成雨夜的工作与私人回应。音乐长短或取消、有限协助或自己工作、牵手或休息分别记录，不代替两个人的愿意。', quote: '「没有舞台的晚上，我也想来见你。」' },
    z9_reopen: { type: 'ZHOU · CHAPTER 09 · 愿意再谈', kind: 'chapter', title: '十分钟，不急着写完以后', scene: 'night', description: '真实回应让双方愿意继续约会或再谈需要。已有约会保留，此前暂停者尚未恢复约会；新的谈话范围、各自交件与仍待答复的巡演分别保留。', quote: '「今天先把这些听清，不要求彼此立刻承诺永远合适。」' },
    z9_paused: { type: 'ZHOU · CHAPTER 09 · 保留暂停', kind: 'chapter', title: '雨停以前，各自回去休息', scene: 'night', description: '旧回应或当前生活期待尚未谈妥，私人推进暂停。已完成的协助、方案变更与自己的交件保留，没有用救场、道歉或知道她经过哪里来替她答应。', quote: '「想见是真实感受，未同意也是真实范围。」' }
  });
  Object.assign(endings, {
    z8_together: { type: 'ZHOU · CHAPTER 08 · 恋人守约', kind: 'chapter', title: '在变化之前，先认真告诉你', scene: 'warm', description: '你们确认或继续女朋友关系，实际回收最低通知与联络安排。提前改约和临近通知各自记录，私人旋律与身体接触不替现实作答，巡演仍由周栀本人核条件。', quote: '「歌可以继续，约好的事也需要我自己负责。」' },
    z8_slow: { type: 'ZHOU · CHAPTER 08 · 有限试行', kind: 'chapter', title: '把能够给出的时间说清', scene: 'warm', description: '双方愿意有限试行相处，原恋人保留称呼，新开始者试着约会。今天实际核对能给的量，尚未接受的巡演和还没发生的未来安排不提前填满。', quote: '「能给多少说多少，不拿第一次见得很好就保证以后一定合适。」' },
    z8_paused: { type: 'ZHOU · CHAPTER 08 · 暂停私人期待', kind: 'chapter', title: '不替彼此选一种人生', scene: 'warm', description: '旧回应、职业决定权或当前生活期待尚未谈妥，私人推进暂停。到货、交件、真正见过与没见过的事实保留，工作合作和一条道歉不自动恢复约会。', quote: '「临近才通知是我的错，要我不做音乐不是补救。」' }
  });
  Object.assign(endings, {
    z7_open: { type: 'ZHOU · CHAPTER 07 · 认真回应', kind: 'chapter', title: '没有伴奏的答案', scene: 'warm', description: '你们亲口确认想成为女朋友，说清各自的时间、联络需要与关系范围。亲吻、牵手或暂不接触分别询问；私人旋律没有代替任何一个答复。', quote: '「歌可以继续写，关系在这里讲，我自己负责答。」' },
    z7_slow: { type: 'ZHOU · CHAPTER 07 · 按约再答', kind: 'chapter', title: '明晚六点，各自带来一句真话', scene: 'warm', description: '双方愿意继续相处，约定二十二号十八点各留十分钟，再答恋爱意愿。原约会或了解保留，没有自动确认恋人，也没有提前完成明天的谈话。', quote: '「普通却才是需要我自己负责的部分。」' },
    z7_distance: { type: 'ZHOU · CHAPTER 07 · 先停在这里', kind: 'chapter', title: '琴放下以后，也能听见暂停', scene: 'warm', description: '具体修改或当前回应仍未落实，私人推进暂停。工作按原范围继续，已经发生的相处保留；没有新的私人邀约，也没有借告别增加身体接触。', quote: '「两个人都绕，并不会绕到同一个地方。」' }
  });
  Object.assign(endings, {
    xu_he: { type: 'XU · HE · 幸福结局', kind: 'final', title: '与你一起留白', scene: 'warm', description: '你们继续作为女朋友相处，能提出需要、回应有限请求，各自承担职业决定。见微完成八周驻外，知夏开始工作，秋日的普通见面仍有两个人的声音。', quote: '「想见是真的，有没有空也是真的。」' },
    xu_ne: { type: 'XU · NE · 继续磨合', kind: 'final', title: '装订之前', scene: 'warm', description: '双方愿意继续，但照顾与仰望的习惯仍需实际磨合。原恋人试行新联系，重新发展者从这次同意开始约会；八周合作与各自工作发生，秋日仍愿意回来听对方回答。', quote: '「认真不是先写完永远，而是下一次也愿意回来听。」' },
    xu_farewell: { type: 'XU · 离别结局', kind: 'final', title: '折痕以外', scene: 'warm', description: '未谈妥的决定权与期待，或任一方结束的意愿，让私人关系在这里告别。册子、活动、送站与原址关灯都真实完成，之后各自工作生活，秋天也有属于自己的下一页。', quote: '「这一页有折痕，下一页也仍属于我。」' }
  });
  Object.assign(endings, {
    x9_together: { type: 'XU · CHAPTER 09 · 继续同行', kind: 'chapter', title: '这一页有两个人的声音', scene: 'rain', description: '暴雨之后，你们按真实能力提出请求，也承担自己的判断与交件，仍愿意作为女朋友继续。展示规模、核对是否暂缓、牵手或休息都有独立记录，不替双方决定关系。', quote: '「想和你相处也不需要一直指导你。」' },
    x9_reopen: { type: 'XU · CHAPTER 09 · 愿意再谈', kind: 'chapter', title: '十分钟之后再分别回答', scene: 'night', description: '具体回应让两人愿意继续相处或再谈。前章暂停者仍未恢复约会，前章了解者也没有自动成为恋人；工作按实际进度，下一次关系答复仍要分别询问。', quote: '「下次怎么走，我们之后分别回答。」' },
    x9_paused: { type: 'XU · CHAPTER 09 · 保留暂停', kind: 'chapter', title: '未完成的那一栏', scene: 'night', description: '旧调整或当前期待尚未得到具体回应，私人约会继续暂停。伙伴协助、受潮记录与自己的按时交件都真实保留，没有把知道她经过哪里变成新的同意。', quote: '「需要新的协助另问，不借工作延长私人话题。」' }
  });
  Object.assign(endings, {
    x8_together: { type: 'CHAPTER 08 · 许见微 · 成为恋人', kind: 'chapter', title: '两个人都能提出需要', scene: 'night', description: '兑现到货抽检与各自交件，尊重见微自己的合作决定。在具体改变之后，你们分别说出愿意成为女朋友；散步、聊天或各自休息都保留这份共同答复。', quote: '「我希望你是我的女朋友，不只是一个我能照顾好的人。」' },
    x8_slow: { type: 'CHAPTER 08 · 许见微 · 继续相处', kind: 'chapter', title: '没有先填满的这一页', scene: 'night', description: '你们说清有限帮助和真实期待，愿意继续相处，尚未确认恋人称呼。既有的约会或继续了解按实际答复保留，驻外询问仍由见微自己决定。', quote: '「想见面就问，不先替对方占时间。」' },
    x8_paused: { type: 'CHAPTER 08 · 许见微 · 暂停约会', kind: 'chapter', title: '决定权仍在她手里', scene: 'night', description: '未完成的调整、越过决定权的回复，或主动提出的暂停，都得到具体回应。到货、交件与已做的澄清照实保留，私人约会没有自动恢复。', quote: '「你可以表达不想分开，不能替我拒绝一份还在了解的工作。」' }
  });
  story.routeReviewNode = 'c4_choose_priority_0';
  story.chapters.self7 = { number: 7, route: 'self', title: '独身群像 · 写给自己的信', label: '独身群像收束篇', place: '六月十九日至三十日、七月与秋日', scene: 'warm' };
  endings.self_forward = { type: 'SELF · 独身群像结局', kind: 'final', title: '雨停后，我也向前走', scene: 'warm', description: '告别展、送站与原址关灯真实完成，知夏开始自己的编辑工作，搬进新的小房间。友情各有继续的方式，旧事照实留着，秋日仍愿意写给自己下一页。', quote: '「那封信，以后还可以继续写。」' };
  if (typeof module !== 'undefined' && module.exports) module.exports = story;
  else root.RainStory = story;
})(typeof window !== 'undefined' ? window : globalThis);
