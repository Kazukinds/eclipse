#!/usr/bin/env node
// AST-based purge: extracts each <script> block, parses with acorn, finds top-level
// FunctionDeclaration / VariableDeclaration / AssignmentExpression (window.X=...) for removed names,
// and deletes them from the HTML by character ranges.
const fs = require('fs');
const path = require('path');
const acorn = require(path.resolve(__dirname, '..', 'node_modules', 'acorn'));

const FILE = path.resolve(__dirname, '..', '..', 'index.html');

const REMOVED_NAMES = new Set([
  // Spells
  'renderSpells','openSpellEditor','saveSpell','deleteSpell','setSpellEdTab','pickSpellImage',
  'openSpellViewer','closeSpellViewer','getSpellRarity','spellNav','spellFlip',
  'SPELL_RARITIES','SPELL_ESSENCES',
  'spells','nextSpellId','_editingSpellId','_viewerIndex',
  // Implants
  'renderImplants','openImplantModal','saveImplant','removeImplant','selectImplantQuality',
  'impQuality','impAttr','impCortexMax','impNeuralMax','impCortexUsed','impNeuralUsed',
  'IMP_QUALITIES','IMP_CATALOG','implantData',
  // Mount / pets
  'renderMount','toggleMountMode','applyMountMode','saveMountData','openMountConfig',
  'openMountModal','toggleMountCondition','saveMountConfig',
  'MOUNT_CONDITIONS','mountMode','mountData',
  'petClick','openPetModal','petClicks','petEvolved','PET_DOG_SVG','PET_DINO_SVG',
  // Vehicles (functions)
  'renderVehicleState','renderVehBars','renderVehPerf','renderVehTelemetry','renderMods',
  'renderGarageList','renderVehicleGallery','renderAttrVisual','renderModVisual','modPerfLabel',
  'renderVehPlate','renderVgModsMini',
  'openRaceModal','runRaceSim','openNewVehicleChoice','generateTestVehicle','selectGarageVehicle',
  'vgState','setVgModsMiniTab','openVehicleGalleryPanel','closeVehicleGalleryPanel',
  'openVehicleIdent','editVehPlate','handleVehicleImage','removeVehicleImage',
  'openVehicleFrame','openVehicleDesc','saveVehDesc','openVehicleConfig',
  'openAttributesConfig','vcfgAddCustom','vcfgSelectType','vcfgSetAeroClass','vcfgSetImprovement',
  'initModStatesFor','modSet','modSetStep','saveModDesc','openModDesc','modToggleInstall',
  'modVehCat','vgMediaHTML','getGarageList','removeVgSlot','ensureVehData','switchVehicle',
  'vgRandomPlate','vgQualityFromMax','vgQualityOf','createBlankVehicle','selectNewVehType',
  'handleVgSlotClick','openVgSlotPopover','closeVgSlotPopover','vgModEmoji','vgStockEmojiFor',
  'toggleVgCarousel','initVgCarouselEdge','vgGalleryEsc','vgGalToggleSel',
  'toggleVgGalMulti','vgGalSelectAll','vgGalBulkDelete','vgGalToggleSelect',
  // Vehicles (state/constants)
  'EMPTY_VEH','userGarage','vehPlateData','vehiclesData','vehicleState','currentVehicle',
  'modStates','modState','currentModK','customVehicles',
  'vehModsTab','vehSideTab','vgModsMiniTab',
  'VEH_TYPE_LABELS','VEH_TYPE_ICONS','VEH_TYPE_DRAW_MAP','VEH_TYPES_ORDER',
  'AERO_CLASS_LABELS','VEH_MODS','VEH_TYPE_TO_MOD_CAT','MOD_COLORS','MOD_MAX',
  'VG_NAMES','VG_QUALITIES','VG_MOD_ICON','VG_STOCK_ICON','VEH_DRAWINGS','MOD_DESCS',
  '_vgGalMode','_vgGalMulti','_vgGalSelected','_currentEditingImplant',
  // More vehicle functions (pass 3)
  'uploadVgSlotImage','renderVgZones','renderVgMelhorias','renderVgStock',
  'addStockItem','editStockItem','openVgGalDetail','closeVgGalDetail','setVgGalMode',
  'applyPlateStyle','saveVehicleIdent','setPlateDraft','saveVehPlate',
  'attrPerfLabel','openStanceImages','pickStanceImage','clearStanceImage',
  'vfAttachDrag','vfUpdate','vfTogglePreview','vfZoomStep','vfNudge',
  'vfCropImage','vfCenter','vfSetFit','vfReset','vfSave',
  'switchAttrTab','acfgSet','acfgStep','vcfgSetHP','updateModsCount','buildModSvg',
  // More spell helpers
  'detectEssence','clearSpellImage','refreshSpellImgPicker',
  'attachCardDrag','attachCardPointer','renderSpellStage',
  // Pass 4 cleanup
  'removeStockItem',
  // Pass 5 — attr/stance helpers tied to vehicle attrs
  'ATTR_MAX','attrDef','attrPct','STANCE_ATTRS','ATTR_DEFS','currentAttrTab',
]);

// Identifiers whose use in any ExpressionStatement / top-level statement implies removal
const DEAD_IDENTS = new Set([
  'VEH_TYPES_ORDER','vehiclesData','EMPTY_VEH','initModStatesFor','renderMods',
  'renderVehicleState','renderVehPerf','renderGarageList','applyMountMode',
  'toggleMountMode','MOUNT_CONDITIONS','mountData','userGarage','currentVehicle',
  'vehicleState','VEH_TYPE_LABELS','modStates','customVehicles',
  'implantData','IMP_QUALITIES','IMP_CATALOG','spells','nextSpellId',
  'renderSpells','openSpellEditor','closeSpellViewer',
]);

function nodeReferencesDead(node, src) {
  const snippet = src.slice(node.start, node.end);
  for (const id of DEAD_IDENTS) {
    // Use word boundary check
    const re = new RegExp(`\\b${id}\\b`);
    if (re.test(snippet)) return true;
  }
  return false;
}

function collectScriptBlocks(html) {
  const blocks = [];
  const re = /<script(\s[^>]*)?>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const openTagEnd = m.index + m[0].indexOf('>') + 1;
    const contentStart = openTagEnd;
    const contentEnd = m.index + m[0].length - '</script>'.length;
    blocks.push({ fileStart: contentStart, fileEnd: contentEnd, code: m[2] });
  }
  return blocks;
}

function getDeclaredNames(node) {
  // Returns array of declared names on a top-level node, or null
  if (node.type === 'FunctionDeclaration' && node.id) {
    return [node.id.name];
  }
  if (node.type === 'VariableDeclaration') {
    return node.declarations
      .filter(d => d.id && d.id.type === 'Identifier')
      .map(d => d.id.name);
  }
  if (node.type === 'ExpressionStatement') {
    const e = node.expression;
    if (e.type === 'AssignmentExpression' && e.left.type === 'MemberExpression') {
      // window.X = ... or document.foo = ...
      if (e.left.object.type === 'Identifier' && e.left.object.name === 'window' &&
          e.left.property.type === 'Identifier') {
        return [e.left.property.name];
      }
    }
  }
  return null;
}

function shouldRemove(node) {
  const names = getDeclaredNames(node);
  if (!names) return false;
  return names.some(n => REMOVED_NAMES.has(n));
}

function processBlock(block) {
  let ast;
  try {
    ast = acorn.parse(block.code, { ecmaVersion: 'latest', sourceType: 'script', allowReturnOutsideFunction: true });
  } catch (e) {
    console.error(`  parse error @ block: ${e.message}`);
    return null; // skip block
  }
  const removeRanges = []; // [start,end) inside block.code
  for (const node of ast.body) {
    if (shouldRemove(node)) {
      let end = node.end;
      while (end < block.code.length && /[\s;]/.test(block.code[end])) end++;
      removeRanges.push([node.start, end, getDeclaredNames(node).join(',')]);
      continue;
    }
    // Top-level ExpressionStatement that references dead identifiers
    if (node.type === 'ExpressionStatement' && nodeReferencesDead(node, block.code)) {
      let end = node.end;
      while (end < block.code.length && /[\s;]/.test(block.code[end])) end++;
      removeRanges.push([node.start, end, 'expr-dead']);
    }
  }
  return removeRanges;
}

const html = fs.readFileSync(FILE, 'utf8');
const blocks = collectScriptBlocks(html);
console.log(`Found ${blocks.length} script blocks`);

// Build list of file-level ranges to remove
const fileRanges = [];
for (const b of blocks) {
  const ranges = processBlock(b);
  if (!ranges) continue;
  for (const [s, e, name] of ranges) {
    fileRanges.push([b.fileStart + s, b.fileStart + e, name]);
  }
}

if (process.argv.includes('--dry')) {
  console.log(`[dry] ${fileRanges.length} ranges to remove`);
  fileRanges.slice(0, 30).forEach(([s, e, n]) => {
    const linesBefore = html.slice(0, s).split('\n').length;
    const linesIn = html.slice(s, e).split('\n').length - 1;
    console.log(`  L${linesBefore} (+${linesIn} lines): ${n}`);
  });
  if (fileRanges.length > 30) console.log(`  ... and ${fileRanges.length - 30} more`);
} else {
  // Sort descending and apply splice
  fileRanges.sort((a, b) => b[0] - a[0]);
  let out = html;
  for (const [s, e] of fileRanges) {
    out = out.slice(0, s) + out.slice(e);
  }
  fs.writeFileSync(FILE, out);
  const before = html.split('\n').length;
  const after = out.split('\n').length;
  console.log(`Kept ${after} / ${before} lines (dropped ${before - after}).`);
}
