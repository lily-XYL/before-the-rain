(function (root) {
  'use strict';
  const scenes = [], gates = [];
  const script = text => text.trim().split('\n').map(line => {
    const i = line.indexOf('｜');
    if (i < 1) throw new Error('许见微第九章对白缺少说话人物。');
    return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
  });
  const add = (id, title, location, time, cast, text, next, extra = {}) => scenes.push({ id, title, location, time, cast, lines: script(text), next, ...extra });
  const variation = (variantBy, variants) => ({ variantBy, variants: Object.fromEntries(Object.entries(variants).map(([key, text]) => [key, script(text)])) });
  const gate = (id, redirectBy, targets) => gates.push({ id, redirectBy, targets });
  const pair = id => ['shen_zhixia', id], xu = pair('xu_jianwei'), self = ['shen_zhixia'];

  add('x9_morning', 'X9-01 · 雨还没有落到纸上', 'dorm', '六月二十四日 · 08:30', pair('lu_yao'), `
旁白｜陆遥坐在箱子上，把雨伞从已经封好的袋子里重新取出来。天色灰得像很早以前我们一起逃过的一节早课，窗前却多了三只贴着新地址的箱子。
陆遥｜预报说下午会更大。这把别装箱，二十九号也得带走。
沈知夏｜你现在连一把伞都能记住属于哪一天。
陆遥｜也没有。刚刚差一点把今晚的牙刷封到下周。
旁白｜我笑着给她挪开胶带。二十八号晚上的入口核对、二十九号七点五十出门和九点二十的车，都还在原来的那一页。
旁白｜手机屏幕亮了一下。我伸手前，先看过昨天两个人真正给出的关系答复。
  `, 'x9_entry');
  add('x9_entry', '昨天留下的名字与范围', 'dorm', '六月二十四日 · 08:45', self, '旁白｜新的天气没有替我们把关系重置。有人已经是女朋友，有人仍在认识彼此，也有人还停在私人暂停。', 'x9_prior_choice', variation('xu8Outcome', {
    together: `许见微 · 消息｜早。昨晚有睡够吗？我没有再开那份文件。
沈知夏 · 消息｜睡够了。女朋友今天需要一把不漏水的伞。
许见微 · 消息｜那是很具体的需要。我有自己的，也希望你的能撑开。
旁白｜看见那个称呼，我仍忍不住笑。昨天是否牵手、聊天或各自休息，没有改变这份两个人都说过的愿意。`,
    slow: `旁白｜她发来一张早餐桌上画歪的圆，说本来想画一个鸡蛋。我回了一句已经能看出不是茶杯，她说这就够了。
旁白｜愿意分享普通小事，仍按昨天继续相处的答复来。试着约会或继续了解有各自的位置，没有一张照片自动替它换成恋人。`,
    paused: `旁白｜私人对话里没有新的早安。见微在工作群确认今日原范围，驻外业务询问由她自己继续核条件。
旁白｜昨天完成过的澄清保留，没有完成的仍欠着。今天不拿群里回得很快，推断她已经愿意恢复私人习惯。`
  }));
  add('x9_prior_choice', '选择一 · 今天的具体回应', 'dorm', '六月二十四日 · 09:00', self, `
旁白｜我打开旧调整与昨天的记录。想继续问她愿不愿意听，先要知道自己有什么实际做到的内容。
  `, null, { choices: [
    { text: '落实未完成的调整，如实回应隐瞒负担或越权回复。', flags: { xu9PriorChoice: 'act', xu9OldRepairKept: false }, next: 'x9_pending_gate' },
    { text: '承认仍需时间，保留原范围与已经说出的暂停。', flags: { xu9PriorChoice: 'hold' }, next: 'x9_prior_hold' }
  ] });
  gate('x9_pending_gate', 'pendingOmittedConversation', { true: 'x9_pending_person', false: 'x9_prior_current' });
  gate('x9_pending_person', 'omittedPerson', { lin: 'x9_prior_lin', xu: 'x9_prior_xu', zhou: 'x9_prior_zhou', ye: 'x9_prior_ye' });
  for (const [id, person, name, scope] of [
    ['lin', 'lin_wan', '林晚', '作者确认件与借阅编号，不把没回信者写成已同意'],
    ['xu', 'xu_jianwei', '许见微', '原尺寸与折边，新增页面另问，不要求重排基础册'],
    ['zhou', 'zhou_zhi', '周栀', '已答应的音频长度与接口，不追加串场'],
    ['ye', 'ye_cheng', '叶澄', '原设备说明，不扩大私人片段的记录或放映']
  ]) add('x9_prior_' + id, '九点十分，修改发给具体的人', 'dorm', '六月二十四日 · 09:10–10:00', pair(person), `
沈知夏 · 消息｜这次发的是具体修改：${scope}。尚未答应的继续停用，请只看标出的这一项。
旁白｜她看过后指出需要补清的一处。我改完再发，等到新版本得到答复才更新状态。
${name} · 消息｜现在这一项可以，其他的仍按原范围。原来没做到的那次不用改日期。
沈知夏 · 消息｜好，今天才记实际完成。
旁白｜一份真实版本有了真实回执。它没有代替其他人同意，更没有让私人关系自动换一个答案。
  `, 'x9_prior_current', { flags: { pendingOmittedConversation: false, repairStarted: true, omittedContribution: 'confirmedPartOnly', xu9OldRepairKept: true } });
  add('x9_prior_current', '看过已经做的，再回应还欠的', 'dorm', '六月二十四日 · 10:05', self, `
旁白｜我把已经确认的工作范围留下，不向同一个人重复讨一次同意。昨天那两种习惯也需要分别看：自己多接却不说，或者替别人回复工作。
旁白｜做过的澄清不重演成今天才做，没说过的话则不能从一份抽检记录里猜成已经说过。
  `, 'x9_hidden_gate');
  gate('x9_hidden_gate', 'xu8SampleHidden', { true: 'x9_hidden_ack_gate', false: 'x9_hidden_clear' });
  gate('x9_hidden_ack_gate', 'xu8HiddenBurdenAcknowledged', { true: 'x9_hidden_clear', false: 'x9_hidden_admit' });
  add('x9_hidden_admit', '额外两本，今天才说完整', 'dorm', '六月二十四日 · 10:10', self, `
沈知夏 · 消息｜二十二号说只是简单核一下，其实多做了两本，十一点十分结束，十一点二十才开始改稿。我之前没有把这份负担说清。
沈知夏 · 消息｜那是自己的额外检查，不补成你答应过。我以后新增协助先问，不等把余量用尽才请你接下。
许见微 · 消息｜现在听清了。你自己的时间也需要被算进去，不是只能用别人的忙来判断能否开口。
旁白｜今天新增的是这次实际说明。二十三号没有说过的，不因为今天得到答复就变成昨天已完成。
  `, 'x9_mail_gate', { flags: { xu9HiddenBurdenAcknowledged: true } });
  add('x9_hidden_clear', '已经说清的负担，保留原来的日期', 'dorm', '六月二十四日 · 10:10', self, `
旁白｜抽检的实际数量与开始改稿的时间都留在记录里。没有隐瞒过的，不虚构一次道歉；已经补说过的，也不改成今天才承认。
旁白｜我把现在能做的量重新写清，给出版社后续材料留出自己的时间。
  `, 'x9_mail_gate', { flags: { xu9HiddenBurdenAcknowledged: false } });
  gate('x9_mail_gate', 'xu8InterferenceMade', { true: 'x9_mail_ack_gate', false: 'x9_mail_clear' });
  gate('x9_mail_ack_gate', 'xu8CorrectionSent', { true: 'x9_mail_clear', false: 'x9_mail_correct' });
  add('x9_mail_correct', '未授权的拒绝，由自己的邮箱澄清', 'dorm', '六月二十四日 · 10:15', self, `
旁白｜我用自己的邮箱向合作方发出澄清：此前以项目伙伴身份发出的拒绝未经见微授权，不代表她；请以她本人答复为准。我没有索要她的客户资料，也没有给八月添一个替她决定的承诺。
沈知夏 · 消息｜自己的更正已经发出。你昨天已独立回复对方，不需要等我道歉。我今天承担的仍是我那封错误邮件。
许见微 · 消息｜收到。我的业务决定仍由我自己给。私人是否继续，可以之后再谈，不由这封澄清自动恢复。
旁白｜她的合作没有被我取回到另一个错误答案里。今天做了该做的部分，也听见她仍需要自己回答的那一句。
  `, 'x9_prior_reply', { flags: { xu9CorrectionSent: true, xu9CorrectionSentAt: '6-24 10:15' } });
  add('x9_mail_clear', '已经独立取回的决定，不再替她签名', 'dorm', '六月二十四日 · 10:15', self, `
旁白｜业务决定一直在她手里。之前若已经澄清，那份更正保留原日期；没有越权回复过的，也没有新造一封错误邮件。
沈知夏 · 消息｜今天新增请求会写清具体的量。我自己的出版社材料自己做，驻外条件由你核，不把两个安排变成谁该迁就谁的证明。
  `, 'x9_prior_reply', { flags: { xu9CorrectionSent: false } });
  add('x9_prior_reply', '她愿意听，不急着替关系作答', 'dorm', '六月二十四日 · 10:25', self, '旁白｜见微在原工作时段看过我的具体安排，给了自己的回复。', 'x9_prior_ready', variation('xu8Outcome', {
    together: `许见微 · 消息｜看到了。女朋友的工作也不是我的附属项目，有需要我们先问。
旁白｜我把自己的时间写得更具体一点。喜欢她的时候，也可以给自己的生活留位置。`,
    slow: `许见微 · 消息｜这样能继续说。想见面也直接问，不需要每次先准备一份足够难的题。
旁白｜我回了好。现在愿意继续认识，没有换成已经确认恋人。`,
    paused: `许见微 · 消息｜具体改变看见了。我愿意再听，但今天先不恢复私人约会，也不马上确认恋人。之后另问谈话时间。
沈知夏 · 消息｜知道了。你愿意听，我也会听完整，不拿再谈等于我们已经回到原处。`
  }));
  add('x9_prior_ready', '今天的回应有自己的结果', 'dorm', '六月二十四日 · 10:30', self, `
旁白｜已落实的版本与新的答复都留好。关系还按实际说出的范围走，今天愿意再谈也不是可以直接占用整个夜晚。
  `, 'x9_editor', { flags: { xu9EntryReady: true, xu9PriorResponseGiven: true } });
  add('x9_prior_hold', '还没准备好的，不借雨天变成完成', 'dorm', '六月二十四日 · 09:20', self, `
沈知夏 · 消息｜今天仍需要时间。已确认的工作照原范围，未落实的调整继续保留；私人相处按昨天真正得到的答复来。
许见微 · 消息｜收到。新增工作也具体问，不把今天有空当成已经全答应。
旁白｜我把未做的回应留在原处。她回了工作消息，不是已经取消私人暂停；原先双方愿意的相处也没有被我说成从未发生。
  `, 'x9_hold_entry', { flags: { xu9OldRepairKept: false, xu9HiddenBurdenAcknowledged: false, xu9CorrectionSent: false, xu9PriorResponseGiven: false } });
  gate('x9_hold_entry', 'xu8Outcome', { together: 'x9_hold_open', slow: 'x9_hold_open', paused: 'x9_hold_closed' });
  add('x9_hold_open', '原先的愿意仍保留', 'dorm', '六月二十四日 · 09:30', self, `
旁白｜昨天已谈妥的关系仍在。欠其他伙伴的具体调整没有自动消失，但也不能把不同的答复全混成我今天只能离谁更近一点。
  `, 'x9_editor', { flags: { xu9EntryReady: true } });
  add('x9_hold_closed', '仍欠的回应，私人暂停也仍在', 'dorm', '六月二十四日 · 09:30', self, `
旁白｜私人暂停的原因还没有得到具体回应。今天会一起做已确认的工作，却没有新得到私人邀约的同意。
  `, 'x9_editor', { flags: { xu9EntryReady: false } });
  add('x9_editor', 'X9-02 · 自己的下一页也有期限', 'dorm', '六月二十四日 · 11:30', self, `
旁白｜出版社来信，想看我的作品说明与两份短样本，二十五号中午十二点前提交。编辑没有要求见微替我排一份，也没有给我一张需要证明更值得喜欢的表。
沈知夏 · 消息｜收到。我会按时发自己的材料，修改理由也附上。
旁白｜我给今天七点四十五到八点十分留了一轮整理，明天上午再通读。想继续参与书店收尾，不代表这些时间可以被悄悄拿走。
旁白｜午饭后我开始列自己的说明。它没有别人的名字可以替我签，每一句都得从我真实做过的作品开始。
  `, 'x9_bookshop', { flags: { xu9PublisherDeadline: '6-25 12:00', xu9PublisherWorkReserved: '6-24 19:45-20:10 / 6-25 morning' } });
  add('x9_bookshop', '四点四十，一扇等着修的窗', 'bookshop', '六月二十四日 · 16:40', ['shen_zhixia', 'xu_jianwei', 'lin_wan', 'chen_xuning'], `
旁白｜下午，我们将到货的基础册带到书店核现场使用。陈老师试过后窗的扣，指给我看仍贴不严的接缝。
陈序宁｜维修最早明天来。先把原稿放里侧，窗口这张桌子尽量空出来。
旁白｜作者原信已经封袋放在里侧柜中。大部分基础册也搬进去，八本待挑现场页码的样册临时放在带盖周转盒里，准备随后挪开。
许见微｜展示拟选八页已获准用于现场的短段。基础册仍是二十四页，另外的展示板不反过来改已经印好的文字。
林晚｜借阅编号与确认件放蓝色登记袋。今晚七点半我要去说明会，能核的下午先核，不等我回来才搬东西。
沈知夏｜好。新增加的用法单独问，没得到答复的先不用。
旁白｜她拿起自己的伞。见微也把客户文件收进包里，今天的工作各有一个结束时间。
  `, 'x9_rain', { flags: { xu9BriefingScheduled: '6-24 19:30', xu9BriefingNotCancelled: true, xu9OriginalDisplayPages: 8 } });
  add('x9_rain', '六点三十五，盒盖挡不住桌沿的水', 'rain_bookshop', '六月二十四日 · 18:35', pair('lu_yao'), `
旁白｜傍晚雨骤然变大。接缝漏下的水顺着桌沿淌进周转盒下方，我和陆遥刚把里面的册子托起，就看见四本下沿已经湿了。
陆遥｜先放干桌。设备停了，线也挪开，别站在水里还想一眼检查全部。
旁白｜我把书放到干燥一侧，去拿垫纸。林岚在电话里同意使用里侧台面，也确认仍按原安排休息，不会赶回来。
沈知夏｜那八页怎么办？
陆遥｜先知道哪几本是真的湿。八页只是原来的计划，不是现在要把别人都喊回来偿还的东西。
旁白｜见微回复可以过来核到八点。周栀刚收到场地方暂停排练的消息，愿意来搬干燥箱子；叶澄确认只来移设备，不拍这段慌乱。
旁白｜这一次，我看见屋里已经有陆遥，群里还有自己的答复。想靠近见微，不必把其他人都变成等待她出现的背景。
  `, 'x9_damage');
  add('x9_damage', '四本受潮，不是全部失去', 'rain_bookshop', '六月二十四日 · 18:55', xu, `
旁白｜见微到后，我们按收货单重新点实物。四本下沿受潮，先单独隔离，不叠压、不承诺一定能恢复；其余实物干燥，未确认展示的作者原信也没有湿。
许见微｜这四本暂不交付。可用数量按实际写，隔离的仍算受影响实物，不拿计划印数说它们都可以用。
沈知夏｜原印数与到货记录不改。今天新增的是四本受潮，以及它们之后需要复核。
旁白｜她点头，在纸边留了一个可以继续写日期的空格。二十二号完成过抽检，也不能因此否认今天新发生的损失。
  `, 'x9_available_gate', { flags: { xu9DamageLogged: true, xu9WetCopies: 4, xu9WetOriginals: 0, xu9QuarantinedCopies: 4, xu9DamageTime: '6-24 18:55' } });
  gate('x9_available_gate', 'workflow', { collective: 'x9_available_56', solo: 'x9_available_56', smaller: 'x9_available_36' });
  for (const count of [56, 36]) add('x9_available_' + count, '实际可交付的一栏', 'rain_bookshop', '六月二十四日 · 19:00', xu, `
旁白｜点数后，干燥可用${count}本，另有四本隔离。二十二号实收${count + 4}本的回执保留，没有把今天损失写成印厂当时少交。
沈知夏｜展示可以从干燥册里选已获准的内容。受潮册复核以后再决定，不先保证能修好。
许见微｜对。交付与展示分别记，别把少一点的遗憾写成必须再订一次印刷。
旁白｜预算表没有换数字。我把现有纸材放到桌边，先想今晚真正能承担的版本。
  `, 'x9_team', { flags: { xu9AvailableCopies: count } });
  add('x9_team', '每一个愿意来的人都有自己的范围', 'rain_bookshop', '六月二十四日 · 19:05', ['shen_zhixia', 'xu_jianwei', 'zhou_zhi', 'ye_cheng', 'lu_yao'], `
旁白｜周栀搬干燥箱子，陆遥接过来归到柜台内侧。叶澄把设备与接线移到干处，只做她答应的那一项，没有开机录下一场能进入影片的事故。
周栀｜搬到这里就够了吧？我八点还要给场地方回电话。
沈知夏｜够了。没有新加的串场或检查音频，谢谢你来搬。
许见微｜我能核原折边到八点。剩下的不是因为我在场就自动归我。
旁白｜她说完，却又伸手去接另一摞展示材料。自己察觉以后停下来，先把那一摞放回桌面。
许见微｜刚才又差一点顺手全接。我想请你一起判断，不想再用我来处理替我们两个都作答。
旁白｜我看着她停下的那只手，比看见她一次做完全部还认真。请求还没有被说出口，就已经有了我也能回应的位置。
  `, 'x9_plan_choice', { flags: { xu9BooksMoved: true, xu9EquipmentMoved: true, xu9PrivateAccidentRecorded: false, xu9OwnerRestKept: true, xu9WindowRepairBooked: '6-25 morning' } });
  add('x9_plan_choice', '选择二 · 展示留下怎样的一页', 'rain_bookshop', '六月二十四日 · 19:12', xu, `
许见微｜原展示拟用八页获准片段。现在可以缩小，也可以用现有材料过渡，或者分两次把八页核完。你想做哪一种，自己能承担多少？
旁白｜三个方案都不改已印出的基础册，也不使用作者尚未允许的内容。想保留什么，需要先从真实时间与现有材料判断。
  `, null, { choices: [
    { text: '缩成四页现场展示，保留干燥基础册的原交付。', flags: { xu9DisplayPlan: 'reduce' }, next: 'x9_plan_reduce' },
    { text: '用四张手工展示卡过渡，受潮实物另报复核进度。', flags: { xu9DisplayPlan: 'manual' }, next: 'x9_plan_manual' },
    { text: '分今晚与明早核原八页，先问补印报价但不下单。', flags: { xu9DisplayPlan: 'restore' }, next: 'x9_plan_restore' }
  ] });
  add('x9_plan_reduce', '少四页，仍能认真留下', 'rain_bookshop', '六月二十四日 · 19:15', xu, `
沈知夏｜我想用四页。先保留作者已经答应的短段与清楚的出处，没展出的不从基础册里删，也不写成作者撤回。
许见微｜可以。余下版面留空，不拿未经确认的信填。四本受潮另做复核，不和四页展示混成一件事。
旁白｜我们选好四项获准片段，写出对应页码。我仍有一点不甘心，却知道它不需要借谁多熬一晚才能被证明认真。
许见微｜留空也需要一个决定。今天你已经给了自己的判断。
旁白｜我把那四页放到待核一栏，今晚先定版本，明天是否准备好要实际核过才写。
  `, 'x9_request_choice', { flags: { xu9DisplayTargetPages: 4, xu9HandmadeCards: 0, xu9ReprintQuoteReceived: false, xu9ReprintOrdered: false, xu9ExtraCost: 0 } });
  add('x9_plan_manual', '手写的副本，也要有清楚的出处', 'rain_bookshop', '六月二十四日 · 19:15', xu, `
沈知夏｜用原先获准现场展示的短段做四张手工卡。标明出处与副本用途，干燥基础册照原交付，隔离的实物另报复核。
许见微｜可以用柜里现有纸材，不增加费用。手写没有把它变成我们的文字，原句与作者名都要核。
旁白｜我取出四张卡，先画边框与标记位置，还没有把尚未核过的短段写成完成品。她给我量线时也先问需要哪一种。
沈知夏｜这一条就够。我不是因为它不够正式，才把每张都交给你重做。
旁白｜见微笑了一下。手工卡可以很小，也能是两个人按具体范围做出的完整版本，而不是无限劳动的委婉名称。
  `, 'x9_request_choice', { flags: { xu9DisplayTargetPages: 4, xu9HandmadeCards: 4, xu9ReprintQuoteReceived: false, xu9ReprintOrdered: false, xu9ExtraCost: 0 } });
  add('x9_plan_restore', '原八页，先拆成可以核的两段', 'rain_bookshop', '六月二十四日 · 19:15', xu, `
沈知夏｜我想保留八页展示。今晚先排六页，另外两页明早按有限时间核，不让你一个人连夜补完。
许见微｜可以用干燥册与已经交印的文件核原文字。受潮实物另处理，展示补齐不等于那四本已经恢复。
旁白｜我问印厂补四本的报价，收到四十八元与最早二十六日下午的答复。这里只是报价，不先下单，也没有向作者保证新的交付日期。
沈知夏｜先留这份报价。明天核现有材料能否完成，若真需要补印，再核预算并取得相关确认，不拿喜欢原八页当成钱已经付过。
许见微｜好。晚上的上限也保留，八页不是八点以后都必须有人留下的理由。
旁白｜我写下六加二，觉得原来的坚持第一次有了可以共同判断的重量。
  `, 'x9_request_choice', { flags: { xu9DisplayTargetPages: 8, xu9HandmadeCards: 0, xu9ReprintQuoteReceived: true, xu9ReprintQuoteAmount: 48, xu9ReprintOrdered: false, xu9ExtraCost: 0 } });
  add('x9_request_choice', '选择三 · 一起判断，还是又交给她全部决定', 'rain_bookshop', '六月二十四日 · 19:30', xu, `
旁白｜还需要核八本样册的具体编号与页码，展示版本也有自己的待办。七点四十五，我答应过自己去整理出版社材料。
许见微｜我核原折边到八点。你现在想请我做的是哪一项？
  `, null, { choices: [
    { text: '各自说清能做的量，留下自己的交件与休息时间。', flags: { xu9WorkRequest: 'shared' }, next: 'x9_work_shared' },
    { text: '希望她替我定完盘点、展示和出版社材料的做法。', flags: { xu9WorkRequest: 'all' }, next: 'x9_work_all' }
  ] });
  add('x9_work_shared', '先问，才把一页交给另一双手', 'rain_bookshop', '六月二十四日 · 19:35–19:45', xu, `
沈知夏｜我核编号与对应页码到七点四十五。你愿意只核这八本的原折边吗？作者通知我发，出版社材料也由我自己写。
许见微｜愿意，八点前结束这项。展示按刚才选的量做，未完的写到明早，不把我有经验变成全给我。
旁白｜我们把八本一一对上登记袋与确认件，受潮标记跟着具体实物，干燥与待复核分开。八本编号和对应页码在七点四十五实际核完。
旁白｜我把自己看过的部分签好，转到里侧自己的电脑前整理作品说明。见微继续完成她已经答应的折边，不接我的整个未来。
许见微｜等你写完自己那项，再告诉我最想保留哪个作品。
沈知夏｜这次我先选了再讲。
旁白｜她点头，眼神里有一种很普通的期待。不是期待我终于不会犯错，而是想听我的选择。
  `, 'x9_plan_progress', { flags: { xu9RequestRespected: true, xu9NightInventoryDone: true, xu9NightCheckedSamples: 8, xu9FullGuidanceRequested: false } });
  add('x9_work_all', '熟悉的请求，没有得到自动接手', 'rain_bookshop', '六月二十四日 · 19:35–19:45', xu, `
沈知夏｜这些都由你定吧。盘点、展示，还有我出版社要交哪两个作品。我怕自己一边做一边又弄错。
许见微｜我愿意核原折边，不会替你选作品，也不能一个人把展示全部做好。你现在又想用我的判断盖过自己的。
旁白｜她把待核那两本放回桌上，没有生气地替我全做完。我在原编号表与作品说明之间来回看，花掉了自己本来能核清的时间。
许见微｜先停。七点四十五你要写自己的材料，照原时间去。这边今晚核过六本，另两本的页码待明早，别把未核写成已经完成。
旁白｜我记下六本与两本。受潮数量早已点清，没有新增损失；迟下来的，是最后两本与展示出处的对应核对。
沈知夏｜我刚才想请你接的，已经多过你愿意接的。
许见微｜是。想帮你不需要全部答应，想和你相处也不需要一直指导你。
  `, 'x9_plan_progress', { flags: { xu9RequestRespected: false, xu9NightInventoryDone: false, xu9NightCheckedSamples: 6, xu9FullGuidanceRequested: true } });
  gate('x9_plan_progress', 'xu9DisplayPlan', { reduce: 'x9_progress_reduce', manual: 'x9_progress_manual', restore: 'x9_progress_restore' });
  for (const [id, detail] of [
    ['reduce', '四项片段已选定，展示纸面尚待明早与确认件逐句比。今晚没有把空白填满，也没有更改基础册的文字。'],
    ['manual', '四张展示卡画好边框与出处位置，原句暂不全部誊入。明早比确认件再完成手写与核对，不把草稿卡算成可以上墙的成品。'],
    ['restore', '六页展示版面已准备，另两页留到明早。现有材料与干燥册仍在，四十八元报价没有成为订单，八页也还没有被记成全部完成。']
  ]) add('x9_progress_' + id, '八点，工作有真实的停笔时间', 'rain_bookshop', '六月二十四日 · 20:00', xu, `
旁白｜${detail}
许见微｜今天能做的到这里。明早核什么，写清以后另问时间，不先替任何人加一个肯定有空。
旁白｜她合上铅笔盒。周栀去回自己的电话，叶澄已移完设备离开，陆遥准备最后一趟把干箱推到柜里。每个人都做过具体的事，也有自己的下一项。
旁白｜我没有请求她们把现场搬完理解成所有私人问题也都结束。
  `, 'x9_own_work', { flags: { xu9NightDisplayReady: false, xu9WorkStoppedAt: '6-24 20:00' } });
  add('x9_own_work', '八点十分，自己的说明写到自己这里', 'rain_bookshop', '六月二十四日 · 20:10', self, `
旁白｜我按自己留出的七点四十五到八点十分整理作品说明，先写完一轮。明早还需通读才提交，没有请见微代写，也没有给编辑改一个未经答应的期限。
旁白｜第一份样本我想保留那篇不那么整齐的短文，因为修改过的理由是自己的。第二份还要再核两句，不急着用她觉得哪份好替我回答。
沈知夏｜今天先到这一步。
旁白｜我保存文件，将电脑合上。选择自己的作品，和选择现场展示一样，都需要先有一个真正愿意承担的判断。
  `, 'x9_authors', { flags: { xu9PublisherDraftPrepared: true, xu9PublisherDraftTime: '6-24 19:45-20:10', xu9PublisherWorkDelegated: false } });
  add('x9_authors', '八点十五，作者需要知道的是真实版本', 'rain_bookshop', '六月二十四日 · 20:15', self, '旁白｜我把受潮与现场方案分别通知相关作者，不先用一句基本没事省略他们需要知道的部分。', 'x9_reply_choice', { ...variation('xu9DisplayPlan', {
    reduce: `沈知夏 · 消息｜四本实体受潮，暂隔离复核；可用册按原安排交付。现场缩为四页已获准片段，未展出的仍保留在基础册，不扩大原用途。
旁白｜我标出明早仍要核的出处，没有把通知送达记成新的授权。`,
    manual: `沈知夏 · 消息｜可用册按原交付。现场用四张现有纸材手工卡过渡，只誊原先获准片段；四本受潮实体另报复核进度，不承诺一定修好或擅自更换原文。
旁白｜若有新用途，仍等新的明确答复，手写没有让未同意的内容自动获得展示资格。`,
    restore: `沈知夏 · 消息｜四本实体隔离，可用册按原交付。拟展示的原八页分今晚六页与明早两页核对，未核完的先不展示。补印只问过报价，尚未下单，不先保证交付。
旁白｜我留下待核清单。即使想尽量补齐，作者的决定与实际费用也不能被一次忙乱跨过去。`
  }), flags: { xu9AuthorsNotified: true, xu9AuthorsNotifiedAt: '6-24 20:15' } });
  add('x9_reply_choice', '选择四 · 对刚才那种请求，怎样回答', 'rain_bookshop', '六月二十四日 · 20:20', self, `
旁白｜见微已经结束今天答应的工作。接下来想谈私人期待，必须先说明自己有没有听懂刚才的界限。
  `, null, { choices: [
    { text: '说出真实进度，兑现自己的量，收回全部交给她的请求。', flags: { xu9ReplyChoice: 'act' }, next: 'x9_reply_action_gate' },
    { text: '承认还没有准备好继续谈，私人相处先暂停。', flags: { xu9ReplyChoice: 'hold' }, next: 'x9_reply_hold' }
  ] });
  gate('x9_reply_action_gate', 'xu9WorkRequest', { shared: 'x9_reply_shared', all: 'x9_reply_all' });
  add('x9_reply_shared', '各自完成的量，不被改成一个人的功劳', 'rain_bookshop', '六月二十四日 · 20:25', self, `
沈知夏 · 消息｜八本编号页码今晚核完，展示仍待明早。自己的作品说明按留出的时间准备，明天由我自己提交。谢谢你核原折边，也谢谢你真的问我想怎样做。
许见微 · 消息｜我也谢谢你给自己的时间留位置。刚才差点顺手接那一摞，我停下来以后没有少一件必须由我负责的事。
旁白｜我看过陆遥、周栀与叶澄的实际协助，把每个人做的部分都留下。今天有两个人想靠近，也不需要一屋子人的劳动只剩一个名字。
  `, 'x9_reply_kept', { flags: { xu9CurrentAdjustmentKept: true, xu9FullRequestWithdrawn: false } });
  add('x9_reply_all', '把错误的请求收回到自己这里', 'rain_bookshop', '六月二十四日 · 20:25', self, `
沈知夏 · 消息｜刚才把盘点、展示和作品选择都请你决定，是我没有承担自己的判断。我收回。今晚六本核完，两本待明早；自己的说明已准备，明天自己提交。
沈知夏 · 消息｜我先把待核两本的编号位置整理好。明早若能协助，只另问那一项，不请你把全部接走。
旁白｜我确实整理出待核位置，撤掉文件里一列请见微定，给每项写自己能做的量。没有把这个动作写成两本已经核过。
许见微 · 消息｜这次具体改变看见了。可以继续说，但我不接完整指导，也不拿你改了当作我必须今晚陪伴的理由。
旁白｜我读完她的回答，没有删去最后半句。收回请求有真实动作，不是只把一个总听你的换成更好看的说法。
  `, 'x9_reply_kept', { flags: { xu9CurrentAdjustmentKept: true, xu9FullRequestWithdrawn: true } });
  add('x9_reply_kept', '愿不愿意再谈，仍要另问', 'rain_bookshop', '六月二十四日 · 20:30', self, `
旁白｜实际工作与当前调整留在原记录里。我现在能问的，是她是否愿意给一段私人谈话，不是因为今天合作够认真就理应得到。
  `, 'x9_classify');
  add('x9_reply_hold', '说到这里，不靠一句没事要求继续', 'rain_bookshop', '六月二十四日 · 20:25', self, `
沈知夏 · 消息｜工作进度照清单，我现在还没准备好继续谈自己的期待。不能请你先接受一句以后会改，私人相处先停。
许见微 · 消息｜知道了。新增工作另问，今晚先不约私人见面。
旁白｜我把具体做完与尚未回应分开。她核过折边，我写过自己的稿，仍不能替一句还没准备好补上新的关系答复。
  `, 'x9_paused', { flags: { xu9CurrentAdjustmentKept: false, xu9FullRequestWithdrawn: false } });
  gate('x9_classify', 'xu9EntryReady', { true: 'x9_relationship_entry', false: 'x9_paused' });
  gate('x9_relationship_entry', 'xu8Outcome', { together: 'x9_together', slow: 'x9_reopen_slow', paused: 'x9_reopen_paused' });
  add('x9_together', '仍愿意作为女朋友继续', 'rain_bookshop', '六月二十四日 · 20:35', self, `
沈知夏 · 消息｜想和你继续作为女朋友相处。今天不是因为最终展示有几页才得出这个答复，也希望你能说自己的需要。
许见微 · 消息｜我也愿意。累的时候能问你陪不陪，不先把整屋子的工作做完再等你看见。
旁白｜她愿意继续，我才把今晚的关系答复记下。受潮的四本还需要复核，少一点展示或未完成的页码没有成为女朋友的评分表。
  `, 'x9_couple_choice', { flags: { xu9Outcome: 'together', relationshipStatus: 'girlfriends', xu9PrivateConversationAllowed: true, xu9ExistingRelationshipContinued: true, xu9DatingResumed: false } });
  add('x9_reopen_slow', '继续相处，称呼不被雨夜催出来', 'rain_bookshop', '六月二十四日 · 20:35', self, `
沈知夏 · 消息｜我仍愿意继续认识你，自己的工作和期待会具体说。今晚若愿意，想听你怎样看接下来的生活。
许见微 · 消息｜愿意继续相处。今天不急着确认恋人，想谈话就先问时间。
旁白｜原来的试着约会或继续了解仍保留，没有因为一场共同处理的危机自动成为女朋友。她说愿意听，和谁做了多少工作分别有自己的位置。
  `, 'x9_learning_choice', { flags: { xu9Outcome: 'reopen', xu9PrivateConversationAllowed: true, xu9ExistingRelationshipContinued: true, xu9DatingResumed: false } });
  add('x9_reopen_paused', '愿意再听，不是已经结束暂停', 'rain_bookshop', '六月二十四日 · 20:35', self, `
沈知夏 · 消息｜现在有具体改变，也知道工作是自己的。你愿意再听一段私人期待吗？不先假定今天已经恢复约会。
许见微 · 消息｜愿意谈。先留十分钟，今天仍不恢复约会，也没有确认恋人。下次怎么走，我们之后分别回答。
旁白｜她给了新的谈话意愿。我把暂停也完整留着，不拿愿意坐下来讲期待，替她写出还没说过的关系结论。
  `, 'x9_learning_choice', { flags: { xu9Outcome: 'reopen', relationshipStatus: 'needsConversation', xu9PrivateConversationAllowed: true, xu9ExistingRelationshipContinued: false, xu9DatingResumed: false } });
  add('x9_paused', '今晚尚未得到新的私人同意', 'rain_bookshop', '六月二十四日 · 20:35', self, `
旁白｜先前待谈的回应或今晚的调整仍没有完成。见微没有答应私人见面，工作按原范围继续。
许见微 · 消息｜今天先停在这里。事情按实际进度记，需要新的协助另问，不借工作延长私人话题。
沈知夏 · 消息｜收到。你没有答应的那段时间，我也不会去等着让它变成已经发生。
旁白｜我把她这句话留下。想把自己一整天都做好，也不能让另一个人失去说不愿意的权利。
  `, 'x9_paused_choice', { flags: { xu9Outcome: 'paused', relationshipStatus: 'needsConversation', xu9PrivateConversationAllowed: false, xu9ExistingRelationshipContinued: false, xu9DatingResumed: false } });
  add('x9_couple_choice', '选择五 · 雨小以后，给彼此怎样的时间', 'rain_bookshop', '六月二十四日 · 20:40', self, `
旁白｜见微吃过晚饭，稍后会到后街站台坐车。知道她会经过那里，不是我已经得到邀约；想见面仍要先问。
  `, null, { choices: [
    { text: '问九点能否在站台见十分钟，也问她是否愿意牵手。', flags: { xu9EveningChoice: 'hand' }, next: 'x9_hand_agree' },
    { text: '问能否在站台聊十分钟，今晚不作身体接触。', flags: { xu9EveningChoice: 'talk' }, next: 'x9_talk_agree' },
    { text: '今晚各自休息，保留双方愿意继续的答复。', flags: { xu9EveningChoice: 'rest' }, next: 'x9_private_rest' }
  ] });
  add('x9_learning_choice', '选择五 · 愿意再谈的十分钟', 'rain_bookshop', '六月二十四日 · 20:40', self, `
旁白｜谈话有新的意愿，身体接触与恋人称呼没有自动附在后面。想听她的想法，也要给她一个能选择的具体时间。
  `, null, { choices: [
    { text: '问九点能否在站台谈十分钟，先听她想说的需要。', flags: { xu9EveningChoice: 'listen' }, next: 'x9_listen_agree' },
    { text: '问能否见十分钟，谈各自工作与未来的真实期待。', flags: { xu9EveningChoice: 'future' }, next: 'x9_future_agree' },
    { text: '今晚先各自休息，下次准备好再问谈话时间。', flags: { xu9EveningChoice: 'rest' }, next: 'x9_private_rest' }
  ] });
  for (const [kind, prompt, reply] of [
    ['hand', '九点在站台见十分钟吗？也想牵一下你的手，你愿意吗？', '愿意见，也愿意牵。九点到九点十分，之后各自回去。'],
    ['talk', '九点在站台聊十分钟吗？今晚先不作身体接触。', '愿意。九点到九点十分，只聊天，也给自己留回去的时间。'],
    ['listen', '九点能在站台谈十分钟吗？先听你想说的需要，不把再谈改成已经约会。', '愿意。只留十分钟，先说彼此真正想表达的，关系按刚才答复。'],
    ['future', '九点能在站台谈十分钟吗？想听你的计划，也讲自己的，不替你决定驻外。', '愿意。九点到九点十分，未确定的也说未确定，不要先造一个保证。']
  ]) add('x9_' + kind + '_agree', '时间和愿意都重新问过', 'rain_bookshop', '六月二十四日 · 20:42', self, `
沈知夏 · 消息｜${prompt}
许见微 · 消息｜${reply}
旁白｜我读完同意才收自己的包。别人愿意经过的地方与真正愿意给的时间，终于没有被我混成一件事。
  `, 'x9_station_' + kind, { flags: { xu9EveningBooked: '6-24 21:00-21:10 rain_stop' } });
  add('x9_station_hand', 'X9-03 · 她自己伸过来的手', 'rain_stop', '六月二十四日 · 21:00–21:10', xu, `
旁白｜九点，我们在站台见面。雨小到只听见檐角隔一阵落下一滴，见微收起自己的伞，向我伸手。我才握住她的掌心。
许见微｜今天很累，但不只想说工作。我想告诉你，刚才有人先问我能做多少的时候，我很高兴。
沈知夏｜我也高兴你问我想做哪种。虽然我仍会怕答错，已经不想只等一个正确答案。
旁白｜她笑了一下，没有用以后都不会错安慰我。手指收紧一点，又很自然地松开，让我自己把伞带绕好。
许见微｜明天我先核自己的业务条款。想让你陪我吃饭时，会直接问，不把吃饭藏成需要看一个稿。
沈知夏｜那我也会讲自己有没有空。不是每次都立刻答应，但想听你问。
旁白｜九点十分，我们松开手。她坐自己的车，我走向宿舍，普通的回程没有把这十分钟变得不够完整。
  `, 'x9_lu_night', { flags: { xu9EveningMet: true, xu9HeldHands: true, xu9EveningFinishedAt: '6-24 21:10' } });
  add('x9_station_talk', '没有触碰，也说完自己的需要', 'rain_stop', '六月二十四日 · 21:00–21:10', xu, `
旁白｜九点我们坐在站台靠里侧的位置，没有牵手。见微把湿伞移开，让两个人的鞋都有干燥的一点地方。
许见微｜我今天想问你陪我说话，差点又写成还有两页想请你看。其实那两页明天核，今晚只是想见你。
沈知夏｜我今天选作品，也差点发给你求一个标准。后来先问了自己，想留下怎样的东西。
许见微｜等你交完，我想听。
旁白｜她的眼睛在站台灯下很亮。我讲第一份样本为什么想保留，她没有代我改题目，只听我把理由说完。
旁白｜九点十分，我们分别。身体没有接近一点，那个作为女朋友想听我的人，也仍真正坐在这里过。
  `, 'x9_lu_night', { flags: { xu9EveningMet: true, xu9HeldHands: false, xu9EveningFinishedAt: '6-24 21:10' } });
  add('x9_station_listen', '愿意听一段没有被改成指导的话', 'rain_stop', '六月二十四日 · 21:00–21:10', xu, `
旁白｜站台的长椅刚擦过，我们在两端坐下，没有牵手。见微先讲自己想要的：疲倦时能问别人，不先借完成一整份工作换一个值得被陪的理由。
许见微｜刚才说我来处理的时候，自己听见了。以前听见以后常会更快地做完，好像做得足够快就不算又那样。
沈知夏｜今天你停下来了，也问我想怎样。这不是没有做事，是把我留在了能回答的位置。
旁白｜她低头笑了。我没有接着讨一个已经恢复约会的证明，也没有把听她讲需要变成我又应该负责她所有疲倦。
许见微｜谢谢你听完。下次想谈，还是先问。
旁白｜九点十分到了，我们各自回程。今天的谈话真实发生，关系仍按刚才给出的答复保留。
  `, 'x9_lu_night', { flags: { xu9EveningMet: true, xu9HeldHands: false, xu9EveningFinishedAt: '6-24 21:10' } });
  add('x9_station_future', '八月没有先替两个人写好', 'rain_stop', '六月二十四日 · 21:00–21:10', xu, `
旁白｜我们在站台见面，没有身体接触。见微说驻外方发来条件清单，她先核工作量和住处，二十六号五点前自己答复是否继续谈。
许见微｜仍是八周询问，没有接受，也没有确定出发。你不用先说一定可以，我也不能要你先保证不会难过。
沈知夏｜我想开始自己的工作，也想以后有机会见你。我还不知道能怎样安排，但会先算自己的时间，不用你的选择替我避开所有害怕。
旁白｜她听完以后讲了一个很小的期待：若真的隔着距离，也想有普通的消息，不只在最需要帮助的时候出现。
沈知夏｜我想试着学会。哪天怎样联系，到时再分别问，不先许一张全天候的日程。
旁白｜九点十分，我们分别。未来没有因此被定好，却也不再只剩一个人负责给另一个人保证。
  `, 'x9_lu_night', { flags: { xu9EveningMet: true, xu9HeldHands: false, xu9EveningFinishedAt: '6-24 21:10' } });
  add('x9_private_rest', '愿意继续，也可以各自回去', 'rain_bookshop', '六月二十四日 · 20:42', self, `
沈知夏 · 消息｜今晚先各自休息。刚才愿意继续相处或再谈的答复保留，不用再见十分钟才算数。
许见微 · 消息｜我也想休息。之后想见就先问，不要求今晚一直回消息。
旁白｜我收好自己的包，回宿舍。她乘自己的车，没有一起散步、牵手或聊天，被答应过的关系也没有因此少一点真实。
  `, 'x9_lu_night', { flags: { xu9EveningMet: false, xu9HeldHands: false } });
  add('x9_paused_choice', '选择五 · 未获同意的夜晚留给自己', 'rain_bookshop', '六月二十四日 · 20:40', self, `
旁白｜今晚不再发私人邀约。她会经过站台，也不等于我能去那里等一个新的答案。
  `, null, { choices: [
    { text: '完整接受暂停，核自己的待办，不追加私人消息。', flags: { xu9EveningChoice: 'accept' }, next: 'x9_paused_rest' },
    { text: '把想谈的期待写给自己，准备好再问她时间。', flags: { xu9EveningChoice: 'write' }, next: 'x9_paused_rest' },
    { text: '先回去吃东西和休息，让今天有真实的结束。', flags: { xu9EveningChoice: 'rest' }, next: 'x9_paused_rest' }
  ] });
  add('x9_paused_rest', '没有等待到一场自动发生的约会', 'dorm', '六月二十四日 · 21:10', self, `
旁白｜我回到宿舍，没有去站台等她，也没有发一句顺路就在这儿要求她改变主意。自己的失落可以先留在自己这里。
旁白｜今天有人来帮忙，有材料需要复核，也有私人答复仍在暂停。它们都真实，不需要挑一件擦掉才允许自己承认另一件。
  `, 'x9_lu_night', { flags: { xu9EveningMet: false, xu9HeldHands: false } });
  add('x9_lu_night', '十点以后，友情也有自己的这一天', 'dorm', '六月二十四日 · 22:00', pair('lu_yao'), `
旁白｜陆遥给自己泡了一碗热汤，没有等我进门才决定吃。她将另一只杯子推过来，问我今天哪个时候真的放过了笔。
沈知夏｜八点十分写完一轮自己的说明，现在放下了。
陆遥｜挺好。你和见微再怎样，都不要最后连自己的晚饭也等她指导。
旁白｜我笑着说知道。她也讲自己白天怕箱子没放好，差点又去重贴每一条胶带，后来只核真正翘起来的那一处。
沈知夏｜那我今天借来的做法也可以还一点给你：不是能再做，就一定该再做。
陆遥｜收到。不过杯子还是要洗，明天它不会自己搬家。
旁白｜我喝完去洗杯子。二十八号核入口、二十九号送她出发照旧，已经完成过的友情谈话没有被新的一场雨替换。
  `, 'x9_next_morning');
  add('x9_next_morning', 'X9-04 · 第二天，先等真正干下来的纸', 'bookshop', '六月二十五日 · 09:00', ['shen_zhixia', 'xu_jianwei', 'chen_xuning'], `
旁白｜早上雨小了。维修的人按约修好后窗，陈老师核过扣与接缝，才把仍不能放原稿的位置重新标好。
陈序宁｜窗修过不代表纸干了。隔离的四本继续分开，能用的与要等的别混在一起。
旁白｜我们没有把昨夜的四本受潮写成今天自动恢复。可用数量仍按昨夜实点，作者原信没有因此移到展示桌上。
许见微｜我十点前有十分钟能核原规格。如果你需要，就具体问；之后先看自己的业务条件。
沈知夏｜出版社材料十一点自己提交，原中午十二点期限不改。今天也先按这个量来。
旁白｜林晚在群里说明昨晚已参加七点半说明会，八点四十五结束。我们现在才记实际参加，没有在她出门前就先完成这一项。
  `, 'x9_morning_choice', { flags: { xu9WindowRepaired: true, xu9WindowRepairedAt: '6-25 09:00', xu9BriefingAttended: true, xu9BriefingFinishedAt: '6-24 20:45' } });
  add('x9_morning_choice', '选择六 · 今天能做到哪一步', 'bookshop', '六月二十五日 · 09:20', xu, `
旁白｜昨天核完的编号页码保留，仍待核的另列。展示未准备好，隔离册也不能擅自恢复交付。想继续做什么，要和今天真实能留出的时间一起回答。
  `, null, { choices: [
    { text: '先问十分钟协助，完成有限核对与所选展示版本。', flags: { xu9MorningChoice: 'finish' }, next: 'x9_morning_finish' },
    { text: '今天暂缓展示，照实通知待办，先按时交自己的材料。', flags: { xu9MorningChoice: 'wait' }, next: 'x9_morning_wait' }
  ] });
  add('x9_morning_finish', '九点半，有限协助重新得到答复', 'bookshop', '六月二十五日 · 09:30–09:40', xu, `
沈知夏｜九点半能核十分钟原规格吗？编号页码我自己比，展示文字只用获准片段。十分钟后都停，不扩大成你继续做完。
许见微｜愿意。只核这一项，到九点四十。
旁白｜我们按实际待办核过。昨夜已核八本的，只复看关键记录；仍待两本的，我对原确认件核清对应页码后才签。见微核她答应的规格，没有替我签。
旁白｜九点四十结束，八本编号与页码现在全部实际核清。四本受潮仍隔离，抽检、数量与复核不是同一种完成。
  `, 'x9_display_finish_gate', { flags: { xu9MorningCheckKept: true, xu9InventoryDone: true, xu9InventoryFinalCheckedSamples: 8, xu9MorningCheckTime: '6-25 09:30-09:40' } });
  gate('x9_display_finish_gate', 'xu9DisplayPlan', { reduce: 'x9_display_reduce', manual: 'x9_display_manual', restore: 'x9_display_restore' });
  for (const [id, pages, detail] of [
    ['reduce', 4, '四页展示与原确认件逐句比过，作者名和出处都核清。没展出的仍留在基础册，空下的版面没有新增未获准材料。'],
    ['manual', 4, '四张手工卡实际誊完原句，逐句核作者名与出处，注明现场副本用途。用的是现有材料，没有新增费用或扩大使用范围。'],
    ['restore', 8, '昨天六页与今早两页实际核完，原八页展示现在具备使用条件。用现有纸材和干燥册核原文，没有下补印单，也没把四本受潮记成恢复。']
  ]) add('x9_display_' + id, '十点十五，版本完成才写完成', 'bookshop', '六月二十五日 · 10:15', self, `
旁白｜${detail}
旁白｜我将所选版本与用途发给伙伴，未确认的单列。完成的是这份现场展示，不是告别展已经举办，更不是往后所有任务都已结束。
沈知夏｜今天这一步到了这里。
旁白｜我把笔合上，收起自己的材料，按时去通读出版社的作品说明。选择了哪种规模，没有替我们决定恋爱关系该怎样走。
  `, 'x9_publisher_sent', { flags: { xu9DisplayReady: true, xu9DisplayCompletedPages: pages, xu9DisplayReadyAt: '6-25 10:15', xu9MorningStatusNotified: true } });
  add('x9_morning_wait', '待办照实发出，不先许一个已经完工', 'bookshop', '六月二十五日 · 09:30', self, `
沈知夏 · 消息｜今天展示暂不启用。四本受潮继续隔离，可用册按原安排；展示出处与版面仍待核，若昨夜有两本页码未核，也继续标待确认。
旁白｜我将待办按实际列给伙伴与相关作者，没有因为不好意思就写成只是最后润色。之后若要约二十六号核对，还需要先问时间，不在别人名字后自动填上全天。
许见微 · 消息｜收到。我按原安排核业务条件，你也先交自己的材料。今天没有新增私人关系答复，工作暂缓照实记录。
旁白｜她没有代我补完展示，我也没有要求它先恢复得足够好，才准自己去做另一份真实的工作。
  `, 'x9_wait_inventory_gate', { flags: { xu9MorningCheckKept: false, xu9DisplayReady: false, xu9DisplayCompletedPages: 0, xu9MorningStatusNotified: true } });
  gate('x9_wait_inventory_gate', 'xu9NightInventoryDone', { true: 'x9_inventory_already', false: 'x9_inventory_pending' });
  add('x9_inventory_already', '已核完的八本，不因暂缓被退回', 'bookshop', '六月二十五日 · 09:35', self, `
旁白｜昨晚已核八本编号页码，今天暂缓展示没有把那一项退回未完成。未准备好的展示仍是自己的下一项。
  `, 'x9_publisher_sent', { flags: { xu9InventoryDone: true, xu9InventoryFinalCheckedSamples: 8 } });
  add('x9_inventory_pending', '六本与两本，仍有具体差别', 'bookshop', '六月二十五日 · 09:35', self, `
旁白｜昨夜核过六本，另两本页码今天没有实际复核，仍标待确认。可用数量已实点，并不靠这两项才知道有几本；但未核页码也不能伪装成已签。
  `, 'x9_publisher_sent', { flags: { xu9InventoryDone: false, xu9InventoryFinalCheckedSamples: 6 } });
  add('x9_publisher_sent', '十一点，自己的材料真实提交', 'dorm', '六月二十五日 · 11:00', self, `
旁白｜十一点，我将自己的作品说明与两份短样本发给出版社，早于原中午十二点期限。编辑是否采纳仍要等答复，提交已经真实发生。
旁白｜第一份保留那篇不那么整齐的短文，第二份选了我最想练下去的一种写法。理由是自己写的，没有见微代我决定，也没有用放弃交件证明喜欢。
沈知夏｜发出了。
旁白｜我看着已发送那一行，给自己盛了一杯温水。忙乱的雨夜没有拿走自己的全部生活；工作完了，也不必须立刻拿另一个人的回复来确认这一天算数。
  `, 'x9_noon', { flags: { xu9PublisherMaterialsSent: true, xu9PublisherMaterialsSentAt: '6-25 11:00', xu9PublisherDeadlineKept: true, xu9PublisherWorkDelegated: false } });
  add('x9_noon', 'X9-05 · 下一页留给真正的下一步', 'studio', '六月二十五日 · 12:10', xu, `
旁白｜见微在群里确认自己仍核驻外的工作量与住处，二十六号五点前由本人给下一步答复。八周只是询问，没有接受、出发或替我取消。
许见微 · 消息｜原址收尾按原安排。我的业务决定自己给，需要新增的工作另核时间。
旁白｜我把昨夜与今早实际做过的部分留好：四本仍隔离，干燥册有真实数量，所选展示的完成或暂缓也各有记录。林岚休息、林晚说明会、周栀与叶澄的协助都有自己的名字。
旁白｜私人批注仍只留给原来的两个人，原信与影像的公开范围没有扩张。二十八号与陆遥核入口、二十九号送站、三十号原址关灯还在之后，不提前记成今天已发生。
  `, 'xu_nine_complete', variation('xu9Outcome', {
    together: '旁白｜我们仍愿意作为女朋友继续。能说需要，也能听见有限答复；一页是否补齐、今晚是否牵手，都没有替双方说出那个愿意。',
    reopen: '旁白｜今天获得了继续相处或再谈的真实意愿。原来暂停的人仍未恢复约会，原来了解的人也没有自动成为恋人。下一次关系答复，需要下一次真正的相处。',
    paused: '旁白｜今天还停在私人暂停。已做完的工作、澄清和自己的交件不会因此被抹去，未回应的也不拿一次合作盖住。以后能否再谈，仍从具体行动与新的同意开始。'
  }));

  const data = { chapterId: 'xu9', scenes, gates };
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.RainChapterNineXu = data;
})(typeof window !== 'undefined' ? window : globalThis);
