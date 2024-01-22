const fs = require('fs');
const path = require('path');

const projectFolder = 'project-dist';

buildPage();

async function buildPage() {
  const existsPromise = new Promise ((resolve, reject) => {
    fs.access(path.join(__dirname, projectFolder), (err) => {
      const exists = !Boolean(err);

      resolve(exists);
    });
  })
  const exists = await existsPromise;
  console.log('Directory exists:', exists);

  const dirPromise = new Promise ((resolve, reject) => {
    if (!exists) {
      fs.mkdir(path.join(__dirname, projectFolder), (err, data) => {});

      resolve(`${projectFolder} directory is created`);
    } else {
      async function deleteFiles() {
        const entries = await fs.promises.readdir(path.join(__dirname, projectFolder));

        console.log(`Files in directory: ${entries}`);

        for (const entry of entries) {
          await fs.promises.rm(path.join(__dirname, projectFolder, entry), {recursive: true});

          console.log(`Delete ${entry}`);
        }

        resolve('Old files deleted');
      }

      deleteFiles();
    }
  })
  const dirMessage = await dirPromise;
  console.log(dirMessage);
 
  createHtmlFile();
  createStyleFile();

  const assetsFolder = 'assets';
  copyFiles(path.join(__dirname, assetsFolder), path.join(__dirname, projectFolder, assetsFolder));
}

function createHtmlFile() {
  const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), {encoding: 'utf-8'});
  const writeStream = fs.createWriteStream(path.join(__dirname, projectFolder, 'index.html'));
  
  const componenetsFolder = 'components';
  
  readStream.on('data', (data) => {
    console.log('Writing index.html');
    
    const tags = [];

    fs.readdir(path.join(__dirname, componenetsFolder), (err, entries) => {
      entries.forEach(entry => {
       
        tags.push(entry);  
      });

      for (let i = 0; i < tags.length; i += 1) {
        const str = `{{${tags[i].replace('.html', '')}}}`;

        const stream = fs.createReadStream(path.join(__dirname, componenetsFolder, tags[i]), {encoding: 'utf-8'});
        
        stream.on('data', (htmlData) => {
          data = data.replace(str, htmlData);
          
          if (i === tags.length - 1) {
            writeStream.write(data);
          }
        });
      }
    })  
  })
}
  
function createStyleFile() {
  console.log('Bundling style.css');

  const stylesFolder = 'styles';
  // const projectFolder = 'project-dist';
  const bundleCssFile = 'style.css';

  fs.promises
    .readdir(path.join(__dirname, stylesFolder), { withFileTypes: true })
    .then((entries) => {
      const stylesArr = [];

      entries.forEach((entry) => {
        const filePath = path.join(__dirname, stylesFolder, entry.name);

        if (entry.isFile() && path.extname(filePath) === '.css') {
          const readStream = fs.createReadStream(
            path.join(__dirname, stylesFolder, entry.name),
            { encoding: 'utf-8' },
          );
          const writeStream = fs.createWriteStream(
            path.join(__dirname, projectFolder, bundleCssFile),
          );

          const promise = new Promise(function (resolve, reject) {
            readStream.on('data', (data) => {
              stylesArr.push(data);

              resolve(stylesArr);
            });
          });

          promise.then((array) => {
            writeStream.write(array.join(''));
          });
        }
      });
    });
}
  
function copyFiles(srcFolder, destFolder) {
  console.log(`Copying ${destFolder}`);
  
  fs.promises.mkdir(destFolder).then(() => {
    fs.readdir(srcFolder, {withFileTypes: true}, (err, entries) => {
      entries.forEach((entry) => {
        if (!entry.isFile()) {
          copyFiles(path.join(srcFolder, entry.name), path.join(destFolder, entry.name));
        } else {
          fs.copyFile(
            path.join(srcFolder, entry.name),
            path.join(destFolder, entry.name),
            () => {},
          );
        }
      });
    });
  });
}