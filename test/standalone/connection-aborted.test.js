'use strict';

const assert = require('assert');
const http = require('http');
const net = require('net');
const formidable = require('../../src/index');

const PORT = 13539;

test('connection aborted', (done) => {
  const server = http.createServer((req) => {
    const form = formidable();

    let abortedReceived = false;
    form.on('aborted', () => {
      abortedReceived = true;
    });
    form.on('error', () => {
      assert(abortedReceived, 'Error event should follow aborted');
      server.close();
    });
    form.on('end', () => {
      throw new Error('Unexpected "end" event');
    });
    form.parse(req, () => {
      assert(
        abortedReceived,
        'from .parse() callback: Error event should follow aborted',
      );

      server.close();
      done();
    });
  });

  server.listen(PORT, 'localhost', () => {
    const choosenPort = server.address().port;

    const client = net.connect(choosenPort);

    client.write(
      'POST / HTTP/1.1\r\n' +
        'Content-Length: 70\r\n' +
        'Content-Type: multipart/form-data; boundary=foo\r\n\r\n',
    );
    client.end();
  });
});
