const fs = require('fs');
const dirPath = 'static/res/';

let result = [];

async function getPaths(path) {
  let files = await fs.promises.readdir(path);

  for (let file of files) {
    let fullPath = path + file;
    let stats = await fs.promises.stat(fullPath);

    if (stats.isDirectory()) {
      await getPaths(fullPath + '/');
    } else {
      result.push(fullPath);
    }
  }
}

getPaths(dirPath)
  .then(() => {
    console.log(result);
  })
  .catch((err) => {
    console.error(err);
  });
