const fs = require('fs');
const path = require('path');

function directoryToTree(rootDir, depth) {
  const absolutePath = path.resolve(rootDir);
  const stat = fs.statSync(absolutePath);
    const name = path.basename(rootDir); // Step 2
  const size = stat.size; // Step 3

  if (stat.isFile()) { // Step 4
    return {
      path: rootDir,
      name: name,
      type: 'file',
      size: size
    };
  }

  if (depth === 0) { // Step 5
    return {
      path: rootDir,
      name: name,
      type: 'dir',
      size: size,
      children: []
    };
  }

  const children = fs.readdirSync(rootDir).map((child) => { // Step 6
    const childPath = path.join(rootDir, child); // Step 7
    return directoryToTree(childPath, depth - 1); // Step 8
  });

  return {
    path: rootDir,
    name: name,
    type: 'dir',
    size: size,
    children: children // Step 9
  };
}

module.exports = directoryToTree;
