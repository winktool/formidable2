'use strict';

const http = require('http');
const assert = require('assert');
const formidable = require('../../src/index');

const testData = {
  numbers: [1, 2, 3, 4, 5],
  nested: { key: 'val' },
};

const PORT = 13535;
test('json', (done) => {
  const server = http.createServer((req, res) => {
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields) => {
      assert.deepStrictEqual(fields, {
        numbers: [1, 2, 3, 4, 5],
        nested: { key: 'val' },
      });

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
        'Content-Type': 'application/json',
      },
    });

    request.write(JSON.stringify(testData));
    request.end();
  });
});
