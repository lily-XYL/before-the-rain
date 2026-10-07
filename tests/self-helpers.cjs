const {story,engine,finish,commonBoundary}=require('./ye-helpers.cjs');
const source=require('../chapter-self-epilogue.js');
const limit=Object.keys(story.nodes).length*2;
const contexts=[];
for(let w=0;w<3;w++)for(let o=0;o<4;o++)for(let p=0;p<2;p++)contexts.push(commonBoundary(w,o,p,4));
function checkpoint(before,ds,target){let s=engine.continueChapter(story,before),i=0,n=0;while(s.node!==target){if(s.ending||++n>limit)throw new Error('Unreachable '+target);s=engine.advance(story,s,story.nodes[s.node].choices?ds[i++]:undefined);}return s;}
const last=id=>id+'_'+(source.scenes.find(s=>s.id===id).lines.length-1);
const frozen=['selectedRoute','relationshipIntent','relationshipStatus','romanceRouteLocked','L_present','X_need','Z_reality','Y_withoutCamera','keptPromise','priorityCompleted','rebookKept','repairAgreement','repairActionKept','nextInvitation','invitationAccepted','meetingTone','letterScope','cameraScope','privateLetterPublic','videoPlaybackApproved','privateClipRecorded','withdrawnSubmission','plannedCost','plannedCopies','budgetReserve','layoutReady','finalLayoutConfirmed','finalProofDeadline','printHandoffDate','luMoveDate','luDeparturePlan','sixthRepairActionKept','sixthFriendTalkKept','sixthFriendTalkTime','sixthRepairTalkTime'];
module.exports={story,engine,finish,source,contexts,checkpoint,last,frozen};
