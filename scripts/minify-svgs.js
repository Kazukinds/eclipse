#!/usr/bin/env node
// Minify all SVGs in icons/ — strip comments, redundant whitespace, default attrs.
// Safe: preserves attributes/structure used by app rendering.
const fs=require('fs');
const path=require('path');
const ROOT=path.resolve(__dirname,'..','icons');

let totalBefore=0,totalAfter=0,filesProcessed=0;

function minifySvg(src){
  // Coleta ids referenciados via url(#x), href="#x", xlink:href="#x" — esses precisam ser preservados.
  const refIds=new Set();
  src.replace(/url\(#([^)]+)\)/g,(_,id)=>{refIds.add(id);return ''});
  src.replace(/(?:xlink:)?href="#([^"]+)"/g,(_,id)=>{refIds.add(id);return ''});
  return src
    .replace(/<!--[\s\S]*?-->/g,'')
    .replace(/<\?xml[^?]*\?>/g,'')
    .replace(/<!DOCTYPE[^>]*>/gi,'')
    .replace(/>\s+</g,'><')
    .replace(/\s+/g,' ')
    .replace(/\s+\/>/g,'/>')
    .replace(/\s*=\s*/g,'=')
    .replace(/" ([a-z-]+)=/gi,'" $1=')
    .replace(/ xmlns:[a-z]+="[^"]*"/gi,(m)=>m.includes('xmlns:xlink')?'':m)
    .replace(/(\s)version="1\.[01]"/g,'')
    .replace(/(\s)xml:space="preserve"/g,'')
    .replace(/(\s)style=""/g,'')
    // Só remove id se não estiver em uso interno
    .replace(/(\s)id="([^"]*)"/g,(m,sp,id)=>refIds.has(id)?m:'')
    .trim();
}

function walk(dir){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,e.name);
    if(e.isDirectory())walk(p);
    else if(e.name.toLowerCase().endsWith('.svg')){
      const before=fs.readFileSync(p,'utf8');
      const after=minifySvg(before);
      if(after.length<before.length){
        fs.writeFileSync(p,after);
        totalBefore+=before.length;totalAfter+=after.length;filesProcessed++;
      }
    }
  }
}

walk(ROOT);
const saved=totalBefore-totalAfter;
const pct=totalBefore?((saved/totalBefore)*100).toFixed(1):0;
console.log(`Minified ${filesProcessed} SVGs.`);
console.log(`Before: ${(totalBefore/1024).toFixed(1)}KB`);
console.log(`After:  ${(totalAfter/1024).toFixed(1)}KB`);
console.log(`Saved:  ${(saved/1024).toFixed(1)}KB (${pct}%)`);
