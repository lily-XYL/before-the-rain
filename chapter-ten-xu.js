(function (root) {
  'use strict';
  const scenes = [], gates = [];
  const script = text => text.trim().split('\n').map(line => {
    const i = line.indexOf('｜');
    if (i < 1) throw new Error('许见微第十章对白缺少说话人物。');
    return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
  });
  const add = (id, title, location, time, cast, text, next, extra = {}) => scenes.push({ id, title, location, time, cast, lines: script(text), next, ...extra });
  const variation = (variantBy, variants) => ({ variantBy, variants: Object.fromEntries(Object.entries(variants).map(([key, text]) => [key, script(text)])) });
  const gate = (id, redirectBy, targets) => gates.push({ id, redirectBy, targets });
  const pair = id => ['shen_zhixia', id], xu = pair('xu_jianwei'), self = ['shen_zhixia'];

  add('x10_start', 'X10-01 · 剩下的日子还有自己的日期', 'bookshop', '六月二十五日 · 15:00', pair('lin_lan'), `
旁白｜下午的书店有了一点阳光。林岚站在柜台里侧，给最后几天的安排画了三个不太圆的圈。
林岚｜二十七号下午告别展，二十八号装箱，三十号交钥匙。十九点半休息也在，不因为最后一次就多开一个晚上。
沈知夏｜好。四本受潮仍单列，原信按作者各自答复交还，不悄悄放上墙。
旁白｜窗已修好，纸却有自己的经过。见微刚看过隔离册，四本下沿仍起皱，先留作内部核规格参考，不交付或用于现场。
林岚｜用现在真正能做的东西见大家。不是所有折痕都要熨掉，才准一间店有最后一天。
旁白｜我把那四本的位置写在登记里。补印报价仍只是报价，原印数、费用、到货与抽检都保留，没有为好看添一份未经答应的订单。
  `, 'x10_entry', { flags: { xu10DamagedCopiesExcluded: true, xu10QuarantinedCopies: 4, xu10ReprintOrdered: false, xu10ExtraCost: 0, xu10ExhibitDate: '6-27 afternoon' } });
  add('x10_entry', '关系从实际停下的地方继续', 'bookshop', '六月二十五日 · 15:15', xu, '旁白｜我看过昨天与今天中午真正给出的私人答复。最后一章，也不能把没谈妥的事情直接跳到幸福里。', 'x10_repair_choice', variation('xu9Outcome', {
    together: `许见微｜女朋友今天自己交了材料，想先听她有没有给自己吃一顿午饭。
沈知夏｜吃了。而且不需要你核菜单。
许见微｜那我可以只听她说好不好吃。
旁白｜她笑起来。站台是否牵手、今天展示有没有暂缓，都没有收回两个人愿意继续的答复。`,
    reopen: `旁白｜我们愿意继续相处或再谈，还没有因为一个共同处理的雨夜自动成为恋人。原来暂停的人，仍需要下一次双方的明确回答。
许见微｜剩下这几天，也按实际能给的范围问，不用活动结束前一定得出一个称呼。
旁白｜我点头。今天能站在同一张桌边，不代表私人关系已经走到同一个位置。`,
    paused: `旁白｜私人谈话仍暂停，基础册和活动合作按原范围。她没有答应新约会，我也不把最后几天变成最后一次催她改变答案的理由。
许见微｜工作清单在这里。其他想说的，先准备好再问，不用藏在这一份里。
旁白｜她说完就把笔放下。今天的结束也可以从认真听完开始。`
  }));
  add('x10_repair_choice', '选择一 · 仍欠的回应，怎样落实', 'bookshop', '六月二十五日 · 15:30', self, `
旁白｜旧调整与雨夜的请求都有自己的记录。最后几天若想继续相处，不能只靠一句这次一定不同。
  `, null, { choices: [
    { text: '发具体修改并等确认，也落实自己承担的判断。', flags: { xu10RepairChoice: 'act', xu10OldRepairKept: false, xu10CorrectionSent: false }, next: 'x10_pending_gate' },
    { text: '承认仍未准备好，保留已经确认的范围与暂停。', flags: { xu10RepairChoice: 'hold' }, next: 'x10_repair_hold' }
  ] });
  gate('x10_pending_gate', 'pendingOmittedConversation', { true: 'x10_pending_person', false: 'x10_repair_current' });
  gate('x10_pending_person', 'omittedPerson', { lin: 'x10_repair_lin', xu: 'x10_repair_xu', zhou: 'x10_repair_zhou', ye: 'x10_repair_ye' });
  for (const [id, person, name, scope] of [
    ['lin', 'lin_wan', '林晚', '已确认文字与借阅编号，未回信者不写成已同意'],
    ['xu', 'xu_jianwei', '许见微', '原尺寸和折边，不要求重排基础册或追加未答应的页面'],
    ['zhou', 'zhou_zhi', '周栀', '原音频长度与接口，不追加串场'],
    ['ye', 'ye_cheng', '叶澄', '原设备说明，不扩大私人影像的记录和播放']
  ]) add('x10_repair_' + id, '真实版本，最后也要收到真实确认', 'bookshop', '六月二十五日 · 15:40–16:10', pair(person), `
沈知夏 · 消息｜具体调整发给你：${scope}。只看标出的这一项，尚未确认的继续不用。
旁白｜她指出仍没写清的一处，我补完再发，等到新版本得到可以的答复才记完成。
${name} · 消息｜现在这项可以，其他按原范围。以前未做的那次不改日期。
沈知夏 · 消息｜收到。今天只清这一项。
旁白｜对她的工作回应有了真实结尾，不需要再附一个私人关系必须变好的证明。
  `, 'x10_repair_current', { flags: { pendingOmittedConversation: false, repairStarted: true, omittedContribution: 'confirmedPartOnly', xu10OldRepairKept: true } });
  add('x10_repair_current', '把自己的判断写到自己的名字下面', 'bookshop', '六月二十五日 · 16:15', xu, `
沈知夏｜作品说明已经由我自己交。下月看房我先核租期，不发一整张生活清单请你定。展示待办也写清自己能做的量。
许见微｜我能看具体的一项，但不担任你全部生活的正确答案。我自己也会先问，不顺手全接。
旁白｜我们当面核这份安排。我撤掉一列请见微定，把自己的选择理由写清；未完成的展示仍等二十六号实际做，不提前签完。
沈知夏｜以前越过你的业务决定、或者隐下自己的负担，已经说清的保留原日期，没有完成的今天分别承担。
  `, 'x10_hidden_gate');
  gate('x10_hidden_gate', 'xu8SampleHidden', { true: 'x10_hidden_eight_gate', false: 'x10_old_mail_gate' });
  gate('x10_hidden_eight_gate', 'xu8HiddenBurdenAcknowledged', { true: 'x10_old_mail_gate', false: 'x10_hidden_nine_gate' });
  gate('x10_hidden_nine_gate', 'xu9HiddenBurdenAcknowledged', { true: 'x10_old_mail_gate', false: 'x10_hidden_admit' });
  add('x10_hidden_admit', '隐下的工作量，今天实际说清', 'bookshop', '六月二十五日 · 16:18', xu, `
沈知夏｜二十二号我说简单核一下，其实多检查了两本，十一点十分结束，十一点二十才开始自己的改稿。那份负担我之前没有说清，今天实际告诉你。
许见微｜现在听清了。下次想求助先说自己能做的量，别把自己的时间用尽，再等我替你补齐。
旁白｜我将额外检查与自己的开工时间写清，没有代她签字。今天的新回应有今天的日期，过去未说过的仍不回填。
  `, 'x10_old_mail_gate', { flags: { xu10HiddenBurdenAcknowledged: true } });
  gate('x10_old_mail_gate', 'xu8InterferenceMade', { true: 'x10_ninth_mail_gate', false: 'x10_repair_reply' });
  gate('x10_ninth_mail_gate', 'xu8CorrectionSent', { true: 'x10_repair_reply', false: 'x10_latest_mail_gate' });
  gate('x10_latest_mail_gate', 'xu9CorrectionSent', { true: 'x10_repair_reply', false: 'x10_old_mail_correct' });
  add('x10_old_mail_correct', '自己的错误邮件，今天才完成更正', 'bookshop', '六月二十五日 · 16:20', self, `
旁白｜我用自己的邮箱发送澄清：此前代见微拒绝合作未获授权，不代表她，请以她本人回复为准。她早已独立答复，不需要等我的更正才拥有自己的决定。
沈知夏 · 消息｜自己那封邮件的责任今天承担。我不索要业务资料，也不拿澄清要求你立刻恢复约会。
许见微 · 消息｜收到。具体改变看见了，私人怎样继续仍需另谈。
旁白｜我留下实际发送的日期，没有补到二十三号或二十四号。
  `, 'x10_repair_reply', { flags: { xu10CorrectionSent: true, xu10CorrectionSentAt: '6-25 16:20' } });
  add('x10_repair_reply', '她看过以后，仍有自己的答复', 'bookshop', '六月二十五日 · 16:30', xu, `
许见微｜愿意继续听。你给自己的判断留位置，我也能说自己真正想要什么。
沈知夏｜以后需要意见时，我会说哪一项，也会接受你没有答案。
旁白｜她点头。此前暂停的人只得到愿意继续谈，没有在今天工作核完以后自动获得女朋友称呼。
  `, 'x10_entry_ready', { flags: { xu10ResponseGiven: true } });
  add('x10_entry_ready', '今天可以再问，尚未预先答应全部未来', 'bookshop', '六月二十五日 · 16:35', self, `
旁白｜具体修改与当前安排已有实际回应。下一次私人意愿仍要另问，不把她愿意听当成一张已经签好的未来。
  `, 'x10_finish_work', { flags: { xu10EntryReady: true } });
  add('x10_repair_hold', '最后几天也不把未做改成做过', 'bookshop', '六月二十五日 · 16:00', xu, `
沈知夏｜今天仍没有准备好新的行动。已确认范围继续，私人按真正得到的答复，不靠活动快结束就跳过还欠着的事。
许见微｜知道了。我的业务自己答复，展示新增协助另问，不默认我接下。
旁白｜已经谈妥的相处保留；仍暂停的没有得到新的同意。欠其他伙伴的工作也没有因我今天想靠近谁而消失。
  `, 'x10_hold_gate', { flags: { xu10OldRepairKept: false, xu10ResponseGiven: false, xu10CorrectionSent: false } });
  gate('x10_hold_gate', 'xu9Outcome', { together: 'x10_hold_ready', reopen: 'x10_hold_ready', paused: 'x10_hold_closed' });
  add('x10_hold_ready', '已得到的愿意，仍按原范围', 'bookshop', '六月二十五日 · 16:10', self, '旁白｜原来已愿意继续相处或再谈，那份答复仍在。今天没有新增保证，既有的具体行动也不被抹去。', 'x10_finish_work', { flags: { xu10EntryReady: true } });
  add('x10_hold_closed', '未回应的暂停，仍留在原处', 'bookshop', '六月二十五日 · 16:10', self, '旁白｜私人暂停的原因没有实际回应，今天仍没有新约会或私人见面的同意。', 'x10_finish_work', { flags: { xu10EntryReady: false } });
  add('x10_finish_work', 'X10-02 · 二十六号，完成能给出的版本', 'bookshop', '六月二十六日 · 10:00–11:00', xu, `
旁白｜二十六号，我们按新问过的有限时段完成展示待办。昨夜已核过的八本保留，仍欠两本页码的，今天对确认件逐项核清再签。
许见微｜只核原规格到十点二十。后面的出处你自己比，不把我在这里改成全部做完。
沈知夏｜好。今天要用的四页或八页，我对原确认件核清，不新增作者没有答应的用途。
旁白｜十一点，编号页码与所选展示都真正完成。四本受潮仍不能交付，干燥可用数量仍是五十六或三十六；原二十四页不改，四十八元报价没有成为订单。
  `, 'x10_display_gate', { flags: { xu10InventoryDone: true, xu10DisplayReady: true, xu10DisplayReadyAt: '6-26 11:00' } });
  gate('x10_display_gate', 'xu9DisplayPlan', { reduce: 'x10_display_reduce', manual: 'x10_display_manual', restore: 'x10_display_restore' });
  for (const [id, pages, detail] of [
    ['reduce', 4, '四页已获准片段与出处核清，余下版面留空。没展出的文字仍在基础册，缩小不等于替作者撤回。'],
    ['manual', 4, '四张手工卡誊好原句，核作者与出处，注明现场副本用途。现有纸材完成，无新增支出。'],
    ['restore', 8, '六页与另两页按原文件核完，八页展示现在可用。完成的是展示，不是四本隔离册已经恢复，也不是已向印厂补下订单。']
  ]) add('x10_display_' + id, '原选择有真实的完成版本', 'bookshop', '六月二十六日 · 11:10', self, `
旁白｜${detail}
旁白｜我将具体版本发给伙伴，作者原信仍按各自答复交还。新现场留存另放一本小簿，不把空白页偷偷插进已印好的基础册。
旁白｜来访者若愿意写，先问是否同意在现场小簿留存，不愿意的可以带走。今天还没举办活动，也没有提前写出人们会留下怎样的话。
  `, 'x10_business', { flags: { xu10DisplayPages: pages } });
  add('x10_business', '四点二十，她自己发出业务答复', 'studio', '六月二十六日 · 16:20', xu, `
许见微｜条件核过了。我决定接受八月一日起八周的驻外合作，九月二十五号结束。范围与报酬已由我自己谈清，现有收尾照原时间。
旁白｜她亲自发出答复，早于原五点期限。不是我替她决定，也不是为了证明谁更独立才接受；她确实想做那份设计，也给自己留了能休息的安排。
沈知夏｜那你会离开临江一段时间。
许见微｜是。想听你的真实期待，不要你先保证一定没事。我也不会因为喜欢，就要求你放下自己的工作跟着走。
旁白｜我把八周与自己的新工作放到同一张日历上。未来第一次没有被藏在某个总会知道答案的人身后。
  `, 'x10_future_choice', { flags: { xu10CooperationAccepted: true, xu10CooperationReplySentAt: '6-26 16:20', xu10CooperationStart: '8-01', xu10CooperationEnd: '9-25', xu10CooperationDurationWeeks: 8, xu10BusinessDecisionByXu: true } });
  add('x10_future_choice', '选择二 · 有距离以后，怎样表达期待', 'studio', '六月二十六日 · 16:30', xu, `
旁白｜我可以不舍，也可以提出需要。她已经作出的本人决定，不该再次变成只有取消才算喜欢。
  `, null, { choices: [
    { text: '尊重她的决定，摊开自己的工作与见面期待。', flags: { xu10FutureChoice: 'respect' }, next: 'x10_future_respect' },
    { text: '希望她取消驻外，觉得留下才说明我们值得继续。', flags: { xu10FutureChoice: 'cancel' }, next: 'x10_future_cancel' }
  ] });
  add('x10_future_respect', '想念与决定，不必互相取代', 'studio', '六月二十六日 · 16:35', xu, `
沈知夏｜我不想假装不会难过，也想开始自己的工作。期待能见面，忙的时候先说明；不是请你取消，也不先请你替我决定这八周怎么生活。
许见微｜我愿意谈真实的联系。先看双方能给的量，变了再改，不拿一张日历要求每一格都有人陪。
旁白｜我们各写自己的工作时段。她没有给我一份总能依靠她的保证，我也没有把不舍交成一张需要她用留下来支付的账。
  `, 'x10_mode_gate', { flags: { xu10DecisionRespected: true } });
  add('x10_future_cancel', '她没有收回自己的决定', 'studio', '六月二十六日 · 16:35', xu, `
沈知夏｜如果真的想继续，不能取消这次吗？我总觉得你留下，我才知道自己是重要的。
许见微｜不会取消。你可以说害怕距离，不能把我的职业决定当成只要留下才正确的证明。
旁白｜她说得很清楚，没有把一次接受合作改成又由我决定。工作收尾按原范围，私人约会先停。
许见微｜之后如果期待始终不同，也可以不继续。不是我必须给一个总让你安心的答案。
旁白｜我听见了这句话。今天的期待仍未谈妥，不会因为最后一天再说想继续，就自动得到不同的回答。
  `, 'x10_mode_paused', { flags: { xu10DecisionRespected: false } });
  gate('x10_mode_gate', 'xu10EntryReady', { true: 'x10_mode_prior', false: 'x10_mode_paused' });
  gate('x10_mode_prior', 'xu9Outcome', { together: 'x10_mode_couple', reopen: 'x10_mode_learning', paused: 'x10_mode_learning' });
  add('x10_mode_couple', '愿意继续，今晚也仍需另问', 'studio', '六月二十六日 · 16:45', xu, `
许见微｜仍愿意作为女朋友继续。二十七号收尾后想和你吃一顿不看稿的晚饭，你愿意吗？
沈知夏｜愿意。六点半，面馆，吃过以后怎样再分别问。
旁白｜她答应。我记下这顿双方新确认的饭，没有替之后的夜晚先作答。
  `, 'x10_privacy_choice', { flags: { xu10PrivateMode: 'couple', relationshipStatus: 'girlfriends', xu10DinnerBooked: '6-27 18:30' } });
  add('x10_mode_learning', '可以继续认识，不先借用恋人称呼', 'studio', '六月二十六日 · 16:45', xu, `
沈知夏｜我仍想继续了解你。二十七号收尾以后，能留一点不看稿的时间吗？不先请你用女朋友称呼回答。
许见微｜愿意留十分钟。六点半在街口，之后怎么继续，我们最后再分别说。
旁白｜这次答应的是私人谈话，不是留宿或者确认恋人。此前暂停者也只从这次新的愿意开始，没有把之前回写成已经恢复。
  `, 'x10_privacy_choice', { flags: { xu10PrivateMode: 'learning', xu10TalkBooked: '6-27 18:30-18:40' } });
  add('x10_mode_paused', '活动合作不替私人意愿作答', 'studio', '六月二十六日 · 16:45', xu, `
许见微｜二十七号工作照原安排。我今天不约私人晚饭或之后的见面。
沈知夏｜知道了。收尾按已确认范围，不追加一个最后一次陪我的要求。
旁白｜我把她的答复留下。业务决定依然有效，私人暂停也没有因为告别展即将举办就被绕开。
  `, 'x10_privacy_choice', { flags: { xu10PrivateMode: 'paused', relationshipStatus: 'needsConversation' } });
  add('x10_privacy_choice', '选择三 · 哪一页给来访者看', 'studio', '六月二十六日 · 17:00', xu, `
旁白｜现场小簿与已印基础册分开。共同工作寄语可以另写，私人批注则要另问她的意愿，不因大家都在就公开。
  `, null, { choices: [
    { text: '只留一张空白页，不公开我们的私人文字。', flags: { xu10PrivacyChoice: 'blank' }, next: 'x10_blank' },
    { text: '一起写一句关于这次工作的寄语，给她确认再用。', flags: { xu10PrivacyChoice: 'work' }, next: 'x10_work_note' },
    { text: '先问她是否愿意节选私人批注，接受不同答复。', flags: { xu10PrivacyChoice: 'private' }, next: 'x10_private_note_gate' }
  ] });
  add('x10_blank', '空白也能是一个共同确认的版本', 'studio', '六月二十六日 · 17:05', xu, `
沈知夏｜这一页先空着。私人批注仍按原收件范围，不需要让别人看见才说明它值得保存。
许见微｜我也愿意这样。空白留给来访者自己的选择，不替他们预先写一句应该怎样告别。
旁白｜我们确认只有现场小簿留这一页，基础册二十四页不变。没有公布关系，也没有展示私人原信或影像。
  `, 'x10_lu_boxes', { flags: { xu10PrivateExcerptApproved: false, xu10WorkNoteApproved: false } });
  add('x10_work_note', '寄语也有共同署名的那一句', 'studio', '六月二十六日 · 17:05', xu, `
沈知夏｜想写这一页不必独自完成，说的是这次每个人都按自己的量参与。可以署工作伙伴的名字吗？
许见微｜我的这一句同意。其他人各问，不写成他们已经都答应。关系不放进去，寄语只说这次工作。
旁白｜我将这句放到另置的现场小簿，给她看过原文才记确认。林晚、周栀与叶澄后来各看自己的署名范围，未同意的新话没有代写。
旁白｜一段工作寄语也能完整，不需要替两个人的私人未来作宣传。
  `, 'x10_lu_boxes', { flags: { xu10PrivateExcerptApproved: false, xu10WorkNoteApproved: true } });
  gate('x10_private_note_gate', 'xu7PrivateNoteShared', { true: 'x10_private_note_mode', false: 'x10_private_note_missing' });
  gate('x10_private_note_mode', 'xu10PrivateMode', { couple: 'x10_private_note_yes', learning: 'x10_private_note_no', paused: 'x10_private_note_no' });
  add('x10_private_note_yes', '只节选双方都愿意给出的那一点', 'studio', '六月二十六日 · 17:05', xu, `
沈知夏｜你画过的那只小猫和纸样批注，愿意节选小猫放现场小簿吗？原话与私人经历不放进去，也不写关系。
许见微｜只用那只猫，我愿意。旁边写你选的留白两个字可以，先让我看最终这一页。
旁白｜我给她看过节选页，她确认这个版本。我也确认愿意展示自己的两个字；原批注仍留在我的本子里，授权只到这张现场节选。
旁白｜二十一号没有公开过的事实仍保留。今天得到新的具体同意，二十七号实际摆出后才记使用。
  `, 'x10_lu_boxes', { flags: { xu10PrivateExcerptApproved: true, xu10WorkNoteApproved: false } });
  add('x10_private_note_no', '她不同意节选，也有完整答复', 'studio', '六月二十六日 · 17:05', xu, `
沈知夏｜之前那张批注，你愿意节选一点放现场吗？不愿意也照原范围留着。
许见微｜今天不愿意。私人相处还在认识或暂停，不想把那一页放到活动里。
沈知夏｜好，现场只留空白，不用工作文字替私人同意。
旁白｜我收起自己的本子。她的不同意没有成为公开关系就能变好的新题，也没有改变已经确认的展示方案。
  `, 'x10_lu_boxes', { flags: { xu10PrivateExcerptApproved: false, xu10WorkNoteApproved: false } });
  add('x10_private_note_missing', '以前没有给过的，不索取一个补发版本', 'studio', '六月二十六日 · 17:05', xu, `
旁白｜之前只有限定工作谈话，见微没有分享私人批注。今天不能拿别的分支里可能有的一只小猫，假装自己的本子里也收到过。
沈知夏｜没有要拿出来的私人页，那就留空白。今天不为展览索取一份新的私密文字。
许见微｜好。现有工作版本按原范围，私人材料不补发。
  `, 'x10_lu_boxes', { flags: { xu10PrivateExcerptApproved: false, xu10WorkNoteApproved: false } });
  add('x10_lu_boxes', '六点，陆遥的箱子也真的搬了', 'dorm', '六月二十六日 · 18:00', pair('lu_yao'), `
旁白｜回宿舍后，我按之前约的收尾时段和陆遥一起把两只箱子搬到待取位置。她扶住转角，我抬起另一边，没有只在日程里写会帮。
陆遥｜谢谢。二十八号核入口以后，这两个先交搬运，二十九号只带随身箱。
沈知夏｜那我终于不用想着在车站一次抱三只。
陆遥｜也没有人请你这样。我有时怀疑你对我的箱子比对我更有承诺感。
旁白｜我笑着说会改，把实际搬完的两只写进清单，仍不提前记她已经出发。
  `, 'x10_role_choice', { flags: { xu10LuBoxesMoved: true, xu10LuBoxesMovedAt: '6-26 18:00' } });
  add('x10_role_choice', '选择四 · 活动里自己的位置', 'farewell_exhibit', '六月二十七日 · 14:00', ['shen_zhixia', 'xu_jianwei', 'lin_wan', 'zhou_zhi', 'ye_cheng'], `
旁白｜下午，展示按已核版本摆好，可用册与隔离实物分开。伙伴们各有原定角色，我也需要选一项自己真实能做的，不把岗位当成私人关系的证明。
  `, null, { choices: [
    { text: '负责来访接待，说明册子与现场留存的范围。', flags: { xu10ExhibitRole: 'receive' }, next: 'x10_role_receive' },
    { text: '负责布置和登记，接待由已答应的伙伴承担。', flags: { xu10ExhibitRole: 'setup' }, next: 'x10_role_setup' }
  ] });
  add('x10_role_receive', '门口，一句可以被真正听懂的欢迎', 'farewell_exhibit', '六月二十七日 · 15:00', self, `
旁白｜来访者进门，我说明哪些册子可领取、哪些现场页只是展示。有人想拍整张桌子，我先指明不包含作者原信与未获准的私人材料。
沈知夏｜小簿这页可以写，也可以空着。愿意现场留存的话先说，不然写好带走也可以。
旁白｜她笑着坐下。我没有急着替一张空白页寻找最感人的句子，而是让她自己开始。
  `, 'x10_exhibit', { flags: { xu10RoleKept: true } });
  add('x10_role_setup', '柜台里，登记自己的那一项', 'farewell_exhibit', '六月二十七日 · 15:00', self, `
旁白｜我守着可用数量与去向登记，林晚按原范围接待，周栀照已答应的音频长度协助。叶澄只处理确认过的设备，不扩大私人片段。
沈知夏｜这份已领，另一份只是现场翻阅，原信不留在这里。
旁白｜见微过来核她负责的折边，我把自己负责的表收好，没有把她在场理解成自己可以不再判断。
  `, 'x10_exhibit', { flags: { xu10RoleKept: true } });
  add('x10_exhibit', 'X10-03 · 告别展真实发生', 'farewell_exhibit', '六月二十七日 · 15:30–17:30', ['shen_zhixia', 'lin_lan', 'xu_jianwei', 'chen_xuning'], `
旁白｜告别展按期发生。展示是自己选择并核好的四页、四张手工卡或八页；现场没有偷偷变厚，也没有借最后一次恢复删去的节目。
旁白｜有人在小簿留一行，有人只看过再走。没有人必须把自己的告别讲成一个适合被收藏的故事，未同意留存的纸也确实带走。
林岚｜以前开店，总觉得还可以再摆一点。现在看见留白，也觉得这间屋子没有少掉今天来的人。
沈知夏｜这次不是只有一个人做完的。
许见微｜也不是一个人替大家决定了怎样才算做完。
旁白｜她看了我一眼。我们继续做各自的工作，没有用一段私人相处覆盖屋里所有人的名字。
  `, 'x10_exhibit_note_gate', { flags: { xu10ExhibitHeld: true, xu10ExhibitHeldAt: '6-27 15:30-17:30' } });
  gate('x10_exhibit_note_gate', 'xu10PrivateExcerptApproved', { true: 'x10_excerpt_shown', false: 'x10_excerpt_not_shown' });
  add('x10_excerpt_shown', '摆出的是新确认的节选', 'farewell_exhibit', '六月二十七日 · 17:35', xu, `
旁白｜那只小猫与留白两个字按昨天双方确认的节选页摆在现场小簿旁。原私人批注、过去经历与我们的关系没有被写进说明。
许见微｜这一点是我们都答应的，不是以后全部都可以给别人看。
沈知夏｜知道。原本仍留在自己那里。
旁白｜我把今日实际使用记下，没有把它补成二十一号就已经公开。
  `, 'x10_cleanup', { flags: { xu10PrivateExcerptPublished: true } });
  add('x10_excerpt_not_shown', '没有公开的仍按原范围', 'farewell_exhibit', '六月二十七日 · 17:35', xu, `
旁白｜现场没有私人批注节选。空白或已确认的工作寄语照原选择使用，私人本子仍收好，关系没有被活动说明公开。
许见微｜今天的版本这样就完整。
旁白｜我点头，没有因为别人看不见，就觉得我们真正谈过的话也变得轻一些。
  `, 'x10_cleanup', { flags: { xu10PrivateExcerptPublished: false } });
  add('x10_cleanup', '结束以后，也按原安排停', 'farewell_exhibit', '六月二十七日 · 18:00', ['shen_zhixia', 'lin_lan', 'xu_jianwei', 'chen_xuning'], `
旁白｜我们把借出的实物与留存按确认件归好，作者原信按各自约定交还，尚未到场领取的封袋另约，不擅自展示。
林岚｜十九点半我就休息。最后一次也不是今晚必须有人留到最后一张桌子擦完。
沈知夏｜我们按量收，明天继续装箱，不把工作塞进你的休息。
旁白｜她笑着离开柜台。见微收起自己的铅笔盒，今天不再向我的那一份伸手。
  `, 'x10_evening_gate', { flags: { xu10OriginalsReturnArranged: true, xu10OwnerRestKept: true, xu10RelationshipPublic: false } });
  gate('x10_evening_gate', 'xu10PrivateMode', { couple: 'x10_dinner', learning: 'x10_learning_meet', paused: 'x10_paused_choice' });
  add('x10_dinner', '六点半，不看稿的晚饭', 'noodle_shop', '六月二十七日 · 18:30–19:10', xu, `
旁白｜我们按昨天的约定吃晚饭。她选了自己想吃的汤，我也没有再把碗交给更懂的人决定。桌上不放稿件，手机只为看回程时间亮了一次。
许见微｜今天想邀请你到我家坐一会儿。不是继续核表，是真的想和你多待一点。
沈知夏｜你已经知道不需要给这个邀请加一个工作理由了。
许见微｜还在练习。所以现在直接问，愿不愿意。
旁白｜她看着我，不先保证整晚都不会累。我也知道可以回答自己的节奏，女朋友这个称呼没有把所有靠近预先同意。
  `, 'x10_couple_choice', { flags: { xu10DinnerKept: true } });
  add('x10_couple_choice', '选择五 · 今晚留多少私人时间', 'noodle_shop', '六月二十七日 · 19:15', xu, `
旁白｜晚饭真实发生，之后仍有新的选择。多留一会儿、只到这里或改天，都不收回两个人的关系答复。
  `, null, { choices: [
    { text: '想留宿，先问她今晚是否也愿意。', flags: { xu10EveningChoice: 'overnight' }, next: 'x10_overnight_agree' },
    { text: '今晚只吃晚饭，各自回去，明早再通话。', flags: { xu10EveningChoice: 'dinner' }, next: 'x10_dinner_part' },
    { text: '今晚先休息，之后再约一段普通的见面。', flags: { xu10EveningChoice: 'later' }, next: 'x10_couple_later' }
  ] });
  add('x10_overnight_agree', '两个人都说愿意，才向家走', 'old_street', '六月二十七日 · 19:20', xu, `
沈知夏｜今晚想留宿。你愿意吗？不把留下理解成之后什么都已经答应。
许见微｜愿意。先回去坐一会儿，每一步都可以另外说，困了就休息。
旁白｜她给出自己的同意，我才和她一起走。二十八号装箱与晚饭照原安排，留宿没有替明天把时间全占完。
  `, 'x10_home', { flags: { xu10OvernightAgreed: true } });
  add('x10_home', '家里，没有等着批注的稿件', 'xu_home', '六月二十七日 · 19:40', xu, `
旁白｜见微的家比工作室安静。沙发上叠着一条毯子，茶几的一角有她看到一半的书，没有等着我回答的红夹子。
许见微｜想喝茶还是水？
沈知夏｜水。今天我已经决定过两碗面，现在能独立决定一杯水。
旁白｜她笑起来，把杯子放到我面前。我也看见她需要在家慢慢走一会儿，才能从被很多人问怎么办的那一天退出来。
沈知夏｜现在想我坐近一点吗？
许见微｜想。但你也说自己的愿意。
旁白｜我说愿意，才坐过去。她没有端着总能照顾好的表情，我也不需要只做一个等待被安置的人。
  `, 'x10_private_night');
  add('x10_private_night', '夜里，愿意也可以继续问', 'xu_home', '六月二十七日 · 22:00', xu, `
旁白｜后来，她问能不能吻我，我答应，也问她是否愿意被我拥抱。每一次靠近都有两个人的声音，没有把一个同意拿去替后面所有时刻签名。
许见微｜如果累了，我们就停。今天不需要完成什么。
沈知夏｜知道。我也会问，不一直等你替我安排。
旁白｜她额头轻轻抵过来，我闭上眼睛。灯暗下去，剩下的私人时光留在两个人都愿意的夜里。
旁白｜睡前我们把明早的时间核好，工作文件没有再打开。亲密没有替八周驻外与各自交件给出答案，却真实让今天有了一段只属于我们自己的靠近。
  `, 'x10_breakfast', { flags: { xu10OvernightKept: true, xu10EveningMet: true, xu10Kissed: true } });
  add('x10_breakfast', '第二天早饭，仍能讲自己的感受', 'xu_home', '六月二十八日 · 08:30', xu, `
旁白｜早饭时，见微把两只杯子放得太近，碰出很轻的一声。她先问我昨晚睡得怎样，不把醒来在同一间屋子当成已经不必再问。
沈知夏｜高兴，也有一点紧张。想继续靠近，但不想以后只有留宿才觉得被想念。
许见微｜我也是。想见面就问，普通晚饭也完整。我也可以说累，不要一定等你先看出来。
旁白｜我点头，自己把盘子端到水池。她没有替我做完全部，我也没把主动洗一次盘子当成以后照顾都归我。
旁白｜吃完我们分别去准备十一点装箱。昨晚发生过，今天的安排也仍能真实发生。
  `, 'x10_pack', { flags: { xu10MorningContactKept: true, xu10MorningContactKind: 'breakfast' } });
  add('x10_dinner_part', '只到晚饭，也得到完整答复', 'old_street', '六月二十七日 · 19:20', xu, `
沈知夏｜今晚只吃晚饭，先各自回去。明早九点能通话十分钟吗？不是看稿，想讲今天普通的一点事。
许见微｜愿意。今晚休息，九点到九点十分。
旁白｜我们分别，没有一起回她家，没有留宿或接吻。那顿不看稿的饭真实发生，作为女朋友愿意继续也没有因此失效。
  `, 'x10_couple_phone', { flags: { xu10OvernightAgreed: false, xu10OvernightKept: false, xu10EveningMet: true, xu10Kissed: false } });
  add('x10_couple_later', '今晚休息，明早的话另外约', 'old_street', '六月二十七日 · 19:20', xu, `
沈知夏｜今晚先休息。后来想再见也直接问，明早九点能先通话十分钟吗？
许见微｜愿意。今晚不用一直回复来证明今天说过的话，明早九点再听。
旁白｜晚饭已吃过，之后没有额外见面或身体接触。我回宿舍，她回自己的家，今天不是因为多留几个小时才值得记住。
  `, 'x10_couple_phone', { flags: { xu10OvernightAgreed: false, xu10OvernightKept: false, xu10EveningMet: true, xu10Kissed: false } });
  add('x10_couple_phone', '九点的电话，从昨天真正答应的开始', 'dorm', '六月二十八日 · 09:00–09:10', self, `
旁白｜九点电话接通。她讲早餐把面包烤得太脆，我讲陆遥差点把今天晚饭的勺子装箱。我们都笑了一会儿。
沈知夏｜昨晚没有多留，但高兴你直接问我愿不愿意。以后想见也这样问吧。
许见微 · 电话｜好。你不多留也没有少一点自己的答复，我也不用拿忙得值得帮助才来找你。
旁白｜九点十分结束通话，各自准备十一点装箱。没有留宿的早晨也有一段真正发生的私人回应。
  `, 'x10_pack', { flags: { xu10MorningContactKept: true, xu10MorningContactKind: 'phone' } });
  add('x10_learning_meet', '六点半，限定谈话按约发生', 'old_street', '六月二十七日 · 18:30', xu, `
旁白｜我们按昨天答应的时间在街口见面。见微放下工作包，先说今天想谈彼此的期待，不继续核表。
许见微｜我想慢慢认识你，但不成为只负责指导的人。也不急着把今天十分钟叫成已经确定的恋人相处。
沈知夏｜我想听你的需要，也把自己的说完整。还不知道怎样继续，不拿你的经验替我跳过。
旁白｜她点头。今天的私人时间有自己的同意，没有邀请去住处或留宿，也没有身体接触。
  `, 'x10_learning_choice', { flags: { xu10DinnerKept: false } });
  add('x10_learning_choice', '选择五 · 把有限的谈话说完整', 'old_street', '六月二十七日 · 18:32', xu, `
旁白｜今天只有六点半到六点四十。接下来的节奏不需要越过那一段已经说好的范围。
  `, null, { choices: [
    { text: '听她现在希望怎样被陪伴，不替她预设答案。', flags: { xu10EveningChoice: 'listen' }, next: 'x10_learning_listen' },
    { text: '讲自己的新工作与不舍，先不求一个保证。', flags: { xu10EveningChoice: 'voice' }, next: 'x10_learning_voice' },
    { text: '今天先分别休息，明早只确认已答应的工作。', flags: { xu10EveningChoice: 'rest' }, next: 'x10_learning_rest' }
  ] });
  add('x10_learning_listen', '陪伴也可以是一个具体请求', 'old_street', '六月二十七日 · 18:35–18:40', xu, `
许见微｜我希望不只有难题才找你。想讲普通的一天，问能不能陪我走一下；你没空也可以说，我不因此把自己做得更有用。
沈知夏｜我愿意听这个请求，也会说自己真实有没有空。不把愿意继续认识听成需要全部接住。
旁白｜六点四十到了。我们分别，另外约明早九点的一条工作确认消息；私人关系仍待之后双方正式回答。
  `, 'x10_learning_message', { flags: { xu10EveningMet: true, xu10OvernightAgreed: false, xu10OvernightKept: false, xu10Kissed: false } });
  add('x10_learning_voice', '不舍也由自己说，不借她决定全部', 'old_street', '六月二十七日 · 18:35–18:40', xu, `
沈知夏｜我想开始自己的工作，也会想见你。有点怕距离，但不想让你用取消出发替我证明不会被留下。
许见微｜我听见了。以后能怎样联系还要具体算，也需要我愿意，不是你现在说得很好就全部同意。
旁白｜我点头。六点四十结束，明早九点只约一条工作确认，私人关系没有借这句话直接命名。
  `, 'x10_learning_message', { flags: { xu10EveningMet: true, xu10OvernightAgreed: false, xu10OvernightKept: false, xu10Kissed: false } });
  add('x10_learning_rest', '有限时间，也能在这里停', 'old_street', '六月二十七日 · 18:35–18:40', xu, `
沈知夏｜今天先到这里。明早九点只确认已答应的装箱位置，私人怎样继续三十号再分别说。
许见微｜可以。休息也不要求今天刚问过的话立刻有另一个答案。
旁白｜六点四十我们分别。有限谈话已发生，没有进一步接触，也没有在知道她住处以后自行把后面写成留宿。
  `, 'x10_learning_message', { flags: { xu10EveningMet: true, xu10OvernightAgreed: false, xu10OvernightKept: false, xu10Kissed: false } });
  add('x10_learning_message', '明早是一条工作确认，不改成约会', 'dorm', '六月二十八日 · 09:00', self, `
沈知夏 · 消息｜今天十一点装箱，隔离册与展示材料分开。自己负责的登记照原范围。
许见微 · 消息｜收到，按这个位置。
旁白｜约过的工作确认实际完成，没有私人电话、早餐或留宿。昨天愿意谈过十分钟，仍不替今天所有时刻签名。
  `, 'x10_pack', { flags: { xu10MorningContactKept: true, xu10MorningContactKind: 'workMessage' } });
  add('x10_paused_choice', '选择五 · 没有私人邀请的今晚', 'dorm', '六月二十七日 · 19:00', self, `
旁白｜今天合作已经结束，她没有答应私人晚饭或见面。我可以选择怎样照顾自己的失落，不再用最后一次给对方施压。
  `, null, { choices: [
    { text: '按她给出的范围，自己的晚饭与待办自己安排。', flags: { xu10EveningChoice: 'scope' }, next: 'x10_paused_rest' },
    { text: '把想说的期待写给自己，不发送求她立刻接住。', flags: { xu10EveningChoice: 'write' }, next: 'x10_paused_rest' },
    { text: '今晚先休息，停止追加私人邀约。', flags: { xu10EveningChoice: 'rest' }, next: 'x10_paused_rest' }
  ] });
  add('x10_paused_rest', '今天没有发生的，就不借用别的故事', 'dorm', '六月二十七日 · 21:00', self, `
旁白｜我自己吃了晚饭，没去她家，也没在街口等一段没有答应的私人时间。活动真实结束，私人暂停仍在。
旁白｜明天十一点装箱是已有工作安排，不自动附一通早安电话。想念可以先留在自己这里，不靠一个人变得更好用来解决。
  `, 'x10_pack', { flags: { xu10DinnerKept: false, xu10EveningMet: false, xu10OvernightAgreed: false, xu10OvernightKept: false, xu10Kissed: false, xu10MorningContactKept: false, xu10MorningContactKind: 'none' } });
  add('x10_pack', 'X10-04 · 二十八号，把原址收进箱子', 'farewell_exhibit', '六月二十八日 · 11:00', ['shen_zhixia', 'lin_lan', 'xu_jianwei', 'chen_xuning'], `
旁白｜十一点，大家按原安排装箱。可用册、四本隔离参考册、展示纸材与作者原信分别登记，去向按具体确认件来。
许见微｜这四本不混入交付箱。它们留下受潮的经过，不需要为了结局好看就自动恢复。
沈知夏｜原信封袋按原答复交还，现场小簿只留已同意留存的部分，私人本子我自己收。
旁白｜陈老师核过登记，林岚按量停下，不为大家还想留一点就再开一份没有结束的清单。两个人的私人关系无论怎样，都没有取消别人完成过的工作。
  `, 'x10_lu_dinner', { flags: { xu10PackingKept: true, xu10PackingDate: '6-28 11:00' } });
  add('x10_lu_dinner', '晚饭以后，入口也真的核过', 'dorm', '六月二十八日 · 19:00–20:00', pair('lu_yao'), `
旁白｜晚上和陆遥一起吃饭。她给汤多放了两片菜，说今天先不用讨论谁走了以后会更坚强。
陆遥｜我想听你以后遇到一点好笑的事。不要都攒到已经过得很好才找我。
沈知夏｜我也想你。无论和谁怎样，这一句不是拿来补一个人离开留下的位置。
旁白｜她点头，我们又笑着讲那只不听话的箱轮。八点一起核车站入口、车次与随身证件，二十九号七点五十出门、九点二十出发没有改。
  `, 'x10_depart', { flags: { xu10LuDinnerKept: true, xu10LuEntryChecked: true, xu10LuEntryCheckedAt: '6-28 20:00' } });
  add('x10_depart', '七点五十，真的一起离开宿舍', 'train_station', '六月二十九日 · 08:25', pair('lu_yao'), `
旁白｜七点五十，我们按约出门。八点二十五到车站，箱轮经过地砖接缝的那一点响声，让我忽然很想再走慢一点。
陆遥｜证件在。我也在，不用把送站变成一轮不停确认没忘我的考试。
沈知夏｜知道。只是有一点想把今天多留一会儿。
陆遥｜可以想。等车的时间就先站在这里，不用现在替以后所有日子保证不难过。
旁白｜我把自己的手从箱柄上收下来。她的出发不是需要挽回的损失，也不因我今天怎样谈恋爱就变得更轻。
  `, 'x10_lu_departure');
  add('x10_lu_departure', '九点二十，朋友真正出发', 'train_station', '六月二十九日 · 09:20', pair('lu_yao'), `
旁白｜九点二十到了，陆遥踏进自己的车厢。我们告别，她没有把一段友情还成必须留在临江的承诺。
陆遥｜到新房再给你讲那块墙。颜色我自己选，你只负责告诉我像不像一碗汤。
沈知夏｜好。你路上先吃一点，不用急着回复。
旁白｜车真正开走，我才记下已送她出发。以前失约的日期仍留在原处，这次做到也有自己的重量。
  `, 'x10_lights', { flags: { xu10LuDepartureKept: true, xu10LuDepartureTime: '6-29 09:20' } });
  add('x10_lights', 'X10-05 · 原址最后一次关灯', 'empty_bookshop', '六月三十日 · 10:00', ['shen_zhixia', 'lin_lan', 'chen_xuning', 'xu_jianwei'], `
旁白｜三十号十点，书店搬空。柜台还在，窗扣也在，昨天把箱子搬出去留下的空处，比所有展示都更像这间屋子真正走到今天。
林岚｜不用给我一个以后一定重开的保证。今天结束以后，我想先过没有营业表的日子。
沈知夏｜好。愿意再见的时候，我们到时问，不拿这间店替你决定以后。
旁白｜她关灯，按约交还钥匙。陈老师核最后一项，见微收起自己的工作袋。大家都完成了具体的收尾，没有一个人被要求留下，才能证明过去是真的。
旁白｜我最后看一眼门里，想到那张空白页。不一定要再写满，也可以带着这一段继续走。
  `, 'x10_contact_choice', { flags: { xu10LightsOff: true, xu10KeysReturned: true, xu10ClosureTime: '6-30 10:00' } });
  add('x10_contact_choice', '选择六 · 以后怎样联系', 'old_street', '六月三十日 · 10:30', self, `
旁白｜共同活动已经结束，八周驻外与我的新工作都有自己的日期。愿意继续的人可以提出具体联系；仍暂停的人也只能先整理期待，不把计划写成对方已答应。
  `, null, { choices: [
    { text: '希望确认普通联系与见面安排，忙时提前说明再改。', flags: { xu10ContactChoice: 'plan' }, next: 'x10_contact_mode' },
    { text: '希望先试行有限联系，一段时间后再一起核对期待。', flags: { xu10ContactChoice: 'trial' }, next: 'x10_contact_mode' }
  ] });
  gate('x10_contact_mode', 'xu10PrivateMode', { couple: 'x10_contact_private', learning: 'x10_contact_private', paused: 'x10_contact_closed' });
  add('x10_contact_private', '双方能给的量，都写在联系里', 'old_street', '六月三十日 · 10:35', xu, '旁白｜我将自己的期待说给她，先说明希望听到的是她真正能给的答复。', 'x10_last_choice', variation('xu10ContactChoice', {
    plan: `沈知夏｜想保留每周一次约过时间的通话，平时普通消息不要求即时回。见面看双方休息，改动先说，不把没空解释成不喜欢。
许见微｜我愿意讨论这个量。驻外前再核时差和排期，不能保证每次都一样。我也会直接问想见面，不用工作做理由。
旁白｜已有恋人愿意延续日常，尚在重新认识的则把这一份留作新开始的安排；它们不能被同一张日历抹成相同的经历。`,
    trial: `沈知夏｜想先试行一个月，每周约一次短通话，普通消息不求即时回。月底再分别说怎样，不先答应一张永远不变的计划。
许见微｜愿意试。需要调整就具体说，不用忍到撑不住，才请另一个人全部接下。
旁白｜这是双方愿意的试行，不是只因为没有结束就已经完成全部磨合。`
  }));
  add('x10_contact_closed', '写给自己的日历，不代替她的答复', 'old_street', '六月三十日 · 10:35', self, `
旁白｜我将期待写进自己的本子，没有发送新的私人邀约。她早已说明暂停，旧回应仍未落实或驻外期待仍未谈妥，不会因一张联系计划自动变成愿意。
旁白｜最后能承担的，是听完不同答案、继续自己的生活。工作收尾没有替私人关系签一份一定要继续的合同。
  `, 'x10_last_closed');
  add('x10_last_choice', '选择七 · 最后，由两个人分别回答', 'old_street', '六月三十日 · 10:45', xu, `
许见微｜自己的工作我会去做，怎样相处也有自己的期待。我们都可以说愿意继续，也可以结束，不需要拿最后一页逼一个相同答案。
旁白｜我听见以后，给出自己真正想承担的答复。
  `, null, { choices: [
    { text: '愿意继续，接受各自决定，也听她最后的意愿。', flags: { xu10LastChoice: 'continue' }, next: 'x10_resolve_mode' },
    { text: '决定结束私人关系，保留真实发生过的合作与相处。', flags: { xu10LastChoice: 'end' }, next: 'x10_farewell' }
  ] });
  add('x10_last_closed', '选择七 · 没有获得新的同意时', 'old_street', '六月三十日 · 10:45', self, `
旁白｜她没有给新的继续意愿，今天不再请她因最后一次改一个答案。我仍可以决定怎样带着这个结束往下走。
  `, null, { choices: [
    { text: '接受她的不同意，不把最后的想继续写成双方愿意。', flags: { xu10LastChoice: 'accept' }, next: 'x10_farewell' },
    { text: '也清楚结束私人期待，之后各自开始自己的生活。', flags: { xu10LastChoice: 'end' }, next: 'x10_farewell' }
  ] });
  gate('x10_resolve_mode', 'xu10PrivateMode', { couple: 'x10_resolve_contact', learning: 'x10_ne' });
  gate('x10_resolve_contact', 'xu10ContactChoice', { plan: 'x10_he', trial: 'x10_ne' });
  add('x10_he', '幸福结局 · 与你一起留白', 'old_street', '六月三十日 · 11:00', xu, `
沈知夏｜我愿意作为你的女朋友继续，不让照顾与被需要成为必须一直正确的角色。
许见微｜我也愿意。想念时说想念，需要陪伴就问，你没空也能回答；自己的工作与选择，由自己承担。
旁白｜这份愿意不是留宿换来的，也不是因为展示做得最完整。我们实际问过、接受过有限答复，也仍会犯错，却不用把声音交给另一个人代写。
旁白｜她走向自己的工作室，我回去准备新工作的资料。八周还没开始，关系却已经有一张允许以后继续修改的日历。
  `, 'x10_he_august', { flags: { xu10Outcome: 'he', relationshipStatus: 'girlfriends', xu10MutualContinue: true } });
  add('x10_he_august', '八月，普通的一天也能联系', 'studio_night', '八月 · 约过的一次晚间通话', xu, `
旁白｜八月见微按本人决定开始八周驻外。我也开始自己的出版社工作，两个人没有为了联系把所有私人时间改成随时待命。
许见微 · 电话｜今天累，能只讲五分钟吗？想听你午饭，不想再解释一份版面。
沈知夏｜能。我今天也要早睡，午饭那碗汤值得讲两分钟。
旁白｜她笑起来。一次具体请求得到自己的答复，我们没有因为只讲五分钟就认定关系少了一点，也没有把原约的时间忍成负担。
  `, 'x10_he_autumn', { flags: { xu10CooperationStarted: true, xu10ShenJobStarted: true } });
  add('x10_he_autumn', '秋日尾声 · 下班以后，先问想不想', 'autumn_riverside', '九月二十七日 · 18:30', xu, `
旁白｜九月二十五号，见微完成八周合作回到临江。二十七号下班后，我们按重新问过的时间在河边见面。她没抱一摞稿，我也不用先准备一个困难才值得来。
许见微｜能陪我走二十分钟吗？今天想慢一点，不想决定晚饭以前所有人该怎么办。
沈知夏｜能。我七点要回去做自己的通读，先一起走这一段。
旁白｜她说好，我们沿河走。中间我讲起陆遥把新房墙色形容成一碗太稀的汤，她笑得停了一下，说这个答复有自己的判断。
旁白｜周栀有自己的下一场演出，叶澄按原拍摄范围完成作品，林晚也在新的日程里；林岚真的过了一段不用每天营业的日子。不是所有人都留在原处，才算那间店曾经有过光。
许见微｜等你明天通读完，想一起吃饭。你有空吗？
沈知夏｜我看过自己的安排以后告诉你。想见是真的，有没有空也是真的。
旁白｜她点头，我们没有急着把这一页填满。余下的日子里，我能说需要，她也能问愿不愿意；留白不再只给一个负责正确的人，也留给我们各自下一次的声音。
  `, 'xu_ten_complete', { flags: { xu10CooperationCompleted: true, xu10CooperationCompletedAt: '9-25', xu10AutumnKept: true } });
  add('x10_ne', '继续磨合 · 装订之前', 'old_street', '六月三十日 · 11:00', xu, `
沈知夏｜愿意继续，也知道有些习惯还没有稳定。今天不是请你承诺以后都能指导好我。
许见微｜我也愿意继续。我们先用能给的量联系，月底重新问，不急着证明一个称呼已经解决全部问题。
旁白｜原来仍是恋人的，保留恋人；刚得到新的继续意愿的，从今天开始约会，不补写之前的暂停已经结束。
旁白｜这份答复是真实的试行，不是因为没走到幸福结局就少一点认真。八周合作由她去完成，我也开始自己的工作。
  `, 'x10_ne_status', { flags: { xu10Outcome: 'ne', xu10MutualContinue: true } });
  gate('x10_ne_status', 'xu10PrivateMode', { couple: 'x10_ne_couple', learning: 'x10_ne_dates' });
  add('x10_ne_couple', '已有恋人，试行新的联系方式', 'old_street', '六月三十日 · 11:05', xu, '旁白｜我们仍是女朋友，试行的是联系与相处安排，不将已有关系退回成从未确认。', 'x10_ne_august', { flags: { relationshipStatus: 'girlfriends' } });
  add('x10_ne_dates', '新约会从今天实际同意的开始', 'old_street', '六月三十日 · 11:05', xu, '旁白｜今天双方才确认愿意试着约会，还没有确认恋人。之前继续了解或暂停的事实保留，不倒填一段没发生过的关系。', 'x10_ne_august', { flags: { relationshipStatus: 'tryingDates' } });
  add('x10_ne_august', '八月，试行也需要真实回来的回应', 'studio_night', '八月 · 第一次核对联系安排', xu, `
旁白｜见微开始驻外，我开始自己的工作。第一次月底核对时，我承认有两次看见她晚回消息就想替她判断不在意；她也说自己差一点又把疲倦接成还能全部帮忙。
许见微 · 电话｜不是说过愿意试，习惯就没了。今天想把一次长通话拆成两次短的，你觉得怎样？
沈知夏｜我先看自己的时间。不是只因为你这么说就一定正确，我也得问它对自己有没有用。
旁白｜她说好。我们把调整落到真实日期，没有请一句喜欢替所有迟来的回应先盖章。
  `, 'x10_ne_autumn', { flags: { xu10CooperationStarted: true, xu10ShenJobStarted: true } });
  add('x10_ne_autumn', '秋日尾声 · 这一页还可以继续问', 'autumn_riverside', '九月二十八日 · 16:00', xu, `
旁白｜九月二十五号合作结束，见微回到临江。二十八号的河边见面先问过双方时间，我给她看最近一次自己选出的作品，不请她给整个人生评分。
许见微｜想听你的理由。今天有空，但我也会说哪些读不完，不拿熟悉当成什么都接。
沈知夏｜这两页就够。读完以后我也想听你这八周最想保留的普通一天。
旁白｜她翻了一页，又停下来，说那天晚饭真的给自己多留了十分钟。我笑着讲自己的午饭，也承认有些不安还需要慢慢说。
旁白｜陆遥的新房、林岚的休息与其他伙伴的下一项工作都继续发生。我们没有回到需要一个人做完全部才算值得被留下的那间屋子。
许见微｜下周还能见吗？
沈知夏｜愿意。时间另核，不让这句愿意先变成全天都有空。
旁白｜她点头。装订之前还有能改的一页，认真不是先写完永远，而是今天说过以后，下一次也愿意回来听对方怎样回答。
  `, 'xu_ten_complete', { flags: { xu10CooperationCompleted: true, xu10CooperationCompletedAt: '9-25', xu10AutumnKept: true } });
  add('x10_farewell', '离别结局 · 折痕以外', 'old_street', '六月三十日 · 11:00', self, `
旁白｜私人关系在这里结束。若我主动说不继续，见微接受；若她已经没有给继续意愿，我也不把自己的想继续写成双方愿意。
旁白｜我们确认工作收尾已完成，私人不再互相等待一个必须相同的答案。原来的晚饭、批注与可能有过的靠近都真实，没有因结束被改成从未发生。
许见微 · 消息｜自己的工作我会去做。希望你也继续选自己的作品和住处，不把以后的生活留在等我的那一栏。
沈知夏 · 消息｜好。不用替我保证都会容易，今天这个结束我也完整听见。
旁白｜我收起本子，走向自己的回程。折痕仍在，却不必用把人留下来才允许自己走出这一页。
  `, 'x10_farewell_august', { flags: { xu10Outcome: 'farewell', relationshipStatus: 'ended', xu10MutualContinue: false } });
  add('x10_farewell_august', '八月，两个人各有自己的出发', 'dorm', '八月 · 一个下班后的晚上', self, `
旁白｜八月，我开始出版社的工作，见微按她自己接受的安排去完成八周驻外。没有因为私人结束就取消她的选择，也没有请她继续代我核每一份稿。
旁白｜陆遥发来新房墙的一角，说这次不是汤色。我看过以后回了一句像晒过的纸，我们都笑了一会儿。
旁白｜有时仍会想起见微，想起那支放在手边的铅笔。但今天要写的理由由自己写，晚饭也不用等一条不再属于这段关系的回复才开始。
  `, 'x10_farewell_autumn', { flags: { xu10CooperationStarted: true, xu10ShenJobStarted: true } });
  add('x10_farewell_autumn', '秋日尾声 · 把自己的下一页写下去', 'autumn_riverside', '九月三十日 · 一个下班傍晚', self, `
旁白｜九月二十五号，见微完成合作回到临江。共同收尾记录里的简短工作消息照实留着，没有成为私人关系已经重新开始的暗号。
旁白｜三十号下班后，我独自沿河走了一段，给自己买晚饭。手机里有陆遥的新房、周栀的演出邀请，叶澄按原范围完成的片子，也有林晚自己的新日程。
旁白｜林岚真的休息过一阵，见朋友时不再先看当天营业表。那间店关了灯，大家没有因此都停在原址等待一个更好的结局。
旁白｜见微曾经可靠，也曾疲倦，曾认真给过自己的需要。我们没有继续，那些真实的相处仍留着，不需要被解释成其实没有喜欢过。
旁白｜我在自己的本子上写一行：以后想听意见，就说具体的一项；想见一个人，也先问她愿不愿意。写完以后合上，去吃今天真正饿了的那顿饭。
旁白｜这一页有折痕，下一页也仍属于我。走出去的时候，不需要先把整个夏天改成没有遗憾，才允许自己遇见晴天。
  `, 'xu_ten_complete', { flags: { xu10CooperationCompleted: true, xu10CooperationCompletedAt: '9-25', xu10AutumnKept: true } });

  const data = { chapterId: 'xu10', scenes, gates };
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.RainChapterTenXu = data;
})(typeof window !== 'undefined' ? window : globalThis);
