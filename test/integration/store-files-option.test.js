'use strict';

const fs = require('fs');
const os = require('os');
const http = require('http');
const path = require('path');
const assert = require('assert');

const formidable = require('../../src/index');

const PORT = 13537;
const DEFAULT_UPLOAD_DIR = path.join(
  os.tmpdir(),
  'test-store-files-option-default',
);
const CUSTOM_UPLOAD_FILE_PATH = path.join(DEFAULT_UPLOAD_DIR, 'test-file');
const testFilePath = path.join(
  path.dirname(__dirname),
  'fixture',
  'file',
  'binaryfile.tar.gz',
);

test('store files option', (done) => {
  const server = http.createServer((req, res) => {
    if (!fs.existsSync(DEFAULT_UPLOAD_DIR)) {
      fs.mkdirSync(DEFAULT_UPLOAD_DIR);
    }
    const form = formidable({
      uploadDir: DEFAULT_UPLOAD_DIR,
      fileWriteStreamHandler: () => new fs.WriteStream(CUSTOM_UPLOAD_FILE_PATH),
    });

    form.parse(req, (err, fields, files) => {
      assert.strictEqual(Object.keys(files).length, 1);
      const { file } = files;

      assert.strictEqual(file.size, 301);
      assert.strictEqual(typeof file.filepath, 'string');

      const uploadedFileStats = fs.statSync(CUSTOM_UPLOAD_FILE_PATH);
      assert.ok(uploadedFileStats.size === file.size);

      fs.unlinkSync(CUSTOM_UPLOAD_FILE_PATH);
      res.end();
      server.close();
      done();
    });
  });

  server.listen(PORT, (err) => {
    assert(!err, 'should not have error, but be falsey');

    const request = http.request({
      port: PORT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    fs.createReadStream(testFilePath).pipe(request);
  });
});
