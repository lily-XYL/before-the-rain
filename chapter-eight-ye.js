(function (root) {
  'use strict';
  const scenes = [], gates = [];
  const script = text => text.trim().split('\n').map(line => {
    const i = line.indexOf('｜');
    if (i < 1) throw new Error('叶澄第八章对白缺少说话人物。');
    return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
  });
  const add = (id, title, location, time, cast, text, next, extra = {}) => scenes.push({ id, title, location, time, cast, lines: script(text), next, ...extra });
  const variation = (variantBy, variants) => ({ variantBy, variants: Object.fromEntries(Object.entries(variants).map(([key, text]) => [key, script(text)])) });
  const gate = (id, redirectBy, targets) => gates.push({ id, redirectBy, targets });
  const pair = id => ['shen_zhixia', id], ye = pair('ye_cheng'), self = ['shen_zhixia'];

  add('y8_morning', 'Y8-01 · 今天还有一只没洗的碗', 'dorm', '六月二十二日 · 08:30', pair('lu_yao'), `
旁白｜陆遥用一根筷子挑起箱子角落的发圈，郑重地宣布这是今天找到的第三件失踪物品。
陆遥｜昨天还以为它们到了新家会自己出现。现在看来，先在这里出现比较省邮费。
沈知夏｜那你有没有见到我的另一只袜子？
陆遥｜袜子暂时不接受本项业务。我只负责有弹性的。
旁白｜我笑着把桌上那只碗洗掉。印厂发来十点到货的消息，叶澄昨天约好的目录核对也在十点。真实的一天并没有因为心里多了一个人就变得特别整齐。
旁白｜我在自己的日历上划出修改稿的时间，才去看昨天私人答复停在哪里。没有答应过的电话，不能借一个很想她的早晨填进去。
  `, 'y8_entry_gate', { flags: { y8OldRepairKept: false } });
  gate('y8_entry_gate', 'y7Outcome', { open: 'y8_entry_open', slow: 'y8_entry_slow', distance: 'y8_entry_distance' });
  add('y8_entry_open', '原来的六点，先真正留出来', 'dorm', '六月二十二日 · 08:45', self, `
旁白｜昨天我们愿意继续约会，或从彼此新的同意开始约会。今天十八点至十八点十分的私人电话，是昨晚一起答应的。
叶澄 · 消息｜六点照旧。今天刚起床的时候，差点把植物浇两次。
沈知夏 · 消息｜它有没有提出意见？
叶澄 · 消息｜还没有。我替它拒绝了第二壶。
旁白｜看见她讲这种小事，我忍不住笑。不是拍摄通知，不是目录更新，也不是一句已经替我决定怎么理解她的漂亮话。
沈知夏 · 消息｜我先做上午的工作。晚上想听你讲今天，不需要有很值得剪进去的事。
  `, 'y8_repair_choice', { flags: { y8EntryOutcome: 'open', y8OriginalContactBooked: true } });
  add('y8_entry_slow', '还没有称呼，也有两个人答应的时间', 'dorm', '六月二十二日 · 08:45', self, `
旁白｜我们仍在继续了解。六点的十分钟电话已经答应，却没有因此提前变成女朋友，或把昨天尚未说的喜欢补成双方确认。
叶澄 · 消息｜晚上照旧。我今天可能没有很完整的故事，先说明。
沈知夏 · 消息｜可以只讲早餐。我现在也只想起一只没有找到的袜子。
叶澄 · 消息｜那是一个悬念。晚上请告诉我结果。
旁白｜我在聊天框里打了一个笑脸。下一次想见她是真的，还需要一点时间也是真的，不必急着把其中一句藏起来。
  `, 'y8_repair_choice', { flags: { y8EntryOutcome: 'slow', y8OriginalContactBooked: true } });
  add('y8_entry_distance', '暂停的早晨，没有一通默认存在的电话', 'dorm', '六月二十二日 · 08:45', self, `
旁白｜昨天私人推进停下了。有些路径已经见过植物和茶，有些只谈了工作；实际发生的保留，今天六点却都没有私人约定。
叶澄 · 消息｜十点目录核对照旧。没有确认的用途仍留空，先不用。
沈知夏 · 消息｜收到。私人那部分不借上午工作接着谈，等我真正准备好以后再问。
旁白｜发送以后，我把手机扣到桌上。她愿意回复工作，不代表我要装作昨天已经谈妥；也不意味着以后永远没有一次新的回答。
  `, 'y8_repair_choice', { flags: { y8EntryOutcome: 'distance', y8OriginalContactBooked: false } });
  add('y8_repair_choice', '选择一 · 中午要交出的回应', 'dorm', '六月二十二日 · 09:00', self, `
旁白｜过去那一项修改和昨天没说完的感受都还看得见。我不需要用忙碌掩盖它们，也不能只发一句想你，就把具体回应留给她猜。
  `, null, { choices: [
    { text: '中午实际完成待确认的修改，也说清自己的感受和能给的时间。', flags: { y8RepairChoice: 'act' }, next: 'y8_arrival' },
    { text: '准时说明还没准备好，保留已确认范围和当前私人状态。', flags: { y8RepairChoice: 'hold' }, next: 'y8_arrival' }
  ] });
  add('y8_arrival', 'Y8-02 · 箱子和目录各有一张回执', 'studio', '六月二十二日 · 10:00', pair('xu_jianwei'), `
旁白｜十点，印厂的纸箱真正落到工作室桌边。见微签收到货回执，林晚核原规格；我看了一眼封口，先按原约接通叶澄的工作核对。
许见微｜数量我和林晚先数。你答应的二十分钟先做完，抽检十点二十五再开始，不用同时在两个栏里签字。
沈知夏｜好。二十号交的是文件，今天才收到实物。
旁白｜叶澄在电话另一头说听得见。她没把这通电话当成晚上的私人十分钟，屏幕共享打开的是目录，没有聊天照片。
旁白｜第一只纸箱打开时有新纸的气味。我听见旁边林晚小声报数，心里也终于能把等待变成一件件真正收到的东西。
  `, 'y8_quantity_gate', { flags: { y8BooksReceived: true, y8DeliveryTime: '6-22 10:00' } });
  gate('y8_quantity_gate', 'workflow', { collective: 'y8_quantity_60', solo: 'y8_quantity_60', smaller: 'y8_quantity_40' });
  for (const copies of [60, 40]) add('y8_quantity_' + copies, '实收的原数量', 'studio', '六月二十二日 · 10:03', pair('xu_jianwei'), `
许见微｜实收${copies}本，二十四页。原费用与机动按原方案，今天没有补订。
旁白｜林晚将数量写到当天回执。纸箱到货与样本核过是两件事，后面的三本仍没翻，先不替它们填完成。
沈知夏｜我先核目录，稍后回到真正翻过的页码。
  `, 'y8_candidate_gate', { flags: { y8DeliveredCopies: copies } });
  gate('y8_candidate_gate', 'y7FilmChoice', { empty: 'y8_candidate_empty', drawing: 'y8_candidate_drawing', pending: 'y8_candidate_new' });
  add('y8_candidate_empty', '空镜能够自己说话', 'studio', '六月二十二日 · 10:05', ye, `
叶澄｜先放二十号那次获准的空桌与书架，只是内部候选。画面边缘没有路过的人，声轨也没有私人谈话。
旁白｜她逐帧给我看目录对照。没有灰色人物占位，也没有替我解释终于愿意留下的字幕。窗上的光走过去，椅子只是椅子。
沈知夏｜昨天觉得它很安静，今天看见桌上那一道磨痕，反而想起在这里放过很多普通东西。
叶澄｜我也喜欢这个。它不需要一个人站到那里，才算有人生活过。
旁白｜我们核过片段编号、这次的来源与内部用途。二十号拍过的事实保留，今天只是完成新一轮核对。
  `, 'y8_directory_done', { flags: { y8CandidateKind: 'empty', y8CandidateReady: true, y8NewDrawingMade: false } });
  add('y8_candidate_drawing', '不借别人的过去，也能画新的结尾', 'studio', '六月二十二日 · 10:05', ye, `
旁白｜目录里是叶澄二十号自画的物件分镜。杯子边缘有一笔没画圆，她没有修成特别逼真的摄影效果。
叶澄｜以前总觉得这点歪会显得没做完。现在看，它也就是我画过的一个杯子。
沈知夏｜不是某个人的手，也不需要让谁再读一次自己的信。
叶澄｜嗯。私人物件只用我新画的这一组，里面没有旧信、肖像或从私人片段临出来的轮廓。
旁白｜我们核清这组内部候选的页码与来源。画过的事实在二十号，今天的核对在今天，最后是否能公映还要另问。
  `, 'y8_directory_done', { flags: { y8CandidateKind: 'drawing', y8CandidateReady: true, y8NewDrawingMade: false } });
  add('y8_candidate_new', '待核的地方，今天真正有了新版本', 'studio', '六月二十二日 · 10:05', ye, `
叶澄｜二十号没有拍，也没有完成候选。昨晚我自己画了三个新物件：空桌、卷起的门帘、一只没有名字的杯子。
旁白｜她打开今早九点五十分导出的文件。画面没有来自旧十秒的身体轮廓，信纸和私人表情都不在这份新稿里。
沈知夏｜昨天还没有的地方，今天才有。不把这个版本记成前天已经做好。
叶澄｜知道。这次是我画的，不请你重演，也不借你自己那份私人片段填空。
旁白｜我们逐页核清新来源。这份候选在今天实际形成，之前的暂缓仍是暂缓，不因后来做完而变成从来没有停过。
  `, 'y8_directory_done', { flags: { y8CandidateKind: 'newDrawing', y8CandidateReady: true, y8NewDrawingMade: true } });
  add('y8_directory_done', '十点二十，按原约结束', 'studio', '六月二十二日 · 10:20', ye, `
沈知夏｜目录与内部候选核清。公开放映仍没有在这次电话里决定，旧私人内容照旧不进影片。
叶澄｜记下了。我的修剪我自己做，后续用途由当事人另答。你去核今天的纸，不用替我一直守着剪辑软件。
旁白｜她笑了一下，准时结束共享。原约二十分钟真实完成，我回到纸箱前，见微已经把三本样本分开放好。
旁白｜她自己的工作能够继续，和她是否愿意做我的女朋友，谁也不需要充当另一件事的报酬。
  `, 'y8_sample_choice', { flags: { y8WorkCheckKept: true, y8WorkCheckTime: '6-22 10:00-10:20', y8PrivateClipImported: false, y8PrivateClipRecorded: false, y8PrivateEmotionUsed: false, y8PublicScreeningApproved: false } });
  add('y8_sample_choice', '选择二 · 原三本样本怎样分工', 'studio', '六月二十二日 · 10:25', pair('lin_wan'), `
旁白｜林晚能核页序，见微负责装订与折边。我十点四十开始自己的改稿，两种原分工都能按时完成这轮检查。
  `, null, { choices: [
    { text: '我核三本页序与原句，见微查装订，十点四十去改稿。', flags: { y8SampleChoice: 'shared' }, next: 'y8_sample_shared' },
    { text: '我核交付清单，林晚与见微查原三本，之后各做自己的工作。', flags: { y8SampleChoice: 'separate' }, next: 'y8_sample_separate' }
  ] });
  add('y8_sample_shared', '纸页翻过，才写下看过', 'studio', '六月二十二日 · 10:25–10:35', pair('lin_wan'), `
旁白｜我逐本翻过二十四页，对照原作者确认件。林晚帮我扶住翘起的封面，见微检查另外一侧的装订。
林晚｜第十八页再看一次，你刚才被门外的人叫走了。
沈知夏｜好。只签自己真正核过的部分。
旁白｜十点三十五，三本的页序、原句、装订与折边核清。没有新印一句未回信者的话，旧授权仍是原来的范围。
旁白｜合上最后一本时，我的指尖留了一点纸灰。完成不一定是特别好看的动作，也可以只是认真翻过以后，准时去做下一件。
  `, 'y8_sample_done', { flags: { y8ShenSampleChecked: true } });
  add('y8_sample_separate', '原分工也有真正完成的名字', 'studio', '六月二十二日 · 10:25–10:35', pair('lin_wan'), `
沈知夏｜我先核交付清单。三本页序能请你看，装订仍由见微查，不加量，可以吗？
林晚｜可以，原十分钟核这三本。新问题单列，不把你的上午一起留下。
旁白｜我核完数量与回执，她逐本对原作者件，见微看折边。十点三十五，检查实际结束，各签各负责的项目。
沈知夏｜我的名字在交付清单，不在你刚翻过的页序栏。
林晚｜这就对了。你也还有自己的稿子。
旁白｜我收起笔，没有多塞一本想顺便检查的样本。有限分工同样是真的承担，不需要靠留得最长换今晚更亲近的答复。
  `, 'y8_sample_done', { flags: { y8ShenSampleChecked: false } });
  add('y8_sample_done', '自己的稿，也从真正打开开始', 'studio', '六月二十二日 · 10:40', self, `
旁白｜三本抽检结果登记完成，原数量、二十四页与预算没有变化。我十点四十打开自己的修改文件，先改编辑标出的那一段。
旁白｜看着一句总想替读者说出感动的总结，我把它删掉，留下能真正看见的动作。刚才的目录核对也提醒我，别人会怎样感受，不必由我先写完。
旁白｜修改没有自动结束。中午要说的回复也还没发，我先把这半小时交给眼前的稿子。
  `, 'y8_repair_gate', { flags: { y8SamplesChecked: true, y8SampleCount: 3, y8SampleTime: '6-22 10:25-10:35', y8OwnWorkStartedAt: '6-22 10:40' } });
  gate('y8_repair_gate', 'y8RepairChoice', { act: 'y8_old_pending_gate', hold: 'y8_repair_hold' });
  gate('y8_old_pending_gate', 'pendingOmittedConversation', { true: 'y8_old_person_gate', false: 'y8_repair_current' });
  gate('y8_old_person_gate', 'omittedPerson', { lin: 'y8_repair_lin', xu: 'y8_repair_xu', zhou: 'y8_repair_zhou', ye: 'y8_repair_ye' });
  for (const [id, person, name, scope] of [
    ['lin', 'lin_wan', '林晚', '作者原句逐项对回件，未回复者继续留白'],
    ['xu', 'xu_jianwei', '许见微', '原尺寸与折边保留，新工时不默认由你接'],
    ['zhou', 'zhou_zhi', '周栀', '换场和撤场各有时段，不临时加歌或新串场'],
    ['ye', 'ye_cheng', '叶澄', '设备说明、字幕与放映用途分别列，私人内容不转作公映素材']
  ]) add('y8_repair_' + id, '旧欠项的新回复，今天才收到', 'studio', '六月二十二日 · 12:00–12:20', pair(person), `
沈知夏 · 消息｜实际调整发给你：${scope}。只请你看标出的这一项，新增的另问。
旁白｜她指出一个还不清楚的地方。我改完再发，等她真正核过版本，不用一条收到代替答应。
${name} · 消息｜现在这一项可以，原范围保留。以前没做的那次仍然没做，不改日期。
沈知夏 · 消息｜今天的记今天，其他没有答应的继续不用。
旁白｜旧待办终于有了真实确认。我松了一口气，却没有因此让她必须替我决定今天另一段私人关系。
  `, 'y8_repair_current', { flags: { pendingOmittedConversation: false, repairStarted: true, omittedContribution: 'confirmedPartOnly', y8OldRepairKept: true } });
  add('y8_repair_current', '这次不把感受缩成一条目录备注', 'studio', '六月二十二日 · 12:30', self, `
沈知夏 · 消息｜昨天的不舒服是被预先解释，不是只少一条用途说明。我也想练习直接讲自己的需要：我想认识你，今天能认真留出时间听，但不要求你一次说完过去。
叶澄 · 消息｜知道了。我愿意讲自己愿意讲的部分。未获准的内容不用，这一点不需要你先答应喜欢我。
旁白｜我看了一会儿她最后一句，才发现自己原先也怕一句不想拍会被听成不想见。今天两句话可以分别说，都能被听见。
旁白｜新的回应真正发送，也得到她的答复。上午已经完成的检查留在工作栏，私人时间仍需要下一次明确询问。
  `, 'y8_contact_entry_gate', { flags: { y8CurrentResponseKept: true, y8PrivateReady: true } });
  add('y8_repair_hold', '没有完成的新回应，也准时说', 'studio', '六月二十二日 · 12:30', self, `
沈知夏 · 消息｜今天的新回应还没准备好。已经确认的原范围保留，未确认的继续不用；当前私人状态不由这条工作消息改变。
叶澄 · 消息｜收到。今天只到真正答应的部分，不临时加一场你还没准备好的谈话。
旁白｜我关上聊天页，没有把准时说明记成具体调整已经完成。原本继续约会或了解的答复仍在，原暂停也不会因为礼貌收到就消失。
  `, 'y8_hold_entry_gate', { flags: { y8CurrentResponseKept: false, y8OldRepairKept: false } });
  gate('y8_hold_entry_gate', 'y8EntryOutcome', { open: 'y8_hold_private', slow: 'y8_hold_private', distance: 'y8_hold_pause' });
  add('y8_hold_private', '原有的愿意，不重复起算', 'studio', '六月二十二日 · 12:35', self, `
旁白｜原约会或了解本来已有双方答复。今天没有一项尚未解决的叶澄工作暂停要靠新话绕过，六点原电话仍按约，不要求谁再从零证明愿意。
旁白｜我把已经答应的时间留下。其他伙伴若有旧欠项，还需要自己的实际修改，不会被一次私人通话顺便清掉。
  `, 'y8_contact_entry_gate', { flags: { y8PrivateReady: true } });
  add('y8_hold_pause', '旧暂停保留，回复工作不越过它', 'studio', '六月二十二日 · 12:35', self, `
旁白｜原暂停与没说完的回应保留。叶澄没有答应私人电话，我也不发一句那晚上见来替她完成邀请。
旁白｜还有工作目录与自己的修改，两件都能继续。关系尚未继续，不必把整个今天写成什么也没有发生。
  `, 'y8_work_schedule', { flags: { y8PrivateReady: false, y8PrivateContactBooked: false, y8ContactKind: 'work' } });
  gate('y8_contact_entry_gate', 'y8OriginalContactBooked', { true: 'y8_contact_original', false: 'y8_contact_new' });
  add('y8_contact_original', '原十八点十分钟，不悄悄往后加长', 'studio', '六月二十二日 · 12:45', self, `
旁白｜我们确认原十八点至十八点十分电话照旧。叶澄说十分钟以后要去吃饭，我也留着自己的修改安排。
沈知夏 · 消息｜到了点就结束。有还想说的，之后再问新的时间。
叶澄 · 消息｜好。我已经把饭从备忘录里的如果有空改成六点半。
旁白｜我笑了一下。愿意听她说普通一天，也愿意不把她的晚饭变成等待我所有问题说完以后才能开始的东西。
  `, 'y8_own_work', { flags: { y8PrivateContactBooked: true, y8ContactKind: 'original', y8PrivateContactTime: '6-22 18:00-18:10' } });
  add('y8_contact_new', '暂停后的新邀请，真正得到新答复', 'studio', '六月二十二日 · 12:45', self, `
沈知夏 · 消息｜旧调整已经按真实确认处理，自己的感受也实际说过。今天十八点至十八点十分，你愿意另谈我们能怎样相处吗？只谈十分钟，不默认恢复约会。
叶澄 · 消息｜愿意谈这十分钟。见面和关系称呼还没答应，晚上我们分别说。
沈知夏 · 消息｜知道，不把愿意谈听成已经谈妥。
旁白｜这是今天获得的一个新约定，不是补出来的昨晚电话。暂停走到愿意再谈的位置，还需要真实听见今晚的回答。
  `, 'y8_own_work', { flags: { y8PrivateContactBooked: true, y8ContactKind: 'new', y8PrivateContactTime: '6-22 18:00-18:10' } });
  add('y8_work_schedule', '六点只发目录进度，不假装她在等', 'studio', '六月二十二日 · 12:45', self, `
旁白｜工作进度十八点可发，叶澄有空再确认。它不是私人通话，也没有需要我取消的约会。今天不去询问她住在哪里。
旁白｜我回到自己尚未改完的一段，忽然觉得把不知道留在不知道的位置，手也能稳一点。
  `, 'y8_own_work');
  add('y8_own_work', '自己的修改，自己实际发送', 'studio', '六月二十二日 · 17:00', self, `
旁白｜五点，我逐项核过编辑提出的修改，把当天修订稿自己发送。对方回执确认收到，二十五号中午前的完整材料仍是另外一次交件。
沈知夏 · 消息｜今天这一轮已交，完整材料按原期限准备，不把收到写成全部通过。
旁白｜见微也结束自己的当日文件，林晚把确认件收好。没有人替我代写，也没有因为接下来可能想见一个人，就将我的工作扔给另一个人。
旁白｜我给自己买了一个面包，慢慢吃完。身体仍然饿，今天仍然要过，喜欢谁也不必先停止照顾自己。
  `, 'y8_phone_gate', { flags: { y8ShenWorkSent: true, y8ShenWorkSentAt: '6-22 17:00', y8ShenWorkDelegated: false } });
  gate('y8_phone_gate', 'y8PrivateContactBooked', { true: 'y8_phone', false: 'y8_work_message' });
  add('y8_phone', 'Y8-03 · 六点，听见她把杯子放下来', 'dorm', '六月二十二日 · 18:00–18:10', self, `
旁白｜十八点我拨过去，叶澄按约接起。先听见的是一声杯子碰桌面，随后她说刚才有一点紧张，正在考虑怎样开始。
沈知夏｜也可以从杯子开始。
叶澄｜杯子暂时没有意见。倒是我，有时候一想到要讲自己，就想先给你看一样东西。
沈知夏｜像植物？
叶澄｜嗯。你看植物的时候，我能在旁边看你。你直接问我今天怎样，我就得真的回答今天怎样。
旁白｜我安静了一会儿，说自己也常把你理解得很准当成不用再讲。我们各说一种会退开的时刻，没有试着在十分钟里把过去全部讲完。
叶澄｜明天下午三点，沿河走一小时，今天不拍。你愿意吗？只是新的私人见面，关系的答案到时各自说。
沈知夏｜愿意。三点到四点，之后的安排另问。
旁白｜十八点十分，我们按约结束，她去吃自己的晚饭。答应下一次不等于已经赴过，我把明天的时间单独记下。
  `, 'y8_evening', { flags: { y8PrivateContactKept: true, y8PrivateContactKeptAt: '6-22 18:00-18:10', y8NextMeetingAccepted: true, y8NextMeetingTime: '6-23 15:00-16:00 private' } });
  add('y8_work_message', '没有私人电话的六点，只有实际发出的工作消息', 'dorm', '六月二十二日 · 18:00', self, `
沈知夏 · 消息｜上午核清的目录范围保留，后续用途仍另问。明天十五点至十五点十五，只核待用目录，可以吗？
叶澄 · 消息｜可以，在书屋只谈这项。私人暂停照旧，今天没有额外电话。
旁白｜她的工作确认收到。我去和陆遥吃晚饭，不把她回复一条消息写成曾等过我，又因我不够努力而失望。
旁白｜知道另一个人的工作时间，不是绕过私人拒绝的入口。明天仍能按原范围合作，接下来要答的话也仍由自己准备。
  `, 'y8_evening', { flags: { y8PrivateContactKept: false, y8NextMeetingAccepted: false, y8WorkMeetingBooked: true, y8NextMeetingTime: '6-23 15:00-15:15 work' } });
  add('y8_evening', '朋友的晚饭，不只是另一段关系的空档', 'dorm', '六月二十二日 · 20:00', pair('lu_yao'), `
陆遥｜新家楼下那家包子店，老板说早上六点开。我查路线的时候，差点把房子选成早餐的附赠品。
沈知夏｜你先别把中介听笑了。
陆遥｜已经听笑了，所以我决定这次先认真问合同。
旁白｜我们翻过房屋的实际记录，仍按二十六号搬两箱、二十八号装箱晚饭和入口核对、二十九号原车次送站来记。未来那一格没有提前打勾。
陆遥｜明天你自己的事也别漏了。别一高兴，或者一不高兴，就先替全世界留时间。
沈知夏｜记着。我还要把那只袜子找出来。
旁白｜她指了指我的椅背。袜子在那里，原来悬念可以只用一个很普通的动作结束。
  `, 'y8_meeting_gate');
  gate('y8_meeting_gate', 'y8NextMeetingAccepted', { true: 'y8_meet_private', false: 'y8_meet_work' });
  add('y8_meet_private', 'Y8-04 · 今天不拍，先不急着很会说话', 'riverside', '六月二十三日 · 15:00', ye, `
旁白｜三点，叶澄站在河边树下，两只手都空着。她的相机留在住处，今天没有拍摄任务，也没有一只其实正在录音的手机。
叶澄｜我提早五分钟到了。本来想顺便找一个好角度，后来发现今天并没有这个顺便。
沈知夏｜那就先站在这个不一定最好的角度。
旁白｜她笑着让出靠河的一侧。风把她额前一小缕头发吹起来，她没有马上去调整，看起来比原先每次端着相机时更像会紧张的人。
叶澄｜我今天可能会说得有点乱。
沈知夏｜我也没有准备一份完整的问题。三点到四点先留给真正说出来的那些。
旁白｜我们开始走，手没有因为一起赴约就自动碰到。私人见面现在才真正发生，不是昨晚答应时就提前完成。
  `, 'y8_topic_private', { flags: { y8MeetingKept: true, y8PrivateMeetingKept: true, y8WorkMeetingKept: false, y8CameraAbsent: true } });
  add('y8_meet_work', 'Y8-04 · 只答应了十五分钟，就在十五分钟里', 'bookshop', '六月二十三日 · 15:00', ye, `
旁白｜三点，我们在书屋桌边打开目录。叶澄没有带相机，今天也不新增拍摄；她把这次工作用的文件放在桌上，没有私人相册。
叶澄｜只看待用编号，到十五点十五结束。私人那部分今天没有新答复，不接成约会。
沈知夏｜知道。我也按这个范围问。
旁白｜窗外有人牵着小狗经过，我看了一眼，再将目光放回桌面。想出去走走的感受可以留在自己这边，不需要让她替我完成。
  `, 'y8_topic_work', { flags: { y8MeetingKept: true, y8PrivateMeetingKept: false, y8WorkMeetingKept: true, y8CameraAbsent: true } });
  add('y8_topic_private', '选择三 · 镜头放下以后，想听见什么', 'riverside', '六月二十三日 · 15:08', ye, '旁白｜我想认识她，也知道某些过去不一定适合今天说完。她愿意从哪一部分开始，可以由她自己决定。', null, { choices: [
    { text: '问她为什么总想留下图像，她愿意讲的部分就好。', flags: { y8TopicChoice: 'waiting' }, next: 'y8_story_waiting' },
    { text: '从第一次拍照聊起，听她现在还喜欢怎样的日常。', flags: { y8TopicChoice: 'making' }, next: 'y8_story_making' }
  ] });
  add('y8_topic_work', '选择三 · 今天获准的目录话题', 'bookshop', '六月二十三日 · 15:03', ye, '旁白｜今天的十五分钟只给工作。我选真正能在这一项里问清的内容，不借话题进入她没有答应的私事。', null, { choices: [
    { text: '逐项核候选来源与用途，没收到答复的留在待用栏。', flags: { y8TopicChoice: 'scope' }, next: 'y8_work_scope' },
    { text: '核双方能给的工时，新增问题另约，不默认她接下。', flags: { y8TopicChoice: 'capacity' }, next: 'y8_work_capacity' }
  ] });
  add('y8_story_waiting', '灯亮着，不代表门马上会开', 'riverside', '六月二十三日 · 15:15', ye, `
叶澄｜小时候我妈下班不固定。有时天黑了还没回，我会把客厅灯开着，对着门等。
旁白｜她讲得很慢，目光停在水面一小圈散开的波纹上。那不是一段需要我替她得出所有结论的经历。
叶澄｜她后来真会回来，也会记得买吃的。但我等的时候并不知道还要多久。有一次我拿家里的小相机拍那盏灯，觉得以后看见照片，就能确定那晚不是只有我自己记得。
沈知夏｜你现在还记得那盏灯吗？
叶澄｜记得，灯罩有一点歪。不是很有故事感的那种漂亮。后来我越拍越熟练，就更不习惯直接说能不能陪我一会儿。
旁白｜她停下来，没有要求我评价她母亲。晚归的工作与她小时候的等待都存在，一个人的过去不必被剪成只有谁对谁错的一幕。
叶澄｜我不想今天把家里的所有事展开。想讲的是，我有时候把留下东西，当成不用向一个会回答的人开口。
沈知夏｜这部分我听见了。你停在这里也可以。
  `, 'y8_story_common', { flags: { y8PersonalStoryShared: true, y8MotherStoryShared: true } });
  add('y8_story_making', '第一张很不清楚的照片，也有后来的人', 'riverside', '六月二十三日 · 15:15', ye, `
叶澄｜第一次认真想拍的，不是人，是家里客厅的灯。拍出来很糊，像一颗没有边的橘子。
沈知夏｜为什么是那盏灯？
叶澄｜我妈那时常晚归，我开着灯等。拍下它，觉得那晚至少有一样东西能留下。她会回来，但等的时候不知道要多久。
旁白｜她说母亲有一次带了热豆浆，塑料袋勒出一条白痕。她记得的不只等待，也有后来听见钥匙的那一声。
叶澄｜现在还是喜欢拍很普通的东西。但有时拿起相机，反而不需要问别人愿不愿意陪我。我会看起来很知道自己要什么。
沈知夏｜放下以后就没那么知道？
叶澄｜嗯。我今天就不知道应该先说我想你，还是先问你今天饿不饿。
旁白｜我被她逗笑，又听见那句想你，脸慢慢热起来。她愿意讲这一小部分，家里其他过去仍可以不说。
叶澄｜灯后面的全部事今天不展开。刚才那句，倒是我现在想自己说的。
  `, 'y8_story_common', { flags: { y8PersonalStoryShared: true, y8MotherStoryShared: true } });
  add('y8_story_common', '被看见以后，也想自己发出声音', 'riverside', '六月二十三日 · 15:25', ye, `
沈知夏｜以前你拍得很好看，或者猜得很准，我会觉得不用再讲。我也有一点怕，自己真说出来没有你看见的那么漂亮。
叶澄｜你可以说今天很累，或者那杯茶不好喝。我不会把它剪成最后终于理解了什么。
沈知夏｜那杯茶其实挺好喝。但我也想练习，不被解释并不是永远不用被问。
旁白｜她转过来看我。风从河面吹来，我们都停了一小会儿，没有人拿起手机把这个停顿留下。
叶澄｜我喜欢你。不是只喜欢你站在一个画面里的样子。也有不知道怎么问的地方，想听你自己答，不想一直猜。
旁白｜这句话直接来到我面前，没有影片、没有音乐，也没有一个可以让我先评论构图的开头。我知道接下来需要自己的声音。
  `, 'y8_response_private');
  add('y8_work_scope', '来源核清，私人过去没有成为目录附件', 'bookshop', '六月二十三日 · 15:06', ye, `
旁白｜我们逐项看新候选来源，只有已经核过的环境或新画物件。旧私人十秒不在文件里，没有相机备份，也不从知夏自己那份导回。
叶澄｜待用栏不代表获准公映。今天我只能确认自己交出的来源，其他当事人还要自己答。
沈知夏｜知道。未获准人物与私人声轨继续不用，旧公开事实也不改。
旁白｜桌上没有她的家庭相册，今天只谈过目录，不会被后来一段阅读版补成她已经讲过小时候。
  `, 'y8_response_work', { flags: { y8PersonalStoryShared: false, y8MotherStoryShared: false } });
  add('y8_work_capacity', '十五分钟结束，不把剩下的都交给她', 'bookshop', '六月二十三日 · 15:06', ye, `
沈知夏｜这一轮就核编号与来源，剩下的用途问题各自问。你今天自己的剪辑不接成给我整晚候命。
叶澄｜可以。我也不会让你因为有新的意见，就必须替我做完结尾。
旁白｜我们把新增问题单列。她能给的工作时间有自己的尽头，不需要讲出家里发生过什么，才能让我接受这个尽头。
旁白｜今天没有私人见面与家庭故事，我也没有借一句其实我只是关心你追问她的过去。
  `, 'y8_response_work', { flags: { y8PersonalStoryShared: false, y8MotherStoryShared: false } });
  add('y8_response_private', '选择四 · 她已经说到这里，我怎样回答', 'riverside', '六月二十三日 · 15:30', ye, '旁白｜她没有把所有过去交给我，也已经说了喜欢。我的愿意、我的不确定，都不能只靠她看懂。', null, { choices: [
    { text: '听她愿意讲的部分，也把自己会退开的时刻说出来。', flags: { y8ResponseChoice: 'share' }, next: 'y8_response_share' },
    { text: '要求看完整旧相册和全部经历，才肯相信她没有隐瞒。', flags: { y8ResponseChoice: 'demand' }, next: 'y8_response_demand' },
    { text: '承认今天有些话还说不顺，先明确自己能谈的部分。', flags: { y8ResponseChoice: 'limited' }, next: 'y8_response_limited' }
  ] });
  add('y8_response_work', '选择四 · 工作话题的边缘', 'bookshop', '六月二十三日 · 15:10', ye, '旁白｜目录核对快结束了。没有私人邀约，关心与好奇也不能替她答应更多。', null, { choices: [
    { text: '只回应实际目录与双方工时，私事等本人愿意再谈。', flags: { y8ResponseChoice: 'share' }, next: 'y8_work_response_share' },
    { text: '要求她交完整私人相册，作为今后合作可信的证明。', flags: { y8ResponseChoice: 'demand' }, next: 'y8_work_response_demand' },
    { text: '承认私人问题还没准备好，今天按工作范围结束。', flags: { y8ResponseChoice: 'limited' }, next: 'y8_work_response_limited' }
  ] });
  add('y8_response_share', '不需要一次讲完，也能听见现在', 'riverside', '六月二十三日 · 15:35', ye, `
沈知夏｜我会退开的时候，是觉得自己一开口就会让别人麻烦。我想见你，却有时只说你工作看起来很忙。
叶澄｜我会听成你其实不想来，又不敢直接问。原来我们都有一部分很会替别人写字幕。
旁白｜我笑了一下，胸口却慢慢松开。她的过去不用一次讲完，我的今天也不必等到完全清楚以后才说。
沈知夏｜你可以不展示全部相册。我想认识你，今天这部分已经是你亲口给我的，不拿剩下的证明真假。
叶澄｜谢谢。我愿意继续听你，也愿意还不会说的时候先说还不会。
  `, 'y8_relation_private', { flags: { y8ResponseHeard: true, y8AllHistoryDemanded: false, y8DemandWithdrawn: false } });
  add('y8_response_demand', '她不交出的部分，也仍属于她', 'riverside', '六月二十三日 · 15:35', ye, `
沈知夏｜如果真的想让我了解，能不能把完整相册和以前的事都给我看？不然我不知道有没有只讲最好的一部分。
旁白｜叶澄停下来，刚才放松的肩膀又收紧了一点。
叶澄｜不能。我讲喜欢是真的，今天愿意讲的也是真的。不交出全部过去，不应该变成隐瞒你的证据。
沈知夏｜我只是怕自己又靠猜。
叶澄｜可以直接问现在。但你问了，我也可以答不愿意。这一项不能用我们想靠近来换。
旁白｜我听见拒绝，没有一份相册因此被打开。害怕猜错是我的感受，怎样回应这个拒绝仍是我接下来要做的事。
  `, 'y8_relation_private', { flags: { y8ResponseHeard: true, y8AllHistoryDemanded: true, y8DemandWithdrawn: false } });
  add('y8_response_limited', '自己没说顺，也不请她一个人继续', 'riverside', '六月二十三日 · 15:35', ye, `
沈知夏｜听见你说喜欢，我很高兴，也有一点紧张。有些关于我自己的话还说不顺，不想拿沉默让你一直猜。
叶澄｜你今天能说到哪里？
沈知夏｜想见你是真的。以后不知道怎样联系，可以直接问，不能只等你拍出一个我看起来很笃定的样子。
旁白｜她轻轻点头。我没有交出自己的全部过去，也没有要求她继续讲更多来填满我没说完的部分。
叶澄｜这几句已经听得见了。今天不需要把所有不会的事都练完，接下来关于关系的答复，我们再分别说。
  `, 'y8_relation_private', { flags: { y8ResponseHeard: true, y8AllHistoryDemanded: false, y8DemandWithdrawn: false } });
  for (const [id, body, demanded] of [
    ['share', '沈知夏｜原编号核清，后续用途各自问。私人问题今天不追加。\n叶澄｜好，十五点十五结束，今天只到这项。\n旁白｜我收起笔，既没有听见她的童年，也没有在一个工作回答后偷偷替两人确认关系。', false],
    ['demand', '沈知夏｜完整私人相册能不能给我看，作为以后合作信任的证明？\n叶澄｜不能。工作来源可以核，私人相册不属于交件。现在的暂停也不能靠我交出过去来换。\n旁白｜她没有打开相册。我听见拒绝，十五点十五仍按原约结束，不将提问写成已经得到材料。', true],
    ['limited', '沈知夏｜自己的私人回复仍没准备好，今天按工作范围结束，不让你继续等。\n叶澄｜收到。愿不愿意再谈，以后分别回答。\n旁白｜我合上目录，十五点十五结束。坦白未完成比一直没消息清楚，却不等于暂停已经解除。', false]
  ]) add('y8_work_response_' + id, '工作回复与真正结束', 'bookshop', '六月二十三日 · 15:12–15:15', ye, body, 'y8_relation_work', { flags: { y8ResponseHeard: true, y8AllHistoryDemanded: demanded, y8DemandWithdrawn: false } });
  add('y8_relation_private', '选择五 · 今天不拍，关系由两个人说', 'riverside', '六月二十三日 · 15:45', ye, `
叶澄｜我愿意试着做你的女朋友，也愿意你还需要时间。只是你的答案要由你说，刚才没答应的相册也仍不答应。
旁白｜如果我刚才用完整过去换信任，需要先收回那个要求。关系的答复不会替它自动消失。
  `, null, { choices: [
    { text: '尊重她不说的部分，讲清自己的需要，问她是否愿意成为排他的女朋友。', flags: { y8RelationChoice: 'together' }, next: 'y8_correct_gate' },
    { text: '尊重她不说的部分，说明还需要时间，问能否继续了解。', flags: { y8RelationChoice: 'slow' }, next: 'y8_correct_gate' },
    { text: '今天先暂停私人推进，不用刚才的喜欢催出一个答案。', flags: { y8RelationChoice: 'paused' }, next: 'y8_relation_paused' }
  ] });
  gate('y8_correct_gate', 'y8AllHistoryDemanded', { true: 'y8_demand_corrected', false: 'y8_need_spoken' });
  add('y8_demand_corrected', '要求收回，是亲口做的一次回应', 'riverside', '六月二十三日 · 15:48', ye, `
沈知夏｜刚才要求全部过去来证明可信，是我越过了你不愿意的部分。这个要求现在收回，也不改成你其实应该主动给我看。
叶澄｜我听见了。没有交相册，也不会在以后关系更近时自动变成必须交。
沈知夏｜知道。怕猜错的时候直接问现在，也接受你会说不愿意。
旁白｜她看着我，慢慢放松下来。刚才的要求确实发生，今天的改口也真实发生，不将两句话修成我从来没让她不舒服过。
  `, 'y8_need_spoken', { flags: { y8DemandWithdrawn: true } });
  add('y8_need_spoken', '可以直接问今天，也能直接答今天', 'riverside', '六月二十三日 · 15:50', ye, `
沈知夏｜我想认识你。想见的时候直接说，忙到不能回复时可以讲晚一点，不让相片替我们证明一切都好。你的工作决定由你自己做。
叶澄｜我也愿意这样。联系少一点能商量，不是每一次晚回复都变成小时候那盏一直等着的灯。我会自己说需要什么。
旁白｜我们核清能给的日常：忙的时候说明，新的时间一起问，有些事暂时不讲也不用拿所有记录来换信任。不是保证再也不会误会，只是不让误会替本人一直说话。
  `, 'y8_relation_answer_gate', { flags: { y8NeedsMutuallyHeard: true } });
  gate('y8_relation_answer_gate', 'y8RelationChoice', { together: 'y8_relation_together', slow: 'y8_relation_slow' });
  add('y8_relation_together', '今天才亲口成为女朋友', 'riverside', '六月二十三日 · 15:55', ye, `
沈知夏｜我愿意做你的女朋友，排他地约会。你也愿意吗？
叶澄｜愿意。我现在喜欢你，想自己这样说。不是因为你愿意被拍，也不是因为你帮我把片子做完。
沈知夏｜我也喜欢你。以前的约会或了解照原来记，女朋友从今天这句双方同意开始。
旁白｜她笑得很轻，眼睛却一下亮起来。我发现自己也一直在笑，原来确切听见一个称呼，比猜它已经被藏在哪里简单很多。
叶澄｜那我现在有一位女朋友了。但你想先喝水还是继续走，我还是得问。
旁白｜我说先喝水。我们没有立即公开，也没有因为一句愿意而自动牵手或接吻。
  `, 'y8_touch_together', { flags: { y8Outcome: 'together', relationshipStatus: 'girlfriends', y8RelationshipConfirmed: true, y8ExclusiveAgreed: true, y8RelationshipPublic: false } });
  add('y8_relation_slow', '愿意继续，不急着替它填一个称呼', 'riverside', '六月二十三日 · 15:55', ye, `
沈知夏｜我喜欢今天这样说话，还需要一点时间。愿意继续了解，但现在没有准备好确认女朋友。
叶澄｜我愿意继续。你刚才的话已经是答复，不用把还没准备好说成一件对不起我的事。
旁白｜原本开始过的约会保留，原了解或暂停后的新认识也各按真实位置。今天没有确认排他关系，没有用她的喜欢替我答应一个称呼。
叶澄｜以后想见仍能问，不要求每次见面结束都升级一次。
沈知夏｜好。今天至少可以知道，喝水这一项我们已经达成一致。
  `, 'y8_slow_status_gate', { flags: { y8Outcome: 'slow', y8RelationshipConfirmed: false, y8ExclusiveAgreed: false, y8RelationshipPublic: false } });
  gate('y8_slow_status_gate', 'y8EntryOutcome', { open: 'y8_slow_date_status', slow: 'y8_slow_learn_status', distance: 'y8_slow_learn_status' });
  add('y8_slow_date_status', '原来的约会保留', 'riverside', '六月二十三日 · 15:58', self, '旁白｜原约会继续，只是今天还没确认女朋友。不将过去双方试着约会的答复撤成从未开始。', 'y8_touch_slow', { flags: { relationshipStatus: 'tryingDates' } });
  add('y8_slow_learn_status', '新愿意从继续了解开始', 'riverside', '六月二十三日 · 15:58', self, '旁白｜我们现在愿意继续了解。原暂停的新回答发生在今天，没有倒改昨晚，也没有提前成为恋人。', 'y8_touch_slow', { flags: { relationshipStatus: 'gettingToKnow' } });
  add('y8_relation_paused', '喜欢听见了，也可以今天停下', 'riverside', '六月二十三日 · 15:55', ye, `
沈知夏｜今天先暂停私人推进。听见喜欢很高兴，但我还没准备好给后面的答复，不想让你一直站在一句也许旁边。
叶澄｜知道。我说过的喜欢是真的，也不会因此让你欠我一个吻，或一场晚饭。
旁白｜我们到四点按原约结束。若刚才有越过的要求，尚未收回的仍保留，不因为选择暂停就写成从来没发生。
旁白｜她没有追问我怎样才能现在改变答案。我也没有借一个告别前的拥抱替身体接触完成同意。
  `, 'y8_touch_paused', { flags: { y8Outcome: 'paused', relationshipStatus: 'needsConversation', y8RelationshipConfirmed: false, y8ExclusiveAgreed: false, y8RelationshipPublic: false, y8NeedsMutuallyHeard: false } });
  add('y8_relation_work', '选择五 · 工作结束之后，自己的下一步', 'dorm', '六月二十三日 · 16:00', self, '旁白｜工作已经准时结束，私人暂停保留。若刚才越过私事范围，需要明确收回；今天的改口不自动换一场约会。', null, { choices: [
    { text: '发实际范围澄清，明确收回任何相册要求，不追加私人邀约。', flags: { y8RelationChoice: 'clarify' }, next: 'y8_work_clarify' },
    { text: '写出自己的误解供后续回复，今天不发送私人请求。', flags: { y8RelationChoice: 'write' }, next: 'y8_work_keep_pause' },
    { text: '先休息，承认自己的回复仍待完成。', flags: { y8RelationChoice: 'rest' }, next: 'y8_work_keep_pause' }
  ] });
  add('y8_work_clarify', '实际澄清收到，私人答复仍没有新增', 'dorm', '六月二十三日 · 16:10', self, `
沈知夏 · 消息｜今天只核工作目录，私人相册不属于交件，不以它作信任证明。若刚才提出这个要求，现在明确收回，也不借澄清追加邀约。
叶澄 · 消息｜收到，范围清楚。私人推进仍暂停，以后愿不愿谈再各自答。
旁白｜工作误解得到实际回应，关系没有因此恢复。她没有交相册，我也没有去住处或等她下班。
  `, 'y8_work_paused', { flags: { y8WorkClarificationKept: true, y8DemandWithdrawn: true } });
  add('y8_work_keep_pause', '没有发送的文字，仍只在自己的草稿里', 'dorm', '六月二十三日 · 16:10', self, '旁白｜我没有发送新请求。草稿不是对方已经听过的答复，休息也不将旧欠项写成完成；今天先到实际答应的工作范围。', 'y8_work_paused', { flags: { y8WorkClarificationKept: false } });
  add('y8_work_paused', '暂停没有被新的好话跳过', 'dorm', '六月二十三日 · 16:15', self, '旁白｜今天没有私人邀约、童年故事或恋人称呼。工作合作继续，私人答复从真实暂停处保留。', 'y8_touch_paused', { flags: { y8Outcome: 'paused', relationshipStatus: 'needsConversation', y8RelationshipConfirmed: false, y8ExclusiveAgreed: false, y8RelationshipPublic: false, y8NeedsMutuallyHeard: false } });
  add('y8_touch_together', '选择六 · 身体靠近，再听一次双方愿意', 'riverside', '六月二十三日 · 16:00', ye, '叶澄｜我很想靠近你，但刚才答应女朋友不等于所有接触都答应。你今天想怎样？', null, { choices: [
    { text: '问她愿不愿意接吻，我也愿意再靠近。', flags: { y8TouchChoice: 'kiss' }, next: 'y8_touch_kiss' },
    { text: '先问能否拥抱，今天就到这里。', flags: { y8TouchChoice: 'hug' }, next: 'y8_touch_hug' },
    { text: '今天不增加身体接触，只一起坐一会儿。', flags: { y8TouchChoice: 'none' }, next: 'y8_touch_none' }
  ] });
  add('y8_touch_kiss', '吻以前，先听见愿意', 'riverside', '六月二十三日 · 16:05', ye, `
沈知夏｜我想吻你。现在愿意吗？
叶澄｜愿意。你也愿意吗？
旁白｜我答愿意，才慢慢靠过去。她没有催，指尖轻轻停在我袖口，河边的风把刚才想好的开头吹散了。
旁白｜那个吻很轻，比我猜过的任何一个画面都要短。退开以后，叶澄先笑，我才发现自己一直抓着水瓶，瓶身被捏出一点声音。
叶澄｜看来今天还有一位旁听者。
沈知夏｜它暂时没有意见。
旁白｜我们都笑了。吻发生在双方答应以后，没有被拍下，也没有替后面的晚饭、住处或留宿答应什么。
  `, 'y8_after_touch', { flags: { y8Kissed: true, y8Hugged: false, y8HeldHands: false } });
  add('y8_touch_hug', '只到拥抱，也可以很高兴', 'riverside', '六月二十三日 · 16:05', ye, `
沈知夏｜今天先拥抱，可以吗？接吻还没准备好。
叶澄｜可以，今天只抱一下。
旁白｜我说也愿意，她才伸出手。靠近时闻到一点洗衣液的味道，她的肩膀比镜头里看起来更温暖，也有一点紧张。
旁白｜我们抱了一会儿，自己松开。叶澄没有将没有接吻接成一场需要安慰她的失落，反而指着河上的一只鸟，说它刚才险些落在歪树枝上。
沈知夏｜不是每一种歪都像你家植物。
叶澄｜我在努力区分。
  `, 'y8_after_touch', { flags: { y8Kissed: false, y8Hugged: true, y8HeldHands: false } });
  add('y8_touch_none', '不接触，也没有少一个女朋友', 'riverside', '六月二十三日 · 16:05', ye, `
沈知夏｜今天不增加身体接触。想和你坐一会儿，可以吗？
叶澄｜可以。刚才说喜欢和愿意的事都在，不需要再用动作证明一次。
旁白｜我们在长椅两端留出一点舒服的距离。她拿自己的水瓶喝水，我看见河边树影晃动，第一次不急着问这样算不算一个正确的恋爱下午。
叶澄｜女朋友今天喝的水怎么样？
沈知夏｜非常普通，温度合理。
叶澄｜那就继续保持。
旁白｜她笑起来，没有伸手缩短我刚刚说过的距离。
  `, 'y8_after_touch', { flags: { y8Kissed: false, y8Hugged: false, y8HeldHands: false } });
  add('y8_touch_slow', '选择六 · 继续相处的今天，也各自选节奏', 'riverside', '六月二十三日 · 16:00', ye, '旁白｜还未确认女朋友，今天愿意继续相处是真的。身体靠近仍另问，不用借它催出关系称呼。', null, { choices: [
    { text: '问她愿不愿意牵手，只走一小段。', flags: { y8TouchChoice: 'hand' }, next: 'y8_slow_hand' },
    { text: '不接触，坐下聊今天的小事。', flags: { y8TouchChoice: 'talk' }, next: 'y8_slow_talk' },
    { text: '今天先结束这段散步，后续时间另问。', flags: { y8TouchChoice: 'home' }, next: 'y8_slow_home' }
  ] });
  add('y8_slow_hand', '牵手只回答牵手', 'riverside', '六月二十三日 · 16:05', ye, `
沈知夏｜想牵手走一小段，现在愿意吗？
叶澄｜愿意。关系称呼还没答应，今天的手也不用替它答。
旁白｜我答愿意，接住她伸来的手。沿河一小段真实走过，后来自己松开，没有相机留下这个动作。
旁白｜她刚才讲过的灯仍留在心里，却不要求我从此每个晚上都成为那个会准时出现的人。陪伴能够问，也能够商量。
  `, 'y8_after_touch', { flags: { y8Kissed: false, y8Hugged: false, y8HeldHands: true } });
  add('y8_slow_talk', '没有称呼的笑，也没有被扣掉', 'riverside', '六月二十三日 · 16:05', ye, `
旁白｜我们不增加接触，坐下聊那只终于找到的袜子。叶澄听完很认真地说，这是一个不适合拍纪录片的悬念，因为结尾过于短。
沈知夏｜你不能要求我的袜子经历三幕结构。
叶澄｜那我撤回选题，今天只笑一下。
旁白｜她笑的时候，我也跟着笑。未确认关系并没有让这个下午少掉真正在一起说过的话。
  `, 'y8_after_touch', { flags: { y8Kissed: false, y8Hugged: false, y8HeldHands: false } });
  add('y8_slow_home', '散步先结束，后面的邀请不偷接', 'riverside', '六月二十三日 · 16:05', ye, `
沈知夏｜这段散步先结束吧。我想休息一下，后面想做什么再问，不把坐到现在接成整晚。
叶澄｜好。原三点到四点的相处已经真实发生，剩下的不用为了凑满再走一次。
旁白｜我们停在沿河出口，没有牵手或接吻。接下来愿不愿留一张新照片或另吃晚饭，仍是可以分别说不的事情。
  `, 'y8_after_touch', { flags: { y8Kissed: false, y8Hugged: false, y8HeldHands: false } });
  add('y8_touch_paused', '选择六 · 暂停之后照顾自己的身体', 'dorm', '六月二十三日 · 16:20', self, '旁白｜私人接触没有被答应。今天先做真正属于自己的安排，不去她住处等一句可能改变的答案。', null, { choices: [
    { text: '自己走一段，再按时吃饭。', flags: { y8TouchChoice: 'selfWalk' }, next: 'y8_paused_self' },
    { text: '回宿舍坐一会儿，喝水，慢慢整理感受。', flags: { y8TouchChoice: 'selfTalk' }, next: 'y8_paused_self' },
    { text: '先休息，不用继续刷她的消息。', flags: { y8TouchChoice: 'rest' }, next: 'y8_paused_self' }
  ] });
  add('y8_paused_self', '自己的这一小时，也有真正的去处', 'dorm', '六月二十三日 · 17:00', self, '旁白｜我按自己刚才选的方式走过、坐下或休息，没有新的身体接触，也不把独处写成她其实已经在旁边。', 'y8_photo_paused', { ...variation('y8TouchChoice', {
    selfWalk: '旁白｜我自己绕楼走了一圈，买好晚饭再回宿舍。风是真的，肚子饿也是真的，不必先让这段路代表已经不难过。',
    selfTalk: '旁白｜我坐在宿舍窗边喝水，把感受写成几句没有发出的文字。自己的草稿仍不是对方已经听过的回复。',
    rest: '旁白｜我把手机放远一点，闭眼休息。醒来时天光换了方向，未完成的问题还在，身体却不用陪它一直绷着。'
  }), flags: { y8Kissed: false, y8Hugged: false, y8HeldHands: false } });
  add('y8_after_touch', '拍不拍这一张，都不改变刚才的答案', 'old_street', '六月二十三日 · 17:00', ye, `
旁白｜下午河边不拍的约定已经履行，后来散步或坐下也实际结束。我们走到街口，叶澄的相机仍留在家里。
叶澄｜刚才都没有记录。如果现在想另留一张，可以重新问这一张；不留也很好，不拿它证明你刚才是真的愿意。
沈知夏｜只问现在这一张，不把今天讲的过去带进去。
旁白｜新邀请不倒改刚才不拍的时段，也不会扩大旧十秒、信件或影片的用途。我第一次觉得没有照片不是遗憾，有照片也不必承担太多。
  `, 'y8_photo_private');
  add('y8_photo_private', '选择七 · 一张新的共同照片', 'old_street', '六月二十三日 · 17:05', ye, '旁白｜一张新照片也要有自己的收件人与用途。想拍可以问，拒绝也不需要赔一句下次一定。', null, { choices: [
    { text: '另问是否愿意用手机拍一张合照，只各自私存，不发给朋友或影片。', flags: { y8PhotoChoice: 'private' }, next: 'y8_photo_yes' },
    { text: '今天不留合照，只记得真正讲过的话。', flags: { y8PhotoChoice: 'none' }, next: 'y8_photo_no' }
  ] });
  add('y8_photo_yes', '这一张得到的答复，只到这一张', 'old_street', '六月二十三日 · 17:10', ye, `
沈知夏｜现在愿意用手机拍一张我们的合照吗？只你我各自存，不发给朋友，不作影片素材。
叶澄｜愿意，只这一张和这两个收件人。你也愿意吗？
旁白｜我答愿意，我们才靠到手机取景范围里。没有身体接触的方向也只站在彼此舒服的位置，不借拍照补一个拥抱。
旁白｜叶澄按一次快门，确认照片没有路人，私下把这一张给我。两边各自存好，不上传云相册、不公开，也没有连拍或录音。
叶澄｜你刚才笑得很像在想那只袜子。
沈知夏｜可能是在想你撤回选题的表情。
旁白｜我们笑了一下。共同照片真实拍过，但今天的谈话没有被录下，影片公开范围和旧私人片段仍照原样。
  `, 'y8_next_contact', { flags: { y8JointPhotoTaken: true, y8JointPhotoRecipient: 'shenAndYeOnly', y8JointPhotoUse: 'privateKeepOnly', y8JointPhotoPublic: false, y8JointPhotoInFilm: false } });
  add('y8_photo_no', '没有照片，也没有少一段已经发生的下午', 'old_street', '六月二十三日 · 17:10', ye, `
沈知夏｜今天不拍。想先记得你自己讲的时候，不把它变成还需要一个证明的下午。
叶澄｜好，不拍。你以后忘了今天穿什么，也不用担心喜欢变得不够真。
旁白｜手机留在包里。我们继续说那只画歪的杯子，没有照片、没有录音，也没有一个因为拒绝拍摄而改变的关系称呼。
  `, 'y8_next_contact', { flags: { y8JointPhotoTaken: false, y8JointPhotoRecipient: 'none', y8JointPhotoUse: 'none', y8JointPhotoPublic: false, y8JointPhotoInFilm: false } });
  add('y8_photo_paused', '选择七 · 今天留下什么给自己', 'dorm', '六月二十三日 · 17:05', self, '旁白｜没有获准共同照片的私人邀请。我能选择自己的记录，不去取得她的图像或给暂停补一张合照。', null, { choices: [
    { text: '只写自己的感受，不拍她、不记她未讲的经历。', flags: { y8PhotoChoice: 'selfNote' }, next: 'y8_photo_self' },
    { text: '今天暂不记录，先去吃饭。', flags: { y8PhotoChoice: 'none' }, next: 'y8_photo_self' }
  ] });
  add('y8_photo_self', '自己的文字或留白，都不替别人留下', 'dorm', '六月二十三日 · 17:10', self, '旁白｜我按刚才的选择写自己的感受，或把笔放下。没有共同照片，也没有她的私人相册进入我的文件；这份文字不发给朋友或活动。', 'y8_night_paused', { flags: { y8JointPhotoTaken: false, y8JointPhotoRecipient: 'none', y8JointPhotoUse: 'none', y8JointPhotoPublic: false, y8JointPhotoInFilm: false, y8MorningContactBooked: false } });
  add('y8_next_contact', '明早的十分钟，今晚之后仍可重新问', 'old_street', '六月二十三日 · 17:20', ye, `
叶澄｜明早九点半到九点四十，愿意聊一下今天之后的感受吗？如果今晚后来留下，也到时再亲口说，不预先写成已经谈完。
沈知夏｜愿意，九点半十分钟。工作目录另外核，不混进这个时间。
旁白｜我们答应明早的私人回应，今晚住不住、在哪里吃饭还没决定。明早尚未发生，也不会因一张照片已经拍过就自动完成。
  `, 'y8_night_gate', { flags: { y8MorningContactBooked: true, y8MorningContactTime: '6-24 09:30-09:40' } });
  gate('y8_night_gate', 'y8Outcome', { together: 'y8_night_together', slow: 'y8_night_slow' });
  add('y8_night_together', '选择八 · 晚饭与留下，各有自己的邀请', 'old_street', '六月二十三日 · 17:30', ye, `
叶澄｜我家可以做一点晚饭，你愿意来吗？只吃饭也可以，想先回去也可以。不因为今天有了女朋友，就默认你的晚上都空着。
旁白｜到住处、晚饭和留宿要在真实答复之后发生。刚才的吻、拥抱或不接触，不替这一项回答。
  `, null, { choices: [
    { text: '愿意去吃晚饭，再另问双方是否愿意留宿；亲密的节奏继续各自答。', flags: { y8NightChoice: 'stay' }, next: 'y8_home_invite' },
    { text: '愿意去吃晚饭，吃完回宿舍，今晚不留宿。', flags: { y8NightChoice: 'dinner' }, next: 'y8_home_invite' },
    { text: '今天先回去休息，明早按约再聊，不去住处。', flags: { y8NightChoice: 'home' }, next: 'y8_night_home' }
  ] });
  add('y8_home_invite', '第一次走进她没有镜头的生活', 'ye_home', '六月二十三日 · 18:00', ye, `
沈知夏｜我愿意来吃晚饭。到住处这一项，你现在也愿意吗？
叶澄｜愿意。今天只你我，什么也不拍。
旁白｜她才带我进门，先指给我看放鞋的位置。窗台那盆植物果然有一点歪，旁边的相机收在闭着的盒子里，没有亮着的镜头。
叶澄｜欢迎。那片歪叶子不是为了等你才排练的。
沈知夏｜它已经比我们更熟悉不解释自己了。
旁白｜她笑着去拿水。桌上两个杯子不一样，一只边缘有小小的缺口，放在她自己那边。住处不完美，也没有为了让我看见而摆成一张理想生活的照片。
  `, 'y8_dinner', { flags: { y8HomeInvitationAccepted: true, y8HomeVisited: true } });
  add('y8_dinner', '盐放早了，还能一起吃的晚饭', 'ye_home', '六月二十三日 · 19:00', ye, `
旁白｜她把围裙系好，又发现锅盖和自己想象的不是同一个尺寸。我在旁边洗青菜，没有因为是第一次来就接下整个厨房。
叶澄｜我会做的确实不是每一样。刚才那种很能安排的表情，你可以忘掉。
沈知夏｜我也只会洗得比较干净，不负责拯救锅盖。
旁白｜饭真正端上桌，汤有一点咸，我们添了热水再分。叶澄吃第一口时认真得像在核目录，我忍不住问，今天能否允许女朋友没有完整评价。
叶澄｜能。只回答还想不想吃第二碗就好。
沈知夏｜想，但你先把自己那碗吃完。
旁白｜我们慢慢吃完，洗过各自用的碗。相机没有打开，手机没有拍食物，第一次晚饭只是两个人真正在一张桌边饿过、笑过，又吃饱。
  `, 'y8_stay_gate', { flags: { y8DinnerKept: true } });
  gate('y8_stay_gate', 'y8NightChoice', { stay: 'y8_stay_invite', dinner: 'y8_dinner_leave' });
  add('y8_stay_invite', '留下不是吃过晚饭后默认的一项', 'ye_home', '六月二十三日 · 21:00', ye, `
叶澄｜你愿意今晚留下吗？没有拍摄，什么程度的靠近都可以停；留下也不是答应更多。我明早八点能一起吃早饭。
沈知夏｜我愿意留下。今晚只到刚才已经答应的接触，后面的任何事都另问，你也愿意这样吗？
叶澄｜愿意。你可以睡不惯、想回去，或者只是需要自己静一会儿。
旁白｜我给陆遥发今天不回宿舍的自己的平安消息，没有分享叶澄住址、照片或私事。她回知道了，提醒我明早别忘记自己的修改。
旁白｜叶澄拿出干净毛巾和备用棉被，两件都很普通。我却忽然有点高兴，因为她没有把留下问成从此都会留下。
  `, 'y8_intimacy_gate', { flags: { y8StayInvitationAccepted: true, y8StayedOvernight: false, y8FurtherIntimacyAgreed: false } });
  gate('y8_intimacy_gate', 'y8TouchChoice', { kiss: 'y8_intimacy_yes', hug: 'y8_intimacy_hug', none: 'y8_intimacy_none' });
  add('y8_intimacy_yes', '灯暗下来以前，也说清愿意', 'ye_home', '六月二十三日 · 22:00', ye, `
旁白｜我们坐在沙发边，下午那个吻没有让后面的靠近自动发生。叶澄先问，现在是否想继续一点，还是只坐着说话。
沈知夏｜我也想继续靠近。任何时候想停就说，不需要为了留在这里答应什么。
叶澄｜愿意，也同意随时停。今天不记录，明天也不拿今天发生过的事要求你继续。
旁白｜我亲口答愿意，她才再靠近。窗外一盏灯亮起，我们把各自的杯子放到稳妥的地方，慢慢关掉客厅的灯。
旁白｜这一夜后面的时间留给两个人。画面在双方实际答应以后淡出，没有照片、录音，也没有需要向谁证明的详细经过。
  `, 'y8_night_complete', { flags: { y8FurtherIntimacyAgreed: true } });
  add('y8_intimacy_hug', '只拥抱和聊天，也是可以留下的夜晚', 'ye_home', '六月二十三日 · 22:00', ye, `
沈知夏｜今晚不进一步亲密，下午的拥抱已经是想答应的节奏。现在如果再抱一下，也先问。
叶澄｜好。只聊天也很好，你不用为了留下把今天的答案再改一次。
旁白｜我们没有追加接吻或进一步亲密，只聊那个歪灯罩，后来又讲窗台植物到底有没有长出第二片新叶。睡觉前她问水够不够，我说够。
旁白｜灯慢慢暗下去，干净棉被带着晒过的味道。留下是已经答应的留下，没有接触的新要求藏在关灯以后。
  `, 'y8_night_complete');
  add('y8_intimacy_none', '不接触的留宿，也有完整的晚安', 'ye_home', '六月二十三日 · 22:00', ye, `
沈知夏｜今天不增加身体接触，留下也照这个节奏，可以吗？
叶澄｜可以。棉被给你，想安静先安静。我喜欢你，不需要让你的身体替这句话多回答一次。
旁白｜我们在各自舒服的位置读了一会儿书，后来互道晚安。她没有走近我刚才说过的距离，也没有把不接触当成我来这里只是勉强。
旁白｜客厅灯熄下，窗台植物只剩柔和的轮廓。两个人愿意留下的夜晚也可以很安静，不必发生新的动作才算真的。
  `, 'y8_night_complete');
  add('y8_night_complete', '这一夜真实过去，明早才是明早', 'ye_home', '六月二十四日 · 07:40', self, `
旁白｜一夜过去，我醒来时先看见窗台那片歪叶子。手机没有一张昨夜的新照片，相机盒仍然关着。
旁白｜留下现在才记作真实过夜，不在昨晚邀请时提前完成。九点半的私人回应还没开始，我先听见厨房很轻的一声锅盖。
  `, 'y8_breakfast', { flags: { y8StayedOvernight: true, y8PrivateNightRecorded: false } });
  add('y8_breakfast', 'Y8-05 · 早饭没有特别的结尾词', 'ye_home', '六月二十四日 · 08:00', ye, `
叶澄｜早餐比昨天汤的风险低一点。我先确认过盐不在这边。
沈知夏｜不用为了我把普通早餐做成风险说明会。
旁白｜桌上是热粥和买来的小包子。她把有小缺口的杯子仍放自己那边，我看了几秒，说下次如果愿意一起买杯子，可以真正另约。
叶澄｜愿意以后问。但现在先吃，我也饿。
旁白｜我笑着咬一口包子，才发现高兴并没有让我不饿。昨夜愿意或不愿意的身体节奏都保留，今早没有一句你都留下了替未来回答。
旁白｜吃完后我收自己的碗，她洗自己的锅。八点四十我回去做自己的准备，九点半的十分钟仍按约用电话，不因为同吃早餐就提前写成谈完。
  `, 'y8_morning_phone', { flags: { y8BreakfastKept: true, y8YeHomeLeftAt: '6-24 08:40' } });
  add('y8_dinner_leave', '晚饭吃完，回去也仍是女朋友', 'old_street', '六月二十三日 · 21:00', ye, `
沈知夏｜今天吃过晚饭就回宿舍，不留宿。明早九点半照旧。
叶澄｜好。愿不愿意让我送到街口？不额外走一段，也不借送行加接触。
旁白｜我答愿意，我们才一起下楼。街口灯亮着，她指给我看回宿舍的方向，没有留下我已经需要回去的时间。
叶澄｜女朋友今天有吃饱。
沈知夏｜女朋友也可以今晚睡自己的床。
旁白｜她笑着说晚安，我们各自回去。没有过夜或早餐，今天的关系答复也没有因此变少。
  `, 'y8_morning_phone', { flags: { y8StayInvitationAccepted: false, y8StayedOvernight: false, y8BreakfastKept: false, y8PrivateNightRecorded: false, y8FurtherIntimacyAgreed: false, y8SendOffKept: true } });
  add('y8_night_home', '不去住处，自己的晚上也完整', 'dorm', '六月二十三日 · 19:00', pair('lu_yao'), `
旁白｜我明确答今天先回去，叶澄说知道了，明早九点半照旧。没有去她住处，也没有一顿后来被补进阅读版的晚饭。
陆遥｜你今天有一点一直在笑的意思，但也有很认真在吃饭的意思。
沈知夏｜这两种可以同时存在。
陆遥｜那就先别对着饭碗讲感情发展，让它履行原职能。
旁白｜我笑着低头吃自己的晚饭。女朋友的称呼真实得到，自己的床和工作也真实需要，不用把每一个晚上都留在同一间房里才算愿意。
  `, 'y8_morning_phone', { flags: { y8HomeInvitationAccepted: false, y8HomeVisited: false, y8DinnerKept: false, y8StayInvitationAccepted: false, y8StayedOvernight: false, y8BreakfastKept: false, y8PrivateNightRecorded: false, y8FurtherIntimacyAgreed: false, y8SendOffKept: false } });
  add('y8_night_slow', '选择八 · 继续了解的晚间安排', 'old_street', '六月二十三日 · 17:30', ye, '旁白｜今天还没确认女朋友，不去住处或留宿。吃饭、走一段或回去都可以问，明早已经答应的十分钟仍保留。', null, { choices: [
    { text: '另问是否愿意去面馆吃晚饭，吃完各自回去。', flags: { y8NightChoice: 'noodles' }, next: 'y8_slow_noodles' },
    { text: '另问是否愿意只在街口走一段，不去住处。', flags: { y8NightChoice: 'walk' }, next: 'y8_slow_walk' },
    { text: '今天先回去，明早按约用电话再聊。', flags: { y8NightChoice: 'home' }, next: 'y8_slow_rest' }
  ] });
  add('y8_slow_noodles', '多一碗面，不多一个默认的称呼', 'noodle_shop', '六月二十三日 · 18:30', ye, `
沈知夏｜现在愿意一起去面馆吃晚饭吗？只是这一顿，吃完各自回去。
叶澄｜愿意。我想吃清汤的，你可以选自己的。
旁白｜我们答应以后才进店，各点一碗。她不吃我那碗里的辣椒，我也没有说尝一下就会喜欢；原来很多小区别可以只留成小区别。
旁白｜饭真实吃完，我们在门口道别。继续了解或原约会照当前答复保留，没有住处、留宿或进一步身体接触。
  `, 'y8_slow_night_done', { flags: { y8DinnerKept: true, y8SendOffKept: false } });
  add('y8_slow_walk', '街口再走一点，是一次新的同意', 'old_street', '六月二十三日 · 18:00', ye, `
沈知夏｜今天愿意再在街口走十五分钟吗？不去住处，身体接触不增加。
叶澄｜愿意，十五分钟。到时我去吃饭，不把你一起留到今晚。
旁白｜我们按新的时间走过两家关门的小店，发现一张贴歪的营业告示。她看见先笑，后来也没有拿出手机。
旁白｜十八点十五各自离开，我去吃自己的晚饭。相处真实发生，未确认关系仍没有被多走一段偷偷确认。
  `, 'y8_slow_night_done', { flags: { y8DinnerKept: false, y8SendOffKept: false, y8EveningWalkKept: true } });
  add('y8_slow_rest', '还愿意了解，也可以先回去', 'dorm', '六月二十三日 · 19:00', self, `
旁白｜我明确说今天先回，叶澄答知道了，明早照旧。没有新晚饭或散步，也没将我的休息听成刚才的愿意全是假话。
旁白｜我洗过自己的杯子，把当天修改文件核到最后一项。想认识她和想过好自己的晚上都存在，今天不必让其中一个消失。
  `, 'y8_slow_night_done', { flags: { y8DinnerKept: false, y8SendOffKept: false } });
  add('y8_slow_night_done', '各自的床，和仍真实存在的明早', 'dorm', '六月二十三日 · 22:00', self, '旁白｜今晚各自回去，没有到叶澄住处，没有过夜或进一步亲密。明早九点半十分钟是已经答应的私人回应，现在仍未发生。', 'y8_morning_phone', { flags: { y8HomeInvitationAccepted: false, y8HomeVisited: false, y8StayInvitationAccepted: false, y8StayedOvernight: false, y8BreakfastKept: false, y8PrivateNightRecorded: false, y8FurtherIntimacyAgreed: false } });
  add('y8_night_paused', '选择八 · 自己的晚饭与晚安', 'dorm', '六月二十三日 · 17:30', self, '旁白｜没有私人晚间邀请，不去她住处，也不等待一通没有约过的明早电话。今晚怎样过，仍是自己能决定的事。', null, { choices: [
    { text: '和陆遥吃晚饭，听朋友自己的下一站。', flags: { y8NightChoice: 'friend' }, next: 'y8_paused_friend' },
    { text: '整理自己的修改与真实待办，完成后准时睡。', flags: { y8NightChoice: 'work' }, next: 'y8_paused_work' },
    { text: '独自吃饭和休息，不把难过藏成额外工作。', flags: { y8NightChoice: 'rest' }, next: 'y8_paused_rest' }
  ] });
  add('y8_paused_friend', '朋友的话，也值得不用恋爱作开头', 'dorm', '六月二十三日 · 19:00', pair('lu_yao'), `
陆遥｜新家那边的房东愿意再视频看一次门锁，我想自己记好问题。你能帮我听十分钟吗？
沈知夏｜能，只十分钟，问题由你自己问。我也想听你为什么选那里，不只听有没有风险。
旁白｜她讲了早餐店、窗户和可以独自走回去的一条路。我按答应的十分钟听完，没有因为自己的关系暂停就把朋友也写成随叫随到的安慰。
旁白｜我们各自收好碗，未完成的私人答复仍在，晚饭却真实吃过。
  `, 'y8_paused_night_done');
  add('y8_paused_work', '待办核清，不用忙到看不见自己', 'dorm', '六月二十三日 · 19:00', self, `
旁白｜我核自己的修改和原截止时间，没有替叶澄接新片，也没有将草稿里的道歉写成她已经收到。
旁白｜核到真正能做的最后一项，我合上电脑去吃饭。九点半把灯关暗，睡前仍觉得难过，却没有再添一页本来不需要今晚完成的工作。
  `, 'y8_paused_night_done');
  add('y8_paused_rest', '没有完成关系，也可以先吃热的', 'dorm', '六月二十三日 · 19:00', self, `
旁白｜我自己买一份热饭，吃完洗碗，手机留在桌上。没有反复看她是否在线，也没请朋友替我问她其实怎么想。
旁白｜难过慢慢安静下来，不代表问题已经解决。今晚先睡，下一次能否继续要等新的真实回应，而不是一张我替她写好的答案。
  `, 'y8_paused_night_done');
  add('y8_paused_night_done', '暂停的次日，也有真正继续的工作', 'dorm', '六月二十四日 · 09:30', self, `
旁白｜次日九点半，没有私人电话，也没有一个约过却临时取消的约定。我继续自己的完整材料，工作目录另按约准备。
旁白｜先前实际见过的部分保留，没听过的童年与没去过的住处也不补出来。今天的工作能继续，关系仍从真实暂停处等待自己的回应。
  `, 'y8_close', { flags: { y8HomeInvitationAccepted: false, y8HomeVisited: false, y8DinnerKept: false, y8StayInvitationAccepted: false, y8StayedOvernight: false, y8BreakfastKept: false, y8PrivateNightRecorded: false, y8FurtherIntimacyAgreed: false, y8MorningContactKept: false } });
  add('y8_morning_phone', 'Y8-06 · 九点半，认真回答昨晚之后', 'dorm', '六月二十四日 · 09:30–09:40', self, `
旁白｜九点半，我按约拨过去，叶澄接起。不是起床就自动谈过，也没有用一张共同照片代替这次答复。
沈知夏｜昨天之后，我觉得很高兴，也发现自己可以直接说还需要什么。你呢？
叶澄｜我也高兴。没说完的过去仍可以慢慢问，不能因为后来靠近过，就变成必须全部展开。
旁白｜我们各自回答感受。向朋友分享关系仍需要以后双方另答，今天没有公开消息，家里经历、共同照片和私人夜晚都不分享。
叶澄｜有一件很普通的事想补一句：我今天没有把植物浇两次。
沈知夏｜很好。我也没有把已经找到的袜子再找一遍。
旁白｜她笑起来。九点四十，我们按约结束，各做自己的工作，不把能联络接成整个上午在线。
  `, 'y8_morning_after', { ...variation('y8NightChoice', {
    stay: '沈知夏｜昨夜只到真正答应的节奏，我觉得被听见了。今早早餐也是真的开心，不是保证以后每次都要留下。\n叶澄｜我也这样记。下次如果想留下，再问下次。',
    dinner: '沈知夏｜昨天晚饭吃完回去，我很安心。想一起吃饭和想睡自己的床能同时说出来。\n叶澄｜我也高兴，没有把你回去听成不喜欢。',
    home: '沈知夏｜昨天自己回去休息，没有少掉刚才已经答应的关系或相处。\n叶澄｜我也没有替你补一份其实该来吃饭的失落。',
    noodles: '沈知夏｜昨天各选自己的面，喜欢不一样也没关系。继续了解不用每次吃完就给一个新称呼。\n叶澄｜知道。下一次想见，我们再自己问。',
    walk: '沈知夏｜昨天只走十五分钟，准时各自吃饭，我觉得很好。\n叶澄｜我也觉得。时间到点就结束，不是把愿意都收回。'
  }) });
  add('y8_morning_after', '电话真正结束之后，才记回应过', 'dorm', '六月二十四日 · 09:40', self, '旁白｜原九点半至九点四十私人回应真实完成。昨天愿意的关系、接触与记录各按原范围保留，今天没有新增公开或放映许可。', 'y8_close', { flags: { y8MorningContactKept: true, y8MorningContactKeptAt: '6-24 09:30-09:40' } });
  add('y8_close', 'Y8-07 · 镜头之外，仍有各自的一天', 'dorm', '六月二十四日 · 10:00', pair('lu_yao'), `
旁白｜我打开自己的出版社材料，二十五号中午前仍要本人提交，今天没有提前记交完。陆遥将新标签贴到箱子上，又撕下来重写一个字。
陆遥｜写错了就重写，不用把整只箱子当成没装过。
沈知夏｜今天这句听起来适合好多东西。
陆遥｜那你先用在自己的地址核对上，别替我的箱子赋予太多文学意义。
旁白｜我笑着对原记录。林晚原说明会、周栀自己的设备、见微的工时、林姨的休息和书屋告别日期仍在，每个人都还有自己的生活。
叶澄 · 工作消息｜二十五号十点，目录与新的用途答复核十五分钟，可以吗？先核真正拿到的，不默认片子已经获准上映。
沈知夏 · 消息｜可以，十点到十点十五只工作。我的完整材料十一点自己交。
旁白｜新的工作核对得到实际确认，未来完成栏仍空着。我把今天合上，没有相机替我总结这个人，下一次的回答也仍需要两个人各自说。
  `, 'ye_eight_complete', { flags: { y8NextWorkBooked: true, y8NextWorkTime: '6-25 10:00-10:15', y8FullMaterialsSubmitted: false } });

  // No camera is present at the private appointment, home or the limited work meeting.
  for (const scene of scenes) if (scene.cast.includes('ye_cheng') && !/^y8_candidate|^y8_directory/.test(scene.id)) scene.spriteVariants = { ye_cheng: 'no_camera' };
  for (const scene of scenes) if (['y8_night_complete', 'y8_breakfast'].includes(scene.id)) scene.location = 'ye_home_morning';
  const data = { chapterId: 'ye8', scenes, gates };
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.RainChapterEightYe = data;
})(typeof window !== 'undefined' ? window : globalThis);
