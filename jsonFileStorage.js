import { readFile, writeFile } from 'fs';

export function write(filename, jsonContentObj, callback) {
  const jsonContentStr = JSON.stringify(jsonContentObj);

  writeFile(filename, jsonContentStr, (writeErr) => {
    if (writeErr) {
      console.log(writeErr);
      callback(writeErr, null);
    } else {
      console.log('write success!');
      callback(null, jsonContentStr);
    }
  });
}

export function read(filename, callback) {
  const handleFileRead = (readErr, jsonContentStr) => {
    if (readErr) {
      console.error('Read error', readErr);
      // Allow client to handle error in their own way
      callback(readErr, null);
      return;
    }

    // Convert file content to JS Object
    const jsonContentObj = JSON.parse(jsonContentStr);

    // Call client callback on file content
    callback(null, jsonContentObj);
  };

  // Read content from DB
  readFile(filename, 'utf-8', handleFileRead);
}

export function edit(filename, readCallback, writeCallback) {
  read(filename, (readErr, jsonContentObj) => {
    if (readErr) {
      console.log('read Err', readErr);
      readCallback(readErr, null);
      return;
    }
    readCallback(null, jsonContentObj);

    write(filename, jsonContentObj, writeCallback);
  });
}

export function add(filename, key, input, callback) {
  edit(filename, (err, jsonContentObj) => {
    if (err) {
      console.error('Edit error', err);
      callback(err);
      return;
    }
    if (!(key in jsonContentObj)) {
      console.error('Key does not exist');
      callback('Key does not exist');
      return;
    }
    jsonContentObj[key].push(input);
  },
  callback);
}
