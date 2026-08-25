import fs from 'fs';

const filePath = 'app/guides/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

function replaceOnce(oldStr, newStr, label) {
  const count = content.split(oldStr).length - 1;
  if (count !== 1) {
    console.log(`FAIL:${label}:found=${count}`);
    process.exit(1);
  }
  content = content.replace(oldStr, newStr);
  console.log(`OK:${label}`);
}

const oldPublished = `  { title: 'Air Freight Chargeable Weight Explained', description: 'Why air freight cost depends on both weight and volume.', href: '/guides/air-freight-chargeable-weight' },
];`;

const newPublished = `  { title: 'Air Freight Chargeable Weight Explained', description: 'Why air freight cost depends on both weight and volume.', href: '/guides/air-freight-chargeable-weight' },
  { title: 'Incoterms Explained Simply', description: 'A clear breakdown of who is responsible for what, and when.', href: '/guides/incoterms-explained' },
];`;

replaceOnce(oldPublished, newPublished, 'add_to_published');

const oldUpcoming = `const upcomingGuides = [
  { title: 'Incoterms Explained Simply', description: 'A clear breakdown of who is responsible for what, and when.' },
  { title: 'Container Guide (20GP / 40GP / 40HC)', description: 'Dimensions, capacities, and when to use each container type.' },
];`;

const newUpcoming = `const upcomingGuides = [
  { title: 'Container Guide (20GP / 40GP / 40HC)', description: 'Dimensions, capacities, and when to use each container type.' },
];`;

replaceOnce(oldUpcoming, newUpcoming, 'remove_from_upcoming');

fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
