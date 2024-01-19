const fs = require('fs');
const rl = require('readline');

const input = process.stdin;
const output = process.stdout;
const readLine = rl.createInterface({ input, output });

const writeStream = fs.createWriteStream('./02-write-file/text.txt');

readLine.write(`Please type smth in: \n`)

readLine.on('line', (data) => {
  if (data === 'exit') {
    handleExit();
  }

  readLine.write(writeStream.write(`${data}\n`));
})

readLine.on('SIGINT', handleExit);

function handleExit() {
  readLine.write('Stop writting to file');
  readLine.close();

  process.exit();
}