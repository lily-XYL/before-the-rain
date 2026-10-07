(function (root) {
  'use strict';
  const scenes = [], gates = [];
  const script = text => text.trim().split('\n').map(line => {
    const i = line.indexOf('｜');
    if (i < 1) throw new Error('叶澄第七章对白缺少说话人物。');
    return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
  });
  const add = (id, title, location, time, cast, text, next, extra = {}) => scenes.push({ id, title, location, time, cast, lines: script(text), next, ...extra });
  const variation = (variantBy, variants) => ({ variantBy, variants: Object.fromEntries(Object.entries(variants).map(([key, text]) => [key, script(text)])) });
  const gate = (id, redirectBy, targets) => gates.push({ id, redirectBy, targets });
  const pair = id => ['shen_zhixia', id], ye = pair('ye_cheng'), self = ['shen_zhixia'];

  add('y7_morning', 'Y7-01 · 一张没有题目的便签', 'studio', '六月十九日 · 09:20', pair('xu_jianwei'), `
旁白｜十九号早上，我从工作室的窗边捡起一张被风吹落的便签。上面没有稿件编号，只有见微写的买茶包。
许见微｜留在桌上容易一起交给印厂。你捡起来以后，我今天至少还能喝茶。
沈知夏｜要不要给它单独编一个不交印号？
许见微｜那下次会忘记它到底归哪个目录。先交给我吧。
旁白｜我把便签递过去，才发现自己一直在笑。桌上真正要交的东西依旧很多，我却又想起叶澄说过的那盆植物。
旁白｜那盆植物还歪着，是她十八号讲过的很小的一件事。想到一片叶子怎样慢慢向光伸过去，我把手机放到一边，先吃完自己的早饭，不替今天尚未得到的答复催一个答案。
  `, 'y7_entry_gate');
  gate('y7_entry_gate', 'relationshipStatus', { tryingDates: 'y7_entry_date', gettingToKnow: 'y7_entry_slow', needsConversation: 'y7_entry_pending' });
  add('y7_entry_date', '原来的三点，是两个人已经答应的时间', 'studio', '六月十九日 · 09:25', self, `
旁白｜十八号，我们都答应试着约会。二十一号下午三点，看看那盆植物，再在楼下喝东西，是已经约好的下一次。
叶澄 · 消息｜三点还记着。那家店周六开门，我问过了，不让你只在一张很好看的照片里喝茶。
沈知夏 · 消息｜记着。植物如果还是歪的，我会不会需要先背一种比较礼貌的评价？
叶澄 · 消息｜不用。它暂时没有接受采访。
旁白｜我笑着收好手机。真实答应过的约会在，上午校样也还在，不需要把其中一件藏到另一件后面。
  `, 'y7_proof', { flags: { y7EntryStatus: 'tryingDates' } });
  add('y7_entry_slow', '愿意多认识一点，也有明确的下午', 'studio', '六月十九日 · 09:25', self, `
旁白｜十八号得到的是继续了解，二十一号三点的见面已有答复。她记得我想喝热的，没有因此多出一份确定恋人的答案。
叶澄 · 消息｜那家店周六开门。三点照旧，想喝别的到时再选，不用为了我提前决定。
沈知夏 · 消息｜好。植物现在怎样？
叶澄 · 消息｜新叶有一点斜。我拍了好几张，后来发现只是想让你看看。
旁白｜我看着她后来补的这一句。没有很完整的构图，也能是一件想告诉我的小事。
  `, 'y7_proof', { flags: { y7EntryStatus: 'gettingToKnow' } });
  add('y7_entry_pending', '十二点先谈修改，不预支私人答复', 'studio', '六月十九日 · 09:25', self, `
旁白｜十八号私人答复仍是先谈清楚。十九号十二点原本就留给具体调整，二十一号的植物和茶没有被我单方面填成已经约好。
叶澄 · 消息｜中午先看那一项。设备说明仍按原版，不把还没答应的播放片段写进清单。
沈知夏 · 消息｜知道。要问私人见面，我之后重新问。
旁白｜我把两项拆开记。她愿意继续合作，也能还没有准备好靠近；一个人想看某盆植物，不会使另一个人失去回答的时间。
  `, 'y7_proof', { flags: { y7EntryStatus: 'needsConversation' } });
  add('y7_proof', '页码和回信，都按真正得到的版本', 'studio', '六月十九日 · 09:30', pair('xu_jianwei'), `
旁白｜我们核完页码、原规格和作者确认件。郑素琴最后答应的原句保留，未回信的名字没有因为今天是截止日而变成可以。
许见微｜你看见一项空着，先看它为什么空着。今天不用替每个没有答复的人赶一次进度。
沈知夏｜基础册里只保留已确认的。现场片段另列，也不拿旧设备说明代替放映答复。
旁白｜她点头。我翻到第二十四页，发现自己终于能把这一轮的最后一项看完，而不急着替后面所有事情画一个勾。
  `, 'y7_proof_done', variation('workflow', {
    collective: '旁白｜六十本、二十四页按共同分工逐项核过。现场单页与各自待回的内容仍独立，未确认的没有混进基础版。',
    solo: '旁白｜独自接下的修改直到昨天仍未最终定稿。今天按十九号十点的新期限完成最后核对，不把新回执写回十七号。',
    smaller: '旁白｜四十本、二十四页、八百六十元按原缩小方案核过，二百二十元机动仍在；不临时恢复删去的节目或印数。'
  }));
  add('y7_proof_done', '十点前，确认件真正收到回执', 'studio', '六月十九日 · 10:00', pair('xu_jianwei'), `
旁白｜九点五十二，我们发出最终确认件；十点前印厂逐项回执，原规格和二十号交印日期也核清。基础版这才标为可交印。
沈知夏｜现在想看一点不用核页码的东西。
许见微｜窗外那棵树可以。你刚才已经对着它看了三次。
旁白｜我不好意思地笑。她没问我究竟是在看树，还是在想某个人，只把买茶包的便签重新夹到自己的包上。
旁白｜完成这一轮之后，我仍要承担自己的工作，也仍有一项过去没说清楚的回复等着中午。
  `, 'y7_repair_choice', { flags: { layoutReady: true, finalLayoutConfirmed: true, y7ProofConfirmed: true, y7ProofReceiptTime: '6-19 09:52-10:00' } });
  add('y7_repair_choice', '选择一 · 原来欠的具体回应', 'studio', '六月十九日 · 11:40', self, '旁白｜那张未确认清单不会因为我已经想好周六喝什么就消失。今天怎样答，仍由我自己做。', null, { choices: [
    { text: '实际改完并等她确认，不把收到消息算成同意。', flags: { y7RepairChoice: 'act' }, next: 'y7_repair_pending_gate' },
    { text: '准时说明仍未完成，继续只用已确认的范围。', flags: { y7RepairChoice: 'hold' }, next: 'y7_repair_hold' }
  ] });
  gate('y7_repair_pending_gate', 'pendingOmittedConversation', { true: 'y7_repair_person_gate', false: 'y7_repair_already' });
  gate('y7_repair_person_gate', 'omittedPerson', { lin: 'y7_repair_lin', xu: 'y7_repair_xu', zhou: 'y7_repair_zhou', ye: 'y7_repair_ye' });
  for (const [id, cast, name, adjustment] of [
    ['lin', 'lin_wan', '林晚', '原句逐一对作者确认件，未回复的继续留白'],
    ['xu', 'xu_jianwei', '许见微', '原尺寸和折边保留，不追加未答应的新排版'],
    ['zhou', 'zhou_zhi', '周栀', '换场撤场单列，不临时加歌或替她接新串场'],
    ['ye', 'ye_cheng', '叶澄', '设备、字幕和片段用途分别核，未获被拍者确认的不进播放单']
  ]) add('y7_repair_' + id, '十二点，修改和答复真实发生', 'studio', '六月十九日 · 12:00–12:20', pair(cast), `
沈知夏 · 消息｜实际修改发给你：${adjustment}。我只请你看标出的这一项，其他待办不默认由你接。
旁白｜她指出一句仍不清楚的说明，我改完再发。十二点二十分前，收到的是看过版本后的明确确认，不是一个被我擅自理解成全部同意的已读。
${name} · 消息｜现在这一项可以，其他原范围保留。私人内容和新增工作仍另问。
沈知夏 · 消息｜好。以前没做的那次不改日期，今天这次记今天。
旁白｜我更新待办，手指终于从发送键上移开。真实改完一件事会轻一点，但不会让另一个人必须立刻答应我想要的关系。
  `, 'y7_lu_gate', { flags: { pendingOmittedConversation: false, repairStarted: true, omittedContribution: 'confirmedPartOnly', y7RepairCompleted: true } });
  add('y7_repair_already', '已确认的保留，不重复给她一份作业', 'studio', '六月十九日 · 12:00', self, `
旁白｜旧修改已经得到真实确认。今天没有拿同一项再向她讨一次回复，只发当前版本的范围说明。
沈知夏 · 消息｜原确认照旧。新问题等各自能看的时间，不默认今天接。
旁白｜她回了收到。我把未获答复的新项继续留在自己的待办里，午饭也终于不需要一边吃一边刷新每个人的消息。
  `, 'y7_lu_gate', { flags: { y7RepairCompleted: false } });
  add('y7_repair_hold', '准时说还没有，也保留真实欠项', 'studio', '六月十九日 · 12:00', self, '旁白｜十二点，我准时说明今天做到哪里，不再让对方从一直没有回复里猜进度。', 'y7_lu_gate', { ...variation('pendingOmittedConversation', {
    true: '沈知夏 · 消息｜具体修改仍未完成，未确认项继续停用。今天只是说明，不记成你已答应。\n旁白｜她答知道了，也说那一项仍不接。失落留在我这边，没有追加一个你先相信我的请求。',
    false: '旁白｜以前真正确认过的范围保留，新增的仍另问。今天没有完成新修改，也不把已有答复撤成从未发生。'
  }), flags: { y7RepairCompleted: false } });
  gate('y7_lu_gate', 'pendingLuConversation', { true: 'y7_lu_talk', false: 'y7_lu_daily' });
  add('y7_lu_talk', 'Y7-02 · 八点，朋友自己的下一站', 'dorm', '六月十九日 · 20:00', pair('lu_yao'), `
旁白｜八点前我回到宿舍，按原约坐到陆遥旁边。她先没有打开房屋视频，而是讲寄件点那张写错一位数字的单子。
陆遥｜站在柜台前重新写的时候，忽然很想让你笑一下。后来又觉得你可能正在忙一件更值得说的事。
沈知夏｜以前让你总等我有空，对不起。你不用先讲一件特别值得说的事。
旁白｜她从箱子里拿出一张被胶带粘过的明信片，边角拉起一点纸毛。是新街早餐店的广告，她觉得图上的包子像一盏灯。
陆遥｜我还想去那里吃。不想到了以后，只剩一份需要不断检查没有受骗的房屋表。
沈知夏｜想听你那里的普通一天。检查的我也会继续看，但不把全部话都接成有没有问题。
旁白｜我们讲了一会儿笑话，再核真正待确认的两项。她并没有因为我终于坐下听，就替以前的失约说都没关系。
陆遥｜二十八号晚饭和入口核对，二十九号七点五十出门、九点二十车。你自己记。
沈知夏｜记着。今天先让我看看那只很像灯的包子。
  `, 'y7_lu_done');
  add('y7_lu_done', '坐过这段时间以后，才记下完成', 'dorm', '六月十九日 · 20:35', pair('lu_yao'), `
旁白｜八点的谈话与房屋记录核对实际发生。我记下她自己的期待，也把仍待落实的两项另列，没有要求她把过去没做到的日子重写。
陆遥｜你明天还要出去吗？
沈知夏｜要交印，之后核影像提案。晚上自己的试稿反馈自己改。
陆遥｜那先吃东西。知道自己去哪儿很好，也别只记得去哪儿。
  `, 'y7_print', { flags: { pendingLuConversation: false, luVideoChecked: true, friendshipRepair: 'continued', y7LuTalkKept: true } });
  add('y7_lu_daily', '已经谈过，也能笑一件普通的事', 'dorm', '六月十九日 · 20:00', pair('lu_yao'), `
旁白｜陆遥将胶带卷放在膝盖上，研究它能不能在箱子最后一面撑到封完。我说可以斜着贴，她说那会像一个准备参加评比的箱子。
沈知夏｜它的参赛项目可能是，里面究竟还有几只单独的袜子。
陆遥｜这一题别问。毕业以前不打算公布答案。
旁白｜我笑着帮她捡起掉在地上的笔。之前真正聊过的事仍在，今天没有重演一次和好，也值得一起笑。
陆遥｜二十八号晚饭、入口核对，二十九号送站照旧。你那天想吃什么，也提前想一下。
沈知夏｜想喝汤。这回不是先问你想吃什么再说我也一样。
旁白｜她满意地点头，继续封那只没有必要参加评比的箱子。
  `, 'y7_print', { flags: { y7LuTalkKept: false } });
  add('y7_print', 'Y7-03 · 文件交出去，实物还要等', 'studio', '六月二十日 · 10:00', pair('xu_jianwei'), `
旁白｜二十号上午，最终文件、原规格和作者确认件交给印厂。见微核版本，我核原印数与二十四页，回执逐项收到以后才签交接日期。
许见微｜到货再抽检。蓝夹子里现在不是已经验过的实物。
沈知夏｜知道。影像也另列，原来没有获准播放的，不能在交印表里顺便变成获准。
旁白｜她点头，将抽检顺序留在下一页。林晚继续核原件，周栀自行联络器材，大家各有自己的工作，不会因为我进入另一段故事就忽然停下。
  `, 'y7_equipment', { flags: { y7PrintHandedOff: true, y7PrintHandoffDate: '6-20', y7SamplesChecked: false } });
  add('y7_equipment', '设备说明，不是一个自动上映的按钮', 'bookshop', '六月二十日 · 13:40', pair('chen_xuning'), `
旁白｜陈老师带来投影接口和归还时段的说明。我们只核型号与摆放，不放入私人信件或人物片段试机器。
陈序宁｜供电和动线到场再核。能借设备，不等于有任何一段片子的放映许可；音量也要看店里最后实际安排。
叶澄｜知道。现在只剪内部候选版，片段逐项确认后才另问用途。
沈知夏｜原播放单仍未获准，不先改它。
旁白｜陈老师收好说明，林姨过来把窗边两本书移开。她只同意今天十四点到十四点十五拍空桌和书架，画面里没人，没有私人声轨，仅供内部核对场地候选。
林岚｜今天我七点半照旧休息。你们核清这一小段，不用等我到关门后再重拍。
  `, 'y7_roughcut', { flags: { y7EquipmentScopeChecked: true, y7EnvironmentSessionApproved: true, y7PublicScreeningApproved: false, y7PrivateClipImported: false, y7PrivateClipRecorded: false, y7PrivateClipPublic: false } });
  add('y7_roughcut', '灰色画面里，也有一个被解释的我', 'bookshop', '六月二十日 · 14:00', ye, `
旁白｜叶澄打开候选粗剪，标题栏写着三分四十八秒，待核。空桌转场的建议后是一格灰色占位，旁边两行拟拍说明忽然让我停住。
旁白｜“知夏读完信，低头。”“字幕：终于愿意留下。”没有我的真实画面，也没有旧信的文字，那个停顿却已经有了她替我写下的意思。
叶澄｜这里还没拍，只是提案。想从空桌转到一个人，再回到书店……我觉得这样，结尾会近一点。
沈知夏｜近到谁？
旁白｜她看向我，没立刻答。我原本只是想帮她看看顺序，那两行字却让我觉得，自己必须在她需要的那种心情里坐好。
叶澄｜你可以不同意。不想用这一段也能重新剪，我还没有想清楚。
旁白｜我知道她没有偷偷拍，也知道提议和真正使用不是一回事。可我仍然不舒服：我的读信之后，不只是一条用来证明作品终于有结尾的线。
  `, 'y7_old_camera_gate', { flags: { y7EmotionProposalSeen: true, y7EmotionProposalFilmed: false, y7PrivateEmotionTextUsed: false } });
  gate('y7_old_camera_gate', 'cameraScope', { private: 'y7_old_private', none: 'y7_old_none', discuss: 'y7_old_discuss' });
  add('y7_old_private', '原十秒仍只在原收件人手里', 'bookshop', '六月二十日 · 14:05', ye, `
沈知夏｜八号那十秒只留给我自己。你传给我以后删了相机上的那段，现在这里没有它，对吗？
叶澄｜没有。我没留副本，也没请你转回来。那一次已经交给你，今天这格不是它，只是我新画的分镜。
旁白｜她点开素材目录，灰色格子后面没有一段可以悄悄还原的私人影像。原件已经删除的事实没有因为后来关系近一点而被收回。
沈知夏｜我没有答应在影片里重演读信，也没有答应那句解释。
叶澄｜知道。这格还不能用，不拿原十秒来补。
旁白｜我松了一点气，仍没把不舒服咽下去。素材没被偷用，不代表我就必须喜欢这份建议。
  `, 'y7_work_choice', { flags: { y7OldClipBoundaryChecked: true } });
  add('y7_old_none', '原来没拍的，不会藏在另一条轨道', 'bookshop', '六月二十日 · 14:05', ye, `
沈知夏｜八号我说不记录自己，你等我走开才拍空桌。现在也没有一段读信后的我。
叶澄｜没有。这里是新提案，不是没告诉你的旧镜头。我应该先问你想不想把这件事交给影片，而不是先替它找到一行漂亮的字幕。
旁白｜她把素材目录打开，实际画面仍是原来允许的空桌，没有一个被另一条轨道藏住的人。
沈知夏｜我不想用一个新表演，把以前没记录的下午补成你想要的反应。
叶澄｜那就不补。这里可以换一种结构，不需要你来证明它真实。
旁白｜我点头。她肯听，可我仍需要讲自己的感受，不只点一个文件没有问题的头。
  `, 'y7_work_choice', { flags: { y7OldClipBoundaryChecked: true } });
  add('y7_old_discuss', '讨论过构图，不等于后来已经开机', 'bookshop', '六月二十日 · 14:05', ye, `
沈知夏｜八号我们只聊构图，没有开机。那只手停在书边的建议，也不是答应你以后用一个替我解释的字幕。
叶澄｜对。今天是新的分镜，我没有将那次讨论记成拍摄许可。这格还没拍，也不能仅凭我觉得很合适就让你坐进去。
旁白｜她给我看候选素材与那张纸，讨论过的构图仍是一张纸。我忽然想起八号自己说，停顿不一定只意味着难过。
沈知夏｜现在想再说一次。停顿也不只意味着，终于决定留下。
叶澄｜听见了。我先删这个解释，之后想怎样拍，再从真正的新问题开始问。
  `, 'y7_work_choice', { flags: { y7OldClipBoundaryChecked: true } });
  add('y7_work_choice', '选择二 · 让作品怎样继续', 'bookshop', '六月二十日 · 14:10', ye, `
旁白｜还未拍的私人占位从本次候选里撤下，解释字幕也移除。叶澄问我，接下来更愿意先看哪一种替代；这是工作选择，不是一份喜欢她的证明。
  `, null, { flags: { y7EmotionProposalRemoved: true, y7PrivateEmotionTextUsed: false }, choices: [
    { text: '只拍今天获准的空桌与书架，让空镜自己成立。', flags: { y7FilmChoice: 'empty' }, next: 'y7_film_empty' },
    { text: '由她画新分镜配空画面，不让任何人重演私人情绪。', flags: { y7FilmChoice: 'drawing' }, next: 'y7_film_drawing' },
    { text: '今天先保留空白与待核说明，暂不拍摄或确定结尾。', flags: { y7FilmChoice: 'pending' }, next: 'y7_film_pending' }
  ] });
  add('y7_film_empty', '空桌不必被写成缺少一个人', 'bookshop', '六月二十日 · 14:10–14:15', ye, `
旁白｜我走出取景范围，叶澄才将相机架稳。录下的是林姨今天实际答应的空桌和书架，没有人物、原信正文或私人声音。
叶澄｜以前看空桌，总想说这里曾经坐过谁。今天先不替它安排一位必须难过的读者。
沈知夏｜也不一定难过。只是椅子推进去以后，有地方放包了。
旁白｜她笑了一下，换了一个能看清桌沿的角度。十四点十五收机，拍摄按原时段结束，没有让我再坐回去补一个所谓自然反应。
叶澄｜光动了一点。这个变化够用了。
旁白｜我看过候选片段。没有我在里面，作品也并没有因此变得更远；她仍需要给这些光一个自己的判断。
  `, 'y7_film_done', { flags: { y7NewEnvironmentRecorded: true, y7DrawingMade: false, y7CandidateReady: true } });
  add('y7_film_drawing', '她自己的线条，也能有一个停顿', 'bookshop', '六月二十日 · 14:10–14:15', ye, `
旁白｜叶澄关掉相机，在新纸上画空桌、门口和一枚空白书签。画的是新的物件分镜，不描摹我的侧影，也不临摹原信。
沈知夏｜这张椅子怎么有五条腿？
叶澄｜因为我总怕它站不稳。删一条吧，不让它替我的紧张承担这么多。
旁白｜我忍不住笑。她自己改完，再将纸放在未录人物的空画面旁，先标候选，不直接合成一份已经可以上映的文件。
叶澄｜我能从自己的线条开始讲，不一定非得找到一个人替我证明这间店有故事。
沈知夏｜想看你怎样让它们接起来。不想看我被放在哪一种心情里。
旁白｜她点头，将那句写在自己工作本里；只记这次工作边界，没有把整段私人话抄作新字幕。
  `, 'y7_film_done', { flags: { y7NewEnvironmentRecorded: false, y7DrawingMade: true, y7CandidateReady: true } });
  add('y7_film_pending', '今天不拍，也不是一次需要挽救的失败', 'bookshop', '六月二十日 · 14:10–14:15', ye, `
沈知夏｜今天先别确定。空白的地方写待核，不为了这十五分钟必须交出一个结尾。
叶澄｜好。这个时间我能先核已经有的顺序，没拍的就仍没拍。
旁白｜她收起相机，给空格写了待讨论。候选片段和说明分开，没有一张叫作临时同意的纸被夹进里面。
沈知夏｜会不会影响你今晚自己的交件？
叶澄｜今晚交的是目录和进度，不是公映版。未完成照实写，也是我该自己答的部分。
旁白｜我想起自己曾经多么怕在截止日写一个未完成。她将空白留在眼前，没有要求我来补成一次彼此更信任。
  `, 'y7_film_done', { flags: { y7NewEnvironmentRecorded: false, y7DrawingMade: false, y7CandidateReady: false } });
  add('y7_film_done', '候选、待核与放映，各有自己的日期', 'bookshop', '六月二十日 · 14:20', ye, `
旁白｜新版本仍只供内部场地与结构核对，不在筹备群发可播放视频，也未批准告别展放映。原播放单没有被今天的决定改写。
叶澄｜我二十二号十点能留二十分钟核片段目录。放映需要之后逐项问，不先让设备表替被拍的人答应。
沈知夏｜十点到十点二十，工作核对。自己的材料我二十号五点半交，不请你顺便替我改。
旁白｜她收到这个时间，写进工作本。下一次讨论已经获准，但讨论本身还没发生。
  `, 'y7_invite_gate', { flags: { y7CandidateScopeConfirmed: true, y7WorkCheckBooked: true, y7WorkCheckTime: '6-22 10:00-10:20' } });
  gate('y7_invite_gate', 'y7EntryStatus', { tryingDates: 'y7_invite_kept', gettingToKnow: 'y7_invite_kept', needsConversation: 'y7_selected_repair_gate' });
  gate('y7_selected_repair_gate', 'pendingOmittedConversation', { false: 'y7_invite_new', true: 'y7_selected_person_gate' });
  gate('y7_selected_person_gate', 'omittedPerson', { ye: 'y7_invite_work', lin: 'y7_invite_new', xu: 'y7_invite_new', zhou: 'y7_invite_new' });
  add('y7_invite_kept', '原来答应的三点，再确认一次', 'dorm', '六月二十日 · 17:40', self, `
沈知夏 · 消息｜自己的试稿反馈刚按时交了。明天下午三点照旧，你那里想从哪里见？
叶澄 · 消息｜楼下门廊。小花盆明天挪下来透气，我们看一会儿，再去那家店。我不带相机。
沈知夏 · 消息｜好。今天工作里没说清的感受，我想明天亲口说，不混进新字幕意见。
叶澄 · 消息｜愿意听。也想有一点不看时间线的下午。
旁白｜我将她的答复留下。明天想认真谈，也可以先看看一片新叶子；不用规定自己见面第一句话必须处理完所有问题。
  `, 'y7_feedback_done', { flags: { y7MeetingKind: 'private', y7PrivateInvitationAccepted: true, y7MeetingBooked: '6-21 15:00 plantAndTea' } });
  add('y7_invite_new', '旧修改真实确认以后，私人时间另问', 'dorm', '六月二十日 · 17:40', self, `
沈知夏 · 消息｜旧修改已经核过。明天下午三点，你愿意先看看植物，在楼下坐一会儿吗？想继续认识你，也想讲今天自己的感受，不将工作确认当成私人同意。
叶澄 · 消息｜愿意。先继续了解，我把小花盆挪到门廊透气，不带相机。三点到那里见。
沈知夏 · 消息｜好。你也可以讲自己的感觉，不只听我说你哪一项做得好或不好。
旁白｜新见面从这一次实际答应开始。十八号没有开始约会的事实保留，没有被我补成原本就有这张周六的邀请。
  `, 'y7_feedback_done', { flags: { y7MeetingKind: 'private', y7PrivateInvitationAccepted: true, y7MeetingBooked: '6-21 15:00 plantAndTea', relationshipStatus: 'gettingToKnow' } });
  add('y7_invite_work', '未回应的旧事仍在，就按二十分钟来', 'dorm', '六月二十日 · 17:40', self, `
沈知夏 · 消息｜旧修改仍未完成。明天下午三点能否在书店核二十分钟范围？不去看植物，不把未确认的私人相处接在工作后面。
叶澄 · 消息｜可以，书店十五点到十五点二十。之后我有自己的安排；私人时间等具体回应以后重新问。
沈知夏 · 消息｜收到。自己的试稿反馈已经交了，明天只带这张待核说明。
旁白｜我记下答复，没有另外预订两个人的饮料。她同意工作谈话，既不是完全不愿见我，也不是能被解释成终于肯约会。
  `, 'y7_feedback_done', { flags: { y7MeetingKind: 'workOnly', y7PrivateInvitationAccepted: false, y7MeetingBooked: '6-21 15:00-15:20 work' } });
  add('y7_feedback_done', '自己的文件，也有真实的回执', 'dorm', '六月二十日 · 18:00', pair('lu_yao'), `
旁白｜五点半提交的试稿反馈已经收到编辑确认。自己的工作没有转给叶澄，也没有为了多看一段粗剪改成明天再说。
陆遥｜那今晚你能自己挑一个配菜吗？
沈知夏｜能。不要让我选一种和未来规划有关的菜。
陆遥｜那选黄瓜，它应该只和今天有关。
旁白｜我笑着拿起菜单，头一次觉得，一天真实做过什么，也包括自己认真挑了一种不需要特殊意义的配菜。
  `, 'y7_ye_progress', { flags: { y7ShenFeedbackSent: true, y7ShenFeedbackSentAt: '6-20 17:30', y7ShenWorkDelegated: false } });
  add('y7_ye_progress', '她自己的目录，也按真实进度交出', 'dorm', '六月二十日 · 21:00', self, `
叶澄 · 消息｜目录与变更说明刚发给陈老师，已收到回执。今天选过的方案按真实状态写，未拍的没记成拍过，也没把内部候选写成已经可以放映。
沈知夏 · 消息｜收到。自己的交件也能有未完成项，下一轮按原来答应的二十二号十点核。
旁白｜她发来的是收到回执这件事，不是私人素材或需要我替她证明做得足够好的整份影片。那一格与字幕已撤下，她自己的工作也没有因为知夏没被拍进去就突然失败。
旁白｜我将工作消息收好。明天下午在哪里见、能谈到哪里，都仍按两个人真正答应的版本。
  `, 'y7_meeting_gate', { flags: { y7YeProgressSent: true, y7YeProgressSentAt: '6-20 21:00', y7YePublicCutCompleted: false } });
  gate('y7_meeting_gate', 'y7MeetingKind', { private: 'y7_plant', workOnly: 'y7_work_meet' });
  add('y7_plant', 'Y7-04 · 她抱着那盆真的长歪的植物', 'old_street', '六月二十一日 · 15:00', ye, `
旁白｜三点，我到租房楼下的门廊。叶澄抱着一个比两只手大不了多少的花盆，衬衫袖口有一点没擦净的土。
叶澄｜原来想先擦干净，后来觉得你已经快到了。它不像照片里那么整齐。
沈知夏｜照片里也没有很整齐。
叶澄｜那可能是我记忆里的构图替它整理过了。
旁白｜我忍不住笑。叶子朝一边伸，盆边压着一小块破陶片，她说留来防止浇水太急。没有相机包，她的手终于有一个很实际的地方可以放。
沈知夏｜我今天不是来验收它是不是终于长好了。
叶澄｜知道。只是想给你看看它真的这样，然后去喝一点东西。
旁白｜我蹲下来，看见叶背一根很细的叶脉。她也蹲在旁边，没有开拍，不要求我重复一个更像第一次发现的表情。
  `, 'y7_tea', { flags: { y7MeetingKept: true, y7PrivateMeetingKept: true, y7WorkMeetingKept: false, y7PlantSeen: true, y7CameraAbsent: true } });
  add('y7_tea', '不用镜头，两只杯子也放得稳', 'old_street', '六月二十一日 · 15:20', ye, `
旁白｜把花盆放回安全的窗台以后，我们坐到楼下店铺靠里的桌边。她挑了一杯温的，我看完菜单，选自己想喝的那一种。
叶澄｜你刚才是不是本来想说和我一样？
沈知夏｜有一点。看起来比重新想一个答案容易。
叶澄｜我也会。别人问最近怎样，我就讲片子剪到哪里，好像那是最不会出错的回答。
旁白｜她握着杯沿笑了一下。窗外一辆送货车缓慢倒过去，遮住我们面前的光，又慢慢将它还回来。
沈知夏｜片子确实是你的一部分，但我也想听一点别的。
叶澄｜那我今天早餐煮过头了。锅底那一层，已经不太适合继续用一个很好的词来解释。
旁白｜我笑出声。她终于也跟着笑，没把这段普通的窘迫藏进一个制作人的自我介绍里。
  `, 'y7_topic_private', { flags: { y7TeaKept: true } });
  add('y7_topic_private', '选择三 · 想听她怎样过一天', 'old_street', '六月二十一日 · 15:30', ye, '叶澄｜工作以外也能讲。你想先听哪一种不一定值得拍的事？', null, { choices: [
    { text: '问植物、早餐和房间里那些很小的习惯。', flags: { y7TopicChoice: 'ordinary' }, next: 'y7_topic_ordinary' },
    { text: '问她怎样开始喜欢影像，也听她现在仍不确定的地方。', flags: { y7TopicChoice: 'making' }, next: 'y7_topic_making' }
  ] });
  add('y7_topic_ordinary', '三种失败的早饭，和一只不听话的杯子', 'old_street', '六月二十一日 · 15:35', ye, `
叶澄｜有一只杯子底不太平，我每次洗完都放同一个地方，后来那个地方就有一圈很淡的印子。
沈知夏｜你为什么还用？
叶澄｜因为拿起来很顺手。也可能因为我总以为下一次会记得垫好。
旁白｜她讲到后来，自己觉得这句话十分不可靠。我告诉她宿舍那张被茶染过的便签，一直还粘在架子边。
沈知夏｜陆遥说它可能比我更早适应搬家，因为已经彻底失去原来的颜色。
叶澄｜你愿意以后发给我看看吗？不作素材，只是想看你笑的是哪张纸。
沈知夏｜愿意。等我真发的时候还是会问你有没有空，不要求你必须回一句特别好笑的话。
旁白｜她点头，喝了一口温茶。普通生活被问起，不会因此自动成为一个新的记录项目。
  `, 'y7_discomfort', { flags: { y7PersonalStoryShared: true } });
  add('y7_topic_making', '一个不够完整，也仍是她自己的开始', 'old_street', '六月二十一日 · 15:35', ye, `
叶澄｜最早喜欢拍的，是放学回去那段路。没想讲一个主题，只觉得第二天的光和第一天不一样。
沈知夏｜后来开始觉得，要有一个很像答案的结尾？
叶澄｜交作业以后。有人问想表达什么，我总觉得答不知道，好像前面全白做了。
旁白｜她拿杯沿比了一下那条路的方向，没有向我展示一段必须被称赞的旧片。她自己的困惑终于不藏在别人被拍得有多真实后面。
沈知夏｜我交试稿时也怕那一句。会把并没有想明白的话写得特别像已经想明白。
叶澄｜昨天那条字幕可能就是这样。想把影片结束得很确定，却将你的下午写得像我已经全部看懂。
旁白｜她看着我。这一次我没有急着说没关系，先把真正没关系的部分和仍不舒服的部分留在自己心里。
  `, 'y7_discomfort', { flags: { y7PersonalStoryShared: true } });
  add('y7_work_meet', '三点，只在她同意的二十分钟里', 'bookshop', '六月二十一日 · 15:00', ye, `
旁白｜三点，我们在书店核工作说明。叶澄没有带花盆，也没有替我点两个人的饮料，桌上只放那张已经移除私人占位的候选表。
叶澄｜昨天未获准的部分没有拍。今天谈范围，十五点二十我离开，之后按自己的安排。
沈知夏｜收到。我不会用顺便聊两句把它延长成原来没有答应的见面。
旁白｜她点头，向我指出候选目录里的一项新问题。我仍想和她更近一点，也能先坐在真正得到的范围里。
  `, 'y7_topic_work', { flags: { y7MeetingKept: true, y7PrivateMeetingKept: false, y7WorkMeetingKept: true, y7PlantSeen: false, y7TeaKept: false, y7CameraAbsent: true, y7PersonalStoryShared: false } });
  add('y7_topic_work', '选择三 · 工作范围内，先核哪一项', 'bookshop', '六月二十一日 · 15:05', ye, '叶澄｜只核今天这张说明。你想先看题材范围，还是能承担的时段？', null, { choices: [
    { text: '核空镜、分镜与待确认片段分别是什么。', flags: { y7TopicChoice: 'scope' }, next: 'y7_topic_scope' },
    { text: '核她自己的交件与我们各自可提供的时间。', flags: { y7TopicChoice: 'capacity' }, next: 'y7_topic_capacity' }
  ] });
  add('y7_topic_scope', '题材写清，不拿空白偷偷装进一个人', 'bookshop', '六月二十一日 · 15:08', ye, `
旁白｜我们逐项看空镜、她自己的物件分镜和待讨论的空白。原私人十秒、旧信正文和未获同意的解释字幕都没有进入候选。
沈知夏｜内部核目录也要分原用途，不能让可看一项被写成可以看所有人的私人内容。
叶澄｜知道。没有新答复的保留待核，不补一个默认能用的人物镜头。
旁白｜她写明版本，我只核这次实际看过的项目，没有把自己来过一次书店记成所有片段都已批准。
  `, 'y7_discomfort_work');
  add('y7_topic_capacity', '二十分钟里，原工作也有自己的量', 'bookshop', '六月二十一日 · 15:08', ye, `
叶澄｜今晚交自己的目录进度，后面仍有要剪的部分。我不能将来访者新答复都接成马上重做。
沈知夏｜自己的出版社材料我也自己写。能做的是二十二号那二十分钟核目录，不替你向所有人收私人拍摄答复。
旁白｜她把两个人的工作各留一行，十点至十点二十仍只是一份未来核对约定，不是现在已经完成的审片。
沈知夏｜你没空时直接说，不用先答都可以。
叶澄｜你也一样。我们不用互相演一个不会增加负担的人。
  `, 'y7_discomfort_work');
  add('y7_discomfort', 'Y7-05 · 昨天那一格，在今天嘴边停住', 'old_street', '六月二十一日 · 16:00', ye, `
旁白｜茶渐渐不那么热。我再想起昨天的灰色占位，忽然怕一开口，就把刚才的轻松全变成一次工作纠错。
叶澄｜你刚才说想讲自己的感受。现在愿意说吗？我也想听见，不只猜一份你没有写出来的剪辑意见。
沈知夏｜我怕说出来以后，我们今天只剩这件事。
叶澄｜不会因为你不舒服，刚才看植物和喝茶就没发生。也不想用刚才很开心，让你必须把不舒服收回去。
旁白｜她停下来等我。那两行字幕已经撤下，感受却还在；我不能只确认文件被改过，就假装自己也已经说过。
  `, 'y7_response_choice');
  add('y7_discomfort_work', '未拍的仍未拍，自己的感受也能说清', 'bookshop', '六月二十一日 · 15:12', ye, `
旁白｜目录核完一项，昨天那两行拟拍说明又停在嘴边。它已撤下，但我还没有说过自己怎样看这件事。
叶澄｜你可以讲对这个提案的感受，原私人暂停也仍保留。我们不因为今天工作能聊，就顺便答应别的。
沈知夏｜知道。今天仍只到十五点二十。
旁白｜她点头。我可以表达自己，也可以尊重她现在只愿意给出的范围，这两件事不必互相抵消。
  `, 'y7_response_choice_work');
  const responses = [
    { text: '直接说：不想让影片替我解释读信后的私人情绪。', flags: { y7ResponseChoice: 'direct' }, next: 'y7_response_direct' },
    { text: '先谈怎样用空镜替代，还没有说出自己为何不舒服。', flags: { y7ResponseChoice: 'alternative' }, next: 'y7_response_alternative' },
    { text: '说你看着办，把自己的不舒服压下去。', flags: { y7ResponseChoice: 'pretend' }, next: 'y7_response_pretend' }
  ];
  add('y7_response_choice', '选择四 · 让她听到哪一句', 'old_street', '六月二十一日 · 16:05', ye, '旁白｜我想被她听见，又还在害怕自己的真实答复会让她失望。', null, { choices: responses });
  add('y7_response_choice_work', '选择四 · 不扩大见面，也不替自己说都可以', 'bookshop', '六月二十一日 · 15:13', ye, '旁白｜剩下的工作时间有限，仍能说清自己真正怎样看昨天的提案。', null, { choices: responses.map(c => ({ ...c, next: c.next + '_work' })) });
  gate('y7_response_location', 'y7MeetingKind', { private: 'y7_response_private', workOnly: 'y7_response_work' });
  add('y7_response_direct', '那不是一个可以替我填好的答案', 'old_street', '六月二十一日 · 当次谈话', ye, `
沈知夏｜我不想让影片解释我读信后的私人情绪。昨天看见那两行，即使知道没拍，还是觉得自己被放进你需要的那个答案。
叶澄｜听见了。抱歉。我没偷拍，也不能拿这一点让你觉得必须接受我的解释。
沈知夏｜我能看工作提案，也能不喜欢它。我不想重演一个终于愿意留下的表情。
叶澄｜不用重演。那一格和字幕已经撤下，之后也不恢复。我自己的影片结构，我自己找别的办法。
旁白｜她没有要我证明不舒服足够严重。我终于知道，自己不是非得把她说成做过更坏的事，才有资格讲现在这句不。
  `, 'y7_response_location', { flags: { y7DiscomfortNamed: true, y7PretenceCorrected: false } });
  add('y7_response_alternative', '谈了许多办法，还没有谈到我自己', 'old_street', '六月二十一日 · 当次谈话', ye, `
沈知夏｜空桌可以接窗边的变化，不一定非得有一个人物镜头。你的分镜也能留停顿，没必要替我填一句字幕。
叶澄｜这个办法我想试。但你现在讲的是它能怎样完成，我还不知道你看见昨天那一格时的感受。
旁白｜我低头，才发现自己把很多真实的话写成了一份看起来很有用的建议。害怕不能合作以后，就没有别的理由让她听我说。
叶澄｜工作已经按未获准撤下，仍不重拍。你想讲自己，可以慢一点；不用先给我一个替代办法，才配让我知道不喜欢。
旁白｜她将题目还给我，不给这次不拍附上一项必须帮助作品成功的交换。
  `, 'y7_response_location', { flags: { y7DiscomfortNamed: false, y7PretenceCorrected: false } });
  add('y7_response_pretend', '一句看着办，没能替两个人轻松下来', 'old_street', '六月二十一日 · 当次谈话', ye, `
沈知夏｜也可能是我想太多，你看着办吧。你比较知道怎样才好。
旁白｜这句话说完，我并没有轻松。叶澄看了我一会儿，也没有将它写成许可。
叶澄｜还没说清哪段、怎样用，今天继续不拍、不用那格。你现在似乎并不想答可以，我也不能拿一个看着办往前走。
沈知夏｜我怕让你觉得，和我相处总是有很多要停下来的地方。
叶澄｜我也怕自己的影片不够好。但我们可以各自害怕，不需要你用不舒服替我少害怕一点。
旁白｜她说完，第一次也像在等一句关于她自己的话。不是等我交一段素材，而是等我愿不愿意真的回答。
  `, 'y7_response_location', { flags: { y7DiscomfortNamed: false, y7PretenceCorrected: false } });
  add('y7_response_private', '在桌边，还能把一句话说回来', 'old_street', '六月二十一日 · 16:15', ye, '旁白｜我们仍坐在两只杯子旁。叶澄问还愿不愿意继续谈私人感受，不请工作修改替关系回答。', 'y7_action_choice');
  add('y7_response_work', '时间到了，工作不延长成新约会', 'bookshop', '六月二十一日 · 15:20', ye, `
旁白｜十五点二十，工作见面到点结束。她按自己的安排离开，没有接上茶、植物或私人散步。
叶澄｜之后有具体回应再问时间。今天工作提案没获准的继续不用，不让它一直等你变得足够体谅。
沈知夏｜好。我也不拿最后一刻的一句更好听的话，让你把刚才的不同意改掉。
旁白｜我留下写自己这份回复，没有跟着她走，也没有把下一段路解释成顺路就可以。
  `, 'y7_action_choice_work');
  const actions = [
    { text: '把真正的感受和相处需要说清，听她自己的答复。', flags: { y7ActionChoice: 'act' }, next: 'y7_action_scope_gate' },
    { text: '今天不继续私人推进，工作范围保持，感受以后再谈。', flags: { y7ActionChoice: 'hold' }, next: 'y7_action_hold_gate' }
  ];
  add('y7_action_choice', '选择五 · 下一句是否真正讲到自己', 'old_street', '六月二十一日 · 16:20', ye, '旁白｜文件里的那一格已经撤下，现在要回答的是两个人是否愿意继续认识真实的彼此。', null, { choices: actions });
  add('y7_action_choice_work', '选择五 · 结束之后，自己怎样回应', 'bookshop', '六月二十一日 · 15:25', self, '旁白｜工作见面已经结束。现在的回复可以清楚，也不替尚未完成的旧修改写一份已完成。', null, { choices: actions });
  gate('y7_action_scope_gate', 'y7MeetingKind', { private: 'y7_action_private', workOnly: 'y7_action_work' });
  gate('y7_action_hold_gate', 'y7MeetingKind', { private: 'y7_hold_private', workOnly: 'y7_hold_work' });
  add('y7_action_private', '没有一个画面替代这一句真话', 'old_street', '六月二十一日 · 16:25', ye, '旁白｜我抬起头，准备把不能交给剪辑替我解释的话亲口说给她。', 'y7_response_kept', { ...variation('y7ResponseChoice', {
    direct: '沈知夏｜刚才那句不还在。也想继续认识你，不是想把全部作品都变成要经过我喜欢才准完成。自己的情绪我自己说，新的记录逐次问。\n叶澄｜愿意听，也想说自己的感受。不将你愿意相处记成必须支持每一种拍法。',
    alternative: '沈知夏｜刚才只讲办法，是因为怕说不舒服就失去继续相处的理由。我不想被那句字幕解释，自己的下午由我讲；也想继续见你，听你本人怎样想。\n叶澄｜听见了。作品不用这段，关系也不用你一直给替代办法才能留下。',
    pretend: '沈知夏｜刚才你看着办不是同意。我不舒服，不想重演读信，不想让字幕替我解释。谢谢你没拿那句含糊话继续拍，我想重新说真实的相处需要。\n叶澄｜改口听见了。以后能停也能说，不拿你怕失望时的勉强当成信任。'
  }) });
  add('y7_response_kept', '那句真实的感受，刚才已亲口说过', 'old_street', '六月二十一日 · 16:28', ye, '旁白｜我已讲过自己的真实感受，她也已听见，不将刚才准备开口的一刻提前记成我们已经谈完。', 'y7_mutual', { flags: { y7CurrentResponseKept: true, y7DiscomfortNamed: true } });
  add('y7_mutual', '她也有自己的紧张，和愿意', 'old_street', '六月二十一日 · 16:30', ye, `
叶澄｜我把人放在画面里会觉得更安全，像终于知道这段见面怎样开始、怎样结束。关掉相机以后，反而怕自己问了一句没有人想听的话。
沈知夏｜我有时候一直答都可以，也是怕自己的话没人想听。可我想知道你真实想不想见，不想只猜你现在缺一个怎样的镜头。
叶澄｜想见你。昨天那格撤下，今天也想和你坐在这里。以后不舒服，讲给我；我没想明白，也不替你写一个已经想明白的答案。
旁白｜她的声音很轻，我却终于听得比影片里的字幕更清楚。一个人愿意承认不知道，也能给出一个真实的想见。
沈知夏｜那我们下次先见面，再各自决定哪些事想留下。
叶澄｜好。这次没有偷偷录声音，也不将你这些话重新剪进去。
旁白｜我点头。我们谈清的是现在愿意怎样相处，不是一份以后绝不出错的保证，更不是已经确认恋人的结论。
  `, 'y7_pretence_gate', { flags: { y7ConversationReady: true, y7RelationshipConfirmed: false, y7ExclusiveAgreed: false, y7RelationshipPublic: false } });
  gate('y7_pretence_gate', 'y7ResponseChoice', { pretend: 'y7_pretence_corrected', direct: 'y7_close_status_gate', alternative: 'y7_close_status_gate' });
  add('y7_pretence_corrected', '改口发生在今天，不抹去刚才的勉强', 'old_street', '六月二十一日 · 16:32', self, '旁白｜刚才那句含糊话没有变成许可，今天也实际改口。我保留两句话的先后，不将自己改成一直都擅长说真话的人。', 'y7_close_status_gate', { flags: { y7PretenceCorrected: true } });
  add('y7_action_work', '新回应能说清，旧修改仍要实际做', 'bookshop', '六月二十一日 · 15:30', self, `
沈知夏 · 消息｜昨天的提案让我不舒服，不想影片替我解释私人情绪。自己的感受现在明确回应，旧修改仍没做完，不请你因为这句话先答应私人见面。
叶澄 · 消息｜感受收到。原占位和解释已撤下，未获准内容继续不用。私人时间等那项真实回应以后再问，今天暂停不改。
旁白｜她能听我这句真话，也能还不愿恢复约会。想说清的工作与感受获得回应，没有因此多出植物、茶或身体靠近。
  `, 'y7_work_pretence_gate', { flags: { y7CurrentResponseKept: true, y7DiscomfortNamed: true, y7ConversationReady: false, y7Outcome: 'distance', relationshipStatus: 'needsConversation', y7RelationshipConfirmed: false, y7ExclusiveAgreed: false, y7RelationshipPublic: false } });
  gate('y7_work_pretence_gate', 'y7ResponseChoice', { pretend: 'y7_work_pretence_corrected', direct: 'y7_paused_choice', alternative: 'y7_paused_choice' });
  add('y7_work_pretence_corrected', '工作回复里改口，也不自动恢复私人关系', 'bookshop', '六月二十一日 · 15:32', self, '旁白｜刚才勉强的看着办已经由这次明确回复纠正，叶澄也听见。旧修改未完成与私人暂停仍在，不将说清一个新感受记成所有欠项已经完成。', 'y7_paused_choice', { flags: { y7PretenceCorrected: true } });
  add('y7_hold_private', '到这里可以停，不拿一次开心抵消分歧', 'old_street', '六月二十一日 · 16:25', ye, `
沈知夏｜今天不继续私人推进。提案未获准的照旧撤下，我还没准备好把自己的感受谈完。
叶澄｜知道。今天的植物和茶真实发生，也不要求你为了保留这个下午答都可以。私人先暂停，工作核对按原时间。
旁白｜我听见她的答复。我们没有将已撤下的画面恢复成可以，也没有因为一起笑过就假装所有事情已经谈妥。
  `, 'y7_paused_choice', { flags: { y7CurrentResponseKept: false, y7ConversationReady: false, y7Outcome: 'distance', relationshipStatus: 'needsConversation', y7RelationshipConfirmed: false, y7ExclusiveAgreed: false, y7RelationshipPublic: false } });
  add('y7_hold_work', '工作收尾以后，不追加私人请求', 'bookshop', '六月二十一日 · 15:30', self, `
旁白｜我不再发送新的私人请求。今天尚未谈完的感受仍保留，旧修改也仍待自己实际完成。
沈知夏 · 消息｜先到今天实际答应的范围。原未获准内容继续不用，二十二号工作核对照旧，不另加私人见面。
叶澄 · 消息｜收到。
旁白｜一个很短的回复就是今天真实的答复，没有一段被我脑补为她其实愿意靠近的隐藏话。
  `, 'y7_paused_choice', { flags: { y7CurrentResponseKept: false, y7ConversationReady: false, y7Outcome: 'distance', relationshipStatus: 'needsConversation', y7RelationshipConfirmed: false, y7ExclusiveAgreed: false, y7RelationshipPublic: false } });
  gate('y7_close_status_gate', 'relationshipStatus', { tryingDates: 'y7_date_choice', gettingToKnow: 'y7_learning_choice' });
  add('y7_date_choice', '选择六 · 继续约会，靠近仍各自问', 'old_street', '六月二十一日 · 16:35', ye, '叶澄｜我愿意继续约会。想沿河走一点，也能今天先回去。靠近不需要用照片来证明。', null, { choices: [
    { text: '先问她愿不愿意牵手，再一起走一段。', flags: { y7CloseChoice: 'hand' }, next: 'y7_date_hand' },
    { text: '只并肩走，不增加身体接触。', flags: { y7CloseChoice: 'walk' }, next: 'y7_date_walk' },
    { text: '今天先回去休息，下次的时间另问。', flags: { y7CloseChoice: 'home' }, next: 'y7_date_home' }
  ] });
  add('y7_date_hand', '伸过来的手，没有变成拍摄许可', 'riverside', '六月二十一日 · 16:40', ye, `
沈知夏｜想牵你的手，现在愿意吗？
叶澄｜愿意。你也可以后来松开，不用解释一个很完整的理由。
旁白｜我说愿意，才接住她的手。她指尖有一点凉，另一只手没有去找相机，河边的光只落在两个人自己的下午。
沈知夏｜刚才想说这很像一个好看的镜头，又想先真的走完它。
叶澄｜我也有过那一句。今天先走，不拍、不录，也不让你的答应多接一项用途。
旁白｜我们笑了一下，沿着树影往前走。原约会继续，第一次牵手有自己的同意，尚未确认女朋友或公开关系。
  `, 'y7_date_done', { flags: { y7HeldHands: true, y7Kissed: false, y7WalkKept: true } });
  add('y7_date_walk', '手没有碰到，也能认真走在同一边', 'riverside', '六月二十一日 · 16:40', ye, `
旁白｜我们只并肩走，不牵手、不接吻。叶澄指给我看一片长得很像她窗台植物的叶子，自己又说可能认错了。
沈知夏｜那就让它先做不知道名字的叶子。
叶澄｜可以。今天不用每一样都给一个准确字幕。
旁白｜她看向我时，我忽然有一点脸热。没有身体接触，听见她愿意继续约会仍让我高兴，普通的下一段路也没有少一点真实。
  `, 'y7_date_done', { flags: { y7HeldHands: false, y7Kissed: false, y7WalkKept: true } });
  add('y7_date_home', '不多留，也不将原来的愿意退回去', 'old_street', '六月二十一日 · 16:40', ye, `
沈知夏｜今天先回去休息。高兴见过你，也想给自己一点慢慢想的时间，不是撤回继续约会的意愿。
叶澄｜好。我也想回去浇水，刚才搬下来以后，土表比我想的干。下次时间重新问。
旁白｜我们分别，没有牵手、亲吻或增加一段散步。原来愿意继续的答复保留，不拿更久的陪伴给它盖另一枚证明章。
  `, 'y7_date_done', { flags: { y7HeldHands: false, y7Kissed: false, y7WalkKept: false } });
  add('y7_date_done', '原约会继续，不重复补一个开始日期', 'old_street', '六月二十一日 · 17:00', self, '旁白｜十八号双方实际答应的约会保留，今天愿意继续。尚未确认女朋友，身体接触与关系称呼也没有被我记成同一件事。', 'y7_contact', { flags: { y7Outcome: 'open', y7DatingStartedHere: false, relationshipStatus: 'tryingDates' } });
  add('y7_learning_choice', '选择六 · 新的愿意，由两个人说', 'old_street', '六月二十一日 · 16:35', ye, '叶澄｜愿意继续认识你，也想听你现在希望怎样相处。可以试着约会，也能慢一点，今天仍不是一份女朋友关系的考试。', null, { choices: [
    { text: '想试着约会，先听她是否也愿意。', flags: { y7CloseChoice: 'date' }, next: 'y7_learning_date' },
    { text: '先继续了解，多一些不带相机的相处。', flags: { y7CloseChoice: 'slow' }, next: 'y7_learning_slow' },
    { text: '今天仍没准备好，私人先暂停，不要求她等。', flags: { y7CloseChoice: 'pause' }, next: 'y7_learning_pause' }
  ] });
  add('y7_learning_date', '今天双方答应，才开始新的约会', 'old_street', '六月二十一日 · 16:40', ye, `
沈知夏｜想试着约会。不是让你把我的拒绝都剪掉，也不是要求你先把过去全讲完。我想见你本人，你也愿意吗？
叶澄｜我愿意。会有不知道怎样开口的时候，也想继续练习亲口问你。
旁白｜我听见答复，才把新的约会从今天记起。以前只是了解或先谈清楚的经过保留，没有被今天的高兴改成早已经开始。
沈知夏｜今天不再加身体接触，想先带着这句话回去。
叶澄｜好。下一次想怎样靠近，再问。
  `, 'y7_contact', { flags: { y7Outcome: 'open', y7DatingStartedHere: true, relationshipStatus: 'tryingDates', y7HeldHands: false, y7Kissed: false, y7WalkKept: false } });
  add('y7_learning_slow', '没有急着下定义，也不只剩等待', 'old_street', '六月二十一日 · 16:40', ye, `
沈知夏｜想先继续了解。今天高兴，也还有一点紧张，希望有更多不急着给称呼的见面。
叶澄｜我也愿意。不是把每个普通下午都当作最后一场答辩，可以今天还不知道。
旁白｜我笑着点头。没有开始约会，也有一份双方实际愿意继续的答复；不是好感不够，才被留在原地。
叶澄｜下次想见，直接问我。不需要先想一个值得拍的主题。
  `, 'y7_contact', { flags: { y7Outcome: 'slow', y7DatingStartedHere: false, relationshipStatus: 'gettingToKnow', y7HeldHands: false, y7Kissed: false, y7WalkKept: false } });
  add('y7_learning_pause', '今天不继续，也把话说到自己的名字', 'old_street', '六月二十一日 · 16:40', ye, `
沈知夏｜今天仍没准备好继续私人相处，先暂停。不要求你等着我的一个更漂亮的答复，也不将自己的不确定写成是你哪里不够好。
叶澄｜听见了。工作按原范围，私人就按你现在真正能给的答案。
旁白｜我们分别。新的感受谈过，没有自动要求两个人必须继续；刚才真实看过植物和喝茶，也不需要为了这一句暂停变成一场坏掉的下午。
  `, 'y7_close', { flags: { y7Outcome: 'distance', y7DatingStartedHere: false, relationshipStatus: 'needsConversation', y7HeldHands: false, y7Kissed: false, y7WalkKept: false, y7NextContactBooked: false } });
  add('y7_contact', '工作与想念，各自获得一段答复', 'old_street', '六月二十一日 · 17:05', ye, `
沈知夏｜二十二号十点的二十分钟工作核对照旧。明晚六点，另外能不能通话十分钟，讲一点自己的日常，不核作品？
叶澄｜十八点到十八点十，愿意。工作和私人分开，临时有变动自己提前说，再问新时间。
旁白｜两个人真正约过，明天也仍没有发生。我没有在记下时间时多填一个已经守约，也没有将私人电话发进筹备群。
叶澄｜想讲那只杯子后来放在哪里。没有素材也能先找你。
沈知夏｜我想讲宿舍便签的颜色。普通也可以。
  `, 'y7_close', { flags: { y7NextContactBooked: true, y7NextContactTime: '6-22 18:00-18:10' } });
  add('y7_paused_choice', '选择六 · 未获新的愿意，先怎样回去', 'old_street', '六月二十一日 · 16:40', self, '旁白｜私人推进暂停，工作范围仍在。不将自己的想继续写成她已经答应，今天也仍有自己的日子。', null, { choices: [
    { text: '按今天真实的范围回去，自己的晚饭自己安排。', flags: { y7CloseChoice: 'scope' }, next: 'y7_paused_done' },
    { text: '把没说完的话写给自己，先不转成她必须回复的消息。', flags: { y7CloseChoice: 'write' }, next: 'y7_paused_done' },
    { text: '先休息，停止追加私人邀请。', flags: { y7CloseChoice: 'rest' }, next: 'y7_paused_done' }
  ] });
  add('y7_paused_done', '不拍不公开，不需要等关系更好才成立', 'old_street', '六月二十一日 · 17:00', self, `
旁白｜旧范围和已撤下的提案照旧，没有恢复私人片段或解释字幕。拒绝记录的答复不需要等恋爱成功以后才作数。
旁白｜我收好自己的东西，没有去她门廊等，也没有拿知道她要剪片的时间换一场顺便见面。二十二号只按原来答应的工作核对，未新增私人通话。
  `, 'y7_close', { flags: { y7DatingStartedHere: false, y7HeldHands: false, y7Kissed: false, y7WalkKept: false, y7NextContactBooked: false } });
  add('y7_close', 'Y7-尾声 · 不交出去的这一页，也属于夏天', 'dorm', '六月二十一日 · 21:00', pair('lu_yao'), `
旁白｜回宿舍时，陆遥把最后一卷胶带放进桌面抽屉。她让我看箱子贴歪的名字，说它现在很像急着出发又走错门的人。
沈知夏｜那先别替它拍一张终于愿意离开的照片。
陆遥｜我只是想问你，名字还能看清吗？
旁白｜我愣了一下，笑了。说看得清，也告诉她今天有些感受终于听见，有些还在自己的待办里。我没有转发叶澄的私人话，更没有请她代替我们给答案。
陆遥｜听见以后也先吃东西。二十八号那顿汤，我已经放进自己的期待里了。
沈知夏｜记着。入口核对、二十九号送站也记着。
旁白｜林晚发来原件清单，见微提醒实物到货后抽检，周栀继续自己核设备。林姨二十七号活动、二十八号装箱、十九点半休息的安排保留。
旁白｜我关掉手机，把今天写给自己的便签夹进书里。没有拍下来，不意味着这个下午没有发生；愿意以后继续，也仍要由两个人各自答。
  `, 'ye_seven_complete');

  // The same proposal response happens inside the agreed work appointment
  // or the private afternoon; retain the actual place and clock for each.
  for (const id of ['y7_response_direct', 'y7_response_alternative', 'y7_response_pretend']) {
    const scene = scenes.find(s => s.id === id);
    scene.time = '六月二十一日 · 16:08';
    scenes.push({ ...scene, id: id + '_work', location: 'bookshop', time: '六月二十一日 · 15:14' });
  }
  for (const scene of scenes) {
    if (/^y7_(plant|tea|work_meet|topic_|discomfort|response_|action_|mutual|pretence_|hold_|date_|learning_|contact)/.test(scene.id)) scene.spriteVariants = { ye_cheng: 'no_camera' };
  }
  const data = { chapterId: 'ye7', scenes, gates };
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.RainChapterSevenYe = data;
})(typeof window !== 'undefined' ? window : globalThis);
