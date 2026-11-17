// Compare representative existing templates with the same mobile Lighthouse settings.
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { writeFileSync, mkdirSync } from 'node:fs';
const [baseline = 'http://127.0.0.1:4174', candidate = 'http://127.0.0.1:4173', out = 'qa-shots/lighthouse'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const paths=['/','/osteopathie/','/osteopathie/lombalgie/','/contact/','/mentions-legales/'];
const report=[];
for (const path of paths) for (const [version,url] of [['baseline',baseline],['integration',candidate]]) {
 const chrome=await launch({chromePath:process.env.CHROMIUM_PATH || undefined,chromeFlags:['--headless','--no-sandbox','--disable-dev-shm-usage']});
 try{
  const {lhr}=await lighthouse(`${url}${path}`,{port:chrome.port,output:'json',onlyCategories:['performance'],logLevel:'error'});
  const row={version,path,score:lhr.categories.performance.score,lcp:lhr.audits['largest-contentful-paint'].numericValue,cls:lhr.audits['cumulative-layout-shift'].numericValue,tbt:lhr.audits['total-blocking-time'].numericValue,errors:lhr.runtimeError||null};
  report.push(row);console.log(JSON.stringify(row));
  writeFileSync(`${out}/${version}${path.replaceAll('/','_')}.json`,JSON.stringify(lhr));
  writeFileSync(`${out}/summary.json`,JSON.stringify(report,null,2));
 }finally{await chrome.kill();}
}
