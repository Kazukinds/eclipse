#!/usr/bin/env node
// Purges dormant JS for spells/pets/vehicles/implants/mount.
// Deletes top-level `function X(){...}` and `window.X=function(){...}` blocks
// by tracking brace depth.
const fs = require('fs');
const path = require('path');

const FILE = path.resolve(__dirname, '..', '..', 'index.html');

const FNS = new Set([
  // Spells
  'renderSpells','openSpellEditor','saveSpell','deleteSpell','setSpellEdTab','pickSpellImage',
  'openSpellViewer','closeSpellViewer','getSpellRarity',
  // Implants
  'renderImplants','openImplantModal','saveImplant','removeImplant','selectImplantQuality',
  'impQuality','impAttr','impCortexMax','impNeuralMax','impCortexUsed','impNeuralUsed',
  // Mount
  'renderMount','toggleMountMode','applyMountMode','saveMountData','openMountConfig',
  'openMountModal','toggleMountCondition','saveMountConfig',
  // Vehicles
  'renderVehicleState','renderVehBars','renderVehPerf','renderVehTelemetry','renderMods',
  'renderGarageList','renderVehicleGallery','renderAttrVisual','renderModVisual','modPerfLabel',
  'openRaceModal','runRaceSim','openNewVehicleChoice','generateTestVehicle','selectGarageVehicle',
  'vgState','setVgModsMiniTab','openVehicleGalleryPanel','closeVehicleGalleryPanel',
  'openVehicleIdent','editVehPlate','handleVehicleImage','removeVehicleImage',
  'openVehicleFrame','openVehicleDesc','saveVehDesc','openVehicleConfig',
  'openAttributesConfig','vcfgAddCustom','vcfgSelectType','vcfgSetAeroClass','vcfgSetImprovement',
  'initModStatesFor','modSet','modSetStep','saveModDesc','openModDesc','modToggleInstall',
  'modVehCat','vgMediaHTML','getGarageList','removeVgSlot','ensureVehData','switchVehicle',
  // Pets
  'petClick','openPetModal',
  // Factory
  'EMPTY_VEH'
]);

function countChar(s, ch) {
  let n = 0;
  let inStr = null;
  let inTpl = 0;
  let inLineCmt = false;
  let inBlkCmt = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    const prev = s[i-1];
    if (inLineCmt) continue;
    if (inBlkCmt) {
      if (c === '/' && prev === '*') inBlkCmt = false;
      continue;
    }
    if (!inStr && !inTpl) {
      if (c === '/' && s[i+1] === '/') { inLineCmt = true; continue; }
      if (c === '/' && s[i+1] === '*') { inBlkCmt = true; i++; continue; }
    }
    if (inStr) {
      if (c === inStr && prev !== '\\') inStr = null;
      continue;
    }
    if (inTpl) {
      if (c === '`' && prev !== '\\') inTpl = 0;
      continue;
    }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '`') { inTpl = 1; continue; }
    if (c === ch) n++;
  }
  return n;
}

function depthDelta(line) {
  return countChar(line, '{') - countChar(line, '}');
}

const text = fs.readFileSync(FILE, 'utf8');
const lines = text.split(/\r?\n/);
const out = [];
let inRemove = false;
let depth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!inRemove) {
    let matched = null;
    for (const fn of FNS) {
      const re1 = new RegExp(`^function\\s+${fn}\\s*\\(`);
      const re2 = new RegExp(`^async\\s+function\\s+${fn}\\s*\\(`);
      const re3 = new RegExp(`^window\\.${fn}\\s*=\\s*(async\\s+)?function`);
      const re4 = new RegExp(`^const\\s+${fn}\\s*=\\s*(\\[|\\{)`);
      if (re1.test(line) || re2.test(line) || re3.test(line) || re4.test(line)) {
        matched = fn;
        break;
      }
    }
    if (matched) {
      console.error(`  remove start L${i+1}: ${matched}`);
      inRemove = true;
      depth = depthDelta(line);
      if (depth <= 0) { inRemove = false; depth = 0; console.error(`  remove end L${i+1} (oneliner)`); }
      continue;
    }
    out.push(line);
  } else {
    depth += depthDelta(line);
    if (depth <= 0) {
      inRemove = false;
      depth = 0;
      console.error(`  remove end L${i+1}`);
    }
    // line dropped
  }
}

if (process.argv.includes('--dry')) {
  console.log(`[dry] Would keep ${out.length}, drop ${lines.length - out.length}`);
} else {
  fs.writeFileSync(FILE, out.join('\n'));
  console.log(`Wrote ${out.length} lines (dropped ${lines.length - out.length}).`);
}
