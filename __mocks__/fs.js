const fs = jest.genMockFromModule('fs');
fs.readFileAsync = () => undefined;
module.exports = fs;
