(function (root) {
  'use strict';
  const scenes = [], gates = [];
  const script = text => text.trim().split('\n').map(line => {
    const i = line.indexOf('｜');
    if (i < 1) throw new Error('叶澄第九章对白缺少说话人物。');
    return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
  });
  const add = (id, title, location, time, cast, text, next, extra = {}) => scenes.push({ id, title, location, time, cast, lines: script(text), next, ...extra });
  const variation = (variantBy, variants) => ({ variantBy, variants: Object.fromEntries(Object.entries(variants).map(([key, text]) => [key, script(text)])) });
  const gate = (id, redirectBy, targets) => gates.push({ id, redirectBy, targets });
  const pair = id => ['shen_zhixia', id], ye = pair('ye_cheng'), self = ['shen_zhixia'];

  add('y9_morning', 'Y9-01 · 雨伞没有装进箱子', 'dorm', '六月二十四日 · 10:20', pair('lu_yao'), `
旁白｜九点半的私人回应，已经按第八章真正发生的范围收束；没有约过电话的方向也没有一通被补出来的早安。十点二十分，陆遥将雨伞从箱子里抽出来，带出一条冬天的围巾。
陆遥｜昨晚好像装了一整年。今天先把夏天拿出来。
沈知夏｜雨伞留下，二十九号也要用。
陆遥｜还有七点五十出门。写在纸上不会自动把我送进车站。
旁白｜我答知道了，把围巾递回去。她的新工作、住处和早餐店仍有自己的问题，朋友不是等我恋爱进展以后才开始生活的人。
旁白｜窗外雨还小，编辑的完整材料仍在电脑里。明天十点到十点十五的目录核对已经答应，我自己十一点交件，不让两件事同时挤在最后一分钟。
  `, 'y9_entry_gate', { flags: { y9OldRepairKept: false, y9OldDemandWithdrawn: false, y9WorkCheckKept: false, y9PublisherMaterialsSent: false } });
  gate('y9_entry_gate', 'relationshipStatus', { girlfriends: 'y9_entry_couple', tryingDates: 'y9_entry_dates', gettingToKnow: 'y9_entry_learning', needsConversation: 'y9_entry_paused' });
  add('y9_entry_couple', '女朋友也有不看手机的上午', 'dorm', '六月二十四日 · 10:25', self, `
叶澄 · 消息｜早上那盆植物没有出现新问题。现在女朋友自己的问题是，桌上的两块橡皮到底哪块比较能擦。
沈知夏 · 消息｜先让它们在纸上试，不用我替其中一块担保。
旁白｜她发来一个笑脸。昨夜留过、只吃晚饭或先回去都按真实发生的记，亲吻、拥抱或不接触也没有改变双方得到的称呼。
旁白｜我回到自己要写的说明里。女朋友不是今天整个上午必须在线的人，新的时间仍要自己问。
  `, 'y9_prior_choice', { flags: { y9EntryStatus: 'girlfriends' } });
  add('y9_entry_dates', '原约会继续，不重复起算', 'dorm', '六月二十四日 · 10:25', self, `
叶澄 · 消息｜上午各做自己的事。昨天有一只袜子，今天我正在找橡皮。
沈知夏 · 消息｜建议先看椅背。不过橡皮也许不适用。
旁白｜我们还在试着约会，未确认女朋友。昨天没有被催成称呼，也没有因此将此前双方愿意的约会撤成从未发生。
旁白｜我笑着收好手机，不拿她每一次回复的速度判断昨天究竟算不算真实。
  `, 'y9_prior_choice', { flags: { y9EntryStatus: 'tryingDates' } });
  add('y9_entry_learning', '继续了解，也能有普通的小事', 'dorm', '六月二十四日 · 10:25', self, `
叶澄 · 消息｜今天又画了那个杯子，还是歪。看来它不太准备接受修改。
沈知夏 · 消息｜那先让它做自己的杯子。
旁白｜我们愿意继续了解，原暂停后的新回答也只从真实答应的那一次开始。共同照片拍没拍、昨晚吃没吃面，都没有提前填出女朋友。
旁白｜我打开自己的文件夹，发现正在写的句子也有一点歪。今天先修自己能修的，不需要让她替我看完全部。
  `, 'y9_prior_choice', { flags: { y9EntryStatus: 'gettingToKnow' } });
  add('y9_entry_paused', '工作群不能替私人聊天开门', 'dorm', '六月二十四日 · 10:25', self, `
旁白｜私人推进停在暂停。见过的下午、说过的过去或没去过的住处都保留，今天没有一个由工作消息默认恢复的称呼。
叶澄 · 工作消息｜明天十点目录核对照旧。没获准的用途还在待用栏。
旁白｜我答收到，没有再问她为什么不发一个笑脸。她能继续工作合作，也能还没有准备好私人再谈。
  `, 'y9_prior_choice', { flags: { y9EntryStatus: 'needsConversation' } });
  add('y9_prior_choice', '选择一 · 今天怎样回应旧问题', 'dorm', '六月二十四日 · 10:40', self, '旁白｜具体修改、没收回的相册要求和自己没说完的感受都有各自的内容。雨不会替它们擦掉日期。', null, { choices: [
    { text: '实际完成旧修改，收回仍未撤回的要求，说清今天能给的回应。', flags: { y9PriorChoice: 'act' }, next: 'y9_pending_gate' },
    { text: '准时承认仍需要时间，保留原工作范围与当前私人答复。', flags: { y9PriorChoice: 'hold' }, next: 'y9_prior_hold' }
  ] });
  gate('y9_pending_gate', 'pendingOmittedConversation', { true: 'y9_person_gate', false: 'y9_demand_gate' });
  gate('y9_person_gate', 'omittedPerson', { lin: 'y9_repair_lin', xu: 'y9_repair_xu', zhou: 'y9_repair_zhou', ye: 'y9_repair_ye' });
  for (const [id, person, name, scope] of [
    ['lin', 'lin_wan', '林晚', '原句核原确认件，未回信者继续留白'],
    ['xu', 'xu_jianwei', '许见微', '原尺寸与折边保留，新工时不默认由你接'],
    ['zhou', 'zhou_zhi', '周栀', '换场撤场各自列时，未答应的新歌或串场不用'],
    ['ye', 'ye_cheng', '叶澄', '设备、字幕和放映用途分别列，私人内容不转作公开素材']
  ]) add('y9_repair_' + id, '新版本真的核过，才是今天的确认', 'dorm', '六月二十四日 · 10:45–11:15', pair(person), `
沈知夏 · 消息｜实际调整发给你：${scope}。只请看标出的这一项，新增的另问。
旁白｜她指出一处歧义，我改完再发。十一点十五前收到的是核过版本的确认，不是一个被我理解为全部同意的已读。
${name} · 消息｜现在这一项可以。原来没完成的那次保留，不改日期。
旁白｜我更新实际待办，没有因此让对方必须替今天另一段私人关系作答。
  `, 'y9_demand_gate', { flags: { pendingOmittedConversation: false, repairStarted: true, omittedContribution: 'confirmedPartOnly', y9OldRepairKept: true } });
  gate('y9_demand_gate', 'y8AllHistoryDemanded', { true: 'y9_withdrawn_gate', false: 'y9_prior_current' });
  gate('y9_withdrawn_gate', 'y8DemandWithdrawn', { true: 'y9_prior_current', false: 'y9_demand_withdraw' });
  add('y9_demand_withdraw', '没有收回的话，今天自己说', 'dorm', '六月二十四日 · 11:20', self, `
沈知夏 · 消息｜要求你交全部过去与私人相册来证明可信，是我越过了你不愿意的部分。现在收回，不改成以后关系更好你就必须交。
叶澄 · 消息｜收到了。我没有交过完整相册，今天也不会因此答应。愿不愿意再谈仍另外说。
沈知夏 · 消息｜知道。昨天的要求和当时没收回的事实保留，今天这次记今天。
旁白｜她能听见改口，也能仍不愿恢复私人关系。我没有将收到道歉写成所有问题已经解决。
  `, 'y9_prior_current', { flags: { y9OldDemandWithdrawn: true, y9OldDemandWithdrawnAt: '6-24 11:20' } });
  add('y9_prior_current', '有些不确定，不再交给她猜', 'dorm', '六月二十四日 · 11:30', self, `
沈知夏 · 消息｜我能负责自己的交件和原工作。私人联系不要求随时回复，想见会问时间，怕误解会问现在，也接受你不愿意讲全部过去。
叶澄 · 消息｜我听清了。愿意之后谈这些具体需要，不把工作顺利或拍过照片当作已经全部谈妥。
旁白｜这是实际回应，也是一次愿意再谈的答复。原暂停者还没有恢复约会，已经在相处的人也没有重新起算自己的称呼。
  `, 'y9_deadline', { flags: { y9PriorResponseKept: true, y9PriorReady: true } });
  add('y9_prior_hold', '仍未准备好，就按真实状态说', 'dorm', '六月二十四日 · 11:30', self, `
沈知夏 · 消息｜今天具体回应仍需要时间。原确认范围保留，没完成的修改不用；私人状态照昨晚最后的答复，不借工作恢复。
叶澄 · 消息｜知道。新增工作另问，不让一句收到代替已经谈妥。
旁白｜我没有完成新的调整，也没有补一封从未发过的道歉。原来愿意相处的保留，原来的暂停也保留。
  `, 'y9_hold_gate', { flags: { y9PriorResponseKept: false } });
  gate('y9_hold_gate', 'y9EntryStatus', { girlfriends: 'y9_hold_open', tryingDates: 'y9_hold_open', gettingToKnow: 'y9_hold_open', needsConversation: 'y9_hold_closed' });
  add('y9_hold_open', '已有的愿意，不被另一份待办抹掉', 'dorm', '六月二十四日 · 11:35', self, '旁白｜原恋人、约会或了解保留。欠其他伙伴的具体修改独立待办，私人相处不能替它确认，也不因它还没做好就将双方原答复收走。', 'y9_deadline', { flags: { y9PriorReady: true } });
  add('y9_hold_closed', '原暂停还没有新的同意', 'dorm', '六月二十四日 · 11:35', self, '旁白｜原暂停的具体原因还没实际回应。合作可以继续，今天没有新的私人谈话许可；想做得好一点也不能先替她答应。', 'y9_deadline', { flags: { y9PriorReady: false } });
  add('y9_deadline', 'Y9-02 · 自己的文件，不能只写成一个人名', 'dorm', '六月二十四日 · 12:00', pair('lu_yao'), `
旁白｜完整材料是作品说明和两份短样本，明天十二点前提交。我留好今晚一轮说明、明早自己的核对，十一点由自己的邮箱发出。
陆遥｜你把待办写成叶澄或者书屋，就会觉得所有东西都要等那边没有问题以后再做。
沈知夏｜所以现在写真正的文件名。两份样本不是两个人替我写的意思。
陆遥｜这句也请用在你明天的发送键上。
旁白｜我笑着保存当前文件。叶澄自己的剪辑、林晚的原说明会、见微的文件与周栀的器材各有日程，没有被我汇成今晚全体陪我等一个答复。
  `, 'y9_rain');
  add('y9_rain', '雨从后窗进来，先不急着找画面', 'rain_bookshop', '六月二十四日 · 18:00', ['shen_zhixia', 'ye_cheng', 'chen_xuning', 'lin_lan'], `
旁白｜傍晚雨忽然密起来。后窗接缝漏水，陈序宁先划停用区域，周栀按负责人安排撤开设备，不接电试音；叶澄也先把相机包放到干燥的架子。
陈序宁｜湿的线和插座不用。先移能安全移的东西，照片不能替现场检查。
林岚｜我只到七点半，之后休息。新检查明早人员到场再做，不让谁守一夜证明很重视。
沈知夏｜知道。我不替设备负责人签安全确认。
旁白｜大家在干燥区域挪东西。雨从玻璃上滑下，很好看，我却先看到桌边那一滴水落进四本册子的封口。
  `, 'y9_damage', { flags: { y9WetEquipmentStopped: true, y9EquipmentReenergized: false } });
  add('y9_damage', '四本湿了，就单独记四本', 'rain_bookshop', '六月二十四日 · 18:08', pair('xu_jianwei'), `
旁白｜见微取出四本受潮册，单独标记隔离，没混回干燥箱。原抽检没有预见后来进水，也不因发生损坏就改成二十二号根本没核过。
许见微｜先记现有可用数量。四本补印四十八元只是报价，还没下单或支付，不从原预算里凭空扣一次钱。
沈知夏｜原印数和二十四页保留，受潮另记，不把隔离写成已经恢复。
旁白｜她合上干燥箱，自己的工时到点结束。今天并没有因为忽然下雨，就多出一份所有人必须整晚接着做的义务。
  `, 'y9_stock_gate', { flags: { y9DamagedCopies: 4, y9DamagedCopiesIsolated: true, y9ReplacementQuote: 48, y9ReplacementOrdered: false, y9ReplacementPaid: false } });
  gate('y9_stock_gate', 'workflow', { collective: 'y9_stock_56', solo: 'y9_stock_56', smaller: 'y9_stock_36' });
  for (const copies of [56, 36]) add('y9_stock_' + copies, '现有干燥可用的数量', 'rain_bookshop', '六月二十四日 · 18:10', self, `
旁白｜原到货数量没有变化，四本隔离后，现有干燥可用${copies}本。原二十四页、费用与机动仍按原方案，未补印、未把受潮册算回去。
旁白｜我记下数字，再把笔递给真正核过的人。林晚正在准备七点半说明会，这份记录不要求她放弃自己的安排。
  `, 'y9_repair_clip', { flags: { y9UsableCopies: copies } });
  add('y9_repair_clip', 'Y9-03 · 只作维修说明的二十秒', 'rain_bookshop', '六月二十四日 · 18:12', ['shen_zhixia', 'ye_cheng', 'lu_yao', 'lin_lan', 'chen_xuning'], `
旁白｜维修人员想看漏水位置。叶澄先问，能否录二十秒窗框和扶毛巾的手，保留这次说明的声音，只在五位现场参与者与维修人员之间核漏水，不进影片。
陆遥｜我的手和这次声音可以，只作维修说明，不作放映。
林岚｜我这次的声音也同意这个范围，其他用途另问。别把旁边人的脸带进去。
旁白｜五个人逐项确认，叶澄才开机。镜头只对窗框和获准的手，没有人物面孔。陈序宁指出接缝位置，陆遥忽然轻声说了一句，搬家以后也怕一个人回去没有灯。
林岚｜新屋那盏灯先由你自己选。怕的时候也可以问朋友，不用只对着一只箱子想。
旁白｜二十秒到了，叶澄关机，将这次文件送给维修人员与约定现场参与者。私人话语虽然在已获准维修记录里，仍没有放映用途；它不是旧信、知夏的十秒或昨日的合照。
  `, 'y9_candidate', { flags: { y9MaintenanceClipRecorded: true, y9MaintenanceClipSeconds: 20, y9MaintenanceClipScope: 'repairOnly', y9MaintenanceClipPublicApproved: false, y9ShenOldClipImported: false, y9JointPhotoImported: false } });
  add('y9_candidate', '她看见一个结尾，也看见不属于影片的用途', 'rain_bookshop', '六月二十四日 · 18:25', ye, `
旁白｜在干燥桌边，叶澄看着维修目录停了一会儿。她说刚才两句关于灯的话像一个很好的结尾，随即将手从导入按钮上移开。
叶澄｜它很贴近这次告别，但刚才答应的不是影片。这个判断该由我自己承担，不能让你一句可以替所有人同意。
沈知夏｜我能说自己的意见，陆遥和林姨的用途仍由本人答。
旁白｜我想起昨天她讲的那盏灯，也想起陆遥自己的下一站。两件相似的事情，不需要被一个人剪成同一种解释。
叶澄｜我也有怕片子最后没话可说的时候。现在想听你怎么想，再由我自己决定下一步做什么。
  `, 'y9_film_choice');
  add('y9_film_choice', '选择二 · 这个结尾怎样处理', 'rain_bookshop', '六月二十四日 · 18:30', ye, '旁白｜它可能很好看，也可能让人很感动，但原维修许可不会自己长出公映这一项。', null, { choices: [
    { text: '建议她分别问原当事人，等真实答复，不先导入影片。', flags: { y9FilmChoice: 'ask' }, next: 'y9_film_ask' },
    { text: '建议直接用原获准空镜或自画物件与留白，不借这段私话。', flags: { y9FilmChoice: 'replace' }, next: 'y9_film_replace' },
    { text: '劝她先放进内部影片候选，觉得感动就能让以后用途好商量。', flags: { y9FilmChoice: 'use' }, next: 'y9_film_use' }
  ] });
  add('y9_film_ask', '问过以后，真正听见不愿意', 'rain_bookshop', '六月二十四日 · 18:35–18:45', ['shen_zhixia', 'ye_cheng', 'lu_yao', 'lin_lan'], `
叶澄｜刚才那二十秒里的两句声音，想另问是否愿意放进告别影片？不愿意就不导入，不要求你们为了帮我做完答应。
陆遥｜不愿意。那句话是刚才真的有点怕，不想在送别之前又当着所有人回答一遍。
林岚｜我也不愿拿这段私话作影片。维修用途保留，原设备说明不等于新的放映答复。
叶澄｜知道了，不用。我自己改结尾，不让你们必须提供另一段更合适的话。
旁白｜她实际等到两位答复，才关掉用途询问。这份拒绝是真实答案，不是尚需努力说服的待办；影片里没有导入这段。
  `, 'y9_film_safe', { flags: { y9NewUseAsked: true, y9NewUseAnswered: true, y9NewUseDenied: true, y9UnauthorizedFilmUseOccurred: false, y9UnauthorizedFilmUseRemoved: false } });
  add('y9_film_replace', '不索取另一种更好看的私话', 'rain_bookshop', '六月二十四日 · 18:35', ye, `
沈知夏｜不用为了一个结尾再问她们愿不愿意交出那句话。你已经有自己真正做过的候选，也可以留白。
叶澄｜我愿意这样改。那二十秒继续只作维修，不导进影片，也不让别人重说一段比较容易公开的怕。
旁白｜她将影片候选与维修文件分在不同目录。真实看过的雨光可以不记录，留白也不需要再借谁的私人故事来解释。
  `, 'y9_film_safe', { flags: { y9NewUseAsked: false, y9NewUseAnswered: false, y9NewUseDenied: false, y9UnauthorizedFilmUseOccurred: false, y9UnauthorizedFilmUseRemoved: false } });
  add('y9_film_safe', '没有进过影片，就不补一份删除记录', 'rain_bookshop', '六月二十四日 · 18:50', ye, `
旁白｜维修片段没有进入影片项目或候选导出。叶澄保留获准的维修工作副本，维修确认后按原当事人要求处理；没有一份被隐瞒起来的告别展版本。
叶澄｜结尾改用已经核过来源的物件或环境，不加人物情绪字幕。具体放映范围明天十点逐项核，今天仍未答应。
旁白｜她重新打开自己的候选，屏幕上没有陆遥刚才那句怕，也没有替谁总结终于愿意留下。
  `, 'y9_plan', { flags: { y9FilmScopeSafe: true, y9UnauthorizedDisclosureKept: false } });
  add('y9_film_use', '叶澄自己按下了导入，也不能把责任转给意见', 'rain_bookshop', '六月二十四日 · 18:35', ye, `
沈知夏｜先放进内部候选看看吧。大家觉得感动，也许以后更愿意答应。
叶澄｜我也想先看一个完整结尾。这个决定是我作的，不拿你的建议当她们的同意。
旁白｜她实际把维修片段导入告别影片候选项目，保留那两句私话，并在我们两人面前播放一次。改变用途确实发生，没有获得陆遥和林姨的新答复。
旁白｜没有对外发送、上传或公开放映，不代表刚才这次用途越界没有发生。屏幕停下时，她先关掉播放，脸上的表情也变了。
叶澄｜刚才越过了原维修范围。我会自己告诉她们，停用并移除，不让你代我取得原谅。
  `, 'y9_use_disclose', { flags: { y9NewUseAsked: false, y9NewUseAnswered: false, y9NewUseDenied: false, y9UnauthorizedFilmUseOccurred: true, y9UnauthorizedFilmUseRemoved: false, y9UnauthorizedPublicScreeningOccurred: false, y9UnauthorizedCutSent: false } });
  add('y9_use_disclose', '本人告知的不是假设，而是已经发生的事', 'rain_bookshop', '六月二十四日 · 18:45', ['shen_zhixia', 'ye_cheng', 'lu_yao', 'lin_lan'], `
叶澄｜我刚才把二十秒维修片段导入影片候选，并在我和知夏面前播放一次，没有新用途同意。现在停用并移除，不发给别人。这是我的错误，不请知夏替我向你们说没关系。
陆遥｜我不愿把那句话放进影片。你已经用过，这件事别写成只是差点用。
林岚｜停用、移除项目和候选缓存，维修副本只等明早确认，之后删除你手里的。其他人的副本由各自按维修范围处理。
叶澄｜知道，实际发生的保留。今晚我做完移除给你们确认，不让你们替我重录一个结尾。
旁白｜没有人答应原谅，也没有人因为她说了对不起就将使用改成获准。她逐项记下当事人的要求，收起自己想补解释的那一句。
  `, 'y9_use_remove', { flags: { y9UnauthorizedDisclosureKept: true, y9UnauthorizedDisclosureAt: '6-24 18:45', y9NewUseDenied: true } });
  add('y9_use_remove', '移除能停止继续使用，不能抹掉发生过', 'rain_bookshop', '六月二十四日 · 19:00', ye, `
旁白｜叶澄实际移除影片项目中的维修片段、候选缓存和缩略图，对过导出目录没有这一段，再向陆遥和林姨发送完成说明。两人确认收到移除结果，没有追加一份她们从未说过的原谅。
叶澄｜维修工作副本只留到明早核接缝，之后删除我这里的。影片结尾重新做，不用这段，也不从你自己那份私人十秒或昨天合照补。
沈知夏｜知道。删除和发生过，分别记。
旁白｜她点头，开始自己的替代稿。我的意见也确实越过了别人用途，接下来怎样回应不能只交给她一个人做。
  `, 'y9_plan', { flags: { y9UnauthorizedFilmUseRemoved: true, y9UnauthorizedFilmUseRemovedAt: '6-24 19:00', y9FilmScopeSafe: true } });
  add('y9_plan', '今天的替代候选，由她自己完成', 'rain_bookshop', '六月二十四日 · 19:10', ye, `
旁白｜叶澄用原已核过来源的环境或新画物件做替代结尾，最后留一段黑画面。没有陆遥私话、林姨私人声音，也没有让谁重演害怕的动作。
叶澄｜我以前一见到留白，就觉得需要赶紧再拍一点。今天先让它空着，我自己负责把前面的节奏接好。
沈知夏｜空着不等于没有发生生活。
旁白｜她自己做完这一轮内部候选，保存实际版本时间。它还不是已经获准公映的影片，明早核用途、设备和片段来源仍是下一件事。
  `, 'y9_owner_rest', { flags: { y9CandidateReady: true, y9CandidateMadeAt: '6-24 19:10', y9PrivateEmotionInCurrentCut: false, y9FilmPublicApproved: false, y9FilmScreened: false, y9UnauthorizedPublicScreeningOccurred: false, y9UnauthorizedCutSent: false } });
  add('y9_owner_rest', '七点半，店主真正去休息', 'rain_bookshop', '六月二十四日 · 19:30', pair('lin_lan'), `
林岚｜到今天实际答应的范围。湿设备不启用，原二十七号告别活动不改成今晚演一次。
旁白｜七点半，林姨离开去休息，没有因为结尾没全部核清就留在桌边。林晚也按原时间去参加说明会，原件清单交给今天真正接手的人。
沈知夏｜知道。作者新增的仍另问，不因为雨夜很忙就把没回信填成可以。
旁白｜我把干燥箱盖好，再看自己的时间。有限帮助或按时回去写材料，都可以真正承担一份已经答应的事。
  `, 'y9_help_choice', { flags: { y9OwnerRestKept: true, y9OwnerRestAt: '6-24 19:30' } });
  add('y9_help_choice', '选择三 · 自己能留下的工时', 'rain_bookshop', '六月二十四日 · 19:35', ye, '旁白｜能做的只有干燥区域里的原工作。我不碰停用设备，也不接叶澄整晚剪辑，自己的材料仍要本人写。', null, { choices: [
    { text: '另问二十分钟，搬三把干椅子并记新动线，到点结束。', flags: { y9HelpChoice: 'finite' }, next: 'y9_help_finite' },
    { text: '核完自己原交付清单，按时回去写材料；其他工作由已答应的伙伴承担。', flags: { y9HelpChoice: 'own' }, next: 'y9_help_own' }
  ] });
  add('y9_help_finite', '帮助有自己的数量，不接成整晚', 'rain_bookshop', '六月二十四日 · 19:35–19:55', ye, `
沈知夏｜到十九点五十五，我能搬三把干椅子、记新动线。设备检查和剪辑不接，可以吗？
叶澄｜可以。我自己核目录，你只做答应的两项，到点回去写自己的材料。
旁白｜我等她答应以后才开始，三把椅子在干燥区域挪好，动线记清。没有向停用插座接电，也没有替负责人签安全通过。
旁白｜十九点五十五，我按约结束。多待或少待都不替今晚的私人答复提供分数，真正完成的二十分钟留在它自己的栏里。
  `, 'y9_own_work', { flags: { y9HelpKept: true, y9HelpMinutes: 20, y9HelpFinishedAt: '6-24 19:55', y9ShenEquipmentCheckSigned: false } });
  add('y9_help_own', '自己的那一页，也需要真正回去', 'rain_bookshop', '六月二十四日 · 19:40', ye, `
沈知夏｜原交付清单我已经核过。今天按自己的材料期限回去，新增椅子与动线由原答应的伙伴做，不默认你全接。
叶澄｜好。我自己的目录我负责，陈序宁已按原范围接动线，你不需要等片子全部完成才离开。
旁白｜我把看过的清单交给实际接手的人，离开干燥桌边。没有帮二十分钟也不等于忽略她，自己的稿子同样有一个需要兑现的日期。
  `, 'y9_own_work', { flags: { y9HelpKept: false, y9HelpMinutes: 0, y9ShenEquipmentCheckSigned: false } });
  add('y9_own_work', '先做一轮自己的说明，再发真实回复', 'dorm', '六月二十四日 · 20:30', self, `
旁白｜八点半，我完成自己的当晚作品说明一轮，保存两份样本待明早核。还没有发送完整材料，不把保存写成编辑已经收到。
旁白｜叶澄发来自己的候选进度，说明原范围和仍待核的用途，没有要求我替所有人答一句可以。这件工作仍由她自己负责。
旁白｜雨敲着窗，我想起她说留下东西能够不用开口。现在影片里的东西已经按实际处理，关于今晚自己的感受，也需要真正的一句话。
  `, 'y9_response_choice', { flags: { y9OwnDraftPrepared: true, y9OwnDraftPreparedAt: '6-24 20:30', y9PublisherWorkDelegated: false } });
  add('y9_response_choice', '选择四 · 我也需要回答的部分', 'dorm', '六月二十四日 · 20:40', self, '旁白｜我的赞成不能替别人许可，我的不舒服也不需要被片子是否感动取代。今晚怎样回应，仍要由自己说。', null, { choices: [
    { text: '回应实际发生的事，尊重当事人的拒绝，也说清自己的感受。', flags: { y9ResponseChoice: 'answer' }, next: 'y9_answer_use_gate' },
    { text: '坚持作品足够感动，觉得当事人应该更体谅这个结尾。', flags: { y9ResponseChoice: 'defend' }, next: 'y9_response_defend' },
    { text: '承认今晚还不能回应，先暂停私人推进，工作范围保留。', flags: { y9ResponseChoice: 'defer' }, next: 'y9_response_defer' }
  ] });
  gate('y9_answer_use_gate', 'y9UnauthorizedFilmUseOccurred', { true: 'y9_response_used', false: 'y9_response_safe' });
  add('y9_response_used', '自己的越界意见，也由自己承担', 'dorm', '六月二十四日 · 20:45', self, `
沈知夏 · 消息｜我劝先放进候选，也越过了她们的用途。这个意见收回。你实际导入、本人告知和移除都分别记，不能把后来删除说成从未使用。
叶澄 · 消息｜我也这样记。决定由我自己作，告知与处理由我负责，不让你代我取得她们原谅。现在片段不在影片里，原拒绝保留。
沈知夏 · 消息｜我仍有不舒服，也想听你怎样承担。想继续相处需要我们真实回应，不靠你以后一直对我好换我说全部没关系。
旁白｜她回答愿意听，具体处理结果可核，私人感受不用被压成作品已经安全所以不能再难过。
  `, 'y9_response_kept', { flags: { y9OwnBadAdviceWithdrawn: true } });
  add('y9_response_safe', '不要求一个漂亮结尾替她们说话', 'dorm', '六月二十四日 · 20:45', self, `
沈知夏 · 消息｜今晚没有将维修片段放进影片，原拒绝或未询问都按真实记录。我的愿意不替其他人答，也不希望生活只有拍成结尾才算值得记得。
叶澄 · 消息｜我愿意这样做。想陪伴会自己问，不从别人私话里替我们找一个已经回答好的故事。
沈知夏 · 消息｜我也会直接讲需要。今晚还想说一点自己的害怕，不把它交给你猜，也不要求你必须拍出来才证明听过。
旁白｜她说愿意听。我看着那句很短的愿意，第一次觉得作品和相处不需要同时得到一个完整结尾。
  `, 'y9_response_kept', { flags: { y9OwnBadAdviceWithdrawn: false } });
  add('y9_response_kept', '回应实际收到，旧问题仍按旧记录', 'dorm', '六月二十四日 · 20:50', self, '旁白｜今晚自己的感受与用途回应真正发送，并收到叶澄实际答复。旧具体回应如果仍未完成，不能被这句新真话自动清掉。', 'y9_mutual_choice', { flags: { y9CurrentResponseKept: true, y9DefenceWithdrawn: false } });
  add('y9_response_defend', '感动不是替当事人答应的理由', 'dorm', '六月二十四日 · 20:45', self, `
沈知夏 · 消息｜如果作品足够让大家感动，是不是该让她们体谅一下这个结尾？不用的话总觉得白错过了。
叶澄 · 消息｜不能。没有新用途同意就是不用；已经越过的要承担，没用过的也不能为了效果再导入。不能让对方因为故事好看就交出不愿意的东西。
旁白｜她没有接受这个要求，当前影片仍没有维修私话。我想辩解自己只是怕遗憾，却知道遗憾也不会让别人的答复失去位置。
旁白｜她愿意说明工作处理，不愿把这次分歧写成私人已经谈妥。未被回应的问题真实留下，不靠一个亲近动作掩过去。
  `, 'y9_mutual_choice', { flags: { y9CurrentResponseKept: false, y9DefenceWithdrawn: false, y9OwnBadAdviceWithdrawn: false } });
  add('y9_response_defer', '今晚还不能说清，不让她继续猜', 'dorm', '六月二十四日 · 20:45', self, `
沈知夏 · 消息｜自己的感受今晚还不能完整回应，先暂停私人推进。工作处理结果收到，未获准内容不用，原明早核对照旧。
叶澄 · 消息｜知道。暂停不影响已经确认的安全与工作范围，也不拿做完结尾要求你立刻答应继续。
旁白｜我合上聊天页。合作真实推进过，关系还没答妥也真实存在，不需要将一个写成另一个的奖励。
  `, 'y9_mutual_choice', { flags: { y9CurrentResponseKept: false, y9DefenceWithdrawn: false, y9OwnBadAdviceWithdrawn: false } });
  add('y9_mutual_choice', '选择五 · 今晚是否继续谈私人需要', 'dorm', '六月二十四日 · 20:55', self, '旁白｜想继续也需要本人同意，旧问题与今晚真实回应没有被作品完成代替。一个人的愿望不能独自恢复双方的关系。', null, { choices: [
    { text: '先按真实回应的范围问她，是否愿意继续相处或重新谈需要。', flags: { y9MutualChoice: 'ask' }, next: 'y9_prior_ready_gate' },
    { text: '今天先暂停私人安排，保留工作与已经发生的相处。', flags: { y9MutualChoice: 'pause' }, next: 'y9_relation_paused' }
  ] });
  gate('y9_prior_ready_gate', 'y9PriorReady', { true: 'y9_current_ready_gate', false: 'y9_relation_paused' });
  gate('y9_current_ready_gate', 'y9CurrentResponseKept', { true: 'y9_relationship_gate', false: 'y9_relation_paused' });
  gate('y9_relationship_gate', 'y9EntryStatus', { girlfriends: 'y9_relation_couple', tryingDates: 'y9_relation_dates', gettingToKnow: 'y9_relation_learning', needsConversation: 'y9_relation_reopen' });
  add('y9_relation_couple', '继续做女朋友，不等于所有事情已经不难过', 'dorm', '六月二十四日 · 21:00', self, `
沈知夏 · 消息｜原问题与今晚回应按实际记。我仍想作为女朋友继续，也有需要慢慢说的感受。你愿意吗？
叶澄 · 消息｜愿意继续做你的女朋友。我们说过的排他保留，不以作品或今天多做多少换亲近。未获准用途不用，也不要求你马上觉得全部安心。
旁白｜这是双方新的继续答复，不是救场之后自动得到的回报。若今晚发生过越界，事实与当事人的拒绝仍在，私人继续不替她们写原谅。
叶澄 · 消息｜我今晚能给站台边十五分钟，二十一点十五到二十一点三十。愿意的话再选，想休息也可以。
  `, 'y9_close_couple', { flags: { y9Outcome: 'together', relationshipStatus: 'girlfriends', y9ExclusiveActive: true, y9PrivateTalkAccepted: true } });
  add('y9_relation_dates', '原约会继续，称呼不偷偷增加', 'dorm', '六月二十四日 · 21:00', self, `
沈知夏 · 消息｜今晚实际回应以后，我愿意继续原约会。还没有确认女朋友，你愿意继续这个范围吗？
叶澄 · 消息｜愿意。二十一点十五到二十一点二十五，可以只谈十分钟，也可以今天先休息。
旁白｜原约会继续，未被多一次雨夜求助起算，也没有变成排他的女朋友。工作与原当事人的用途问题仍各自承担。
  `, 'y9_close_reopen', { flags: { y9Outcome: 'reopen', y9ReopenKind: 'dates', relationshipStatus: 'tryingDates', y9ExclusiveActive: false, y9PrivateTalkAccepted: true } });
  add('y9_relation_learning', '继续了解，也听见新的愿意', 'dorm', '六月二十四日 · 21:00', self, `
沈知夏 · 消息｜今晚想继续了解，也想说清自己的需要。现在愿意再谈十分钟吗？
叶澄 · 消息｜愿意，二十一点十五到二十一点二十五，不确认新称呼，身体靠近另问。今天想休息也可以。
旁白｜我们仍在了解，没有把彼此愿意听见误写成已经恋爱。影片完成量没有替任何一句私人答复加快一步。
  `, 'y9_close_reopen', { flags: { y9Outcome: 'reopen', y9ReopenKind: 'learning', relationshipStatus: 'gettingToKnow', y9ExclusiveActive: false, y9PrivateTalkAccepted: true } });
  add('y9_relation_reopen', '暂停之后，只到愿意再谈', 'dorm', '六月二十四日 · 21:00', self, `
沈知夏 · 消息｜旧问题实际回应过，今晚的也说清。现在愿意重新谈十分钟需要吗？不默认恢复约会或成为女朋友。
叶澄 · 消息｜愿意谈，二十一点十五到二十一点二十五。原暂停不倒改，新的关系答复以后仍各自说。
旁白｜这一次得到的是愿意再谈，不是恢复恋人。我想见她的感受有位置，也能不让那份感受占掉她尚未答应的部分。
  `, 'y9_close_reopen', { flags: { y9Outcome: 'reopen', y9ReopenKind: 'afterPause', relationshipStatus: 'needsConversation', y9ExclusiveActive: false, y9PrivateTalkAccepted: true } });
  add('y9_relation_paused', '合作继续，私人今天停在这里', 'dorm', '六月二十四日 · 21:00', self, `
旁白｜原问题或今晚感受仍未真正回应，或我自己选择先停。叶澄明确回复今天不新增私人安排，原明早工作核对照旧。
叶澄 · 消息｜知道。没有同意的见面，不去站台等一个可能改变的答案。以前真正在一起的部分仍保留，今天先到这里。
旁白｜我答知道了。曾亲近过不要求未来继续，作品已经安全也不逼私人马上安心。
  `, 'y9_close_paused', { flags: { y9Outcome: 'paused', relationshipStatus: 'needsConversation', y9ExclusiveActive: false, y9PrivateTalkAccepted: false } });
  add('y9_close_couple', '选择六 · 站台边，也可以只休息', 'dorm', '六月二十四日 · 21:05', self, '旁白｜她已经答应十五分钟，是否实际去、是否牵手仍分别问。知道她走哪条路不是同意的替代品。', null, { choices: [
    { text: '按新约去站台，另问能否牵手，只待十五分钟。', flags: { y9CloseChoice: 'hand' }, next: 'y9_station_hand' },
    { text: '按新约去站台，只聊天，不增加身体接触。', flags: { y9CloseChoice: 'talk' }, next: 'y9_station_talk' },
    { text: '明确今晚先各自休息，不去站台，私人见面另问。', flags: { y9CloseChoice: 'rest' }, next: 'y9_contact_rest' }
  ] });
  add('y9_station_hand', '伸出的手，也在新的回答之后', 'rain_stop', '六月二十四日 · 21:15–21:30', ye, `
旁白｜我按新约到站台，叶澄也准时来，相机留在工作架上，没有带来记录今晚。两把伞靠在各自一侧，雨声没有被录下。
沈知夏｜现在想牵你的手，愿意吗？
叶澄｜愿意，你也愿意吗？
旁白｜我答愿意，才接住她伸来的手。她手心比河边那次暖一点，今天仍有未完全安静的感受，不需要被这个动作揉成全部没关系。
叶澄｜我有时候怕不留下，就证明不了认真。今晚想练习直接听你说，不让你为了我必须说好听的。
沈知夏｜我也想练习直接说。你握得有点紧，能松一点吗？
旁白｜她立即松一点，我们笑了一下。二十一点三十准时各自离开，未增加接吻、照片或留宿。
  `, 'y9_night_friend', { flags: { y9PrivateMeetingKept: true, y9PrivateTalkMinutes: 15, y9HeldHands: true, y9Kissed: false, y9CameraAbsent: true, y9NightRecorded: false } });
  add('y9_station_talk', '不牵手，也没有少一句继续', 'rain_stop', '六月二十四日 · 21:15–21:30', ye, `
旁白｜我们按新约在站台见到，没带相机，手机留在口袋。两个人只聊天，身体接触没有因为继续女朋友就自动发生。
沈知夏｜雨太大以后，我也会想把所有事情赶快做完，好像只要还有一项空着，就不能安心回去。
叶澄｜我也会。今天还没上映，明天也不是必须交一个从此不会再犯错的人。
旁白｜我听完，慢慢呼出一口气。二十一点三十按约结束，我们各自回去，未被一段好看的雨声留成另一份证明。
  `, 'y9_night_friend', { flags: { y9PrivateMeetingKept: true, y9PrivateTalkMinutes: 15, y9HeldHands: false, y9Kissed: false, y9CameraAbsent: true, y9NightRecorded: false } });
  add('y9_close_reopen', '选择六 · 获准的十分钟不承担新称呼', 'dorm', '六月二十四日 · 21:05', self, '旁白｜原约会、了解或暂停后的愿意再谈各自保留。这次只答应十分钟，未答应身体接触、住处或关系升级。', null, { choices: [
    { text: '按新约去站台，只谈各自需要，不增加接触。', flags: { y9CloseChoice: 'needs' }, next: 'y9_station_needs' },
    { text: '按新约去站台，只谈下一次怎样另问时间。', flags: { y9CloseChoice: 'future' }, next: 'y9_station_future' },
    { text: '明确今晚先休息，不去见面，之后的时间再问。', flags: { y9CloseChoice: 'rest' }, next: 'y9_contact_rest' }
  ] });
  add('y9_station_needs', '十分钟，能说出自己的那一份', 'rain_stop', '六月二十四日 · 21:15–21:25', ye, `
旁白｜我们按新约到站台，相机没有带来。叶澄先说想听自己怎样更直接提陪伴，我也说害怕一开口就让别人麻烦。
沈知夏｜今天能够听到这些，不需要你把全部过去展开。我也能还没有准备好所有答案。
叶澄｜知道，新的联系问时间，不把一张合照或工作进展当作已经答应。
旁白｜二十一点二十五，十分钟实际结束。没有牵手或接吻，没有住处邀请，暂停后再谈者仍未恢复约会。
  `, 'y9_night_friend', { flags: { y9PrivateMeetingKept: true, y9PrivateTalkMinutes: 10, y9HeldHands: false, y9Kissed: false, y9CameraAbsent: true, y9NightRecorded: false } });
  add('y9_station_future', '下一次的时间，不是今天顺手填进去', 'rain_stop', '六月二十四日 · 21:15–21:25', ye, `
旁白｜我们按新约只谈十分钟，各自说未来忙时能怎样明确通知。没有约一个尚不知道是否能到的整晚，也没有把明早十点工作改成私人约会。
叶澄｜下次想见，问能给的时段。没有答应就不等，也不从你昨天说过愿意来推今天一定愿意。
沈知夏｜好。你没准备好答的，也可以直接说。
旁白｜二十一点二十五，我们准时离开，没有相机、身体接触或新的关系称呼。下一次仍需要新的真实邀请。
  `, 'y9_night_friend', { flags: { y9PrivateMeetingKept: true, y9PrivateTalkMinutes: 10, y9HeldHands: false, y9Kissed: false, y9CameraAbsent: true, y9NightRecorded: false } });
  add('y9_contact_rest', '实际说今晚不去，就不补一个赴约', 'dorm', '六月二十四日 · 21:15', self, `
沈知夏 · 消息｜今天先各自休息，我不去站台。刚才愿意继续或再谈的答复保留，新的私人时间另问。
叶澄 · 消息｜知道，今晚见面撤回，未赴约也按未赴约记。原明早工作核对照旧。
旁白｜我们实际共同确认不去见面，没有一个她在雨里等我却没告诉我的故事。没有身体接触，私人继续也没有因为休息被扣掉。
  `, 'y9_night_friend', { flags: { y9PrivateMeetingKept: false, y9PrivateTalkMinutes: 0, y9PrivateMeetingCancelledByAgreement: true, y9HeldHands: false, y9Kissed: false, y9NightRecorded: false } });
  add('y9_close_paused', '选择六 · 没有新邀约的自己的晚上', 'dorm', '六月二十四日 · 21:05', self, '旁白｜没有私人见面，不去站台等待，也不假装取消过一场未答应的约会。今天先照顾自己的生活。', null, { choices: [
    { text: '和陆遥聊她的新住处，有限听朋友自己的下一站。', flags: { y9CloseChoice: 'friend' }, next: 'y9_paused_self' },
    { text: '完成自己的材料核对后准时停，不加额外剪辑工作。', flags: { y9CloseChoice: 'work' }, next: 'y9_paused_self' },
    { text: '先喝水、休息，不一直刷她的消息。', flags: { y9CloseChoice: 'rest' }, next: 'y9_paused_self' }
  ] });
  add('y9_paused_self', '自己的安排实际做过，不借她的行程绕过去', 'dorm', '六月二十四日 · 21:30', self, '旁白｜我按刚才选的方式过完这段时间，没有去她住处或站台，也没有新的照片或身体接触。', 'y9_night_friend', { ...variation('y9CloseChoice', {
    friend: '旁白｜我听陆遥讲新屋那盏灯，她自己想买一盏能调方向的。怕与期待都由她亲口说，不是我从某段影片替她得出的结论。',
    work: '旁白｜我核自己的样本与说明，做到答应的一轮就停。没有替叶澄接整晚剪辑，也没有请她代交明天的材料。',
    rest: '旁白｜我喝水、把手机放远一点。难过还在，身体也不必陪它一直绷着；睡觉不是已经解决所有问题的证明。'
  }), flags: { y9PrivateMeetingKept: false, y9PrivateTalkMinutes: 0, y9HeldHands: false, y9Kissed: false, y9NightRecorded: false } });
  add('y9_night_friend', '友情、关灯和明天，都有自己的栏', 'dorm', '六月二十四日 · 22:00', pair('lu_yao'), `
陆遥｜今天那句话如果你听见了，先别替我总结成终于能勇敢离开。我也想怕一下，再选一盏真的会亮的灯。
沈知夏｜知道。以后想讲，你自己说，不需要先讲得很适合告别。
旁白｜我没有给她看影片，没有要求她原谅叶澄，也没有拿自己的关系继续来证明她应该更放心。
陆遥｜二十六号搬两箱，二十八号晚饭和入口核对还在。记得你自己明天十一点的发送键。
旁白｜我答记得。二十九号原车次送站与三十号书屋关灯仍在未来，我把手机放下，让今晚真正结束。
  `, 'y9_window');
  add('y9_window', 'Y9-04 · 修过的窗，不替所有设备签安全', 'bookshop', '六月二十五日 · 09:00', ['shen_zhixia', 'ye_cheng', 'chen_xuning'], `
旁白｜维修人员修好后窗接缝，陈序宁按现场负责人安排核干燥范围。停用设备没有因为窗修好就重新通电，四本受潮册仍隔离。
陈序宁｜今天只核这次维修和干燥动线，电器继续按负责人检查，不用一段视频代替。
旁白｜林晚发来昨晚原说明会的回收：十九点半实际参加，二十点四十五结束。现在听见真实结果，才写下参加，不让昨晚忙乱把她的事情挤没。
叶澄｜这次维修确认收到了，工作片段按原当事人的要求处理。我自己核完手里的副本，不把删除写成没有拍过。
  `, 'y9_maintenance_delete', { flags: { y9WindowRepaired: true, y9WindowRepairedAt: '6-25 09:00', y9DryRouteChecked: true, y9BriefingAttended: true, y9BriefingFinishedAt: '6-24 20:45' } });
  add('y9_maintenance_delete', '自己的维修副本真实删掉，其他人的不代写', 'bookshop', '六月二十五日 · 09:20', ye, `
旁白｜陆遥与林姨分别确认维修用途已经完成，要求叶澄删除自己持有的工作副本。她实际删除原维修文件与缓存，说明结果，两人确认收到。
叶澄｜我这边删掉了，拍过、曾否改过用途的事实保留。维修人员与其他参与者的记录由本人按原范围处理，我不替所有设备声称已经全部删除。
沈知夏｜知道。影片项目已经不含这段，旧信、本人十秒和昨天合照也仍不导入。
旁白｜真正完成一件处理，会让接下来清楚一点，不会让陆遥必须补一句其实也没什么。
  `, 'y9_work_check', { flags: { y9YeMaintenanceCopyDeleted: true, y9YeMaintenanceCopyDeletedAt: '6-25 09:20', y9AllOtherCopiesDeletedClaimed: false } });
  add('y9_work_check', '十点，原十五分钟工作核对实际开始', 'bookshop', '六月二十五日 · 10:00', ye, `
旁白｜按第八章原约，十点我们核目录与新的用途答复，只到十点十五。不将昨夜的私人关系改成谁应该额外替谁完成一个上午。
叶澄｜所选结尾只有原核过来源的环境或自画物件与黑画面。维修私话不在里面，也不用人物情绪字幕。
旁白｜陈序宁另核设备停用与干燥动线，林姨只就自己空桌书架范围回执，其他当事人没有新答复的素材继续不用。
沈知夏｜这份范围可以逐项核，原设备借用说明不等于所有片段放映许可。
叶澄｜知道。今天形成可提交的新候选清单，最终放映范围与现场条件二十六号本人逐项确认，告别展仍未举办。
旁白｜十点十五，原核对实际结束，我收起自己的笔，回去发自己的完整材料。完成的是这次工作，不是从此所有问题都已解决。
  `, 'y9_publisher', { flags: { y9WorkCheckKept: true, y9WorkCheckTime: '6-25 10:00-10:15', y9CandidateSourcesChecked: true, y9CandidateUseListReady: true, y9FilmPublicApproved: false, y9FilmScreened: false } });
  add('y9_publisher', '十一点，材料从自己的邮箱发出', 'dorm', '六月二十五日 · 11:00', self, `
旁白｜十一点，我逐项核完作品说明与两份短样本，从自己邮箱发送完整材料。编辑回执确认收到，结果另等，不把收到写成正式入职。
沈知夏 · 消息｜完整材料已提交，今天这一轮自己完成。后续结果按真实回复记录。
旁白｜昨天当轮稿、今早核对与现在交件分别留在它们的日期。没有委托叶澄代写，没有为了片子空出我的发送键。
旁白｜窗外雨小了，我给自己倒一杯水，第一次觉得做到这一项不需要再借一份漂亮的影像证明。
  `, 'y9_business', { flags: { y9PublisherMaterialsSent: true, y9PublisherMaterialsSentAt: '6-25 11:00', y9PublisherDeadlineKept: true, y9PublisherWorkDelegated: false } });
  add('y9_business', '她自己的下一份工作，仍由她自己答', 'dorm', '六月二十五日 · 11:20', self, `
叶澄 · 工作消息｜收到外地影像助理项目询问，七月八日至八月四日四周，二十六号十七点前本人答复。目前只核条件，没接受、没出发。告别片的范围与这个工作分别处理。
沈知夏 · 消息｜收到。你自己的条件自己核，原项目和新的工作不合并成谁必须替谁决定。
旁白｜她讲的是当下真正收到的业务询问，私人暂停的方向也只听这份工作更新，没有被附带一场未来约会。明天的选择仍要等本人答复。
  `, 'y9_noon', { flags: { y9YeProjectInquiryReceived: true, y9YeProjectDates: '7-08 to 8-04', y9YeProjectReplyDeadline: '6-26 17:00', y9YeProjectAccepted: false, y9YeProjectDeparted: false } });
  add('y9_noon', 'Y9-05 · 有些片刻不需要证据', 'dorm', '六月二十五日 · 12:00', pair('lu_yao'), `
陆遥｜我找到一盏小灯，先存商品页，没有下单。光看照片还不知道放到新屋会不会合适。
沈知夏｜等你自己真正看过再选。
旁白｜她点头，又把那条冬天的围巾卷好。四本隔离、报价未下单、店主按时休息、原说明会和各自交件都保留，没人需要为我的关系停在桌边。
旁白｜叶澄的候选完成了这一轮，最终用途与现场条件仍待本人核，公开放映尚未发生。今晚没有照片留下私人对话，也没有恢复任何已经删除的旧原件。
旁白｜我合上今天的记录。喜欢、怕、愿意或暂停，都有真正说过的声音；下一段生活仍需要我们自己到场，而不是先找一份能够证明永远的片段。
  `, 'ye_nine_complete');
  for (const s of scenes) if (s.cast.includes('ye_cheng') && !/^y9_(repair_clip|candidate|film_|use_|plan)/.test(s.id)) s.spriteVariants = { ye_cheng: 'no_camera' };
  const data = { chapterId: 'ye9', scenes, gates };
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.RainChapterNineYe = data;
})(typeof window !== 'undefined' ? window : globalThis);
