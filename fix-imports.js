const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const webFiles = walk('./apps/web/src');
webFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/@\/lib\/types/g, '@clapculture/shared');
  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
  }
});

const apiFiles = walk('./apps/api/src');
apiFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/['"]\.\.\/types['"]/g, "'@clapculture/shared'");
  newContent = newContent.replace(/['"]\.\.\/types\/index['"]/g, "'@clapculture/shared'");
  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
  }
});
console.log('Imports fixed.');
