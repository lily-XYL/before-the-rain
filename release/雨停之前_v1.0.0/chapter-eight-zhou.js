(function (root) {
  'use strict';
  const scenes = [], gates = [];
  const script = text => text.trim().split('\n').map(line => {
    const i = line.indexOf('｜');
    if (i < 1) throw new Error('周栀第八章对白缺少说话人物。');
    return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
  });
  const add = (id, title, location, time, cast, text, next, extra = {}) => scenes.push({ id, title, location, time, cast, lines: script(text), next, ...extra });
  const variation = (variantBy, variants) => ({ variantBy, variants: Object.fromEntries(Object.entries(variants).map(([key, text]) => [key, script(text)])) });
  const gate = (id, redirectBy, targets) => gates.push({ id, redirectBy, targets });
  const pair = id => ['shen_zhixia', id], zhou = pair('zhou_zhi'), self = ['shen_zhixia'];

  add('z8_morning', 'Z8-01 · 包裹与一句尚未发生的约定', 'dorm', '六月二十二日 · 08:40', pair('lu_yao'), `
旁白｜陆遥把箱子上的旧标签揭下来，纸上留下一小块白。我正要帮她贴新标签，她把笔递给我，先让我核地址。
陆遥｜别因为已经写过一次就凭印象。人去了新的地方，快递也要真正知道。
沈知夏｜我看原消息，不猜。
旁白｜她满意地点头，又去折那件写着寝室号的衣服。我的手机里有印厂到货的通知，和昨晚真正得到的私人答复，两件事并排，谁也不能替谁自动继续。
旁白｜今天要做自己的出版社修改，基础册也要实际到货后才抽检。我看着六点那一栏，先确认它究竟是两个人答应过的十分钟，还是我自己希望能有的时间。
  `, 'z8_entry');
  gate('z8_entry', 'z7Outcome', { open: 'z8_entry_open', slow: 'z8_entry_slow', distance: 'z8_entry_distance' });
  add('z8_entry_open', '女朋友，也不是自动接下所有新安排', 'dorm', '六月二十二日 · 09:00', self, `
旁白｜昨天我们亲口确认女朋友，身体节奏另问。今晚十八点至十八点十分的联系，已经由双方答应，不因为是否亲吻而变化。
沈知夏 · 消息｜晚上六点十分钟照旧，上午各做自己的事。
周栀 · 消息｜我留好了。今天没有开场音乐，只有一位正在找第二只袜子的女朋友。
沈知夏 · 消息｜先找，不用同时证明联络很稳定。
旁白｜她发来一个笑脸。能讲普通的一天让我高兴，也提醒我，昨天的认真答复需要在今天很普通的时间里继续练习。
  `, 'z8_repair_choice', { flags: { z8EntryOutcome: 'open' } });
  add('z8_entry_slow', '六点要答的，不能又交给下一首歌', 'dorm', '六月二十二日 · 09:00', self, `
旁白｜昨晚约了今天六点，十分钟，各自回答是否开始或确认恋爱。原试着约会或继续了解仍在，没有因约好回复就提前得到新称呼。
沈知夏 · 消息｜六点我能在。自己的需要已经写过一点，想听你真正能给的答案，不需要是一段开场词。
周栀 · 消息｜我也准备了。没想清的会说没想清，不再让你从副歌里猜。
旁白｜我将这段时间留在私人栏，工作另记。今晚尚未发生，也不能在上午就签上谈过两个字。
  `, 'z8_repair_choice', { flags: { z8EntryOutcome: 'slow' } });
  add('z8_entry_distance', '暂停之后，先别替六点填一个人', 'dorm', '六月二十二日 · 09:00', self, `
旁白｜昨晚的私人答复停在暂停。可能之前吃过点心、听过旋律，也可能只有工作二十分钟；今天都从真正结束的位置继续。
沈知夏 · 消息｜旧范围保留，具体修改另准备，不借到货消息默认今晚有私人通话。
周栀 · 消息｜收到。新增协助也先问，不把一张工作表当作什么都同意。
旁白｜她回复得很快，但回复工作不是答应约会。我合上聊天页，先去洗自己的碗。
  `, 'z8_repair_choice', { flags: { z8EntryOutcome: 'distance' } });
  add('z8_repair_choice', '选择一 · 旧回应准备好了多少', 'dorm', '六月二十二日 · 09:20', self, `
旁白｜尚未确认的具体修改仍有自己的清单。昨晚让人猜、或说还没准备好的那部分，也不能用今天想见她来代替行动。
  `, null, { choices: [
    { text: '中午发实际修改，并把自己的需要和时间说清。', flags: { z8RepairChoice: 'act', z8OldRepairKept: false, z8ControlDemandWithdrawn: false }, next: 'z8_dispatch' },
    { text: '说明仍没准备好，保留旧暂停与原工作范围。', flags: { z8RepairChoice: 'hold', z8ControlDemandWithdrawn: false }, next: 'z8_dispatch' }
  ] });
  add('z8_dispatch', '十点的实物，不是二十号的文件', 'studio', '六月二十二日 · 09:30', pair('xu_jianwei'), `
旁白｜印厂确认十点送达。见微将自己的文件移开，只为原抽检留半小时；林晚带着作者确认件，周栀的技术表仍放在另一侧。
许见微｜先数数量，再取三本核页序、装订和折边。新增检查另说，不默认谁继续整个上午。
沈知夏｜我十点四十开始自己的修改。音乐设备不是册子的抽检范围，不能把看过一本书写成线路也已经检查过。
旁白｜门外有人推着纸箱经过，今天这一批还没到。我们给待查栏留着空格，没有提前填下完成。
  `, 'z8_delivery');
  add('z8_delivery', '纸箱落地之后，才是到货', 'studio', '六月二十二日 · 10:00', pair('xu_jianwei'), `
旁白｜十点整，送货的人把纸箱放到桌边。我对原确认单点数，见微核外箱状态，林晚留好当天回执。
许见微｜现在记收货，里面的页序等真的翻过。
沈知夏｜没有因为今天心情变化，就多订一箱。
旁白｜印墨与新纸的味道从封口里慢慢出来。我忽然想到，二十号把文件交出去时看不到这种味道，也不能把那一刻写成已经检查过今天的纸。
  `, 'z8_quantity', { flags: { z8BooksReceived: true, z8DeliveryTime: '6-22 10:00' } });
  gate('z8_quantity', 'workflow', { collective: 'z8_quantity_60', solo: 'z8_quantity_60', smaller: 'z8_quantity_40' });
  for (const copies of [60, 40]) add('z8_quantity_' + copies, '原方案的实收数量', 'studio', '六月二十二日 · 10:05', self, `
旁白｜实收${copies}本，每本二十四页。原确认费用、作者答复与现场单页清单保留，没有新增印数，也没有把私人旋律塞进册子的留白。
旁白｜基础册收到了，告别活动还没发生。我们先把数量写清，再看今天愿意承担的检查范围。
  `, 'z8_sample_choice', { flags: { z8DeliveredCopies: copies } });
  add('z8_sample_choice', '选择二 · 原半小时怎样分工', 'studio', '六月二十二日 · 10:10', self, `
旁白｜三本样本已取好。我可以参与核页序，也可以说明今天自己的工时，由已答应的伙伴完成原检查。
  `, null, { choices: [
    { text: '核三本页序与作者确认件，装订由见微检查。', flags: { z8SampleChoice: 'shared' }, next: 'z8_sample_shared' },
    { text: '先数交付清单，原三本由林晚和见微核，我按时改稿。', flags: { z8SampleChoice: 'separate' }, next: 'z8_sample_separate' }
  ] });
  add('z8_sample_shared', '自己翻过的页，才在自己名字下签字', 'studio', '六月二十二日 · 10:10–10:30', pair('lin_wan'), `
旁白｜我逐本翻过二十四页，对原作者确认件，林晚指出一处我差点跳过的编号；见微同时看装订和折边。
林晚｜这一项你看过，再签。不用因为大家都站在桌边就写成大家每一项都查了。
沈知夏｜三本页序核清，没有新增作者文字。装订记录放在见微实际看的那一栏。
旁白｜十点半，三本原样本检查实际结束。没有隐藏多拿的两本，也没有靠多做一项替今晚预支一个更亲近的答复。
  `, 'z8_sample_done', { flags: { z8ShenSampleChecked: true, z8OwnWorkStartedAt: '6-22 10:40' } });
  add('z8_sample_separate', '各自承担，也能完成原检查', 'studio', '六月二十二日 · 10:10–10:30', pair('lin_wan'), `
沈知夏｜我核数量和交付清单，十点四十做自己的修改。三本页序能否请你和见微按原范围核，不加量？
林晚｜可以，原半小时里核三本。多出来的问题单列，不需要你留到它们全部消失。
旁白｜我对好清单，她逐本翻页，见微检查折边。十点半，三本检查实际结束，各自签自己负责的那项。
旁白｜我没在样本页序栏签字，也没有因为这一项由伙伴承担就少一份责任。按时去做自己的修改，同样是今天真正答应的安排。
  `, 'z8_sample_done', { flags: { z8ShenSampleChecked: false, z8OwnWorkStartedAt: '6-22 10:40' } });
  add('z8_sample_done', '完成量有自己的数字', 'studio', '六月二十二日 · 10:35', pair('xu_jianwei'), `
旁白｜原三本样本的页序、装订与折边核清，结果已登记。抽检完成不保证以后任何一本都不会受损，也不扩大作者同意的范围。
许见微｜今天各自做完的够了。现场新项再问，不将我的半小时往后接成一整天。
沈知夏｜好。自己的修改十点四十开始，中午只处理真实准备好的那项回应。
  `, 'z8_repair_gate', { flags: { z8SamplesChecked: true, z8SampleCount: 3, z8SampleTime: '6-22 10:10-10:30' } });
  gate('z8_repair_gate', 'z8RepairChoice', { act: 'z8_repair_pending', hold: 'z8_repair_hold' });
  gate('z8_repair_pending', 'pendingOmittedConversation', { true: 'z8_repair_person', false: 'z8_repair_current' });
  gate('z8_repair_person', 'omittedPerson', { lin: 'z8_repair_lin', xu: 'z8_repair_xu', zhou: 'z8_repair_zhou', ye: 'z8_repair_ye' });
  for (const [id, person, name, scope] of [
    ['lin', 'lin_wan', '林晚', '只采用已获准原句，未回信者留白；借阅编号对原件'],
    ['xu', 'xu_jianwei', '许见微', '保留原尺寸与折边，新增工时另问，不请她默认接全部'],
    ['zhou', 'zhou_zhi', '周栀', '十五分钟歌、换场、撤场分别列时，未确认的新串场不用'],
    ['ye', 'ye_cheng', '叶澄', '设备说明由负责人确认，私人片段不转成公开素材']
  ]) add('z8_repair_' + id, '今天的新版本，今天实际确认', 'studio', '六月二十二日 · 12:00–12:20', pair(person), `
沈知夏 · 消息｜具体调整发给你：${scope}。只看标出的这一项，没有确认的继续不用。
旁白｜她指出一处仍不清楚的文字，我改完再发，等她真正看过。两次发送之间有一点等待，不能用我很希望这项完成来跳过。
${name} · 消息｜现在这一项可以，新增的另问。以前没有做的那次，不改日期。
沈知夏 · 消息｜收到，今天只清实际得到确认的这一项。
  `, 'z8_repair_current', { flags: { pendingOmittedConversation: false, repairStarted: true, omittedContribution: 'confirmedPartOnly', z8OldRepairKept: true } });
  add('z8_repair_current', '准备自己的需要，不准备她必须说的台词', 'dorm', '六月二十二日 · 12:30', self, `
旁白｜我在备忘里分别写需要、能给、尚不知道三个短标题。最低的联络需要不是要求她永远立刻回，自己的工作时间也不藏在一句都方便里面。
沈知夏 · 消息｜我把能给的量写清了。未说清的会自己改口，不用你猜；工作各自负责，新的私人谈话仍问你是否愿意。
周栀 · 消息｜听清了。你的新安排看过，愿意再谈，但不是发了一张表我就先答应所有以后。
旁白｜旧暂停者今天得到新的谈话同意，没有倒填昨晚，也没有因为一条回复就恢复女朋友称呼。
  `, 'z8_ready', { flags: { z8PriorReady: true, z8CurrentResponsePrepared: true } });
  add('z8_ready', '新的回应只记今天', 'dorm', '六月二十二日 · 12:35', self, `
旁白｜原先已完成的保留，新确认与这次准备都有自己的日期。没有旧待办要清的，就不虚构又做完了一次。
旁白｜工作修改的确认不替私人关系作答。今天的新需要仍要由两个人分别回答。
  `, 'z8_invite_gate');
  add('z8_repair_hold', '中午准时说清，旧暂停没有新答复', 'dorm', '六月二十二日 · 12:00', self, `
沈知夏 · 消息｜具体回应今天仍没准备好。原已确认的保留，未确认的继续不用，旧暂停也不靠一起核书改成已恢复。
周栀 · 消息｜收到。以前答应的按原范围，没答应的新时间不先排。
旁白｜她知道我今天能做到哪里，却没有因此替我做完那份修改。原来已有的相处保留，原来暂停的则仍没有新的私人答复。
  `, 'z8_hold_ready', { flags: { z8OldRepairKept: false, z8CurrentResponsePrepared: false } });
  gate('z8_hold_ready', 'z7Outcome', { open: 'z8_hold_open', slow: 'z8_hold_open', distance: 'z8_hold_closed' });
  add('z8_hold_open', '已答应的六点，仍照原约', 'dorm', '六月二十二日 · 12:35', self, '旁白｜昨晚已愿意继续相处并约好六点十分钟，今天保留那份真实答复。欠其他伙伴的工作仍独立待谈，不用这次私人通话替它签字。', 'z8_invite_gate', { flags: { z8PriorReady: true } });
  add('z8_hold_closed', '还未回应的地方，今天没有新邀约', 'dorm', '六月二十二日 · 12:35', self, '旁白｜旧暂停的原因尚未具体回应，今天没有新的私人通话同意。基础册与设备按原范围推进，不借配合工作延长私人时间。', 'z8_invite_gate', { flags: { z8PriorReady: false } });
  gate('z8_invite_gate', 'z8PriorReady', { true: 'z8_invite_kind', false: 'z8_work_contact_booked' });
  gate('z8_invite_kind', 'z7Outcome', { open: 'z8_invite_old', slow: 'z8_invite_old', distance: 'z8_invite_new' });
  add('z8_invite_old', '原十分钟，再确认可以按时开始', 'dorm', '六月二十二日 · 12:40', self, `
沈知夏 · 消息｜今晚十八点至十八点十分照旧。我先做完自己的修改，不给这十分钟顺便添一份工作。
周栀 · 消息｜可以。我也按时拨过来，谈关系的就谈关系，不拿一段试听发过去当作答过。
旁白｜我将原约继续留在日程里，没有为它加一段未经答应的晚饭。
  `, 'z8_shen_work', { flags: { z8CallKind: 'oldCall', z8CallAgreed: true, z8CallBooked: '6-22 18:00-18:10' } });
  add('z8_invite_new', '重新获准谈，也重新问十分钟', 'dorm', '六月二十二日 · 12:40', self, `
沈知夏 · 消息｜具体回应已经发过。今晚六点能否留十分钟，继续谈各自真正想要的相处？不默认旧暂停已经结束。
周栀 · 消息｜这个时间我愿意谈。六点到六点十分，今天先把问题听清，不先写成恢复约会。
旁白｜新的谈话同意只记今天。她愿意听，不等于愿意按我期待的结论答，我也不用先让她保证才敢开口。
  `, 'z8_shen_work', { flags: { z8CallKind: 'newTalk', z8CallAgreed: true, z8CallBooked: '6-22 18:00-18:10' } });
  add('z8_work_contact_booked', '六点只有工作消息，不是缺席的私人约会', 'dorm', '六月二十二日 · 12:40', self, `
旁白｜我按原范围确认十八点接收设备说明更新，只有一条工作消息，不预约通话和见面。
周栀 · 消息｜十八点发原接口表。没有新增串场，不需要延长成私人谈话。
旁白｜工作时间可以写得具体，也仍只是一件工作。没有约过的私人见面，更不能在后来写成她临时取消了。
  `, 'z8_shen_work', { flags: { z8CallKind: 'workMessage', z8CallAgreed: false } });
  add('z8_shen_work', '十七点半，自己的修改自己交', 'dorm', '六月二十二日 · 17:30', self, `
旁白｜下午我关了几个重复打开的页面，把出版社的修改一段段写完。十七点三十，实际从自己的邮箱发出，对方回了收到。
旁白｜我没有将自己的待办发给周栀求她替我决定。她的 EP 与我的文字都需要时间，哪一份更浪漫，不能决定谁的工作就该让开。
陆遥｜你今天按时吃饭了吗？
沈知夏｜吃了。没有说自己不饿然后拿你的。
陆遥｜那我很支持这项个人成长。
旁白｜我笑着收好碗。六点快到了，但仍先把桌边这一点纸屑收进垃圾袋。
  `, 'z8_call_gate', { flags: { z8ShenFeedbackSentAt: '6-22 17:30' } });
  gate('z8_call_gate', 'z8CallKind', { oldCall: 'z8_call_old_kind', newTalk: 'z8_call_new', workMessage: 'z8_work_contact' });
  gate('z8_call_old_kind', 'z7Outcome', { open: 'z8_call_couple', slow: 'z8_call_reply' });
  add('z8_call_couple', 'Z8-02 · 六点，普通的声音也按时到', 'dorm', '六月二十二日 · 18:00–18:10', self, `
旁白｜六点整，手机响了。我接通时先听见她把椅子推开，又听到一声很认真、没有唱出来的你好。
周栀 · 通话｜我找到袜子了。另一只在琴袋旁边，证据说明它比我更想巡演。
沈知夏｜袜子有收到邀约吗？
周栀 · 通话｜暂时只有洗衣服的邀约。我今天先问人。
旁白｜我们讲了各自工作的进度，也再次确认女朋友不是要求每个工作间隙都在。她说，昨晚那个没有伴奏的答案，今天还愿意自己负责。
沈知夏｜如果今晚有空，想再走二十分钟。二十点半到二十点五十，不顺便看表，可以吗？
周栀 · 通话｜可以，后街小店门口。结束以后各自回去，我还要整理自己的录音文件。
旁白｜十八点十分，我们按时结束。今天的十分钟确实发生，新的二十分钟也有双方明确同意，却还没有发生。
  `, 'z8_tour', { flags: { z8CallKept: true, z8ReplyKept: false, z8CallStatus: 'girlfriends', z8PrivateAppointmentBooked: true, z8OriginalAppointment: '6-22 20:30-20:50', z8CallFinishedAt: '6-22 18:10' } });
  add('z8_call_reply', '答复可以诚实，不必每次都确定所有以后', 'dorm', '六月二十二日 · 18:00–18:10', self, `
旁白｜六点通话准时开始。周栀没有发新旋律来代替答案，先问我是否愿意把各自想过的那几句话说出来。
沈知夏｜我愿意继续约会。称呼女朋友还想在具体联系期待谈清后再定，不想为了让今天看起来圆满先说全部都适应。
周栀 · 通话｜我也愿意。今天的答复是继续约会，不是还等一首歌写完才答，也不是现在已经确认女朋友。
旁白｜原来了解的人，在这次双方真正愿意之后开始试着约会；原来已在约会的人保留那份答复。昨天的状态仍留在昨天记录里。
沈知夏｜今晚二十点半能否走二十分钟，再讲一点各自能给的联络？
周栀 · 通话｜可以，二十点半到二十点五十，后街小店门口。我们按时结束，不借你愿意继续就默认你还有一整晚。
旁白｜十八点十分，原约的关系答复实际完成。尚未确定的称呼有清楚的说法，不是一句让我继续自己猜的以后再说。
  `, 'z8_tour', { flags: { relationshipStatus: 'tryingDates', z8CallKept: true, z8ReplyKept: true, z8ReplyAnswer: 'continueDatesWithoutLabel', z8CallStatus: 'tryingDates', z8PrivateAppointmentBooked: true, z8OriginalAppointment: '6-22 20:30-20:50', z8CallFinishedAt: '6-22 18:10' } });
  add('z8_call_new', '先听清问题，还没有重新开始约会', 'dorm', '六月二十二日 · 18:00–18:10', self, `
旁白｜六点，我接到新问过的通话。她先说看过具体修改与今天的准备，愿意听新的需要，但约会尚未恢复。
沈知夏｜以前把随便当成体谅，是我不想承认自己会等一个回复。今天会具体讲，不能适应的也讲，不拿你必须放弃音乐来让我安心。
周栀 · 通话｜听到了。我也会说自己真正能给的安排，不用笑话替你消掉这些问题。
沈知夏｜今晚二十点半能否再留二十分钟，面对面把需要讲清？只谈这件事，不默认你已经答应恋爱。
周栀 · 通话｜可以，二十点半至二十点五十，后街小店门口。今天先谈，不预先答恢复约会。
旁白｜十八点十分结束。新谈话有了真实时间，旧暂停仍没有被偷偷改成昨天已经结束。
  `, 'z8_tour', { flags: { z8CallKept: true, z8ReplyKept: false, z8CallStatus: 'needsConversation', z8PrivateAppointmentBooked: true, z8OriginalAppointment: '6-22 20:30-20:50', z8CallFinishedAt: '6-22 18:10' } });
  add('z8_work_contact', '一条设备更新，就停在一条消息', 'dorm', '六月二十二日 · 18:00', self, `
旁白｜六点，周栀发来原接口表，没有新增工作，也没有打过来一通未经答应的私人电话。
沈知夏 · 消息｜收到，原范围更新已记。新修改仍没做好，不用你先答应其他时间。
周栀 · 消息｜好。我的录音文件自己处理，原设备表不夹新串场。
旁白｜今天只有工作消息。夜里没见面不算她取消一次约会，因为那场私人约会从未得到双方同意。
  `, 'z8_tour', { flags: { z8CallKept: false, z8ReplyKept: false, z8CallStatus: 'needsConversation', z8PrivateAppointmentBooked: false, z8WorkMessageKept: true } });
  add('z8_tour', '一份询问，尚未是一张出发车票', 'dorm', '六月二十二日 · 18:15', self, `
旁白｜周栀把自己的新消息发到工作群，只说明与现有排期有关的部分：收到七月五日至十九日、三城五场的巡演询问，报酬、交通与录音使用范围还要由她本人核清。
周栀 · 群消息｜回复期限二十六号十七点。我还没有接受，先核条件；六月二十七号原活动、已确认十五分钟曲目与归还器材照旧。
许见微 · 群消息｜收到。不把询问当成已经决定，也不先用未谈妥的预算排新工作。
旁白｜她结束过一份不适合的商业合作，现在仍要认真看另一份，而不是只靠愿意继续做音乐就答应全部条件。我也没有因为可能分开，就先替这封询问写一句不去。
  `, 'z8_change_gate', { flags: { z8TourInquiryReceived: true, z8TourAccepted: false, z8TourReplyDue: '6-26 17:00', z8TourProposedStart: '7-05', z8TourProposedEnd: '7-19', z8TourProposedShows: 5, z8TourCancelled: false } });
  gate('z8_change_gate', 'z8PrivateAppointmentBooked', { true: 'z8_change_first', false: 'z8_no_private_changes' });
  add('z8_change_first', '提前说明，仍是一次真实改约', 'dorm', '六月二十二日 · 19:30', self, `
周栀 · 消息｜录音师今晚八点到九点有空，想补录 EP 一段尾奏。我想用这个时段，原来二十点半的二十分钟不能同时做到，对不起。能否改明天下午四点到四点二十？你也可以说不方便。
旁白｜距离原约还有一小时。我还没出门，她这次先说明，不让我走到门口才发现没人在；提前通知仍不等于原来那次见面已经发生。
沈知夏 · 消息｜明天四点我有空，四点二十要走，自己的修改另排。可以改这个时间，今晚不等。
周栀 · 消息｜收到，原二十点半取消，明天四点到四点二十，小店门口。我按这个时间准备，不把你说可以理解成所有临时变化都没关系。
旁白｜我改了提醒，再去晾干已经洗好的衣服。她有一段录音，我也有一个不需要留在门口等的晚上。
  `, 'z8_recording_done', { flags: { z8FirstChangeNotified: true, z8FirstChangeNoticeAt: '6-22 19:30', z8FirstChangeLeadMinutes: 60, z8FirstRebookAgreed: true, z8FirstRebookTime: '6-23 16:00-16:20', z8OriginalMeetingKept: false } });
  add('z8_no_private_changes', '录音日程变了，不能虚构被取消的约会', 'dorm', '六月二十二日 · 19:30', self, `
旁白｜工作群里更新了录音时段：今晚二十点至二十一点补尾奏，明天下午十七点半交文件。周栀自己核录音条件，没有向我提出私人改约。
旁白｜我们从未约今晚二十点半或明天下午四点，就没有两次私人改约、门口等待或漏掉的恋爱承诺。旧暂停仍在，工作按已确认的范围继续。
沈知夏 · 消息｜工作更新收到。没有新增协助，我做自己的修改。
  `, 'z8_recording_done', { flags: { z8FirstChangeNotified: false, z8FirstRebookAgreed: false, z8OriginalMeetingKept: false, z8SecondLateNotice: false, z8PrivateMeetingMissed: false } });
  add('z8_recording_done', '尾奏录完，自己的文件仍由自己交', 'dorm', '六月二十二日 · 21:10', self, `
旁白｜九点十分，周栀在工作群发原音频进度：尾奏录过，明天下午五点半交修订版，试听与公开使用另问，没拿新录音替原授权加一句可以放。
旁白｜我没有立刻点开全部试听。陆遥让出一块桌面，我们一起找她箱子里那件很薄的外套，找了三分钟，发现它在她自己肩上。
陆遥｜这件不适合写进毕业纪念册。
沈知夏｜只适合当晚讲给你听。
旁白｜她笑着坐下。一个工作日结束，也不必每个人都在同一时刻给别人交一份很完整的开心。
  `, 'z8_next_day', { flags: { z8RecordingCompleted: true, z8RecordingTime: '6-22 20:00-21:00', z8EpFileDue: '6-23 17:30' } });
  add('z8_next_day', 'Z8-03 · 二十三号，日程里不能只有会来的那个人', 'dorm', '六月二十三日 · 09:00', pair('lu_yao'), `
旁白｜早上，陆遥先看自己的寄件时间，我先看修改清单。她没有问我为什么不像昨天一样一直笑，我也没有将每个小情绪都藏在天气里。
沈知夏｜想和人约好，又怕计划变。昨天她提前说，我接受了；但不知道自己真正能适应多少。
陆遥｜那就说多少。别先写成自己什么都行，再等她发现那张纸背面还有一整页。
旁白｜我点头。稳定不等于每个人都得有同一种工作，喜欢也不等于没有最低需要。
陆遥｜二十八号晚饭核入口，二十九号七点五十出门、九点二十车次。这个不因为你今天有新问题就漂走了。
沈知夏｜还在我自己的提醒里。
  `, 'z8_second_gate');
  gate('z8_second_gate', 'z8PrivateAppointmentBooked', { true: 'z8_change_second', false: 'z8_no_wait' });
  add('z8_change_second', '五分钟前的通知，也留下已经走过的路', 'old_street', '六月二十三日 · 15:50–16:00', self, `
旁白｜十五点五十，我到小店门口。四点二十以后还要走，今天只留约好的二十分钟。屋檐下有两个人在分一袋点心，我先将自己的手机放回包里。
周栀 · 消息｜今天修订比预计多，五点半要交，四点这次来不了。我到快出门才确认，又通知晚了，对不起。能否改十八点半到十八点五十？
旁白｜消息是十五点五十五。距离四点五分钟，我却已经走到门口。这一次不能只算她说了，也要算我已经花掉的路程与被改变的安排。
沈知夏 · 消息｜我已经到了。新时间先不自动答应，等我核自己的安排。你先交自己的文件，我不替你接，也不站在这里等你忙完。
周栀 · 消息｜知道了。昨天提前说明不代表今天就没有失约，是我临近才说。原四点那次没有见面，新时间等你答。
旁白｜四点到了，原约没有发生。我离开屋檐，先去买自己要喝的水；新提议仍在待答栏，不算已经重新约好。
  `, 'z8_response_choice', { flags: { z8SecondLateNotice: true, z8SecondNoticeAt: '6-23 15:55', z8SecondLeadMinutes: 5, z8ShenArrivedAt: '6-23 15:50', z8PrivateMeetingMissed: true, z8FirstRebookKept: false } });
  add('z8_no_wait', '没有私人约定的四点，属于自己的下午', 'old_street', '六月二十三日 · 16:00', self, `
旁白｜四点，我做完自己一段修改，到后街买水，没有去她会经过的街口等。周栀的文件待交，不意味着我被取消了一次从未获准的私人见面。
旁白｜我仍在想自己最低的联络需要，也想过能否适应她的节奏。准备这些是自己的事，不能将准备完听成她已经答应再谈。
旁白｜工作范围保留。知道她的录音地点，不等于有权走过去要求她立刻回答我的私人期待。
  `, 'z8_response_choice', { flags: { z8SecondLateNotice: false, z8PrivateMeetingMissed: false, z8FirstRebookKept: false } });
  add('z8_response_choice', '选择三 · 关心、需要与她自己的选择', 'old_street', '六月二十三日 · 16:05', self, `
旁白｜我可以提出最低需要，也可以承认现在不适应；想让未来少一点变化，不能变成替她决定未来。
  `, null, { choices: [
    { text: '具体说最低通知与联络需要，新的时间逐次确认。', flags: { z8ChangeResponse: 'rules', z8ControlDemandMade: false }, next: 'z8_rules_gate' },
    { text: '承认目前难适应，先暂停私人推进，问有限收束时间。', flags: { z8ChangeResponse: 'space', z8ControlDemandMade: false }, next: 'z8_space_gate' },
    { text: '替她安排稳定职位，要求她放弃巡演来证明认真。', flags: { z8ChangeResponse: 'control', z8ControlDemandMade: true }, next: 'z8_control' }
  ] });
  gate('z8_rules_gate', 'z8PriorReady', { true: 'z8_rules', false: 'z8_rules_closed' });
  add('z8_rules', '最低需要可以具体，不必先吞下失约', 'old_street', '六月二十三日 · 16:10', self, `
沈知夏 · 消息｜需要约好的事有明确答复。知道可能变动就先说，不等确认一定赶不上才通知。新时间我逐次答，不写成永远都能等。
周栀 · 消息｜我能做到提前说明可能变动，不能保证从不改约。今天临近才说是我的责任，我自己处理文件，不要求你留下等。十八点半还愿意谈二十分钟吗？
沈知夏 · 消息｜核过自己的安排，十八点半到十八点五十可以。只谈各自能给的量，工作不夹在里面。
周栀 · 消息｜好。若还没交好文件也提前说，不将你这次愿意改听成我以后都可以这样。
旁白｜新的时间由两个人重新确认。接受这次新约，没有把原四点的失约改成没发生，也不代表我不再需要解释与改变。
  `, 'z8_zhou_work', { flags: { z8DecisionRespected: true, z8RebookAccepted: true, z8TalkKind: 'private', z8TalkBooked: '6-23 18:30-18:50' } });
  add('z8_rules_closed', '说清新需要，仍不能跳过旧回应', 'dorm', '六月二十三日 · 16:10', self, `
沈知夏 · 消息｜我需要约好的事有明确答复，也会逐次确认新时间。但旧具体回应仍未做，不把这段话当作已经落实；私人谈话另获准后再问。
周栀 · 消息｜听到了。今天仍按原工作范围，新私人时间没有答应。六点半发原设备说明，只有工作消息。
旁白｜我没有拿新规则要求她立刻结束旧暂停。工作消息有自己的时点，也仍只是一条消息。
  `, 'z8_zhou_work', { flags: { z8DecisionRespected: true, z8RebookAccepted: false, z8TalkKind: 'workMessage', z8TalkBooked: '6-23 18:30 work update' } });
  gate('z8_space_gate', 'z8PriorReady', { true: 'z8_space', false: 'z8_space_closed' });
  add('z8_space', '不适应，也不需要判她的工作有错', 'old_street', '六月二十三日 · 16:10', self, `
沈知夏 · 消息｜我目前难适应这段节奏，想暂停私人推进。新提议的十八点半不接受。能否十九点通话十分钟，只说清这次暂停？不是要求你换工作。
周栀 · 消息｜可以，十九点到十九点十分，只谈收束。两次变化里我承担自己没提前说的那次，但不会用放弃音乐证明愿意负责。
旁白｜我把自己的不适应说清，没有判她的工作不值得。双方答应的新十分钟只用于收束，不是恢复约会的暗号，也没有新晚间见面。
  `, 'z8_zhou_work', { flags: { z8DecisionRespected: true, z8RebookAccepted: false, z8TalkKind: 'pausePhone', z8TalkBooked: '6-23 19:00-19:10 pause talk' } });
  add('z8_space_closed', '原来已暂停，今天不再预订另一通电话', 'dorm', '六月二十三日 · 16:10', self, `
沈知夏 · 消息｜我也还没准备好继续。原暂停保留，不要求你换职业，也不追加一段私人通话。工作更新按原范围。
周栀 · 消息｜收到。六点半发原设备说明，私人时间没有新安排。
旁白｜这段自我认识没有自动变成两个人的邀约。今天没有人在门口等一场她从未答应的约会。
  `, 'z8_zhou_work', { flags: { z8DecisionRespected: true, z8RebookAccepted: false, z8TalkKind: 'workMessage', z8TalkBooked: '6-23 18:30 work update' } });
  add('z8_control', '一份替她写好的职业计划，并不是体贴', 'dorm', '六月二十三日 · 16:10', self, `
旁白｜我把那家旧商业公司的招聘页发给她，附上自己列的固定上班、固定收入与取消巡演的计划，没有问她想不想要。
沈知夏 · 消息｜回去做稳定的岗位吧，巡演别去。如果认真想和我继续，就别再选这种变动很多的日子。
周栀 · 消息｜我没有同意你安排职业，也不会取消一份还在了解的巡演来证明喜欢。临近才通知是我的错，要我不做音乐不是补救。今天不接受新的私人见面或电话，工作范围保留。
旁白｜我盯着自己那张表，发现上面只有我认为正确的生活，没有她真正给过的答复。它没有成为她的投递、入职或业务邮件，合作方也没收到任何我代她发的消息。
旁白｜招聘页仍是一张网页，巡演仍由她本人判断。旧职业选择不因我写了一份更稳定的计划就改掉，私人暂停却有了现在这句话的责任。
  `, 'z8_zhou_work', { flags: { z8DecisionRespected: false, z8CareerPlanAuthorized: false, z8TourCancelled: false, z8RebookAccepted: false, z8TalkKind: 'workMessage', z8TalkBooked: '6-23 18:30 work update' } });
  add('z8_zhou_work', '五点半，她交自己的文件', 'rehearsal', '六月二十三日 · 17:30', zhou, `
旁白｜十七点三十，周栀自己把 EP 修订文件发给录音师，对方核收到的版本并回复。文件由她交，不是知夏放弃自己的修改替她赶出来。
周栀 · 群消息｜修订版已交。原试听范围保留，未答应的录音播放不加。巡演交通和使用范围仍在核条件，二十六号前由我本人答复。
许见微 · 群消息｜收到。原活动表十五分钟、换场撤场分开，新增仍等各自确认。
旁白｜她给自己的文件留下真实的发送记录。工作按时完成，不能抹去下午的临近通知；私人相处是否继续，也不替一封准时发出的邮件作答。
  `, 'z8_talk_gate', { flags: { z8EpFileSent: true, z8EpFileSentAt: '6-23 17:30', z8TourAccepted: false, z8BusinessDecisionByZhou: true } });
  gate('z8_talk_gate', 'z8TalkKind', { private: 'z8_private_talk', pausePhone: 'z8_pause_phone', workMessage: 'z8_work_talk' });
  add('z8_private_talk', 'Z8-04 · 这次真正到场，不代替错过的那次', 'old_street', '六月二十三日 · 18:30', zhou, `
旁白｜十八点半，她准时到小店门口。今天有这次新的见面，原四点没有发生的事实也仍在，不能将两个提醒合成一个终于见到了。
周栀｜录音的时间变了，我提前说；下午改稿估时错了，快到点才通知。这两次不该合成我反正都很忙，第二次需要我自己承担。
沈知夏｜我需要知道可能变，不是等你已经确定来不了才知道。自己的工作也会有变化，我同样提前说。
周栀｜我把私人邀约和工作表分开记。排练一延长就先发可能变动，不等一句解释看起来够完整。你可以说新时间不行，我不让它自动变成你欠我一场理解。
旁白｜她把自己实际改过的日程提醒给我看，只展示和这次安排有关的两行，没有让我检查手机或联系人来证明认真。
沈知夏｜舞台上与观众说话、合作排练是工作；私人约会是另一份答复。我也不把每一次热情都听成你已经向我保证全部以后。
周栀｜有需要就讲。不能承诺的也讲。我想继续音乐，也想认真对待你，不用其中一个偷偷替另一个答。
  `, 'z8_relationship_choice', { flags: { z8RebookKept: true, z8RulesDiscussed: true, z8TalkKept: true, z8PrivateTalkKept: true } });
  add('z8_relationship_choice', '选择四 · 双方想怎样继续', 'old_street', '六月二十三日 · 18:40', zhou, `
旁白｜我们讲清工作交流、私人邀约与最低通知需要。得到一个认真解释之后，也仍要分别回答是否愿意继续这段关系。
  `, null, { choices: [
    { text: '愿意作为女朋友继续，明确排他关系与各自范围。', flags: { z8RelationshipChoice: 'commit' }, next: 'z8_commit' },
    { text: '想有限试行相处，保留已经答应过的真实状态。', flags: { z8RelationshipChoice: 'trial' }, next: 'z8_trial_kind' },
    { text: '现在仍难适应，清楚说明需要暂停私人推进。', flags: { z8RelationshipChoice: 'pause' }, next: 'z8_private_pause' }
  ] });
  add('z8_commit', '不拿排他关系代替职业决定', 'old_street', '六月二十三日 · 18:45', zhou, `
沈知夏｜我愿意做你的女朋友，想要双方都同意的排他恋爱。工作交流照原范围，别的私人约会不能用没有说清来绕过；不是让我替你管职业或查手机。
周栀｜我也愿意。原来已是女朋友的继续；今天新确认的只记今天，不倒填以前的称呼。通知和下一次邀约由我自己认真说，不让一句想你承担全部安排。
旁白｜她没有说既然确认了就都该适应，我也没有因为喜欢就取消自己的最低需要。称呼亲口答过，日常仍需实际做。
  `, 'z8_couple_choice', { flags: { relationshipStatus: 'girlfriends', z8Outcome: 'together', z8RelationshipAnswer: 'together', z8RelationshipConfirmed: true, z8ExclusiveAgreed: true, z8RelationshipPublic: false, z8EveningMode: 'couple' } });
  gate('z8_trial_kind', 'z8CallStatus', { girlfriends: 'z8_trial_couple', tryingDates: 'z8_trial_dates', needsConversation: 'z8_trial_dates' });
  add('z8_trial_couple', '有限试行联系，没有悄悄取消女朋友', 'old_street', '六月二十三日 · 18:45', zhou, `
沈知夏｜想先有限试行通知和联络，一段时间后再核期待。我们已有的女朋友关系保留，不因为需要试行就没说过。
周栀｜我也愿意。排他关系照旧，试的是这些安排实际能不能做到。能给多少说多少，不拿第一次见得很好就保证以后一定合适。
旁白｜我们分别答完，女朋友没有被一项较慢的计划偷偷降成陌生人，尚需练习的也没被称呼盖住。
  `, 'z8_couple_choice', { flags: { relationshipStatus: 'girlfriends', z8Outcome: 'slow', z8RelationshipAnswer: 'slow', z8RelationshipConfirmed: true, z8ExclusiveAgreed: true, z8RelationshipPublic: false, z8EveningMode: 'couple' } });
  add('z8_trial_dates', '新开始或继续约会，不自动成为恋人', 'old_street', '六月二十三日 · 18:45', zhou, `
沈知夏｜我愿意试着约会，先有限试行联络和通知，暂不确认女朋友。之前已经在约会的继续，原暂停的人从这次新的同意开始。
周栀｜我也愿意。今天开始的只记今天，没发生的以前不补。工作和私人邀约分别说，不拿一个较慢的答复要求你忽略失约。
旁白｜我们亲口说清目前的状态，尚未得到的称呼没有因为终于见面就自动补上。愿意试行也可以是一份完整的答复。
  `, 'z8_dates_choice', { flags: { relationshipStatus: 'tryingDates', z8Outcome: 'slow', z8RelationshipAnswer: 'slow', z8RelationshipConfirmed: false, z8ExclusiveAgreed: false, z8RelationshipPublic: false, z8EveningMode: 'dates' } });
  add('z8_private_pause', '听完了，也可以诚实说仍不适应', 'old_street', '六月二十三日 · 18:45', zhou, `
沈知夏｜我听见你愿意具体改，也还是觉得现在难适应。想暂停私人推进，不要求你为让我安心换掉职业。
周栀｜知道了。今天这次新见面确实发生，原四点没见也确实发生；私人暂停不抹去其中一个。工作范围保留，晚间不继续加邀约。
旁白｜我点头。清楚答完以后，我们按原十八点五十结束，不用为了让今天像一个温柔的结尾，再增加一段她没有答应的靠近。
  `, 'z8_paused_choice', { flags: { relationshipStatus: 'needsConversation', z8Outcome: 'paused', z8RelationshipAnswer: 'paused', z8RelationshipConfirmed: false, z8ExclusiveAgreed: false, z8RelationshipPublic: false, z8EveningMode: 'paused' } });
  add('z8_pause_phone', '十九点，只谈答应过的收束', 'dorm', '六月二十三日 · 19:00–19:10', self, `
旁白｜十九点，通话按新问过的时间开始。周栀没有把这个十分钟转成重新约会，我也没有拿她接通来推翻下午自己说的暂停。
沈知夏｜我现在需要稳定一些的联络，仍难适应。想给自己时间，不是给你一项必须改成同一种人生的任务。
周栀 · 通话｜听到了。我承担自己临近才通知那次，不拿继续做音乐当借口；你也不用先把所有变化接受，才有资格说喜欢。
旁白｜十九点十分结束。收束谈话真正完成，没有新的身体接触和晚间私人见面。
  `, 'z8_closed_relationship', { flags: { z8TalkKept: true, z8PrivateTalkKept: false, z8RebookKept: false, z8RulesDiscussed: false } });
  add('z8_work_talk', '六点半的更新，停在原工作范围', 'dorm', '六月二十三日 · 18:30', self, '旁白｜六点半，原设备说明更新发来。没有私人通话或见面，工作按原范围核。', 'z8_closed_relationship', { ...variation('z8ChangeResponse', {
    rules: '周栀 · 消息｜原设备范围更新在这里。旧具体回应未落实，新的私人时间未答应；准备好真实版本再问。\n旁白｜我收下工作消息，不将现在讲过新需要写成先前问题已经修好。',
    space: '周栀 · 消息｜原设备说明已发，私人暂停照刚才说的保留。\n旁白｜收到一份工作表，没有改变两个人尚未愿意继续私人相处的事实。',
    control: '周栀 · 消息｜职业决定仍由我自己做，原设备范围在这里。今天不接受私人见面或电话。\n旁白｜我听到具体拒绝，不再用招聘网页或几张稳定作息表要求她重新答。'
  }), flags: { z8TalkKept: true, z8PrivateTalkKept: false, z8RebookKept: false, z8RulesDiscussed: false } });
  add('z8_closed_relationship', '选择四 · 已说暂停，不借结尾改成愿意', 'dorm', '六月二十三日 · 谈话之后', self, `
旁白｜今天没有继续私人推进的共同答复。愿望仍可以留在自己这里，却不能因为最后一次想选积极的话，就替她答应。
  `, null, { choices: [
    { text: '接受当前暂停，清楚记下自己仍需承担的回应。', flags: { z8RelationshipChoice: 'accept' }, next: 'z8_closed_accept' },
    { text: '整理自己的需要，未获准的私人文字先不发。', flags: { z8RelationshipChoice: 'write' }, next: 'z8_closed_write' },
    { text: '各自休息，工作继续按原确认范围。', flags: { z8RelationshipChoice: 'rest' }, next: 'z8_closed_rest' }
  ] });
  add('z8_closed_accept', '接受不是把责任交给她等以后', 'dorm', '六月二十三日 · 谈话之后', self, `
旁白｜我把目前的暂停记清，未完成的具体修改仍在原清单里。她自己的工作照旧，我准备好再问，不让她先负责判断我何时终于足够难过。
旁白｜今天的工作、通知与拒绝都有真实范围。听清它们不舒服，也不需要追加一条你再考虑一下，才算认真结束。
  `, 'z8_closed_done');
  add('z8_closed_write', '写给自己的那份，不冒充两人都看过', 'dorm', '六月二十三日 · 谈话之后', self, `
旁白｜我写想要怎样的联络，也写自己什么时候把生活方式当成唯一正确答案。这份文字只在自己的备忘里，没有发出去，也没有被写成她已经原谅。
旁白｜具体回应仍需要真正的修改与答复，私人的期待也仍要另问。一个夜晚想清一点，不代表已经替两个人谈完。
  `, 'z8_closed_done');
  add('z8_closed_rest', '今天也可以只吃自己的晚饭', 'dorm', '六月二十三日 · 谈话之后', pair('lu_yao'), `
旁白｜我问陆遥锅里还有没有热水，她说有，面要自己拿。工作表和私人问题都先放下，我去洗一只碗。
陆遥｜不是每一顿饭都要先将人生全部安排好。
沈知夏｜今天先安排面。
旁白｜她笑了一下，没有借这句笑替我宣布所有难过都过去。休息有自己的位置，不是换一种方式让周栀立刻答应见面。
  `, 'z8_closed_done');
  add('z8_closed_done', '尚未继续的，仍没有继续', 'dorm', '六月二十三日 · 傍晚', self, '旁白｜当前答复是私人暂停，后面的晚间安排也按这个范围。不借工作、道歉或知道她在哪里绕过不同意。', 'z8_paused_choice', { flags: { relationshipStatus: 'needsConversation', z8Outcome: 'paused', z8RelationshipAnswer: 'paused', z8RelationshipConfirmed: false, z8ExclusiveAgreed: false, z8RelationshipPublic: false, z8EveningMode: 'paused' } });
  add('z8_couple_choice', '选择五 · 今晚怎样相处', 'old_street', '六月二十三日 · 18:50', zhou, `
旁白｜约好的二十分钟结束。恋人关系已经亲口答过，今晚是否再留一段私人时间，仍需要另问。
  `, null, { choices: [
    { text: '问她愿不愿意牵手散步十分钟。', flags: { z8EveningChoice: 'hand' }, next: 'z8_couple_hand' },
    { text: '只聊普通一天，不接触，问能否再留十分钟。', flags: { z8EveningChoice: 'chat' }, next: 'z8_couple_chat' },
    { text: '今天各自休息，已经给出的关系答复保留。', flags: { z8EveningChoice: 'rest' }, next: 'z8_couple_rest' }
  ] });
  add('z8_couple_hand', '一只手有今晚自己的同意', 'old_street', '六月二十三日 · 18:55–19:05', zhou, `
沈知夏｜想和你牵手走十分钟，现在愿意吗？
周栀｜愿意。十九点零五就各自回去，我自己记，不让你变成替我掐时间的那个人。
旁白｜她伸出手，我握住以后，发现那一点紧张并没有妨碍我们走得很慢。经过小店，她看了一眼今天剩下的点心，问为什么边角总比中间先卖完。
沈知夏｜可能有很多结构复杂的人。
周栀｜也可能只是比较脆。
旁白｜我笑了。她把今天自己负责的答复留在原处，没有用一个动作要求我从此不再提失约。十分钟结束，我们松开手，各自回去。
  `, 'z8_friend', { flags: { z8EveningMet: true, z8HeldHands: true } });
  add('z8_couple_chat', '十分钟只讲今天，不再核工作表', 'old_street', '六月二十三日 · 18:55–19:05', zhou, `
沈知夏｜今天先不牵手，想再聊十分钟普通的事，可以吗？
周栀｜可以。十九点零五结束，不看稿。
旁白｜她讲第二种煮面终于加了青菜，我讲晾床单没有再用陆遥的衣架。那两件事都很小，却不用先夸大，才准成为想告诉女朋友的一句。
周栀｜我以前会觉得得讲一个特别的故事，才有理由找你。
沈知夏｜今天这个就够。你忙的时候也可以直接说忙，不用先编好一个解释。
旁白｜我们按时分别，没有身体接触。少一个动作，不会撤回两个人真正答应过的关系。
  `, 'z8_friend', { flags: { z8EveningMet: true, z8HeldHands: false } });
  add('z8_couple_rest', '按时回去，也是一种照约做完', 'old_street', '六月二十三日 · 18:55', zhou, `
沈知夏｜今天想先回去休息。不是没听见你愿意，也不想为了证明高兴再加一整晚。
周栀｜好。我也回去吃饭。关系答复保留，新见面之后再问，晚一点消息也先说能不能答。
旁白｜她挥手，走向另一边。今天实际见过、谈过，我们不用再增加一个动作，才能让这份答复在明天继续存在。
  `, 'z8_friend', { flags: { z8EveningMet: false, z8HeldHands: false } });
  add('z8_dates_choice', '选择五 · 试着约会，仍按当前范围', 'old_street', '六月二十三日 · 18:50', zhou, `
旁白｜两个人愿意试着约会，尚未确认为女朋友。额外十分钟是否愿意，也不因为刚才说了继续就默认得到。
  `, null, { choices: [
    { text: '问能否再走十分钟，不增加身体接触。', flags: { z8EveningChoice: 'walk' }, next: 'z8_dates_walk' },
    { text: '问能否只聊普通一天，十分钟后分别。', flags: { z8EveningChoice: 'chat' }, next: 'z8_dates_chat' },
    { text: '今天各自休息，下次私人时间重新问。', flags: { z8EveningChoice: 'rest' }, next: 'z8_dates_rest' }
  ] });
  add('z8_dates_walk', '一步一点认识，不先走到别的称呼里', 'old_street', '六月二十三日 · 18:55–19:05', zhou, `
沈知夏｜愿意再走十分钟吗？先不牵手，想多认识一点普通的你。
周栀｜愿意，十九点零五结束。今天不用有一段很漂亮的散步结尾。
旁白｜我们讲起路边哪家店的早饭开得比较早，她指出一块去年换过的招牌。我没有将知道这种小事写成早就认识她全部生活，也没有将新的约会同意补到原来暂停的日期。
  `, 'z8_friend', { flags: { z8EveningMet: true, z8HeldHands: false } });
  add('z8_dates_chat', '听普通一天，也不提前答完试行', 'old_street', '六月二十三日 · 18:55–19:05', zhou, `
沈知夏｜可以再聊十分钟吗？不讲试听，也不提前给关系下一个更大的定义。
周栀｜可以。我今天普通的一天，有半小时在找一个自己放错的文件夹。
旁白｜我说自己改一段话改得不认识那段话，她问这种时候会不会也想把它放进别的文件夹。我们都笑了，十九点零五按时分别，没有身体接触。
  `, 'z8_friend', { flags: { z8EveningMet: true, z8HeldHands: false } });
  add('z8_dates_rest', '下次见面仍要一个新的愿意', 'old_street', '六月二十三日 · 18:55', zhou, `
沈知夏｜今天先休息。愿意试行的答复保留，下次私人见面重新问，不默认你总在同一个地方有空。
周栀｜好。我也想休息。下一次普通的见面可以很小，但还是要两个人都愿意。
旁白｜我点头告别，回自己的路。较慢的节奏没有少掉今天真正说清的需要，也不需要用一段额外等待证明认真。
  `, 'z8_friend', { flags: { z8EveningMet: false, z8HeldHands: false } });
  add('z8_paused_choice', '选择五 · 私人暂停后的晚上', 'dorm', '六月二十三日 · 晚间', self, `
旁白｜今天没有新私人见面或身体接触的同意。知道她的排练室在哪里，也不能成为走过去等她改变答案的理由。
  `, null, { choices: [
    { text: '接受范围，不追加散步、电话或接触。', flags: { z8EveningChoice: 'accept' }, next: 'z8_pause_accept' },
    { text: '把需要写给自己，准备好具体回应再问。', flags: { z8EveningChoice: 'write' }, next: 'z8_pause_write' },
    { text: '休息，按时吃饭，工作按原范围继续。', flags: { z8EveningChoice: 'rest' }, next: 'z8_pause_rest' }
  ] });
  add('z8_pause_accept', '让不同意真的结束', 'dorm', '六月二十三日 · 晚间', self, `
旁白｜我没有再发一条只走十分钟也不行吗。十分钟不是一个自动无害的理由，她不愿意也已经是一份完整答复。
旁白｜工作仍按原范围，未做的准备还在。今天接受暂停，不等于替彼此承诺将来一定恢复，也不等于喜欢从未发生。
  `, 'z8_friend', { flags: { z8EveningMet: false, z8HeldHands: false } });
  add('z8_pause_write', '自己的文字，今晚不代替她参与', 'dorm', '六月二十三日 · 晚间', self, `
旁白｜我写自己最低需要，也写哪些担心被我变成了希望她换一种生活。没有将这页发过去，不在句尾放一个需要她立刻安慰的问号。
旁白｜未来若想谈，准备真实回应再问。今晚没得到的新同意，不因我写了一页很认真的话就出现。
  `, 'z8_friend', { flags: { z8EveningMet: false, z8HeldHands: false } });
  add('z8_pause_rest', '热饭有自己的时间', 'dorm', '六月二十三日 · 晚间', self, `
旁白｜我洗好碗，给自己煮一份面。锅盖被蒸汽顶了一下，我将火调小，终于不是只盯着手机上那一行最后回复。
旁白｜难过可以在，也可以按时吃饭、休息。没完成的工作明天按原范围处理，不在夜里借新文件把暂停的人重新叫回来。
  `, 'z8_friend', { flags: { z8EveningMet: false, z8HeldHands: false } });
  add('z8_friend', 'Z8-05 · 朋友也有不围着恋爱的一天', 'dorm', '六月二十三日 · 20:00', pair('lu_yao'), `
旁白｜八点，陆遥将房屋记录上的一项圈起来，说新的入口说明已经拿到，二十八号再一起按实物记录核，不提前写成完成。
沈知夏｜二十九号车次还是九点二十，七点五十出门。
陆遥｜对。还有我今天找到了一家早餐店，想以后有空拍一张发你。不是要你帮我判断搬走以后会不会开心。
旁白｜我点头，听她讲那家店的菜单与她想去的新街。她问我今天如何，我只讲愿意讲的部分，不让她替周栀发一份人物说明或恋爱结论。
旁白｜林晚继续整理作者确认件，见微做自己的文件，叶澄说明原影像用途不变，林姨保留二十七号活动与十九点半休息。群聊没有因为一条私人路线而只剩一个人的日程。
  `, 'z8_feedback_choice');
  add('z8_feedback_choice', '选择六 · 今晚把新回应落在哪里', 'dorm', '六月二十三日 · 21:30', self, `
旁白｜今天的通知、原约未赴与重新见面都有各自记录。下一步要怎样继续，不能只靠一句刚才很认真就先签全部完成。
  `, null, { choices: [
    { text: '如实回收今天的量，已谈妥的具体确认，越权要求自己撤回。', flags: { z8FeedbackChoice: 'act' }, next: 'z8_feedback_act_mode' },
    { text: '承认仍无法承担新联络安排，今晚先说清保留或进入暂停。', flags: { z8FeedbackChoice: 'hold' }, next: 'z8_feedback_hold' }
  ] });
  gate('z8_feedback_act_mode', 'z8Outcome', { together: 'z8_feedback_private', slow: 'z8_feedback_private', paused: 'z8_feedback_paused_kind' });
  gate('z8_feedback_paused_kind', 'z8ChangeResponse', { rules: 'z8_feedback_paused', space: 'z8_feedback_paused', control: 'z8_feedback_control' });
  add('z8_feedback_private', '确认能做到的量，不提前兑现明天', 'dorm', '六月二十三日 · 21:35', self, `
沈知夏 · 消息｜今天各自工作按时交过，原四点没见保留，新见面按时结束。最低通知与逐次确认新时间照刚才说的做，工作时可能晚回，但约好的事会给明确答复。
周栀 · 消息｜我也确认这份量。知道可能变就先说，新的私人时间重新问，不将试行或女朋友称呼当成一定都能适应。今天我自己把提醒分开了，不让你一直替我核。
旁白｜双方实际回收今晚的安排。明天的工作与新见面仍等明天真实发生，不能因为今天确认了规则就预填以后每一栏。
  `, 'z8_night', { flags: { z8RuleFeedbackKept: true, z8ControlDemandWithdrawn: false } });
  add('z8_feedback_paused', '具体回应，也不能要求今晚立刻恢复', 'dorm', '六月二十三日 · 21:35', self, '旁白｜我将今晚真正能给出的回应写清，不拿准备好一句话要求她马上改变私人答复。', 'z8_night', { ...variation('z8ChangeResponse', {
    rules: '沈知夏 · 消息｜当前暂停保留。仍欠的具体修改准备好再问，今天的新规则不替它签字；今晚不追加私人时间。\n周栀 · 消息｜收到，原范围照旧。\n旁白｜准时说清不能将没做的事情改成做过，当前暂停保留。',
    space: '沈知夏 · 消息｜今天说的暂停仍在，不要求你换职业。我会继续核自己的需要，工作按原范围。\n周栀 · 消息｜收到，我也按真实范围。\n旁白｜这份认识没有自动成为继续恋爱的共同答复。'
  }), flags: { z8RuleFeedbackKept: false } });
  add('z8_feedback_control', '自己撤回职业要求，不索要立刻恢复的答复', 'dorm', '六月二十三日 · 21:35', self, `
沈知夏 · 消息｜我撤回替你安排稳定职位、要求取消巡演的那份计划。没有向任何合作方代发消息，决定权在你。我自己承担说过的话，不拿撤回要求今晚恢复约会。
周栀 · 消息｜撤回看见了。巡演由我本人判断，今天的私人暂停保留。
旁白｜撤回实际发生，原越权要求也保留事实与日期，不能从后来一条更诚恳的消息里消失。
  `, 'z8_night', { flags: { z8RuleFeedbackKept: false, z8ControlDemandWithdrawn: true, z8ControlWithdrawalAt: '6-23 21:35' } });
  gate('z8_feedback_hold', 'z8Outcome', { together: 'z8_new_pause', slow: 'z8_new_pause', paused: 'z8_hold_pause' });
  add('z8_new_pause', '曾经答应过，今晚也能重新说承担不了', 'dorm', '六月二十三日 · 21:35', self, `
沈知夏 · 消息｜刚才愿意继续是真实答复，但现在发现最低联络安排仍没准备好承担。不能先答应再让你明天猜，今晚想暂停私人推进，工作范围保留。
周栀 · 消息｜知道了，我也先停在这里。今天见面、已经说过的关系或靠近没有删掉，明天不默认有私人约会。
旁白｜这次新的暂停有自己的答复。实际牵过的手仍牵过，没牵过的也不添；新状态不回写之前的真实相处。
  `, 'z8_pause_final', { flags: { z8RuleFeedbackKept: false, z8ControlDemandWithdrawn: false, z8FinalPauseNew: true } });
  add('z8_hold_pause', '保留暂停，不预支一句明天一定不同', 'dorm', '六月二十三日 · 21:35', self, `
沈知夏 · 消息｜今天仍没准备好完整回应，原暂停保留。工作按原确认范围，未同意的新安排不用，不在今晚追加私人请求。
周栀 · 消息｜收到。准备好真实版本再问，我有自己的答复。
旁白｜我没有加一句你先相信我。仍欠的具体回应仍未完成，工作收到也不等于私人问题已谈妥，不拿按时发消息替它们盖章。
  `, 'z8_pause_final', { flags: { z8RuleFeedbackKept: false, z8ControlDemandWithdrawn: false, z8FinalPauseNew: false } });
  add('z8_pause_final', '今晚最后的状态，按实际答复保留', 'dorm', '六月二十三日 · 21:40', self, '旁白｜私人推进暂停，原工作继续。今天的解释、见面与身体接触按是否真正发生分别保留，不因最后答复变化就改写整日的经过。', 'z8_night', { flags: { relationshipStatus: 'needsConversation', z8Outcome: 'paused', z8RelationshipConfirmed: false, z8ExclusiveAgreed: false, z8RelationshipPublic: false } });
  add('z8_night', '关掉的提示音，不等于消失的声音', 'dorm', '六月二十三日 · 22:00', self, '旁白｜临睡前，我把明天自己的工作放到第一行，再看今天最后实际得到的私人答复。', 'z8_final_gate', variation('z8Outcome', {
    together: '旁白｜我们愿意作为女朋友继续，也实际确认了最低通知与联络量。她的巡演仍由她本人核条件，我的工作仍由自己安排。没有一首歌需要替这份普通的认真作证。\n旁白｜今天牵手或只聊天、各自休息各有真实经过。明天仍要自己说出想见、能不能见，而不是让一个称呼替所有日程答应。',
    slow: '旁白｜我们愿意有限试行。原女朋友保留已答过的称呼，新开始或继续约会保留实际位置；喜欢没有自动解决不同节奏，也不妨碍认真回应下一次需要。\n旁白｜尚未接受的巡演仍在核条件，未发生的未来谈话仍等待新同意。今天能给的量已经实际说清，不必先承诺必然成功。',
    paused: '旁白｜我们停在私人暂停。旧问题、控制要求或今晚新的不适应各有真实责任，准时交件与共同工作没有替它们自动结尾。\n旁白｜我仍记得她的声音，也记得自己有需要；今晚不必再让一个人回复，才能允许另一个人睡去。明天从真正停下的位置继续。'
  }));
  gate('z8_final_gate', 'z8ChangeResponse', { control: 'z8_control_final', rules: 'zhou_eight_complete', space: 'zhou_eight_complete' });
  add('z8_control_final', '撤回与没有撤回，各自保留事实', 'dorm', '六月二十三日 · 22:05', self, '旁白｜那份替她决定职业的要求没有获得授权，也没有让巡演取消。是否实际撤回，按今晚真正发过的话记录，不借一张回忆卡擦掉。', 'zhou_eight_complete', { ...variation('z8FeedbackChoice', {
    act: '旁白｜今晚实际撤回已经得到收到的答复，但她没有因此立刻恢复约会。',
    hold: '旁白｜今晚尚未实际撤回，私人暂停保留。准备好以后，需要自己清楚承担，不能让她先把这份要求当作没说过。'
  }), flags: { z8CareerPlanAuthorized: false } });

  const data = { chapterId: 'zhou8', scenes, gates };
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.RainChapterEightZhou = data;
})(typeof window !== 'undefined' ? window : globalThis);
