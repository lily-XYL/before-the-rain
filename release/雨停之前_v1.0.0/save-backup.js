(function(root){
  'use strict';
  const names=['auto','quick','slot1','slot2','slot3','slot4','routeBookmark'];
  const date=x=>typeof x==='string'&&Number.isFinite(Date.parse(x));
  const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
  function collections(story,raw){
    if(!object(raw))throw new Error('回忆收藏格式不正确。');
    const out={};for(const [id,time]of Object.entries(raw)){if(!Object.hasOwn(story.endings,id)||!date(time))throw new Error('回忆收藏包含无效记录。');out[id]=time;}return out;
  }
  function validate(story,engine,raw){
    if(!object(raw)||raw.format!=='before-the-rain-backup'||raw.version!==1||raw.storyId!==story.id||!date(raw.exportedAt)||!object(raw.saves))throw new Error('这不是可用的《雨停之前》故事备份。');
    const saves={};for(const [name,saved]of Object.entries(raw.saves)){
      if(!names.includes(name)||!object(saved)||!date(saved.savedAt))throw new Error('书签格式不正确。');
      const state=engine.restore(story,saved.state);if(!state)throw new Error('备份中的故事进度无法通过校验。');
      saves[name]={savedAt:saved.savedAt,state};
    }
    return {format:raw.format,version:1,storyId:story.id,exportedAt:raw.exportedAt,saves,endings:collections(story,raw.endings)};
  }
  function create(story,engine,read,time=new Date().toISOString()){
    const saves={};for(const name of names){const saved=read(name);if(saved)saves[name]=saved;}
    return validate(story,engine,{format:'before-the-rain-backup',version:1,storyId:story.id,exportedAt:time,saves,endings:read('endings')||{}});
  }
  function apply(story,engine,raw,read,write){
    const backup=validate(story,engine,raw),current=collections(story,read('endings')||{});
    const updates={...backup.saves,endings:{...backup.endings,...current}},previous={},written=[];
    for(const name of Object.keys(updates))previous[name]=read(name);
    try{for(const[name,value]of Object.entries(updates)){written.push(name);if(write(name,value)===false)throw new Error('浏览器未能保存导入内容，已恢复原进度。');}}
    catch(e){for(const name of written.reverse())write(name,previous[name]??null);throw e;}
    return {saves:Object.keys(backup.saves).length,endings:Object.keys(updates.endings).length};
  }
  const api={names,create,validate,apply};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RainSaveBackup=api;
})(typeof window!=='undefined'?window:globalThis);
