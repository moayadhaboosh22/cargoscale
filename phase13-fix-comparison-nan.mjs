import fs from 'fs';
const filePath = 'lib/engine/comparison.ts';
let content = fs.readFileSync(filePath, 'utf8');
function replaceOnce(oldStr, newStr, label) {
  const count = content.split(oldStr).length - 1;
  if (count !== 1) { console.log(`FAIL:${label}:found=${count}`); process.exit(1); }
  content = content.replace(oldStr, newStr);
  console.log(`OK:${label}`);
}
replaceOnce(
  `  if (lclCost === null || fclCost === null) {
    return {
      lclCost,
      fclCost,
      differenceAmount: null,
      recommendedOption: null,
      strength: 'LOW',
      reasons: ['Insufficient pricing data for a reliable financial comparison.'],
    };
  }

  const differenceAmount`,
  `  if (lclCost === null || fclCost === null) {
    return {
      lclCost,
      fclCost,
      differenceAmount: null,
      recommendedOption: null,
      strength: 'LOW',
      reasons: ['Insufficient pricing data for a reliable financial comparison.'],
    };
  }

  if (!Number.isFinite(lclCost.totalEstimatedCost) || !Number.isFinite(fclCost.totalEstimatedCost)) {
    return {
      lclCost,
      fclCost,
      differenceAmount: null,
      recommendedOption: null,
      strength: 'LOW',
      reasons: ['Insufficient pricing data for a reliable financial comparison.'],
    };
  }

  const differenceAmount`,
  'add_nan_guard'
);
fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
