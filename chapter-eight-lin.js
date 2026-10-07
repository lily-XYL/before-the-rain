(function (root) {
  'use strict';
  const scenes = [], gates = [];
  const script = text => text.trim().split('\n').map(line => {
    const i = line.indexOf('｜');
    if (i < 1) throw new Error('林晚第八章对白缺少说话人物。');
    return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
  });
  const add = (id, title, location, time, cast, text, next, extra = {}) => scenes.push({ id, title, location, time, cast, lines: script(text), next, ...extra });
  const variation = (variantBy, variants) => ({ variantBy, variants: Object.fromEntries(Object.entries(variants).map(([key, text]) => [key, script(text)])) });
  const gate = (id, redirectBy, targets) => gates.push({ id, redirectBy, targets });
  const pair = id => ['shen_zhixia', id], lin = pair('lin_wan');

  add('l8_morning', 'L8-01 · 信纸上的第二行', 'dorm', '六月二十二日 · 08:30', pair('lu_yao'), `
旁白｜早上醒来，昨天那张纸仍放在桌上。第一行写过无糖乌龙以后，后面还有很大一块空白，像是连纸也在等我别再只描述别人。
陆遥｜你已经盯着它十分钟了。字不会因为你看得认真，自己长出来。
沈知夏｜我在想先写哪一件事。
陆遥｜那先把早餐吃掉。吃完也没想到，可以在信里承认你想了很久。
旁白｜她把一只水煮蛋放到我的盘边。我试着把它剥得完整，最后还是在一侧留下一小块月牙形的缺口。
旁白｜写给现在的林晚，也要有现在的我。不是整理一个始终喜欢她、始终知道该怎样说话的收件人。
  `, 'l8_entry');
  add('l8_entry', '今天从昨天真正停下的地方开始', 'dorm', '六月二十二日 · 08:40', lin, '旁白｜我打开昨天的对话，看一遍我们真正说好的安排。', 'l8_repair_choice', variation('lin7Outcome', {
    open: `旁白｜今天十四点在书店交换新信，已经约好。我看着那一行，不必再猜她是不是愿意来，也不把它扩写成她答应了整个夜晚。
林晚 · 消息｜下午见。我还没把信写得很漂亮，不过会带来。
沈知夏 · 消息｜我也是。写真的就好。`,
    slow: `旁白｜昨天说的是写好以后再问时间，没有约好今天见。我先给她发了一条消息，问是否愿意今天下午十四点在书店交换一些话。
林晚 · 消息｜愿意。你不用为了赶今天，把还没想好的也写成已经想好了。
沈知夏 · 消息｜好。今天先听彼此写出来的那一部分。`,
    distance: `旁白｜昨天暂停了私人约会，今天并没有谁在十四点等我。我先问林晚，是否愿意下午在书店继续谈。
林晚 · 消息｜十四点可以留一段时间。但先谈具体没有说清的事，今天不默认恢复约会。
沈知夏 · 消息｜好。你愿意听我，不等于已经替我把问题放下。`
  }));
  add('l8_repair_choice', '写信以前，仍有行动要给出', 'dorm', '六月二十二日 · 09:00', pair('shen_zhixia'), `
旁白｜昨天没有完成的调整，以及还没有真正承认的分歧，都在记录里。我可以今天把行动给出，也可以继续暂停；信写得长一些，不会替我做完其中一件。
  `, null, { choices: [
    { text: '先核对具体调整，兑现需要改变的安排。', flags: { lin8RepairChoice: 'act' }, next: 'l8_old_repair_gate' },
    { text: '承认仍未准备好，保留待谈与暂停的范围。', flags: { lin8RepairChoice: 'hold' }, next: 'l8_old_hold' }
  ] });
  gate('l8_old_repair_gate', 'pendingOmittedConversation', { true: 'l8_old_person', false: 'l8_old_kept' });
  gate('l8_old_person', 'omittedPerson', { lin: 'l8_old_lin', xu: 'l8_old_xu', zhou: 'l8_old_zhou', ye: 'l8_old_ye' });
  const repairs = [
    ['lin', 'lin_wan', '林晚', '借阅资料中已经核实的日期', '不再按有无回信删去作者的文字，新增文字仍需作者另外确认'],
    ['xu', 'xu_jianwei', '许见微', '已排页面的尺寸与折边', '不请你接下新增试排，尚未确认的材料继续单列'],
    ['zhou', 'zhou_zhi', '周栀', '已经约定的音频起止', '不新增串场，也不擅自改变你确认过的时长'],
    ['ye', 'ye_cheng', '叶澄', '已获准的设备说明', '不扩大任何私人片段的记录或播放范围']
  ];
  for (const [id, cast, name, item, scope] of repairs) add('l8_old_' + id, '先让具体版本到达对方手里', 'dorm', '六月二十二日 · 09:10–10:00', pair(cast), `
沈知夏 · 消息｜这份调整今天发出：${scope}。我想请你只核对${item}，愿意的话再给这版答复。
旁白｜对方先回了能看的时间。我等到那一段，再收到她指出的一处旧说明，改好重新发出，没让这次的认真仍只停在开头。
${name} · 消息｜这版这一项可以。其他未确认的部分仍然不采用。
沈知夏 · 消息｜收到，我按今天这一版留记录。以前没有做到的日期也保留。
旁白｜她的答复只属于这次清楚的一项。我把它放到版本下面，不拿它去证明私人关系已经没有裂缝。
  `, 'l8_old_done');
  add('l8_old_done', '迟来的确认有自己的日期', 'dorm', '六月二十二日 · 10:00', pair('shen_zhixia'), `
旁白｜调整已发出、修改，也收到具体确认。未采用的材料继续另外放，旧日期没有被涂成今天之前就完成。
  `, 'l8_schedule_check', { flags: { pendingOmittedConversation: false, repairStarted: true, omittedContribution: 'confirmedPartOnly', lin8OldRepairKept: true } });
  add('l8_old_kept', '已经做过的事，不再强行演一次', 'dorm', '六月二十二日 · 09:20', pair('shen_zhixia'), `
旁白｜已确认的范围有对应版本。今天新增的问题继续单列，我发了说明，没把对方回的收到改成她答应接下新的工作。
旁白｜我把这张清单收好。需要修复的部分不止在工作里，接下来该面对的，是我自己的期待怎样落到另一个人身上。
  `, 'l8_schedule_check', { flags: { lin8OldRepairKept: false } });
  add('l8_old_hold', '还没有给出的答复，先承认它仍在', 'dorm', '六月二十二日 · 09:20', pair('shen_zhixia'), '旁白｜我按已经确认的范围继续，不擅自使用任何尚待答复的部分。', 'l8_schedule_check', { ...variation('pendingOmittedConversation', {
    true: '旁白｜具体调整还没准备好，我给那位伙伴发了明确说明。她回复未确认部分继续停用。我把这句也留在清单上，没拿今天要读的信去换一个先不要介意。',
    false: '旁白｜已经完成过的确认仍有效。今天暂缓新增问题，没有把旧修复退回成从未发生。'
  }), flags: { lin8OldRepairKept: false } });
  gate('l8_schedule_check', 'lin7ConflictResolved', { true: 'l8_schedule_kept', false: 'l8_schedule_action' });
  gate('l8_schedule_action', 'lin8RepairChoice', { act: 'l8_schedule_repair', hold: 'l8_schedule_hold' });
  add('l8_schedule_kept', '她那一晚的时间仍属于她', 'dorm', '六月二十二日 · 10:10', lin, `
旁白｜昨天实际改过的表还在。二十四号林晚参加说明会，我把需要的协助留在待询问栏，没有又悄悄把她填回去。
沈知夏 · 消息｜说明会那晚按你的安排来。需要的帮助我另找人确认，不用你临时赶回来证明在意。
林晚 · 消息｜好。我看到了。下午我们可以谈谈七月的事。
  `, 'l8_write_choice', { flags: { lin8ScheduleReady: true } });
  add('l8_schedule_repair', '暂停以后，给出一处真实的改变', 'dorm', '六月二十二日 · 10:10', lin, `
沈知夏 · 消息｜昨天我用以前的你要求现在的你，也把二十四号排给了自己。我把那一格改回待询问，你有说明会，七月实习也照你自己的安排走。
旁白｜我发去改好的具体表格，不只发一句我会尊重。之后，林晚回了一段比平常长一点的消息。
林晚 · 消息｜改动我看见了。昨天那句话还是会让我难受，但我愿意今天继续谈。先从你真的怎样看待现在的我开始，不直接跳到我们已经和好了。
沈知夏 · 消息｜好。我不要求你先给一个轻松的表情，才愿意把话说完。
旁白｜这次不是把暂停强行结束，而是她看见一个实际改变之后，愿意让谈话往前挪一点。
  `, 'l8_write_choice', { flags: { lin8ScheduleReady: true, lin8ScheduleRepairKept: true } });
  add('l8_schedule_hold', '她不必替我的等待腾出全部生活', 'dorm', '六月二十二日 · 10:10', lin, `
旁白｜昨天那段分歧仍没有实际调整。我告诉林晚自己还需要想清楚，也确认下午只是继续谈，不请她默认恢复私人约会。
林晚 · 消息｜知道了。我自己的行程照旧。你可以慢慢想，但不能把等你想好这件事，安排成我其他事情都先停着。
沈知夏 · 消息｜明白。今天我会听你的真实答复。
  `, 'l8_write_choice', { flags: { lin8ScheduleReady: false } });

  add('l8_write_choice', 'L8-02 · 这次从自己写起', 'dorm', '六月二十二日 · 11:00', pair('shen_zhixia'), `
旁白｜我把信纸翻回正面。只写一句我喜欢你还不够，因为它太容易把我真正害怕的、希望的和还做不好的，都遮在一个好听的句子后面。
旁白｜第一行后面的空白终于不再像等一个正确答案。我想从哪一件真实的事开始写？
  `, null, { choices: [
    { text: '从害怕再次失去联系写起，也写自己的回避。', flags: { lin8LetterStart: 'fear' }, next: 'l8_write_fear' },
    { text: '从昨天看见的变化写起，写希望怎样认识她。', flags: { lin8LetterStart: 'present' }, next: 'l8_write_present' }
  ] });
  add('l8_write_fear', '不把四年都写成她离开的后果', 'dorm', '六月二十二日 · 11:10', pair('shen_zhixia'), `
沈知夏 · 信｜林晚，我一直以为不打扰比较体面。其实有时候，是我不想问一个可能得到拒绝的问题。
沈知夏 · 信｜你离开以后，我们还能联系。我收到你节日的问候，回得很认真，也很客气。发出去以后又看很久，等你能从那几句里看见我其实想多说一点。
沈知夏 · 信｜后来你也变得客气，我就把它当成证据，觉得自己不问才是尊重。现在想起来，那个答案有一半是我自己做出来的。
沈知夏 · 信｜这次我怕联系又慢慢变少。可怕也不能让我把你的行程全部排成靠近我。我想学着问，而不是安排一个你只能答应的以后。
旁白｜写完，我把原来那句我一直在等你划掉。不是它全不真实，而是它漏掉了很多次我也没有发出去的消息。
  `, 'l8_arrival_gate');
  add('l8_write_present', '让一个新答案有机会进来', 'dorm', '六月二十二日 · 11:10', pair('shen_zhixia'), `
沈知夏 · 信｜林晚，昨天知道你喝无糖乌龙的时候，我先觉得自己记错了。后来才发现，记得四年前的答案，并不能让我少问今天这一句。
沈知夏 · 信｜我喜欢你拿起那本深绿本子，认真按平纸页的样子。以前我会先想它不太像你，现在想知道你准备用它记什么。
沈知夏 · 信｜我也变了。会把太多事接在自己手里，再希望别人看见我很努力，却不说其实已经累了。想见你时，也总想找一个更不容易被拒绝的理由。
沈知夏 · 信｜我想让你认识这样的我。希望以后喜欢的不一样，还是能一起逛；希望我害怕的时候，能说害怕，不先把你安排成那个不能走的人。
旁白｜我读了一遍，把其中一个永远删掉。纸上留下的是更小的、需要之后一次次去做的愿望。
  `, 'l8_arrival_gate');
  gate('l8_arrival_gate', 'lin8ScheduleReady', { false: 'l8_arrive_guard', true: 'l8_arrive_pending' });
  gate('l8_arrive_pending', 'pendingOmittedConversation', { false: 'l8_arrive_status', true: 'l8_arrive_person' });
  gate('l8_arrive_person', 'omittedPerson', { lin: 'l8_arrive_guard', xu: 'l8_arrive_status', zhou: 'l8_arrive_status', ye: 'l8_arrive_status' });
  gate('l8_arrive_status', 'relationshipStatus', { tryingDates: 'l8_arrive_open', gettingToKnow: 'l8_arrive_open', needsConversation: 'l8_arrive_resume' });
  add('l8_arrive_open', 'L8-03 · 下午两点，两张新信纸', 'bookshop', '六月二十二日 · 14:00', lin, `
旁白｜两点，我按原约或今天重新确认的时间来到窗边。林晚手里拿着深绿色本子，里面夹了一张信纸，没有把那封旧信再带来一次。
林晚｜我写的时候发现，这张纸比四年前薄，但写起来一点不轻松。
沈知夏｜我把几个很熟练的句子删掉了。
林晚｜我也是。都说得太像自己已经知道以后会怎样。
旁白｜她把纸放到桌边，等我坐下。阳光落在两个不同的封皮上，像终于允许它们不必成为同一个颜色。
  `, 'l8_read', { flags: { lin8Ready: true, lin8LetterMeetingKept: true } });
  add('l8_arrive_resume', '她愿意继续了解，先从今天开始', 'bookshop', '六月二十二日 · 14:00', lin, `
旁白｜林晚到了，先看了上午实际改过的部分，再抬头看我。昨天留下的不自在仍然没有被她急着藏起来。
林晚｜今天你把要改变的地方做出来了，我愿意继续认识你。但先从了解开始，不把这一点进步直接叫作已经确定关系。
沈知夏｜好。今天的答复就按你说的记。
旁白｜她把夹着信的本子放下，示意我也把纸拿出来。我们终于有机会往前谈一点，但这一步有自己的长度。
  `, 'l8_read', { flags: { lin8Ready: true, lin8LetterMeetingKept: true, relationshipStatus: 'gettingToKnow' } });
  add('l8_arrive_guard', '见面读信，不代表隔阂已经消失', 'bookshop', '六月二十二日 · 14:00', lin, `
林晚｜今天我愿意听你写了什么，也想告诉你我那时怎样想。但没落实的调整还在，这次先谈，不安排成私人约会。
沈知夏｜好。我不会拿你来了，替你答应后面的事情。
旁白｜我把信放在桌上。她也拿出自己写的一页，先说明是愿意给我读的部分，不需要我为了表示信任交出所有没有写好的话。
  `, 'l8_read', { flags: { lin8Ready: false, lin8LetterMeetingKept: true, relationshipStatus: 'needsConversation' } });
  add('l8_read', '那封信没有写完的生活', 'bookshop', '六月二十二日 · 14:10', lin, `
旁白｜林晚让我先读。我把写出来的部分一行行念完，念到自己也曾用客气制造距离的时候，有一点想赶快越过去。
旁白｜她没有打断。我读完，才看到她按在纸边的手慢慢松开。
林晚｜那时我到了新的学校，最开始很多东西都不习惯。下课不知道该往哪栋楼走，吃饭时想起你，晚上又担心突然说这些会显得很奇怪。
林晚｜我以为你看过信。你回得客气，我就想也许你不知道怎么拒绝，才还愿意在节日回我一句。
沈知夏｜你有没有想过直接问信的事？
林晚｜想过。有一次写了整整一段，最后只发出新年快乐。你回新年快乐，我就把它当成了全部回答。
旁白｜她说完，看向窗外那条我们现在都很熟悉的街。四年里并没有一扇完全锁死的门，只是两个人都站在自己的那一边，等对方先敲。
林晚｜我应该确认信有没有送到。后来也应该问，那几句客气到底是什么意思。我没有问，不全是因为你没给答案。
沈知夏｜我也把没问，写成了自己很懂得不打扰。
旁白｜她点头，拿起自己的信。开头没有写一直，只写了今天你的杯子放得离我近了一点。
林晚 · 信｜知夏，我会想和你坐得近一点，也会想有些时间一个人做自己的事。希望这两件事可以一起被你知道。
林晚 · 信｜我怕你记得以前的我时，今天说出的不同想法会被听成我不愿意再靠近。我想让你知道，有自己的决定，也可以同时想见你。
林晚 · 信｜我也会回避。有时候明明不想答应，还先笑一下，让你以为都可以。所以我想练习把不愿意说清，也听你说不愿意。
林晚 · 信｜我想做野外研究，想在很热、很早的海边记那些现在还不熟悉的名字。我也想回来以后见你。不是只剩一件，才算认真。
旁白｜她读到最后，声音轻了一点。我没有急着把这段生活概括成她其实还是喜欢我，把自己没认识过的部分也认真听完。
林晚｜这次我写的是给你的，不进展览，也不用发给谁看。我想让收件人先只有你。
沈知夏｜我这张也是。我们读过的部分留在彼此这里，没写出来的仍由各自决定。
旁白｜两张纸留在桌上，没有因为被读出来，就变成可以替作者说明一切的证据。
  `, 'l8_contact_choice', { flags: { lin8NewLettersRead: true, lin8LettersPrivate: true } });
  add('l8_contact_choice', 'L8-04 · 六周要怎样放进日常', 'bookshop', '六月二十二日 · 15:00', lin, `
旁白｜她拿出七月实习的行程草表。早上出发时间很早，有几天在野外，晚上整理记录；有信号的时候可以发消息，却不是每一晚都能通话。
林晚｜我想跟你说清能做到的，也希望你告诉我自己的日子。不想一开始把每一天都答应得太满，之后再一遍遍说对不起。
旁白｜六周在纸上只占一小栏，在我的心里却比那一栏长很多。我可以把这份担心说成一个能商量的问题，也可以又一次希望她先改变自己的去处。
  `, null, { choices: [
    { text: '说清担心，一起安排能做到的联系。', flags: { lin8ContactChoice: 'discuss' }, next: 'l8_contact_discuss' },
    { text: '先试两周，再核对彼此是否自在。', flags: { lin8ContactChoice: 'trial' }, next: 'l8_contact_trial' },
    { text: '希望她取消实习，留下来证明在意。', flags: { lin8ContactChoice: 'cancel' }, next: 'l8_contact_cancel' }
  ] });
  add('l8_contact_discuss', '想听见你，也给未接通留下位置', 'bookshop', '六月二十二日 · 15:10', lin, `
沈知夏｜我怕消息越来越少以后，又开始猜你是不是不想回。但我不想用每天必须联系，替你安排每一个晚上。
林晚｜可以先约一周两次晚饭后通话，提前一天核对有没有空。野外信号不好就发一条说明，不能把没有信号理解成故意不回应。
沈知夏｜我有试稿或入职准备，忙的时候也提前说。不是只有你要证明自己没有变得客气。
林晚｜嗯。谁想多说一句，都可以开口问；也可以收到今天太累了，明天再讲。
旁白｜我们分别记下能做到的部分，没有把每次说晚一点都预先解释成不够喜欢。
沈知夏｜二十四号那晚先留给说明会。若我真的需要帮忙，就找确认有空的人，不用这份联络约定让你马上回来。
林晚｜好。你这样说，我才愿意把更多自己的事讲给你。
  `, 'l8_relationship_gate', { flags: { lin8ContactPlan: 'twiceWeeklyWithConfirmation', lin8ContactReady: true } });
  add('l8_contact_trial', '一段可以修改的试行', 'bookshop', '六月二十二日 · 15:10', lin, `
沈知夏｜要不要先试实习开始后的两周？每周找两段晚饭后能聊的时间，提前确认。两周以后，认真问一次这样有没有负担。
林晚｜愿意。核对的时候，不只是问消息够不够多，也问有没有为了怕对方不高兴，硬把自己撑着。
沈知夏｜我也说自己的工作和休息，不把等消息当成一天里全部的事。
旁白｜她在草表旁画了一个小括号，写下再商量。我看着那几个字，发现可以修改反而让这个计划更像真的能做。
林晚｜野外日程最后确认以后，再一起定具体时段。现在不用替整个六周填满闹钟。
沈知夏｜好。两周以后，不因为我们说过试一试，就必须宣布已经成功。
旁白｜她笑了一下，把小括号圈起来。那份答复没有保证未来，却给了两个人都能提意见的地方。
  `, 'l8_relationship_gate', { flags: { lin8ContactPlan: 'reviewAfterTwoWeeks', lin8ContactReady: true } });
  add('l8_contact_cancel', '她的远方不是这封信的交换条件', 'bookshop', '六月二十二日 · 15:10', lin, `
沈知夏｜如果你真的想和我好好开始，能不能这次先不去？至少等我们稳定一点。
旁白｜林晚拿笔的手停住了。刚才还摊开的草表，被她慢慢收回自己的那一边。
林晚｜不能。我愿意认真想怎样联系，不愿意用取消实习证明我在意你。
沈知夏｜我只是怕……
林晚｜我听见你怕了，也愿意谈。可如果我的决定只有改成留下，才算正确的回答，我们就还没真正听懂刚才的信。
旁白｜我看着她，没有找到一句可以让自己的要求变轻的补充。因为它真正要求的那件事，并没有轻一点。
林晚｜今天先暂停私人约会。说明会和实习照旧，等你准备好接受我的选择，再问我愿不愿意继续谈。
沈知夏｜我知道你没有答应。
旁白｜她点头。信里的喜欢仍然是真实的，也没有让她失去给出不同答案的权利。
  `, 'l8_relationship_guard', { flags: { lin8ContactReady: false, lin8ContactPlan: 'notAgreed', relationshipStatus: 'needsConversation' } });
  gate('l8_relationship_gate', 'lin8Ready', { true: 'l8_relationship_choice', false: 'l8_relationship_guard' });
  add('l8_relationship_choice', '喜欢以外，还想怎样称呼彼此', 'bookshop', '六月二十二日 · 15:40', lin, `
林晚｜现在我更知道你怎样害怕，也更知道你愿意怎样做。我想和你认真谈一件事：我们要不要成为恋人？
林晚｜如果答应，我希望以后想改变相处方式、想结束关系，都亲口告诉彼此。不会把对朋友的好自动当成另一份恋爱承诺。
沈知夏｜我也希望我们能直接问，不靠别人猜。我还想保留自己的节奏，也把它认真说给你听。
旁白｜她看着我，没有替我选那句最让她高兴的回答。
  `, null, { choices: [
    { text: '愿意成为恋人，谈清共同的期待。', flags: { lin8RelationshipChoice: 'commit' }, next: 'l8_commit' },
    { text: '先按现在的节奏相处，不急着确认恋人身份。', flags: { lin8RelationshipChoice: 'slow' }, next: 'l8_slow' },
    { text: '还需要独处想清楚，今天先暂停约会。', flags: { lin8RelationshipChoice: 'pause' }, next: 'l8_pause' }
  ] });
  add('l8_commit', '两个人都说出的称呼', 'bookshop', '六月二十二日 · 15:45', lin, `
沈知夏｜愿意。我想成为你的恋人，也想让我们遇到不舒服的事能直接说，不因为有了这个称呼，就把一切默认为可以。
林晚｜我也是。七月会出去六周，联系计划按刚谈的再核对；我们各自的朋友和工作，也不用靠减少它们证明关系。
沈知夏｜不想公开给所有人看，也可以是真的。我想先留给我们自己，再一起决定要告诉谁。
林晚｜好。那今天，我可以叫你女朋友吗？
旁白｜我点头，点得有一点快。她看见了，忍不住笑，笑完又很认真地把我的名字接在那个新称呼后面。
沈知夏｜我也可以叫你了。
旁白｜我们隔着桌子笑了一会儿。这个下午没有替以后的每一次争执作保，却终于有一个两个人都亲口给出的名字。
  `, 'l8_evening_choice', { flags: { relationshipStatus: 'girlfriends', lin8Outcome: 'together', lin8RelationshipConfirmed: true } });
  add('l8_slow', '慢一点，不藏起已经说清的心意', 'bookshop', '六月二十二日 · 15:45', lin, `
沈知夏｜我想先按现在的节奏来。今天更清楚自己的心意，但还不想为了让这封信有一个完整结尾，就急着确定称呼。
林晚｜好。我们可以继续见面，也照刚说的方式商量联系。你不需要把慢一点说成没有喜欢。
旁白｜她把我的信折好，问能不能带走。我说这是给她的，只希望不转给别人。她说好，放进自己的本子里。
旁白｜我们没有确定恋人身份，也没有把今天谈过的安排当作仅供恋人才配拥有的东西。
  `, 'l8_other_evening_choice', { flags: { lin8Outcome: 'slow', lin8RelationshipConfirmed: false } });
  add('l8_pause', '一句尚未准备好，也是一份回答', 'bookshop', '六月二十二日 · 15:45', lin, `
沈知夏｜我还想独处一段，把喜欢和害怕分清楚。今天先暂停私人约会，可以吗？
林晚｜可以。那具体联系计划先留作我们谈过的方案，不当成你现在必须执行的恋爱约定。
沈知夏｜好。等我准备好再问你的时间，也接受你那时有自己的安排。
旁白｜她把信收好，没有让我撤回刚读过的真话。我们只是让今天的关系停在两个人都知道的位置。
  `, 'l8_other_evening_choice', { flags: { relationshipStatus: 'needsConversation', lin8Outcome: 'paused', lin8RelationshipConfirmed: false } });
  add('l8_relationship_guard', '这一次先回答还没做好的事', 'bookshop', '六月二十二日 · 15:40', lin, `
旁白｜尚未谈妥的部分让今天停在这里。林晚没有继续邀请亲近，我也不能拿交换过的信，要求她先给一个恋人的回答。
林晚｜有些话我已经听见，也想让你认真听见我没有答应的部分。以后能不能再靠近，需要接下来真的做过什么。
  `, null, { choices: [
    { text: '记清她没有答应什么，准备具体回应。', flags: { lin8RelationshipChoice: 'notes' }, next: 'l8_guard_notes' },
    { text: '说出自己还需要思考，不催她继续等。', flags: { lin8RelationshipChoice: 'reflect' }, next: 'l8_guard_reflect' },
    { text: '先结束今天的谈话，尊重她自己的安排。', flags: { lin8RelationshipChoice: 'stop' }, next: 'l8_guard_stop' }
  ] });
  add('l8_guard_notes', '把未得到的答应写准确', 'bookshop', '六月二十二日 · 15:45', lin, `
沈知夏｜你没有答应扩大工作，也没有答应改变实习。我会具体回答自己还没做到的部分，不先说成你已经接受我的理由。
林晚｜好。你把这些记清，比现在发一段保证让我放心有用。
旁白｜我写下这两句。今天的隔阂仍在，但终于没有被我又改成对方只是还需要听更动人的解释。
  `, 'l8_other_evening_choice', { flags: { relationshipStatus: 'needsConversation', lin8Outcome: 'paused', lin8RelationshipConfirmed: false } });
  add('l8_guard_reflect', '给自己时间，也还她自己的时间', 'bookshop', '六月二十二日 · 15:45', lin, `
沈知夏｜我还需要想清楚为什么一直希望你先改变。今天不让你陪我想完，也不要求你把以后的时间都先留给我。
林晚｜好。准备好之后先问我，我们都可以再决定。
旁白｜这句再决定让我有一点难过。我没有因此把它改成你到时一定要来，只点了点头。
  `, 'l8_other_evening_choice', { flags: { relationshipStatus: 'needsConversation', lin8Outcome: 'paused', lin8RelationshipConfirmed: false } });
  add('l8_guard_stop', '结束谈话以前，没有最后一次施压', 'bookshop', '六月二十二日 · 15:45', lin, `
沈知夏｜那今天先到这里。你自己的事照旧，我回去处理还没有真正给出的回应。
林晚｜嗯。信我会收好，它不需要被今天的分歧抹掉。
旁白｜我看着她把纸放回本子。没有再问一句是不是读了也没有用，才发现自己也能让别人的回答完整地结束。
  `, 'l8_other_evening_choice', { flags: { relationshipStatus: 'needsConversation', lin8Outcome: 'paused', lin8RelationshipConfirmed: false } });

  add('l8_evening_choice', 'L8-05 · 写完信以后', 'bookshop', '六月二十二日 · 16:00', lin, `
林晚｜今晚想不想去我住的地方吃饭？学校旁边短租的那间，七月出发前还住在那里。我也想问，要不要多留一会儿，或者留下过夜。
旁白｜她把这几件事分别问出来，没有把答应吃饭连成答应整晚。
沈知夏｜明天早上我有空，但十点要去书店核对一批到货。陆遥那边也会告诉她自己的安排，不让她以为我忽然没回去。
林晚｜好。你可以选现在舒服的，也可以到时改变主意。
  `, null, { choices: [
    { text: '愿意留下过夜，再一起说清今晚的节奏。', flags: { lin8EveningChoice: 'overnight' }, next: 'l8_home' },
    { text: '一起吃晚饭，之后各自休息。', flags: { lin8EveningChoice: 'dinner' }, next: 'l8_home' },
    { text: '今天先回去，约好明早通话。', flags: { lin8EveningChoice: 'home' }, next: 'l8_go_home' }
  ] });
  add('l8_other_evening_choice', '今天余下的时间也要分别询问', 'bookshop', '六月二十二日 · 16:00', lin, `
旁白｜我们没有把关系往留宿或亲近继续推。接下来想做什么，仍然需要两个人都愿意。
  `, null, { choices: [
    { text: '问她是否愿意先散步一小段，再分别。', flags: { lin8EveningChoice: 'walk' }, next: 'l8_other_walk' },
    { text: '问能否在书店再聊一会儿普通的事。', flags: { lin8EveningChoice: 'chat' }, next: 'l8_other_chat' },
    { text: '各自回去，把今天想过的事情先放稳。', flags: { lin8EveningChoice: 'separate' }, next: 'l8_other_separate' }
  ] });
  gate('l8_other_walk_gate', 'lin8Outcome', { slow: 'l8_other_walk_yes', paused: 'l8_other_walk_no' });
  add('l8_other_walk', '一小段路也先问愿不愿意', 'bookshop', '六月二十二日 · 16:05', lin, '沈知夏｜离开以前，你想和我沿后街走一小段吗？如果今天更想自己回去，也可以直接说。', 'l8_other_walk_gate');
  add('l8_other_walk_yes', '不用新的称呼也能同行', 'old_street', '六月二十二日 · 16:15', lin, `
林晚｜想。就走到路口，我还要回去整理明天的资料。
旁白｜我们沿街走过去，聊起那家卖本子的小店已经换了橱窗。她没有替我把慢一点加上倒数，我也认真记住这段路到哪里结束。
  `, 'l8_next_morning', { flags: { lin8Stay: false } });
  add('l8_other_walk_no', '她想独处的那一段', 'bookshop', '六月二十二日 · 16:05', lin, `
林晚｜今天想自己回去。刚才的话需要一点时间，我不想为了让分别好看，就继续散步。
沈知夏｜好。那今天在这里分别。
旁白｜我让路口留给她自己的脚步，没有把合理的拒绝又添成一项需要解释的伤害。
  `, 'l8_next_morning', { flags: { lin8Stay: false } });
  add('l8_other_chat', '普通的话也不能用来绕过暂停', 'bookshop', '六月二十二日 · 16:05', lin, '沈知夏｜要不要再坐一会儿，讲点普通的事？你今天不想继续，我们就先到这里。', 'l8_other_chat_gate');
  gate('l8_other_chat_gate', 'lin8Outcome', { slow: 'l8_other_chat_yes', paused: 'l8_other_chat_no' });
  add('l8_other_chat_yes', '花盆今天仍只是花盆', 'bookshop', '六月二十二日 · 16:10', lin, `
林晚｜可以坐十分钟。我今早把窗台的花盆转了方向，发现每次转完都忍不住想立刻看它是不是长直了。
沈知夏｜那它有被你的目光催直吗？
林晚｜没有。先把我晒热了。
旁白｜我们笑了一会儿。十分钟到了，她收好本子，我也起身，没有把这点自在当成今天必须继续往前的理由。
  `, 'l8_next_morning', { flags: { lin8Stay: false } });
  add('l8_other_chat_no', '不让新的话题挡住她要走', 'bookshop', '六月二十二日 · 16:05', lin, `
林晚｜今天先不聊了。我想回去休息。
沈知夏｜好。不用为了我再留一句轻松的话。
旁白｜她点头，把杯子收好。今天的谈话在她真实给出的范围里结束，没有被我用另一个不重要的话题偷偷延长。
  `, 'l8_next_morning', { flags: { lin8Stay: false } });
  add('l8_other_separate', '各自回去，信仍有自己的位置', 'old_street', '六月二十二日 · 16:10', pair('shen_zhixia'), `
旁白｜我们各自离开。我回到后街的长椅坐了一会儿，摸到包里新信纸的边角，没有立刻拍下来证明今天有一个怎样的结尾。
旁白｜慢慢了解或暂停，都不让那封信变成没写过。它已经告诉过另一个人一部分真实的我，之后还需要真实的日子继续说。
  `, 'l8_next_morning', { flags: { lin8Stay: false } });

  add('l8_home', '她住的地方，也有她的日常', 'lin_home', '六月二十二日 · 18:00', lin, `
旁白｜房间比我想的简单。桌上摆着两本植物图鉴，窗台有一只旧陶杯，沙发边的帆布包只装好了一半。
林晚｜别看那个包。它每天都有不同的一半已经装好。
沈知夏｜我认识一个有三箱最后一箱的人。
旁白｜她笑着把钥匙放进小碟子，让我坐一会儿。我没有急着替她把整间屋子收好，先问杯子放哪里，她指给我看。
旁白｜我们一起做了一顿很普通的饭。她切菜，我洗番茄，切得不一样大小的时候，她说不用拿去参展，熟了就好。
沈知夏｜明天吃早餐用的碗也在这里吗？
林晚｜在下一层。你如果临时想回去，它也可以等下次再用。
旁白｜我看着她，没有把这个新称呼赋予的靠近误以为自己已经熟悉每一个抽屉。
  `, 'l8_home_after');
  add('l8_home_after', '晚饭的每一段都有自己的答复', 'lin_home', '六月二十二日 · 19:30', lin, `
旁白｜吃完饭，我们把碗洗好，坐到窗边。天色一点点变暗，林晚拧亮小台灯，把两张新信收在各自的本子里。
沈知夏｜我今天很喜欢这里，也喜欢知道这只是你暂时住的地方。七月还要出发，不会因为我来了就改变。
林晚｜嗯。你自己的九月也还在。我们要找能一起过的办法，不是把两个人都留在这一盏灯底下。
旁白｜她伸出手，我问能不能牵，她说可以。掌心靠在一起时，没有谁立刻替另一件还没问的事作出回答。
  `, 'l8_stay_gate');
  gate('l8_stay_gate', 'lin8EveningChoice', { overnight: 'l8_stay', dinner: 'l8_dinner_goodbye' });
  add('l8_stay', '夜晚留下，不把以后全部答应', 'lin_home', '六月二十二日 · 21:00', lin, `
旁白｜我把自己的安排告诉陆遥，只说今晚在林晚这里，明早十点前到书店。没有把读过的信或私下的话发出去。
林晚｜现在还想留下吗？如果想回去，我陪你走到路口。
沈知夏｜想留下。也想告诉你，我紧张的时候可能会说得慢一点。
林晚｜那我们就慢一点。我也会直接问，不靠你没有拒绝，猜成你愿意。
旁白｜我们轻轻亲吻，停下来时仍然能说一句等等，也能把还没准备好的留到以后。小台灯的光落在合起的本子上，这个夜晚只属于两个人此刻都愿意的部分。
旁白｜之后的私密时光安静地淡出。第二天，先叫醒我的是窗外清早的脚步声，还有她在厨房小声找勺子的声音。
  `, 'l8_next_morning', { flags: { lin8Stay: true, lin8PrivateEvening: true } });
  add('l8_dinner_goodbye', '吃过晚饭，也可以完整地分别', 'lin_home', '六月二十二日 · 20:30', lin, `
沈知夏｜今天吃过饭就回去，还是按说好的来。我很喜欢和你在这里，不想为了留住这个感觉就把自己往前推得太快。
林晚｜好。我送你到路口。明早九点半有空的话，我们通个电话？
沈知夏｜有空。十点去书店之前，能认真留那一段。
旁白｜她帮我把本子放进包里，问能不能抱一下。我说可以，肩膀靠过去时，听见她笑着说记得别把钥匙落在这里。
旁白｜我们在路口分别，约好的电话留在明天。今天没有留宿，也没有因此少得到她认真回应的那一段晚饭。
  `, 'l8_next_morning', { flags: { lin8Stay: false, lin8MorningCall: '6-23 09:30' } });
  add('l8_go_home', '今天先回去，也有明天能说的话', 'old_street', '六月二十二日 · 16:20', lin, `
沈知夏｜今天我想先回去整理。你愿意明早九点半通话吗？十点去书店以前，可以留二十分钟。
林晚｜愿意。那今晚各自吃饭，明早先问一句睡得好吗。
旁白｜她没有把我没去她那里解释成又一次退缩。我也不需要先保证下次一定留下，才让这次自己的选择成立。
旁白｜走到路口，她朝我挥手。我回到宿舍，把新信收好，给明天的电话留了提醒。
  `, 'l8_next_morning', { flags: { lin8Stay: false, lin8MorningCall: '6-23 09:30' } });

  gate('l8_next_morning', 'lin8Outcome', { together: 'l8_morning_together', slow: 'l8_morning_slow', paused: 'l8_morning_paused' });
  gate('l8_morning_together', 'lin8Stay', { true: 'l8_morning_home', false: 'l8_morning_phone' });
  add('l8_morning_home', 'L8-06 · 一起吃早餐的第二天', 'lin_home', '六月二十三日 · 09:30', lin, `
旁白｜我坐在小桌旁，把两只杯子推到热水旁边。林晚煎的蛋一边有点焦，她先皱眉，又笑着说今天先吃这一版。
沈知夏｜我帮你拿勺子。这层，是吗？
林晚｜对。今天你也要十点到书店，我们别一边聊天一边忘了时间。
旁白｜早餐很普通，让昨晚不只停在一个被写得很好的镜头里。
  `, 'l8_feedback_choice_home');
  add('l8_morning_phone', 'L8-06 · 各自在家，也留出早上的一段', 'dorm', '六月二十三日 · 09:30', lin, '旁白｜二十三号早上，我们按昨天约好的时间接通电话。', 'l8_feedback_choice_dorm', variation('lin8EveningChoice', {
    dinner: `旁白｜林晚在自己的房间，我在宿舍，她先问昨天回去路上顺不顺，我告诉她钥匙真的没有落下。
林晚｜我刚做早餐，蛋有一点焦。你呢？
沈知夏｜吃了。今天这句也是真的。`,
    home: `旁白｜林晚刚把窗台的杯子挪到有光的位置，先问我昨晚休息得怎样。
沈知夏｜睡得不错。有些高兴的事，我还是想今天再亲口说一次。
林晚｜那我也有一点想告诉你。`
  }));
  add('l8_morning_slow', '继续了解，不等于随时必须联络', 'dorm', '六月二十三日 · 09:30', lin, `
旁白｜我先问林晚上午愿不愿意聊一小段，没有把昨天的一次同行或闲话默认成每天都能立刻接通。
林晚 · 消息｜现在有十分钟，可以聊。十点我也要去书店核对自己的那部分。
旁白｜她回了能给出的时间，我才发起通话。我们仍在慢慢了解，昨天说清的部分也可以今天再问一次。
  `, 'l8_feedback_choice_dorm');
  add('l8_morning_paused', '只问可以谈的部分', 'dorm', '六月二十三日 · 09:30', lin, `
旁白｜我先发消息问，林晚是否愿意给昨天的谈话一句反馈。不是问要不要立刻恢复约会，也不要求她一早替我解除难过。
林晚 · 消息｜可以发一段。今天先不用通话，十点我去书店做原来答应的核对。
旁白｜我照她说的方式准备消息。私人关系暂停，她答应过的工作也不会被我改成对我还喜欢多少的证明。
  `, 'l8_feedback_choice_dorm');
  for (const [suffix, place] of [['home', 'lin_home'], ['dorm', 'dorm']]) {
  const feedbackVariation = variants => variation('lin8Outcome', suffix === 'home' ? { together: variants.together } : variants);
  add('l8_feedback_choice_' + suffix, '把第二天也留给真实感受', place, '六月二十三日 · 09:35', lin, `
旁白｜昨天的选择各有自己的后续。今天想说什么，也可以从自己的感受开始，或先认真听她的那一部分。
  `, null, { choices: [
    { text: '主动说自己的感受，也说明仍需要的节奏。', flags: { lin8Feedback: 'self' }, next: 'l8_feedback_self_' + suffix },
    { text: '先听她的感受，不急着替她总结。', flags: { lin8Feedback: 'listen' }, next: 'l8_feedback_listen_' + suffix }
  ] });
  add('l8_feedback_self_' + suffix, '高兴和不自在都可以说', place, '六月二十三日 · 09:40', lin, '旁白｜我按已经说好的方式，把自己的感受告诉她。', 'l8_work_today', feedbackVariation({
    together: `沈知夏｜昨天很高兴，也有紧张的时候。想以后停下来多问一句，不因为成为恋人，就怕说还没准备好会让你失望。
林晚｜我也想这样。我们私下的信和事情，先只属于我们；以后想向朋友说哪一部分，先一起商量。
旁白｜我认真应下，又说明今天十点的安排。愿意亲近以后，工作和休息仍然需要各自说清楚。`,
    slow: `沈知夏｜昨天更知道自己为什么想见你。还是想慢一点，也不希望为了证明有进展，每次都得比前一次更近。
林晚｜好。我希望慢慢了解也有真实的见面，不只把所有话留到某一天忽然都准备好。
旁白｜我们把这两句一起留下，没有把慢解释成永远不用回应。`,
    paused: `沈知夏 · 消息｜昨天难过，也看见自己还没给出你需要的行动。今天不催你恢复关系，我会先处理具体没有做到的部分。
林晚 · 消息｜知道了。我也保留自己的决定。以后是否继续，我们到时分别作答。
旁白｜这不是已经修复的消息。我收到以后，没有再发一段更长的，希望她改成让我安心的答案。`
  }));
  add('l8_feedback_listen_' + suffix, '她的回答留在自己的声音里', place, '六月二十三日 · 09:40', lin, '旁白｜我先让林晚按自己的方式说完，没有把一个停顿急着填上。', 'l8_work_today', feedbackVariation({
    together: `林晚｜昨天我也很高兴。可有时候会怕提要求太多，让你觉得我和记忆里差得很远。想继续说清楚，不再先笑着答应。
沈知夏｜你可以直接说。我听不懂的时候再问，也不把自己一时失落，当成你该收回的理由。
旁白｜她讲完，我们再说起早餐和出门时间。昨天的靠近有后续，不只有一段被写好的结束。`,
    slow: `林晚｜我愿意慢慢了解，也有怕你因为没有立即确定关系，就悄悄退回客气的时候。
沈知夏｜我可以直接告诉你想见。还没准备好的部分，也说还没准备好，不让你只剩猜。
旁白｜她说这样更清楚。我没有把这句更清楚改成她已经愿意开始恋爱。`,
    paused: `林晚 · 消息｜我今天仍想按昨天说过的范围来，不为了让分别好看，就把暂停改成我们已经谈妥。说明会和实习照旧，自己的决定仍留给自己。
沈知夏 · 消息｜我听见了，不替你的决定加一句其实是在等我坚持。
旁白｜消息停在这里。她给出的范围已经足够清楚，之后要改变的是我的行动，不是她对同一件事解释得有多耐心。`
  }));
  }
  add('l8_work_today', 'L8-尾声 · 十点，各自到场', 'bookshop', '六月二十三日 · 10:00', ['shen_zhixia', 'lin_wan', 'xu_jianwei'], `
旁白｜十点，我们各自按工作表到书店。一批到货的册子摊在桌上，见微示意我从中间抽几本，看页码、折边和原作者确认的文字。
许见微｜先检查，不因为看见印出来，就把所有内容和现场材料一起算成完成。
旁白｜我按原预算的印数核对这批回执。还在等许可的材料另列，私人新信不在其中，也没有因为读给收件人听过就进展览。
旁白｜林晚做自己的借阅核对，叶澄看设备接口，周栀确认音频清单。没有谁因为我进入一条路线，就停止拥有自己的工作和日子。
旁白｜陆遥的二十九号车次仍在日历里。我看过二十八号晚间核对入口的提醒，没有把它从这一段关系旁边挤掉。
  `, 'l8_last', { flags: { lin8SampleChecked: true } });
  add('l8_last', '那封信没有写完的部分', 'bookshop', '六月二十三日 · 11:00', lin, `
旁白｜窗边的两张新信没有摆出来。它们留在各自的本子里，给读过的人，也给以后愿意继续说的话。
旁白｜陈老师发来二十四号天气有变化的提醒，问大家核对门窗和存放的位置。林晚的实习说明会也在那一晚，已经清清楚楚写在自己的行程里。
旁白｜接下来的日子还会问我们新的问题。昨天写过、说过的部分，不能替以后的行动作答，却可以提醒我先把真实的事情说清楚。
  `, 'lin_eight_complete', variation('lin8Outcome', {
    together: '旁白｜我看向林晚，认真想了一遍刚开始使用的那个称呼。成为恋人以后，仍然要一次次问、听、到场。今天我愿意这样往下走。',
    slow: '旁白｜我看向林晚，知道我们还没有确定恋人身份。愿意慢慢认识的人，也值得一次次真实的见面，而不是被催出一个结尾。',
    paused: '旁白｜我看向林晚，没有用目光请她先回到我身边。今天停下来的部分仍在，下一次能不能靠近，要看我怎样面对她已经说清的选择。'
  }));
  const data = { scenes, gates };
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.RainChapterEightLin = data;
})(typeof window !== 'undefined' ? window : globalThis);
