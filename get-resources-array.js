// Import the fs module
const fs = require('fs');

// Define the directory path
const dirPath = 'static/res/';

// Define an empty array to store the paths
let result = [];

// Define a recursive function to get the paths
async function getPaths(path) {
  // Get the directory contents
  let files = await fs.promises.readdir(path);

  // Loop through the files
  for (let file of files) {
    // Get the full path
    let fullPath = path + file;

    // Get the file stats
    let stats = await fs.promises.stat(fullPath);

    // Check if it is a directory or a file
    if (stats.isDirectory()) {
      // Call the function again with the subdirectory path
      await getPaths(fullPath + '/');
    } else {
      // Push the path to the array
      result.push(fullPath);
    }
  }
}

// Call the function with the initial path
getPaths(dirPath)
  .then(() => {
    // Log the result
    console.log(result);
  })
  .catch((err) => {
    // Handle errors
    console.error(err);
  });
