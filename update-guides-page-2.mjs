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

const oldPublished = `  { title: 'LCL vs FCL — Which One Do You Need?', description: 'Compare less-than-container-load and full-container-load shipping.', href: '/guides/lcl-vs-fcl' },
];`;

const newPublished = `  { title: 'LCL vs FCL — Which One Do You Need?', description: 'Compare less-than-container-load and full-container-load shipping.', href: '/guides/lcl-vs-fcl' },
  { title: 'Air Freight Chargeable Weight Explained', description: 'Why air freight cost depends on both weight and volume.', href: '/guides/air-freight-chargeable-weight' },
];`;

replaceOnce(oldPublished, newPublished, 'add_to_published');

const oldUpcoming = `  { title: 'Container Guide (20GP / 40GP / 40HC)', description: 'Dimensions, capacities, and when to use each container type.' },
  { title: 'Air Freight Chargeable Weight Explained', description: 'Why air freight cost depends on both weight and volume.' },
];`;

const newUpcoming = `  { title: 'Container Guide (20GP / 40GP / 40HC)', description: 'Dimensions, capacities, and when to use each container type.' },
];`;

replaceOnce(oldUpcoming, newUpcoming, 'remove_from_upcoming');

fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
