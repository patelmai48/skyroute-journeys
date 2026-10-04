const sass = require('sass');
const path = require('path');

module.exports = function(content) {
  const resourcePath = this.resourcePath;
  this.cacheable && this.cacheable();

  try {
    const result = sass.compile(resourcePath, {
      loadPaths: [
        path.resolve(__dirname, 'node_modules'),
      ],
      quietDeps: true,
      silenceDeprecations: [
        'import',
        'if-function',
        'global-builtin',
        'color-functions',
        'slash-div',
        'call-string',
        'function-units',
        'duplicate-var-flags'
      ],
      importers: [
        {
          findFileUrl(url) {
            if (url.startsWith('~')) {
              const clean = url.slice(1);
              const resolved = path.resolve(__dirname, 'node_modules', clean);
              return new URL('file://' + resolved.replace(/\\/g, '/'));
            }
            return null;
          }
        }
      ]
    });
    return result.css;
  } catch (e) {
    this.emitError(e);
    return '';
  }
};
