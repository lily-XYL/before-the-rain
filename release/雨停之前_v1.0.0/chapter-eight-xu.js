(function (root) {
  'use strict';
  const scenes = [], gates = [];
  const script = text => text.trim().split('\n').map(line => {
    const i = line.indexOf('｜');
    if (i < 1) throw new Error('许见微第八章对白缺少说话人物。');
    return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
  });
  const add = (id, title, location, time, cast, text, next, extra = {}) => scenes.push({ id, title, location, time, cast, lines: script(text), next, ...extra });
  const variation = (variantBy, variants) => ({ variantBy, variants: Object.fromEntries(Object.entries(variants).map(([key, text]) => [key, script(text)])) });
  const gate = (id, redirectBy, targets) => gates.push({ id, redirectBy, targets });
  const pair = id => ['shen_zhixia', id], xu = pair('xu_jianwei'), self = ['shen_zhixia'];

  add('x8_morning', 'X8-01 · 一本书真正到来以前', 'dorm', '六月二十二日 · 08:40', pair('lu_yao'), `
旁白｜陆遥把箱子上的旧地址划掉，换了一个新标签。窗外天亮得很早，手机上的物流还停在派送中。
陆遥｜你昨晚是不是把闹钟改了三次？
沈知夏｜一次想早起来改稿，一次怕睡不够，最后改回八点。
陆遥｜挺好。至少没有请闹钟替你决定毕业以后去哪儿。
旁白｜她低头笑，我也笑了一下。出版社的反馈还在我的桌面上，今天必须由我自己完成；到货抽检则有已经说好的半小时。
旁白｜我看见聊天页停在昨晚分别的地方。今天可以往下说什么，要从真正得到的答复开始。
  `, 'x8_entry');
  gate('x8_entry', 'xu7Outcome', { open: 'x8_entry_open', slow: 'x8_entry_slow', distance: 'x8_entry_distance' });
  add('x8_entry_open', '通话是昨晚两个人都答应的', 'dorm', '六月二十二日 · 09:00', self, `
旁白｜七点半，十分钟，不看稿。那是昨晚我们亲口定下的私人通话，不是今天抽检之后理所当然延长的时间。
沈知夏 · 消息｜上午照旧核实物。晚上七点半的十分钟，我留好了。
许见微 · 消息｜我也是。若有临时变动先告诉你。
旁白｜我给这两件事各留一行。原来同一个名字出现在日程里，也可以有完全不同的原因。
  `, 'x8_repair_choice', { flags: { xu8EntryOutcome: 'open' } });
  add('x8_entry_slow', '慢慢认识，不等于已经约好今晚', 'dorm', '六月二十二日 · 09:00', self, `
旁白｜我们愿意继续了解，但昨晚没有约下一次私人见面。我先打开自己的稿件，没有把今天上午的一起工作当成她一定愿意陪我到夜里。
沈知夏 · 消息｜我上午按约来。私人时间晚一点再问，先不占你的日程。
许见微 · 消息｜好。今天印厂到货后，把确切时段再核一下。
旁白｜她回的是哪件事，我就按哪件事理解。这样做并没有少一点期待，只是让期待有了真正可以被回答的位置。
  `, 'x8_repair_choice', { flags: { xu8EntryOutcome: 'slow' } });
  add('x8_entry_distance', '暂停的那句话还在', 'dorm', '六月二十二日 · 09:00', self, `
旁白｜昨晚的私人答复是先停下来。无论那顿晚饭是否发生，今天都不能拿到货的消息替它换一个意思。
沈知夏 · 消息｜上午仍按已确认的抽检范围做。你说需要先谈的部分，我另外准备，不借核书顺便再问约会。
许见微 · 消息｜收到。把不同的事分开，我会比较容易知道你在问什么。
旁白｜我读了两遍，才合上聊天页。她没有说以后再也不能开口，也没有说一句普通回复就已经答应重新靠近。
  `, 'x8_repair_choice', { flags: { xu8EntryOutcome: 'distance' } });
  add('x8_repair_choice', '选择一 · 把欠着的回应放在哪里', 'dorm', '六月二十二日 · 09:20', self, `
旁白｜有些范围已在十九号确认，有些还没有。我也记得昨晚自己有没有真正调整总等她给答案的习惯。今天要做的，不能只是一句我想明白了。
  `, 'x8_dispatch', { choices: [
    { text: '上午先按约抽检，中午发具体修改，等真实答复。', flags: { xu8RepairChoice: 'act' }, next: 'x8_dispatch' },
    { text: '说明旧问题仍未准备好，保留原有暂停与范围。', flags: { xu8RepairChoice: 'hold' }, next: 'x8_dispatch' }
  ] });
  add('x8_dispatch', '九点半，先确认到货时段', 'studio', '六月二十二日 · 09:30', xu, `
旁白｜印厂确认十点送到。见微把自己的客户文件挪到另一边，只为基础册留出已经答应的半小时。
许见微｜十点到十点半。我核装订和折边，你核页序、作者确认件与交付数量。原方案先用，不临时把所有事并到我这边。
沈知夏｜出版社的修改我十点四十开始。新增检查若需要时间，我们先说。
旁白｜她抬头看我一眼，说好。桌上的私人批注仍夹在我自己的本子里，没有放进交付清单。
旁白｜我们照二十号确认过的检查计划摆好样本位置。货还没到，记录里也没有先填完成。
  `, 'x8_delivery', variation('xu7CheckPlan', {
    sharedOrder: '旁白｜之前说好的共用顺序仍在：先数外箱，再取样核页序，最后看折边。我们分别签自己看过的部分。',
    boundedRoles: '旁白｜之前谈过负担，今天就按有限分工来。见微的半小时没有被我的一句你熟悉扩成整个上午。',
    specificationOnly: '旁白｜之前她只解释原规格，是否再接新工作由我自己判断。今天的清单也没有多一栏请她替我决定。'
  }));
  add('x8_delivery', '十点，纸箱落在桌边', 'studio', '六月二十二日 · 10:00', xu, `
旁白｜十点整，送货的人将纸箱放到桌边。见微扶住外箱，我对着确认单逐件点数，再签当天的收货回执。
沈知夏｜封面没有压坏，外箱数量对得上。下一项才是取样。
许见微｜别拿已收货代替已检查。里面仍需要真的翻开。
旁白｜我拆开第一层纸，闻到新印墨和纸张混在一起的味道。它们终于不是屏幕里的一叠页码，但也没有因为终于到来，就替我们完成整个告别。
  `, 'x8_quantity', { flags: { xu8BooksReceived: true, xu8DeliveryTime: '6-22 10:00' } });
  gate('x8_quantity', 'workflow', { collective: 'x8_quantity_60', solo: 'x8_quantity_60', smaller: 'x8_quantity_40' });
  for (const copies of [60, 40]) add('x8_quantity_' + copies, '收到的数量仍按原方案', 'studio', '六月二十二日 · 10:05', xu, `
旁白｜实收${copies}本，每本二十四页，与原方案及印厂回执一致。数量写在当日清单里，费用仍用已经确认的那一份。
沈知夏｜没有因为今天觉得场面可能不够热闹，就偷偷加印。
许见微｜也不用替已经删去的东西心虚。把答应的做好，是一个完整的选择。
旁白｜她摸过一处折边，示意我等取样时再登记。我把笔停在数量后面，给尚未核过的页序留了空格。
  `, 'x8_sample_choice', { flags: { xu8DeliveredCopies: copies } });
  add('x8_sample_choice', '选择二 · 同一张表，两种负担', 'studio', '六月二十二日 · 10:08', xu, `
旁白｜按原约定检查三本，足够完成这一轮抽检。我却看着旁边整齐的书堆，又想把所有可能的小问题都替大家先处理掉。
  `, null, { choices: [
    { text: '说清今天能做的量，按原约定共同抽检三本。', flags: { xu8SampleChoice: 'shared' }, next: 'x8_sample_shared' },
    { text: '说只是简单核一下，自己悄悄多检查两本。', flags: { xu8SampleChoice: 'hide' }, next: 'x8_sample_hide' }
  ] });
  add('x8_sample_shared', '把半小时用在答应过的地方', 'studio', '六月二十二日 · 10:10–10:30', xu, `
沈知夏｜我今天能做三本的完整页序核对。若还想加样，先安排别的时段，我不把改稿时间悄悄用掉。
许见微｜我也只签这三本的装订和折边。以后发现问题，按那本的编号登记，不写成今天已经保证全部完美。
旁白｜三本轮流经过两双手。第二本第十一页有一点纸屑，轻轻刷去后字面完好；页序、正文和作者确认件一致，没有需要重新交印的缺损。
旁白｜十点半，我们分别签自己实际看过的部分。我把其余册子归入待现场按编号使用的一箱，没有给每一本都盖一个未经核对的保证。
许见微｜现在去改你的稿。这里不是因为你还坐着，我就会觉得你更认真。
沈知夏｜那我先走。需要新增协助时另问你。
  `, 'x8_sample_shared_done', { flags: { xu8SamplesChecked: true, xu8SampleCount: 3, xu8SampleHidden: false, xu8ExtraCheckTaken: false, xu8SampleTime: '6-22 10:10-10:30' } });
  add('x8_sample_shared_done', '十点四十，打开自己的修改稿', 'dorm', '六月二十二日 · 10:40', self, `
旁白｜我回到宿舍，按原安排打开出版社的修改稿。三本抽检已完成，剩余实物仍按具体编号记录，谁的工作都没有凭一张合照变成另一个人的。
旁白｜第一处反馈是句子太绕。我删掉两层解释，只留真正想说的那一句，忽然想起见微常问我到底在请求什么。
旁白｜这一次，我没有截图给她问删得对不对。改完先自己通读，再给编辑具体说明理由。
  `, 'x8_repair_gate', { flags: { xu8ShenWorkStarted: '6-22 10:40' } });
  add('x8_sample_hide', '又把可以变成应该', 'studio', '六月二十二日 · 10:10–10:30', xu, `
沈知夏｜就是简单核一下，我很快就好。你先按自己的安排走。
许见微｜我核过的三本写在这里。剩下的要加检查，记清是你之后另做，不要代我签。
旁白｜我说知道。她十点半结束自己答应的范围，我仍把第四本拿出来，心里想着多一点总不会错。
旁白｜可我没有告诉她，这些多一点正从自己的改稿时间里取。像以前等她决定一样，这一次不说也让我暂时不用面对可能被拒绝的请求。
  `, 'x8_extra_check');
  add('x8_extra_check', '十一点十分，额外的两本才核完', 'studio', '六月二十二日 · 10:30–11:10', self, `
旁白｜我另外核了两本的页序与折边。五本样本均未发现需要重印的缺损，但这不是对全部实物逐本检查，也不是见微多留了四十分钟。
旁白｜我在第四、第五本后只签自己的名字，写下十一点十分。检查结果照实，隐下的只是我没说清楚的工作量。
沈知夏｜下次再补说明吧。
旁白｜说出口以后，我才听见这句话有多熟悉。原来不把别人的意见写错，也仍可能把自己的能力说得不真实。
  `, 'x8_sample_hide_done', { flags: { xu8SamplesChecked: true, xu8SampleCount: 5, xu8SampleHidden: true, xu8ExtraCheckTaken: true, xu8SampleTime: '6-22 10:10-11:10' } });
  add('x8_sample_hide_done', '十一点二十，改稿真正开始', 'dorm', '六月二十二日 · 11:20', self, `
旁白｜回到宿舍，出版社的文件才真正打开。我在自己的日程里把开始时间改成十一点二十，没有把计划的十点四十抄成已经做过。
旁白｜午饭需要晚一点，第一轮通读也少了缓冲。我还能完成今天的反馈，但这一点余量是自己的，不是见微会自动帮我补齐的。
旁白｜我喝了一口已经凉下来的水，先写自己的第一处修改。
  `, 'x8_repair_gate', { flags: { xu8ShenWorkStarted: '6-22 11:20' } });
  gate('x8_repair_gate', 'xu8RepairChoice', { act: 'x8_old_pending', hold: 'x8_repair_hold' });
  gate('x8_old_pending', 'pendingOmittedConversation', { true: 'x8_old_person', false: 'x8_repair_current' });
  gate('x8_old_person', 'omittedPerson', { lin: 'x8_old_lin', xu: 'x8_old_xu', zhou: 'x8_old_zhou', ye: 'x8_old_ye' });
  for (const [id, person, name, scope] of [
    ['lin', 'lin_wan', '林晚', '已确认作者文字与编号，不把未回信者写成已经答应'],
    ['xu', 'xu_jianwei', '许见微', '原尺寸与折边，新增材料不再要求重排或加厚'],
    ['zhou', 'zhou_zhi', '周栀', '原音频长度与接口，不追加未答应的串场'],
    ['ye', 'ye_cheng', '叶澄', '原设备说明，不扩大私人片段与放映范围']
  ]) add('x8_old_' + id, '中午，具体版本收到对应答复', 'dorm', '六月二十二日 · 12:00–12:20', pair(person), `
沈知夏 · 消息｜之前未落实的调整，这次只发这一项：${scope}。标出的改动已经做好，未确认的仍停用。
旁白｜我等她打开后核对。她指出一处没有写清的界限，我补上再发，没有把消息已送达先记成对方已同意。
${name} · 消息｜现在这项可以。其他部分仍照原范围，不自动加进来。
沈知夏 · 消息｜按这份答复做。之前没完成的日期保留，今天才记确认。
旁白｜这项具体调整有了真实结尾。它没有替过去补出一次完整相处，也没有附送任何私人关系的答复。
  `, 'x8_repair_current_done', { flags: { pendingOmittedConversation: false, repairStarted: true, omittedContribution: 'confirmedPartOnly', xu8OldRepairKept: true } });
  add('x8_repair_current', '已经完成的，不重新算一次道歉', 'dorm', '六月二十二日 · 12:20', self, `
旁白｜具体工作范围已经确认，我没有再拿同一份修改讨一次答复。今天写的是自己总想等一个正确答案、或者把负担藏起来的做法。
旁白｜原先完成过的事情保留原日期。这次要回应的，是我现在实际还会怎样做。
  `, 'x8_repair_current_done', { flags: { xu8OldRepairKept: false } });
  add('x8_repair_current_done', '把一个小决定留给自己', 'dorm', '六月二十二日 · 12:25', self, `
沈知夏 · 消息｜出版社的修改今天我自己给理由。下月的住处我先筛两处，也不会把整张生活清单发给你求一个正确答案。
沈知夏 · 消息｜如果想听你的意见，会说是哪一项、我已经怎么想过，你也可以没有答案。
许见微 · 消息｜这样我能听懂。我的新增帮忙也先问，不拿接下所有事当作能和你多说几句的理由。
旁白｜她愿意看这份具体改变。我没有接着写那我们就算没事了，而是问，晚一点是否愿意留十分钟说各自的一天。
旁白｜这次有回应的，是一份安排与一个请求，不是已经得到恋人的称呼。
  `, 'x8_contact_entry', { flags: { xu8PriorReady: true } });
  add('x8_repair_hold', '未准备好也要如实留在这一栏', 'dorm', '六月二十二日 · 12:20', self, `
沈知夏 · 消息｜需要调整的部分我今天中午仍未准备好。原确认范围继续有效，未确认的停用；不拿抽检完成替私人问题作答。
许见微 · 消息｜收到。你写清真正能做的，就按那个范围来。
旁白｜我没有将她一句收到看成旧问题已经清除。如果昨晚已经愿意继续相处，那份答复仍有效；如果昨晚停下了，暂停也还在。
  `, 'x8_hold_entry', { flags: { xu8OldRepairKept: false } });
  gate('x8_hold_entry', 'xu7Outcome', { open: 'x8_hold_ready', slow: 'x8_hold_ready', distance: 'x8_hold_pending' });
  add('x8_hold_ready', '原先的愿意仍按原范围', 'dorm', '六月二十二日 · 12:25', self, `
旁白｜原有的私人意愿没有因今天的暂缓被改写。欠其他伙伴的调整也没有因此消失，我仍只使用已确认的材料。
旁白｜需要更多认识时，可以另问时间。不能把对一个人的好感写成已经替所有人完成了回应。
  `, 'x8_contact_entry', { flags: { xu8PriorReady: true } });
  add('x8_hold_pending', '今天先按工作范围回复', 'dorm', '六月二十二日 · 12:25', self, `
旁白｜昨晚的待谈问题仍未落实。见微说明今晚不接私人通话，七点半只看一条有关已到货基础册的工作消息。
沈知夏 · 消息｜知道了。我只写实际检查结果，不借那条消息再约见面。
旁白｜我把通话栏留空。这一点空白并没有改变她的工作，也没有给我一个绕开答复的入口。
  `, 'x8_feedback', { flags: { xu8PriorReady: false, xu8CallKind: 'workMessage', xu8CallAgreed: false, xu8CallKept: false } });
  gate('x8_contact_entry', 'xu7Outcome', { open: 'x8_contact_old', slow: 'x8_contact_new', distance: 'x8_contact_talk' });
  add('x8_contact_old', '确认的是昨晚那十分钟', 'dorm', '六月二十二日 · 12:30', self, `
许见微 · 消息｜晚上仍按昨天说的，七点半到七点四十。不把上午的工作接到电话里。
沈知夏 · 消息｜好。我也留好自己的晚饭与改稿时间。
旁白｜我们没有重新假装昨天未曾约过，也没有把十分钟改成她必须陪我到睡着。
  `, 'x8_feedback', { flags: { xu8CallKind: 'oldCall', xu8CallAgreed: true } });
  add('x8_contact_new', '想听她的一天，先问有没有空', 'dorm', '六月二十二日 · 12:30', self, `
沈知夏 · 消息｜晚上七点半能通话十分钟吗？想听你的一天，也讲我的。若想休息可以另约。
许见微 · 消息｜可以。七点四十我去准备明早的交件，只留这十分钟。
旁白｜这是今天新问、也新得到同意的私人时间。昨晚没有约过的事实仍保留，不拿这条回复补到昨天。
  `, 'x8_feedback', { flags: { xu8CallKind: 'newCall', xu8CallAgreed: true } });
  add('x8_contact_talk', '愿意再谈，还没有恢复约会', 'dorm', '六月二十二日 · 12:30', self, `
沈知夏 · 消息｜具体改变你已经看过。晚上七点半能留十分钟谈谈我们的期待吗？不先假定你愿意恢复约会。
许见微 · 消息｜愿意听。先十分钟，之后怎样再分别说。
旁白｜她答应的是再谈。我给那行日程写下这个名字，没换成约会，也没有把之前的暂停划掉。
  `, 'x8_feedback', { flags: { xu8CallKind: 'newTalk', xu8CallAgreed: true } });
  add('x8_feedback', 'X8-02 · 先交自己的这一份', 'dorm', '六月二十二日 · 17:30', self, `
旁白｜五点半，我将修改与说明发给出版社。每一项理由都写过，编辑是否采纳还要等回复，今天完成的是我自己的提交。
旁白｜我没有让见微代审整篇，也没有为了今晚可能的一通电话宣布自己可以不交。这份工作属于我的生活，不是需要从喜欢里撤走的障碍。
沈知夏｜晚饭。
旁白｜我给自己说了这个很普通的词，起身去拿饭盒。原来把一天过完，也需要先承认自己不是只靠期待就能不饿。
  `, 'x8_brief', { flags: { xu8ShenFeedbackSent: '6-22 17:30' } });
  add('x8_brief', '八周合作，还只是一份询问', 'dorm', '六月二十二日 · 18:50', self, `
旁白｜见微在项目群发了公开合作简章，也说明自己之后可能的空闲。对方询问八月起八周的驻外设计合作，六月二十六日五点前答复是否继续谈条件。
旁白｜简章附着普通业务邮箱，没有私人账户内容。她没有接受邀请，更没有买票；报价、工作量与住处都还待她自己核过。
许见微 · 消息｜若继续谈，我会另核原址收尾之后的时间。现有基础册的工作按原约定做，不把未来询问写成已经离开。
旁白｜我盯着八周两个字，想起毕业后每一张需要自己回答的表。熟悉的冲动又回来了：是不是找到一个人替我决定，就可以不用害怕。
  `, 'x8_wait', { flags: { xu8CooperationInquiryReceived: true, xu8CooperationAccepted: false, xu8CooperationReplyDue: '6-26 17:00', xu8CooperationDurationWeeks: 8 } });
  add('x8_wait', '可靠的人也有没睡好的时候', 'studio_night', '六月二十二日 · 19:05', xu, `
旁白｜见微发来一句今天文件还剩一项。她说昨晚到一点多才关灯，又补了没什么要紧，像把一张没有对齐的纸迅速压进下面。
沈知夏 · 消息｜那你今天有吃晚饭吗？
许见微 · 消息｜吃了。有点困，交件还是我自己明早发。别替我接下。
旁白｜我没有看过她的私密屏幕，不知道每一项客户内容。她愿意说出的这一点疲倦，却已经足够让那个总会处理好一切的人变得具体。
旁白｜想帮她可以从问起，也可能从承认自己没有能力替她过完这一天开始。
  `, 'x8_call_gate');
  gate('x8_call_gate', 'xu8CallAgreed', { true: 'x8_call', false: 'x8_work_choice' });
  add('x8_call', '七点半，十分钟真的开始', 'dorm', '六月二十二日 · 19:30', self, `
旁白｜七点半电话接通。见微先问我晚饭怎样，我说食堂把汤装得太满，回宿舍的路上一直在小心一只纸杯。
许见微 · 电话｜我今天终于给茶续了水。下午那杯没有被我放凉到关灯。
沈知夏｜听起来我们都完成了一件很容易被忘掉的事。
旁白｜她笑了，笑完停了一下。电话里听得见椅子轻轻动，却没有她继续敲键盘的声音。
许见微 · 电话｜这十分钟我不改稿。驻外的询问还没答应，不过我确实想去看看条件，也怕自己又把能做写成全做。
旁白｜我握着手机，终于听见她也会不确定。她并不是在等我给一个正确答案。
  `, 'x8_call_choice');
  add('x8_call_choice', '选择三 · 想帮助，还是想替她决定', 'dorm', '六月二十二日 · 19:33', self, `
许见微 · 电话｜你不用帮我证明这份合作一定好，也不用因为我困，就替我拒绝。我想知道的是，你自己的安排和想法。
旁白｜我看着桌上已经发出的稿件，想到我们各自都有一张不能由别人签名的表。
  `, null, { choices: [
    { text: '一起列清能做的量，各自决定工作和需要的帮助。', flags: { xu8CooperationChoice: 'together' }, next: 'x8_call_together' },
    { text: '今晚各自处理，先确认明早愿意再核对的时间。', flags: { xu8CooperationChoice: 'separate' }, next: 'x8_call_separate' },
    { text: '认为替她拒绝会轻松些，用自己的邮箱回复合作方。', flags: { xu8CooperationChoice: 'overreach' }, next: 'x8_call_overreach' }
  ] });
  add('x8_call_together', '把需要说成可以被回答的请求', 'dorm', '六月二十二日 · 19:35', self, `
沈知夏｜我能帮你核公开简章的时间条款，明早九点十分钟。报价和是否去由你决定，我也不请你替我选住处。
许见微 · 电话｜那一项可以。我的客户文件自己做，不加进来。要是明早仍累，我会先说，十分钟不是一定把整件事解决。
沈知夏｜我希望以后有机会见面。这是我的期待，不是要求你用拒绝合作来回答。
许见微 · 电话｜我听见了。我也希望见你，但还需要知道那份合作究竟是什么。
旁白｜我们各列一项真的能做的事。没有把并肩理解成必须用同一张表交出所有人生决定。
  `, 'x8_call_end', { flags: { xu8DecisionRespected: true, xu8InterferenceMade: false, xu8MorningCheckBooked: '6-23 09:00' } });
  add('x8_call_separate', '今晚先分别完成，也约好回来核对', 'dorm', '六月二十二日 · 19:35', self, `
沈知夏｜今晚我先做自己的通读，你准备交件。明早九点能用消息核十分钟吗？只说各自确定的量，不急着决定八月。
许见微 · 电话｜可以。今晚各自休息，明早我把自己要确认的时间条款列出来。
沈知夏｜我不是不想陪你。只是今晚继续撑着，也未必能给出真实的帮助。
许见微 · 电话｜我知道。先分别完成自己的事，不等于你就不在我考虑的人里。
旁白｜听见这一句，我紧绷的肩慢慢松下来。原来不把夜晚全部交出去，也可以让一个请求得到完整的答复。
  `, 'x8_call_end', { flags: { xu8DecisionRespected: true, xu8InterferenceMade: false, xu8MorningCheckBooked: '6-23 09:00' } });
  add('x8_call_overreach', '发送以后，决定权才显得那么清楚', 'dorm', '六月二十二日 · 19:35', self, `
旁白｜我打开公开简章上的业务地址，用自己的邮箱发了一封邮件，称作为工作室项目伙伴，见微暂不考虑驻外合作。我没有问过她，也没有替她账户登录。
沈知夏｜我想让你少操一点心。已经帮你回了。
许见微 · 电话｜你回了什么？
旁白｜我读完那两句，电话那头安静下来。她没有把我的替她安排当成需要感谢的体贴。
许见微 · 电话｜你可以表达不想分开，可以问我能不能休息。不能替我拒绝一份还在了解的工作。
许见微 · 电话｜我会自己回复对方。私人约会先停下，七点四十结束电话。
旁白｜我想解释只是担心，却第一次听见这个只是并不能把已经发出的内容收回来。
  `, 'x8_call_end', { flags: { xu8DecisionRespected: false, xu8InterferenceMade: true, xu8FalseReplySentAt: '6-22 19:35' } });
  add('x8_call_end', '七点四十，按约结束', 'dorm', '六月二十二日 · 19:40', self, `
旁白｜七点四十，我们结束通话。她需要完成自己的交件，我也没有续打一个电话要求今晚就把关系谈出结果。
旁白｜这十分钟真实发生了，说过的期待与产生的分歧都留在今天。没有因一句晚安就变成全部解决。
  `, 'x8_next_morning', { flags: { xu8CallKept: true, xu8CallFinishedAt: '6-22 19:40', xu8WorkMessageKept: false } });
  add('x8_work_choice', '选择三 · 只有一条工作消息的范围', 'dorm', '六月二十二日 · 19:30', self, `
旁白｜她没有答应私人通话。我只在那条工作消息里回报基础册的实际情况；公开简章的地址也还在屏幕上。
  `, null, { choices: [
    { text: '列清自己能完成的交付项，新增协助另问。', flags: { xu8CooperationChoice: 'together' }, next: 'x8_work_together' },
    { text: '只报已完成的检查，各自按原工作安排继续。', flags: { xu8CooperationChoice: 'separate' }, next: 'x8_work_separate' },
    { text: '认为替她拒绝会轻松些，用自己的邮箱回复合作方。', flags: { xu8CooperationChoice: 'overreach' }, next: 'x8_work_overreach' }
  ] });
  add('x8_work_together', '明确协助，不延长私人谈话', 'dorm', '六月二十二日 · 19:30', self, `
沈知夏 · 消息｜实收与原方案一致，抽检结果按具体编号记录。我自己完成交付清单；若需要你核原规格，再单独问时间。
许见微 · 消息｜收到。今晚只到这里，其他工作按原约定。
旁白｜我没有接着问她为什么想驻外，也没有拿合作简章换出私人通话。对她决定权的尊重可以从这一条停在约定范围里的消息开始。
  `, 'x8_work_end', { flags: { xu8DecisionRespected: true, xu8InterferenceMade: false } });
  add('x8_work_separate', '各自工作，也不给暂停换名字', 'dorm', '六月二十二日 · 19:30', self, `
沈知夏 · 消息｜今日抽检结果已登记，交付清单我自己做。你按原安排交件，不新增请你处理的内容。
许见微 · 消息｜收到。按这个范围。
旁白｜她没有问我的一整天，我也没有因此替她认定不在乎。今天本来就只约一条工作消息，私人的问题还停在先前答复的位置。
  `, 'x8_work_end', { flags: { xu8DecisionRespected: true, xu8InterferenceMade: false } });
  add('x8_work_overreach', '一封邮件越过了原来的范围', 'dorm', '六月二十二日 · 19:30', self, `
旁白｜我用自己的邮箱给简章上的业务地址发去拒绝，称作为项目伙伴，见微不考虑驻外。那句话没有得到她授权，也不是我们已谈妥的决定。
沈知夏 · 消息｜到货已登记。我也替你回绝了那份合作，想让你轻松一点。
许见微 · 消息｜工作消息不包含这个。我会自己向对方说明，你没有权利代我回复。私人暂停也继续保留。
旁白｜我看着已经发送的标记，终于知道一句为你好，不能把本来属于她的决定改成我能接手的工作。
  `, 'x8_work_end', { flags: { xu8DecisionRespected: false, xu8InterferenceMade: true, xu8FalseReplySentAt: '6-22 19:30' } });
  add('x8_work_end', '一条限定消息确实结束', 'dorm', '六月二十二日 · 19:40', self, `
旁白｜我结束那一条消息，没有继续打电话。工作结果真实提交，私人通话没有发生，两者都如实留在记录里。
旁白｜今晚还没有完成的谈话不借一份基础册绕过去。桌上自己的修改稿，也不因为难过就交给她代为处理。
  `, 'x8_next_morning', { flags: { xu8CallKept: false, xu8WorkMessageKept: true } });
  add('x8_next_morning', 'X8-03 · 次日，她先完成自己的那份', 'studio', '六月二十三日 · 08:40', xu, `
旁白｜第二天早上，见微说明自己八点四十将客户文件发出。今天完成的是她自己的交件，不是客户已经验收，更不是替我的出版社修改稿收尾。
许见微 · 消息｜文件交了。先吃早饭，业务询问由我自己答复。
旁白｜我也看了一遍昨晚的记录。若想改变什么，必须从自己真的做过的事情开始，不能请她用忙完了给我一个更容易接受的解释。
  `, 'x8_own_reply_gate', { flags: { xu8XuOwnFileSent: '6-23 08:40' } });
  gate('x8_own_reply_gate', 'xu8InterferenceMade', { true: 'x8_own_reply_correction', false: 'x8_own_reply' });
  add('x8_own_reply_correction', '她自己的答复，不等我的道歉', 'studio', '六月二十三日 · 08:50', xu, `
旁白｜见微自己回复合作方，只把与我有关的那一句说明发给我：旁人以项目伙伴身份发出的拒绝不代表她，她仍希望了解条件，二十六号前由本人给下一步答复。
许见微 · 消息｜这是我的工作，不需要等你准备好道歉才取回决定权。其他客户信息不会给你看。
沈知夏 · 消息｜知道了。我那封邮件的责任仍是我的。
旁白｜她希望了解，并不等于已经接受。拒绝代决，也不等于必须立刻去驻外证明独立。我不能再替她选另一个答案。
  `, 'x8_follow_choice', { flags: { xu8OwnReplyReasserted: true, xu8OwnReplySentAt: '6-23 08:50' } });
  add('x8_own_reply', '条件要自己核，回答也由自己给', 'studio', '六月二十三日 · 08:50', xu, `
旁白｜见微给合作方回了希望继续了解条件的消息。预算、住处和八周的安排仍要核，她没有把一份询问写成已接受的行程。
许见微 · 消息｜二十六号前我自己给下一步答复。基础册和现有收尾按原时间，不混进这封业务消息里。
旁白｜她说出自己的选择，我听见以后也仍能有自己的期待。两个声音不需要先变得一模一样，才算认真相处。
  `, 'x8_follow_choice', { flags: { xu8OwnReplyReasserted: true, xu8OwnReplySentAt: '6-23 08:50' } });
  add('x8_follow_choice', '选择四 · 昨晚的话，今天怎样做', 'dorm', '六月二十三日 · 09:00', self, `
旁白｜九点到了。有约过核对的，按那个范围回来；没有私人答复的，也不能先问见面。自己多接的工作、或者自己发错的拒绝，需要我分别承担。
  `, null, { choices: [
    { text: '如实说明负担并兑现有限安排；越权回复由自己澄清。', flags: { xu8FollowChoice: 'act' }, next: 'x8_follow_sample' },
    { text: '承认还没有准备好行动，私人相处先暂停。', flags: { xu8FollowChoice: 'hold' }, next: 'x8_follow_hold' }
  ] });
  gate('x8_follow_sample', 'xu8SampleHidden', { true: 'x8_admit_hidden', false: 'x8_follow_clear' });
  add('x8_admit_hidden', '额外两本与晚开始的四十分钟', 'dorm', '六月二十三日 · 09:02', self, `
沈知夏 · 消息｜昨天我说简单核一下，其实自己多做了两本，十一点十分结束，十一点二十才开始改稿。结果没有隐瞒，工作量没有说清。
沈知夏 · 消息｜我不补写你已经知道，也不代你签。新增协助会先说自己的能力，不等撑不住时才请你接下。
许见微 · 消息｜谢谢你把具体时间说出来。你的余量也需要被看见，下次问我时不用先证明一个人能做完。
旁白｜昨天藏起过负担的事实仍在。我这次补上的，是今天真实说出并得到回应的一段话。
  `, 'x8_follow_action_gate', { flags: { xu8HiddenBurdenAcknowledged: true } });
  add('x8_follow_clear', '按昨天答应的量回来核对', 'dorm', '六月二十三日 · 09:02', self, `
沈知夏 · 消息｜昨天三本抽检按约完成，自己的修改也提交了。今天有限协助先核时间，其他的我自己安排。
旁白｜我没有为了显得更可靠，把原先没答应的事项也塞进来。昨天没有隐瞒工作量，不需要今天虚构一次补救。
  `, 'x8_follow_action_gate', { flags: { xu8HiddenBurdenAcknowledged: false } });
  gate('x8_follow_action_gate', 'xu8InterferenceMade', { true: 'x8_follow_correct', false: 'x8_follow_kept' });
  add('x8_follow_correct', '自己的澄清不能要求一个恋爱答复', 'dorm', '六月二十三日 · 09:05', self, `
旁白｜我用昨天自己的邮箱给合作方发出澄清：之前的拒绝没有获得见微授权，不代表她；请以她本人答复为准。我只发送这一项更正，没有索取她的报价或客户文件。
沈知夏 · 消息｜澄清已发。我越过了你的决定权，不以担心作为理由，也不请你因为我改了就马上恢复约会。
许见微 · 消息｜收到。你承担了自己的邮件，但我今天仍不愿恢复私人约会。现有工作照原范围。
旁白｜她的答复没有因为更容易伤心就被我漏掉。今天真正完成了一份澄清，今天也真正没有得到重新约会的同意。
  `, 'x8_ready_gate', { flags: { xu8CorrectionSent: true, xu8CorrectionSentAt: '6-23 09:05', xu8PatternActionKept: true } });
  add('x8_follow_kept', '十分钟里只核那一项', 'dorm', '六月二十三日 · 09:05–09:10', self, `
旁白｜能继续私人谈话的，我们按昨天说的有限范围核公开时间条款。我只提出自己读到的疑问，不替她给业务结论；没有约过私人核对的，只回报原有交付项。
许见微 · 消息｜我的客户文件已交，之后需要休息。你自己的安排也保留，不用等我空出一整天才开始。
沈知夏 · 消息｜好。下个月住处我先核租期，想听你的意见时只问具体的一项。
旁白｜这一次，分开处理与一起讨论都有了能兑现的边界。没有要求任何一方用多接工作来证明关系值得继续。
  `, 'x8_ready_gate', { flags: { xu8CorrectionSent: false, xu8PatternActionKept: true } });
  add('x8_follow_hold', '今天的未完成仍记未完成', 'dorm', '六月二十三日 · 09:05', self, `
沈知夏 · 消息｜今天还没有准备好兑现下一步。不能请你先信一个完整承诺，私人相处先停下。
许见微 · 消息｜知道了。我的业务答复已经自己处理，工作仍按原范围。
旁白｜我把仍未完成的回应留在自己的待办里，不写成已经完成。她今天自己交了文件，也不是替我收拾掉这些责任。
  `, 'x8_blocked', { flags: { xu8PatternActionKept: false, xu8CorrectionSent: false, xu8HiddenBurdenAcknowledged: false } });
  gate('x8_ready_gate', 'xu8PriorReady', { true: 'x8_decision_gate', false: 'x8_blocked' });
  gate('x8_decision_gate', 'xu8DecisionRespected', { true: 'x8_invitation', false: 'x8_blocked' });
  add('x8_invitation', '三点，可以只谈我们自己吗', 'dorm', '六月二十三日 · 09:20', self, `
沈知夏 · 消息｜今天三点你愿意留半小时谈我们自己吗？不看稿，不把驻外询问塞成今天一定要决定的事。
许见微 · 消息｜愿意。来工作室，下午那半小时电脑关掉。三点前我先休息，不继续回工作消息。
旁白｜我答应。她得到自己的上午，我也去洗衣服、核租房条件。约好下午，并没有把之前每一段空白都占成等她的时间。
  `, 'x8_private', { flags: { xu8PrivateTalkAllowed: true, xu8PrivateMeetingBooked: '6-23 15:00' } });
  add('x8_private', 'X8-04 · 没有开机的那张桌子', 'studio', '六月二十三日 · 15:00', xu, `
旁白｜三点我到工作室，电脑确实关着。见微给我倒水，自己坐到桌子另一边，没有先翻一份需要我回答的稿件。
许见微｜我休息过了。今天不谈怎样把每个人的事处理好，谈我自己想怎样和你相处。
沈知夏｜我刚洗完衣服。听起来比你这句话普通很多。
许见微｜普通也很好。我想认识的人又不是只会在问题最大的时候出现。
旁白｜她看着我，眼下仍有一点疲倦，却不再把它压成没什么。我也没有急着用一个解决方案填满这半小时。
  `, 'x8_private_need');
  add('x8_private_need', '我来处理，有时是在躲一个请求', 'studio', '六月二十三日 · 15:05', xu, `
许见微｜以前有段关系里，我觉得只要够可靠，就不用问对方愿不愿意陪我。需要什么也不说，先做了再等她看见。
沈知夏｜后来呢？
许见微｜她说她想知道我在想什么，不只是想看我做完了什么。我当时听成自己做得还不够。
旁白｜她没有替过去那位女性伴侣讲一个完整结论，也没有拿那段经历要求我成为更会感激的人。
许见微｜现在也会这样。昨天说困，差一点又接成我还能做。我想试着问，你愿不愿意陪我说一会儿，而不是先给自己找个值得被陪的工作。
旁白｜我终于知道可靠有时也会累。她把这个请求放到我面前，不是把更重的责任交给我，而是给了我真正可以回答的一句话。
  `, 'x8_private_voice');
  add('x8_private_voice', '听你的，也曾让我少承担一个风险', 'studio', '六月二十三日 · 15:12', xu, `
沈知夏｜我总说听你的，不全是觉得你更懂。有时怕自己的判断被否定，想先借你的答案躲一下。
许见微｜我以前也容易接。有人需要我，好像就不用担心自己会不会被留下。
沈知夏｜但我喜欢你，不是想找一个不会错的生活说明书。我希望你能说累，也希望我说不确定时，你不需要马上替我解出来。
许见微｜我愿意练习。也希望你真正不同意的时候说出来，别先看我的表情把话改掉。
旁白｜我点头以后，她又问是不是自己的答复。我笑着说是，这次没有先等她点头。
旁白｜窗外有一阵风。水杯里的倒影晃过，我突然很想把今天这个并不完美、却会主动问我愿不愿意的人留在自己的未来里。
  `, 'x8_relationship_choice');
  add('x8_relationship_choice', '选择五 · 今天想给关系什么名字', 'studio', '六月二十三日 · 15:20', xu, `
许见微｜如果继续，我想知道你希望的是什么。八月合作还没有决定，成为恋人也不等于你得先答应一种固定距离。
旁白｜我可以提出期待，也可以慢一点。她会给自己的答复，不需要一次身体接触来证明这句话算数。
  `, null, { choices: [
    { text: '希望作为女朋友继续，问她是否也愿意。', flags: { xu8RelationshipChoice: 'commit' }, next: 'x8_commit' },
    { text: '愿意继续相处，暂时不确认恋人称呼。', flags: { xu8RelationshipChoice: 'slow' }, next: 'x8_slow' },
    { text: '现在仍需要停一下，先各自整理期待。', flags: { xu8RelationshipChoice: 'pause' }, next: 'x8_private_pause' }
  ] });
  add('x8_commit', '两个人分别说出的愿意', 'studio', '六月二十三日 · 15:25', xu, `
沈知夏｜我希望你成为我的女朋友。不是答应什么都听你的，也不请你为了我放弃自己的工作。你愿意吗？
许见微｜愿意。我也希望你是我的女朋友，不只是一个我能照顾好的人。
旁白｜我听完才笑起来。她没有拿经验作保证，说以后所有冲突都可以由她处理，我也没有给一句永远不会不同意的誓言。
许见微｜如果有新的私人关系期待，我们先说。要不要告诉朋友，什么时候说，都另外问，不默认这句话可以写进群里。
沈知夏｜好。今晚先不发任何宣布，记得我们两个是真的说过。
旁白｜我喜欢那个两个。它让这份答复有了两个人，而不是一个提供答案、一个负责相信的人。
  `, 'x8_evening_choice', { flags: { xu8Outcome: 'together', relationshipStatus: 'girlfriends', xu8RelationshipConfirmed: true, xu8RelationshipPublic: false } });
  add('x8_slow', '慢一点，也把希望说具体', 'studio', '六月二十三日 · 15:25', xu, `
沈知夏｜我想继续认识你，但今天先不确认恋人称呼。不是希望你等着接受一个迟早正确的答案，是真的还想多知道一点我们怎样相处。
许见微｜我愿意。想见面就问，不先替对方占时间；以后想换一个答复，也分别说。
旁白｜她没有把慢一点当成工作必须接得更多的条件。我也不拿今天愿意陪她说话换一个已经成为恋人的标记。
旁白｜之前已经试着约会的，仍在约会；之前继续了解的，仍可以继续了解。今天没有把新的称呼强塞给过去。
  `, 'x8_slow_status', { flags: { xu8Outcome: 'slow', xu8RelationshipConfirmed: false, xu8RelationshipPublic: false } });
  gate('x8_slow_status', 'xu7Outcome', { open: 'x8_slow_dates', slow: 'x8_slow_know', distance: 'x8_slow_know' });
  add('x8_slow_dates', '原先试着约会，今天仍按那个答复', 'studio', '六月二十三日 · 15:30', xu, `
旁白｜我们仍愿意试着约会，还没有确认恋人。原来的愿意不因为今天没换称呼被改成失效，也没有自动升级成确定关系。
  `, 'x8_evening_choice', { flags: { relationshipStatus: 'tryingDates' } });
  add('x8_slow_know', '继续认识，从今天实际答应的开始', 'studio', '六月二十三日 · 15:30', xu, `
旁白｜我们都愿意继续了解。若之前曾暂停，今天是新的答复，不会改掉当时真实停下过的那一页。
  `, 'x8_evening_choice', { flags: { relationshipStatus: 'gettingToKnow' } });
  add('x8_private_pause', '没有先用一句喜欢盖住不同期待', 'studio', '六月二十三日 · 15:25', xu, `
沈知夏｜我现在仍需要停一下。今天能说清的这些是真的，但不想借你愿意听，就先答应自己还没有想好的关系。
许见微｜好。那私人约会先停，工作按原范围。之后要再谈也先问，不互相保证一个期限。
旁白｜她说完，我没有再挑一个更亲密的称呼让她拒绝。今天愿意把话说出来，也可以得到一个不继续约会的结尾。
  `, 'x8_paused_evening_choice', { flags: { xu8PrivateTalkAllowed: true, xu8Outcome: 'paused', relationshipStatus: 'needsConversation', xu8RelationshipConfirmed: false, xu8RelationshipPublic: false } });
  add('x8_blocked', '现在还没有私人邀约的答复', 'dorm', '六月二十三日 · 09:20', self, `
旁白｜旧回应未完成、今天的安排没有兑现，或者已经越过她的决定权，仍有真实后果。基础册到货与抽检完成，都不能自动换成她愿意约会。
许见微 · 消息｜今天先不约私人见面。工作按原范围，需要新增的另外确认。
沈知夏 · 消息｜收到。我不把工作往来接成你已经改了答复。
旁白｜我把那句话完整留下，也给自己的下一步留了位置。尊重暂停不是消失不承担责任，而是不要求对方先用更亲近的答复让自己好受。
  `, 'x8_blocked_choice', { flags: { xu8PrivateTalkAllowed: false } });
  add('x8_blocked_choice', '选择五 · 未获同意时怎样面对自己', 'dorm', '六月二十三日 · 09:25', self, `
旁白｜今天不再发私人邀约。我仍需要决定怎样处理自己的失落，而不是请她立刻接住。
  `, 'x8_blocked_reply', { choices: [
    { text: '完整接受她的暂停，自己的工作继续承担。', flags: { xu8RelationshipChoice: 'accept' }, next: 'x8_blocked_reply' },
    { text: '先把想说的话写给自己，不发送给她求回应。', flags: { xu8RelationshipChoice: 'write' }, next: 'x8_blocked_reply' },
    { text: '给自己休息时间，之后有具体改变再问意愿。', flags: { xu8RelationshipChoice: 'pause' }, next: 'x8_blocked_reply' }
  ] });
  add('x8_blocked_reply', '未发送的那一页也有自己的位置', 'dorm', '六月二十三日 · 10:00', self, `
旁白｜我把自己的整理留在本子里，没有变成第二条催她回复的消息。需要继续完成的工作仍在原清单，没答应的新事不擅自接下。
旁白｜今天的暂停不等于过去一起吃过的饭、说过的话全部是假。只是那些真实的相处，也不能要求她忽略一个现在仍未谈妥的问题。
  `, 'x8_paused_evening_choice', { flags: { xu8Outcome: 'paused', relationshipStatus: 'needsConversation', xu8RelationshipConfirmed: false, xu8RelationshipPublic: false } });
  add('x8_evening_choice', '选择六 · 今晚怎样相处', 'studio', '六月二十三日 · 15:40', xu, `
许见微｜晚上七点可以留一点私人时间，也可以今天先分别休息。你想怎样？
旁白｜下午的答复不会因为选择各自回去失效。晚上的时间与身体接触，也都要从真正愿意的那一项开始。
  `, null, { choices: [
    { text: '问晚上能否沿河走一会儿，再分别回去。', flags: { xu8EveningChoice: 'walk' }, next: 'x8_evening_walk_agree' },
    { text: '问能否七点在关机的工作室喝茶，聊二十分钟。', flags: { xu8EveningChoice: 'chat' }, next: 'x8_evening_chat_agree' },
    { text: '今晚各自休息，今天的关系答复保留。', flags: { xu8EveningChoice: 'rest' }, next: 'x8_evening_rest' }
  ] });
  add('x8_evening_walk_agree', '散步的时间重新问过', 'studio', '六月二十三日 · 15:42', xu, `
沈知夏｜晚上七点沿河走二十分钟吗？你想早点回去也说。
许见微｜愿意。七点在步道入口见，各自吃过饭再来，散完各自回去。
旁白｜我把新的时间记下。下午愿意继续不是一张能使用整个夜晚的通行证，这个小邀请也得到了自己的答复。
  `, 'x8_walk', { flags: { xu8EveningBooked: '6-23 19:00 riverside' } });
  add('x8_walk', '七点，风没有替我们回答', 'riverside', '六月二十三日 · 19:00', xu, `
旁白｜七点，我们在步道入口见面。河面比下午暗了一点，路边有人慢慢推着自行车，谁也没有急着赶到一个一定正确的地方。
许见微｜我下午睡了二十分钟，醒来没有先看手机。这听起来很小，不过今天想告诉你。
沈知夏｜我给自己选了两处待看房。还没决定哪一处，至少这次不是等你替我选。
旁白｜她笑着说想听我看过以后怎么想。我也想听她核过驻外条件后的判断，不需要先把未来缩成只有一个人可以出发。
  `, 'x8_walk_outcome', { flags: { xu8EveningMet: true } });
  gate('x8_walk_outcome', 'xu8Outcome', { together: 'x8_walk_hand', slow: 'x8_walk_beside' });
  add('x8_walk_hand', '伸手以前，先问一声', 'riverside', '六月二十三日 · 19:10', xu, `
沈知夏｜现在可以牵你的手吗？
许见微｜可以。我也想牵你。
旁白｜她把手伸过来，我才握住。掌心比风暖，步子没有因此变得更快；我看着桥边的灯，忽然不太想组织一句足够漂亮的话。
许见微｜想说什么？
沈知夏｜你今天不是因为我有问题才在这里。
许见微｜你也不是因为我一定能解决才来。
旁白｜我们都笑了一下。二十分钟结束时松开手，各自走向回程，没有把今天的触碰当成下一次自动同意。
  `, 'x8_night', { flags: { xu8HeldHands: true, xu8EveningFinishedAt: '6-23 19:20' } });
  add('x8_walk_beside', '并肩的一段路也完整', 'riverside', '六月二十三日 · 19:10–19:20', xu, `
旁白｜我们没有牵手。见微说起路边新开的一家茶店，我说等看过营业时间以后再问她要不要一起去。
许见微｜可以问。今天不用急着替下周每个晚上做安排。
沈知夏｜那今天先把这段路走完。
旁白｜二十分钟到了，我们各自回去。没有身体接触，也没有让这段彼此愿意的相处少一个真正发生过的结尾。
  `, 'x8_night', { flags: { xu8HeldHands: false, xu8EveningFinishedAt: '6-23 19:20' } });
  add('x8_evening_chat_agree', '二十分钟，不顺手再开一个文件', 'studio', '六月二十三日 · 15:42', xu, `
沈知夏｜七点能回来喝茶、只聊二十分钟吗？不是把你的晚上接成继续工作。
许见微｜可以。我先吃饭，七点来，屏幕不打开。七点二十都回去休息。
旁白｜她给出了明确时间，我答应。说好只聊天，不需要拿一个急着求助的理由才值得见面。
  `, 'x8_chat', { flags: { xu8EveningBooked: '6-23 19:00 studio' } });
  add('x8_chat', '夜间工作室，只有两杯新茶', 'studio_night', '六月二十三日 · 19:00–19:20', xu, `
旁白｜七点，窗外渐暗，桌灯映着木头上的小划痕。屏幕没有亮，样本箱放在另一边，我们各有一杯真的刚泡好的茶。
许见微｜小时候我很喜欢把本子第一张空着，觉得正式的内容总要从后面开始。后来发现等到够正式，有时一本已经写完了。
沈知夏｜我会先挑一支笔。挑好以后不敢写，怕第一句话辜负那支笔。
许见微｜今天没有要交出去的第一句。
旁白｜我笑着讲午饭纸杯的后续，她讲昨晚关灯前发现自己一直没把耳机插上。都是不能拿来证明谁更可靠的小事，我却听得很认真。
旁白｜七点二十，我们放下杯子，各自回去。没有加班、牵手或者留宿，也真实给了彼此一段不靠完成任务才发生的时间。
  `, 'x8_night', { flags: { xu8EveningMet: true, xu8HeldHands: false, xu8EveningFinishedAt: '6-23 19:20' } });
  add('x8_evening_rest', '各自休息的晚上，答复仍在', 'studio', '六月二十三日 · 15:42', xu, `
沈知夏｜今晚先各自休息吧。我不是要收回刚才的答复，只是想让今天真的有一个结束。
许见微｜我也是。下次想见面再问，不用今晚还一直回复来证明我们说过的话。
旁白｜我离开工作室，晚上留在宿舍。她没有来，也没有被我算成一起度过的夜晚；今天愿意继续的关系仍按下午真实得到的答复保留。
  `, 'x8_night', { flags: { xu8EveningMet: false, xu8HeldHands: false } });
  add('x8_paused_evening_choice', '选择六 · 暂停之后，今晚留给自己', 'dorm', '六月二十三日 · 19:00', self, `
旁白｜今天不再问私人见面，也没有已确认的晚间通话。我能做的是给自己的夜晚一个真实安排，不用继续催她回答。
  `, 'x8_paused_rest', { choices: [
    { text: '核自己剩下的工作，只做已答应的一项。', flags: { xu8EveningChoice: 'scope' }, next: 'x8_paused_rest' },
    { text: '整理自己的期待，暂时留在未发送的笔记里。', flags: { xu8EveningChoice: 'notes' }, next: 'x8_paused_rest' },
    { text: '今晚先休息，尊重她没有答应见面的决定。', flags: { xu8EveningChoice: 'rest' }, next: 'x8_paused_rest' }
  ] });
  add('x8_paused_rest', '没有自动恢复的约会', 'dorm', '六月二十三日 · 19:20', self, `
旁白｜我没有再发一条其实只是问工作，试着把今天的拒绝接成私人见面。自己的整理留在自己的桌上，已确认的工作照旧。
旁白｜需要澄清的责任没有凭休息消失，已经真实澄清的也不会被抹去。今晚只是没有见面，没有牵手，更没有替对方决定一个已经愿意继续的结论。
  `, 'x8_night', { flags: { xu8EveningMet: false, xu8HeldHands: false } });
  add('x8_night', 'X8-05 · 明天还在各自的日程里', 'dorm', '六月二十三日 · 21:00', pair('lu_yao'), `
旁白｜九点，陆遥在箱盖上贴好最后一张今天要贴的标签。我把杯子洗净，给自己的书桌空出一小块地方。
陆遥｜天气预报说明天雨很大。去书店记得带伞，不要又觉得今天没湿，明天也肯定没事。
沈知夏｜记下了。还有二十八号的入口核对、二十九号七点五十出门，我没改。
陆遥｜好。今晚我先不收下一箱，给自己留一点没打包的地方。
旁白｜我点头。林岚已确认的休息、林晚二十四号说明会、伙伴们自己的工作也都在原来的日程里，不会因为我今天怎样谈关系就被挪走。
旁白｜基础册已经实收到货、实际抽检。旧信、作者答复、私人影像和那张只给两个人看的批注，仍按原权限保存。明天的雨还没有落下来，我没有提前登记不存在的损失。
  `, 'xu_eight_complete', variation('xu8Outcome', {
    together: '旁白｜今天我们都说愿意成为对方的女朋友。我在自己的本子上写下这一句，没有替八月答应一个决定，也不需要用今晚是否见面确认它是真的。',
    slow: '旁白｜今天我们愿意继续相处，尚未确认恋人。慢一点不是把决定交给一个更懂的人，而是各自仍愿意说出真正的下一步。',
    paused: '旁白｜今天的私人相处停下了。做完的工作与澄清照实保留，未完成的责任也继续在。往后是否愿意再谈，要从新的请求和她真正给出的答复开始。'
  }));
  const data = { chapterId: 'xu8', scenes, gates };
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.RainChapterEightXu = data;
})(typeof window !== 'undefined' ? window : globalThis);
