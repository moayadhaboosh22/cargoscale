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

const oldPublished = `const publishedGuides = [
  { title: 'What is CBM & How to Calculate It', description: 'Understand cubic meters and how shipment volume is calculated.', href: '/guides/cbm-explained' },
];`;

const newPublished = `const publishedGuides = [
  { title: 'What is CBM & How to Calculate It', description: 'Understand cubic meters and how shipment volume is calculated.', href: '/guides/cbm-explained' },
  { title: 'LCL vs FCL — Which One Do You Need?', description: 'Compare less-than-container-load and full-container-load shipping.', href: '/guides/lcl-vs-fcl' },
];`;

replaceOnce(oldPublished, newPublished, 'add_to_published');

const oldUpcoming = `const upcomingGuides = [
  { title: 'LCL vs FCL — Which One Do You Need?', description: 'Compare less-than-container-load and full-container-load shipping.' },
  { title: 'Incoterms Explained Simply', description: 'A clear breakdown of who is responsible for what, and when.' },`;

const newUpcoming = `const upcomingGuides = [
  { title: 'Incoterms Explained Simply', description: 'A clear breakdown of who is responsible for what, and when.' },`;

replaceOnce(oldUpcoming, newUpcoming, 'remove_from_upcoming');

fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
