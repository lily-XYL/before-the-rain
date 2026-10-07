const fs=require('node:fs'),path=require('node:path');
const p=path.resolve(__dirname,'../chapter-self-epilogue.js');
fs.writeFileSync(p,fs.readFileSync(p,'utf8').replaceAll("'lin_yi'","'lin_lan'").replaceAll("'chen_mo'","'chen_xuning'").replaceAll('陈默','陈序宁').replaceAll('陈叙宁','陈序宁').replaceAll('林姨｜','林岚｜').replaceAll('他答应后，我们','她答应后，我们'));
