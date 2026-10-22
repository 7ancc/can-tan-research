/* Browser acceptance checks for the V5.1 integration. No server or deploy side effects. */
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
let chromium;try{({chromium}=require('playwright'))}catch{({chromium}=require('/Users/cc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'))}
const base=process.env.PORTFOLIO_TEST_BASE_URL||'http://127.0.0.1:8000/';
const root=path.resolve(__dirname,'..'),out=process.env.PORTFOLIO_QA_OUTPUT||path.join(root,'qa-artifacts/v5-1');
const before=JSON.parse(fs.readFileSync(path.join(root,'tests/v5-1-baseline.json')));
const captureStyle='.header{visibility:hidden!important}';
fs.mkdirSync(out,{recursive:true});
const projectIds={business:['credit','citrus','market'],ml:['climate','aviation','nlp','neural'],economics:['ets','healthcare']};
function expectUrl(actual,relative){assert.equal(new URL(actual).pathname,new URL(relative,base).pathname)}
(async()=>{const browser=await chromium.launch(),errors=[],reports=[],clicked=[];
try{
for(const width of [1920,1440,1024,768,390,320]){
 const p=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
 p.on('pageerror',e=>errors.push({width,error:e.message}));p.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push({width,status:r.status(),url:r.url()})});
 await p.goto(base,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 assert.equal(await p.locator('.profile-stats .proof:nth-child(2) b').textContent(),'3');
 assert.equal(await p.locator('.v51-published .pub').count(),3);assert.equal(await p.locator('.v51-submitted .pub').count(),2);
 // Link-helper siblings from browser extensions must not become grid cells.
 const publishedCards=p.locator('.v51-published .pub');
 const publicationPositions=()=>publishedCards.evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width}}));
 const cleanPublicationPositions=await publicationPositions();
 await publishedCards.evaluateAll(es=>es.slice(0,2).forEach(e=>{const helper=document.createElement('span');helper.className='test-link-helper';helper.textContent='↗';e.after(helper)}));
 const helperPublicationPositions=await publicationPositions();
 if(width>900){for(const positions of [cleanPublicationPositions,helperPublicationPositions]){assert(Math.max(...positions.map(r=>r.y))-Math.min(...positions.map(r=>r.y))<1,`${width} publications must share one row`);assert(Math.max(...positions.map(r=>r.width))-Math.min(...positions.map(r=>r.width))<1,`${width} publications must have equal widths`)}}
 assert.equal(await p.locator('.v51-published .pub-grid > .v51-publication-slot').count(),3);
 if([1440,390].includes(width))await p.locator('#publications').screenshot({path:path.join(out,'publications-with-link-helpers-'+width+'.png'),style:captureStyle});
 await p.locator('.test-link-helper').evaluateAll(es=>es.forEach(e=>e.remove()));
 assert.equal(await p.locator('.strength-outcomes').count(),0);assert.equal(await p.locator('.v51-strength').count(),3);
 assert.equal(await p.locator('.v51-practice').count(),3);assert.equal(await p.locator('.practice-links a').count(),6);
 assert.equal(await p.locator('#strengths .summary, #publications .summary, #contributions .summary').count(),0);
 assert.equal(await p.locator('.v51-core').count(),2);assert.equal(await p.locator('.v51-complement').count(),2);assert.equal(await p.locator('.v51-tool').count(),3);
 assert.equal(await p.locator('.v51-credentials>div').count(),2);
 const refinement=await p.evaluate(()=>{const rect=s=>[...document.querySelectorAll(s)].map(e=>{const r=e.getBoundingClientRect();return{y:r.y,height:r.height,width:r.width}});const lines=s=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return r.height/parseFloat(getComputedStyle(e).lineHeight)};return{strengths:rect('.v51-strength'),practice:rect('.v51-practice'),contributions:rect('.v51-contribution'),relevant:rect('.v51-relevant'),researchTitleLines:lines('#research h2'),summaryLines:Object.fromEntries(['research','awards','experience'].map(id=>[id,lines('#'+id+' .summary')]))}});
 if(width>=1024){for(const key of ['strengths','contributions'])assert(Math.max(...refinement[key].map(r=>r.height))-Math.min(...refinement[key].map(r=>r.height))<1,`${width} ${key} card heights`);for(const key of ['practice','relevant'])assert(Math.max(...refinement[key].map(r=>r.y))-Math.min(...refinement[key].map(r=>r.y))<1,`${width} ${key} divider alignment`);assert(Math.abs(refinement.researchTitleLines-1)<.02,`${width} research heading wraps`);for(const [id,lines]of Object.entries(refinement.summaryLines))assert(Math.abs(lines-2)<.02,`${width} ${id} summary has ${lines} lines`)}
 assert.equal(await p.locator('.school-sdu .admission-note').count(),0);assert.equal(await p.locator('.school-gou .admission-note').count(),1);
 assert.equal(await p.locator('.school-sdu .school-courses li').count(),4);assert.equal(await p.locator('.school-gou .school-courses li').count(),8);
 assert.equal(await p.locator('.school-honors li').count(),7);assert.equal(await p.locator('.v51-award').count(),4);
 const visual=await p.evaluate(()=>{const e=document.querySelector('#awards h2'),r=e.getBoundingClientRect(),c=getComputedStyle(e);const metrics=Object.fromEntries(['body','.hero h1','.profile-stats b','.school-grid','.school-card','.school-card h3','.school-courses','.school-courses li','.school-courses li strong'].map(s=>{let x=getComputedStyle(document.querySelector(s));return[s,Object.fromEntries(['fontFamily','fontSize','fontWeight','lineHeight','padding','gap','gridTemplateColumns','borderTopWidth','backgroundColor'].map(k=>[k,x[k]]))]}));return{width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth+1,awardsLines:r.height/parseFloat(c.lineHeight),metrics}});
 assert.equal(visual.overflow,false,`${width} home overflow`);if(width>=1024)assert(Math.abs(visual.awardsLines-1)<.02,`${width} awards heading wrapped`);
 const baseline=before.find(r=>r.width===width)?.metrics||{};
 for(const s of Object.keys(baseline)){assert.equal(visual.metrics[s].fontFamily,baseline[s].fontFamily,`${width} changed font ${s}`);if(s.startsWith('.school'))assert.deepEqual(visual.metrics[s],baseline[s],`${width} changed school-card styling ${s}`)}
 for(const [track,ids] of Object.entries(projectIds)){await p.locator(`[data-filter=${track}]`).click();assert.deepEqual(await p.locator('.project-card:visible').evaluateAll(es=>es.map(e=>e.dataset.project)),ids);assert.equal(new URL(p.url()).searchParams.get('focus'),track);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false)}
 await p.locator('[data-filter=business]').focus();await p.keyboard.press('ArrowRight');assert.equal(await p.locator('[data-filter=ml]').getAttribute('aria-selected'),'true');
 if(width===1440){for(const id of ['about','publications','research','contributions','methods','education','awards','experience','contact']){if(id==='research')await p.locator('[data-filter=business]').click();await p.locator('#'+id).screenshot({path:path.join(out,id+'-1440.png'),animations:'disabled',style:captureStyle})}}
 if([1440,768,390].includes(width)){for(const id of ['strengths','contributions','methods','awards','experience'])await p.locator('#'+id).screenshot({path:path.join(out,id+'-'+width+'.png'),animations:'disabled',style:captureStyle})}
 if([1024,390,320].includes(width)){await p.locator('[data-filter=business]').click();await p.locator('#awards').screenshot({path:path.join(out,'awards-'+width+'.png')});await p.locator('#education').screenshot({path:path.join(out,'education-'+width+'.png')})}
 if(width===390){await p.locator('[data-filter=business]').click();await p.screenshot({path:path.join(out,'mobile-full.png'),fullPage:true});await p.locator('.hamburger').click();assert.equal(await p.locator('.hamburger').getAttribute('aria-expanded'),'true');await p.keyboard.press('Escape');assert.equal(await p.locator('.hamburger').getAttribute('aria-expanded'),'false')}
 reports.push({...visual,refinement});await p.close();
}
const p=await browser.newPage({viewport:{width:1440,height:1000}});p.on('pageerror',e=>errors.push({route:'links',error:e.message}));
await p.goto(base);const awardSymbol=p.locator('.v51-award .award-symbol').first();const awardBefore=await awardSymbol.evaluate(e=>getComputedStyle(e).backgroundColor);await p.locator('.v51-award').first().hover();await p.waitForTimeout(220);assert.notEqual(await awardSymbol.evaluate(e=>getComputedStyle(e).backgroundColor),awardBefore);assert.equal(await awardSymbol.evaluate(e=>getComputedStyle(e).color),'rgb(255, 255, 255)');await p.locator('#awards').screenshot({path:path.join(out,'awards-hover-1440.png')});
// Every new evidence or capability link resolves to its existing local destination.
await p.goto(base);const proofLinks=await p.locator('.practice-links a,.v51-relevant a,.method-links a,.v51-contrib-contact a').evaluateAll(es=>es.map(a=>a.getAttribute('href')));for(const href of [...new Set(proofLinks)]){const u=new URL(href,base);assert.equal((await p.request.get(u.href)).status(),200);if(u.hash)assert.equal(await p.locator(u.hash).count(),1);clicked.push('evidence:'+href)}
// Deep links keep their matching selected panel on direct entry.
for(const track of Object.keys(projectIds)){await p.goto(base+'index.html?focus='+track);assert.equal(await p.locator(`[data-filter=${track}]`).getAttribute('aria-selected'),'true')}
// Each of the nine actual project links navigates locally and hydrates correctly.
for(const [track,ids] of Object.entries(projectIds)){for(const id of ids){await p.goto(base+'index.html?focus='+track);await p.locator(`#panel-${track} a[href="project-${id}.html"]`).click();await p.waitForLoadState('networkidle');expectUrl(p.url(),'project-'+id+'.html');assert.equal(await p.locator('#full-project').getAttribute('data-project'),id);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);clicked.push('project-'+id+'.html')}}
await p.goto(base);for(const href of ['project-credit.html','project-ets.html']){await p.locator(`.v51-submitted a[href="${href}"]`).evaluate(a=>a.removeAttribute('target'));await p.locator(`.v51-submitted a[href="${href}"]`).click();await p.waitForLoadState('networkidle');expectUrl(p.url(),href);clicked.push('submitted:'+href);await p.goto(base)}
const pubDestinations=await p.locator('.v51-published a').evaluateAll(es=>es.map(a=>a.href));assert.equal(pubDestinations[0],'https://doi.org/10.1371/journal.pone.0330645');assert.equal(pubDestinations[1],'https://doi.org/10.1016/j.frl.2024.105688');
for(const a of await p.locator('.header nav a').all()){const href=await a.getAttribute('href');const u=new URL(href,base);if(u.hash&&u.pathname.endsWith('/index.html')){await a.click();assert.equal(new URL(p.url()).hash,u.hash);assert.equal(await p.locator(u.hash).count(),1);clicked.push('nav:'+u.hash)}}
for(const [selector,href] of [['.v51-experience','experience.html'],['.v51-award','achievements.html'],['.link-row a','research.html']]){await p.goto(base);await p.locator(selector).first().click();await p.waitForLoadState('networkidle');expectUrl(p.url(),href);clicked.push(href)}
await p.goto(base);for(const href of ['assets/can-tan-academic-cv.pdf','assets/materials/papers/transformational-leadership.pdf']){const response=await p.request.get(base+href);assert.equal(response.status(),200);assert((await response.body()).subarray(0,5).equals(Buffer.from('%PDF-')));clicked.push('PDF:'+href)}
await p.goto(base+'project-ets.html');assert.equal(await p.locator('.research-material-groups details[open]').count(),3);await p.locator('.research-material-grid button').first().click();await p.waitForSelector('#media-dialog[open]');await p.keyboard.press('Escape');
await p.goto(base+'education.html');assert.equal(await p.locator('.school-courses li').count(),16);assert.equal(await p.locator('.school-gou .admission-note').count(),1);assert.equal(await p.locator('.school-sdu .admission-note').count(),0);
assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({base,errors,reports,clicked,pubDestinations},null,2));console.log(JSON.stringify({widths:reports.map(r=>r.width),awardsLines:reports.map(r=>[r.width,r.awardsLines]),errors,clicked:clicked.length,educationStyleMatchesBaseline:true},null,2));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
