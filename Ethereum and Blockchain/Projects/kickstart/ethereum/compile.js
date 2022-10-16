
const path = require('path');
// Couple of extra functions in fs-extra
const fs = require('fs-extra');

const solc = require('solc');


// Delete the build folder
// Folder inside ethereum directory
const buildPath = path.resolve(__dirname, 'build');
//  Basically removes a file/folder in a single command.

fs.removeSync(buildPath);

// Resolve the path to the Campaign.sol file
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');

// Read the contents of the file
const source = fs.readFileSync(campaignPath, 'utf8');

// Compile the source code
// Compiling : Only care about contracts property
const output = solc.compile(source, 1).contracts;


// This basically creates a build folder
// See the step diagram on how compile.js works
fs.ensureDirSync(buildPath);

// Writing the contracts to the build folder
console.log(output);
for(let contracts in output) {
  // Writes out an JSON file
  fs.outputJsonSync(
    path.resolve(buildPath, contracts.replace(':', '') + '.json'),
    output[contracts]
  );
}

