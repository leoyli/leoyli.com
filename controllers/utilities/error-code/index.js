/* eslint-disable no-shadow, no-template-curly-in-string */
const { checkToStringTag } = require('../string');


class ErrorCodeDictionary {
  constructor(dictionary) {
    this.dictionary = new Map(Object.entries(dictionary).map(pair => [+pair[0], pair[1]]));
  }

  lookup(entry, literals) {
    if (!this.dictionary.has(entry)) return null;
    if (!checkToStringTag(literals, 'String')) return this.dictionary.get(entry);

    // replacing with template literals
    return this.dictionary.get(entry).replace(/\${([^}]*)}/g, (match, key) => {
      const replacement = checkToStringTag(literals, 'Object')
        ? literals[key] || literals[key] === 0 ? literals[key] : match
        : literals;
      return `${replacement}`.trim();
    });
  }
}


// dictionary collection
const collection = new Map();

collection.set('ServerError_en', new ErrorCodeDictionary({
  90001: 'Failed to load website configs, please contact the admin.',
  92001: '[MultiPartUpload] Cannot create the folder (fs.mkdir, missing parent folder?): ${dirPath}',
  92002: '[MultiPartUpload] Failed to clean up the truncated file...\n${errString}',
}));

collection.set('TemplateException_en', new ErrorCodeDictionary({
  91001: 'Failed to compile template function: ${filePath}\n${err}',
  91002: 'Failed to render template function: ${filePath}\n${err}',
  91003: 'Failed to asynchronously lookup file (fs.readFile): ${filePath}',
  91004: 'Failed to synchronously lookup file (fs.readFileSync): ${filePath}',
}));

collection.set('ClientException_en', new ErrorCodeDictionary({
  10001: 'Please fill all required fields.',
  10002: 'Two new password does not the same.',
  10003: 'Password cannot be set to the same as the current.',
  20001: 'Invalid authorization...',
  20002: 'Wrong email/username or password!',
  20003: 'Please sign in first!',
}));

collection.set('HttpException_en', new ErrorCodeDictionary({
  400: 'HTTP 400 - Bad Request.',
  401: 'HTTP 401 - Unauthorized.',
  403: 'HTTP 403 - Forbidden.',
  404: 'HTTP 404 - Not found.',
  500: 'HTTP 500 - Internal Server Error.',
}));


// exports
module.exports = new Proxy(collection, {
  get: (collection, name) => {
    const book = `${name}_${process.env.$WEBSITE_CONFIGS.language || 'en'}`;
    if (collection.has(book)) return (entry, literals) => collection.get(book).lookup(entry, literals) || entry;
    return (entry) => entry;
  },
});
