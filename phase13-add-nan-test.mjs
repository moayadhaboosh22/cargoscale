import fs from 'fs';
const filePath = 'lib/engine/comparison.test.ts';
let content = fs.readFileSync(filePath, 'utf8');
function replaceOnce(oldStr, newStr, label) {
  const count = content.split(oldStr).length - 1;
  if (count !== 1) { console.log(`FAIL:${label}:found=${count}`); process.exit(1); }
  content = content.replace(oldStr, newStr);
  console.log(`OK:${label}`);
}
replaceOnce(
  `  it('returns LOW strength when both prices are nearly equal', () => {
    const result = compareLclVsFcl(makeCost(1000), makeCost(1005));
    expect(result.strength).toBe('LOW');
  });
});`,
  `  it('returns LOW strength when both prices are nearly equal', () => {
    const result = compareLclVsFcl(makeCost(1000), makeCost(1005));
    expect(result.strength).toBe('LOW');
  });

  it('does not produce a fake HIGH-confidence recommendation when a cost is NaN', () => {
    const brokenCost: CostBreakdown = { ...makeCost(0), totalEstimatedCost: NaN };
    const result = compareLclVsFcl(brokenCost, makeCost(1000));
    expect(result.strength).toBe('LOW');
    expect(result.recommendedOption).toBe(null);
    expect(result.differenceAmount).toBe(null);
  });
});`,
  'add_nan_test'
);
fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
