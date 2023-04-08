const properFilename = 'funkyfilename.txt';

function expect(originalFilename) {
  return [
    { type: 'field', name: 'title', value: 'Weird originalFilename' },
    {
      type: 'file',
      name: 'upload',
      originalFilename,
      fixture: properFilename,
    },
  ];
}

const webkit = ' ? % * | " < > . ? ; \' @ # $ ^ & ( ) - _ = + { } [ ] ` ~.txt';
const ffOrIe = ' ? % * | " < > . ☃ ; \' @ # $ ^ & ( ) - _ = + { } [ ] ` ~.txt';

module.exports = {
  'osx-chrome-13.http': expect(webkit),
  'osx-firefox-3.6.http': expect(ffOrIe),
  'osx-safari-5.http': expect(webkit),
  'xp-chrome-12.http': expect(webkit),
  'xp-ie-7.http': expect(ffOrIe),
  'xp-ie-8.http': expect(ffOrIe),
  'xp-safari-5.http': expect(webkit),
  'line-separator.http': expect(null),
};
