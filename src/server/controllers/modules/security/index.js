class ContentSecurityPolicy {
  constructor() {
    this.whitelist = [];
  }

  addToWhitelist(src, domain) {
    this.whitelist.push([src, domain]);
    return this;
  }

  getTrustedDomains(src) {
    return this.whitelist.filter(i => i[0].includes(src)).map(j => j[1]).join(' ');
  }

  generateRules() {
    const RuleMaps  = {
      'connect-src': `'self' ${this.getTrustedDomains('connect')}`,
      'default-src': '\'self\'',
      'font-src': `${this.getTrustedDomains('font')}`,
      'frame-src': '\'none\'',
      'img-src': '*',
      'object-src': '\'none\'',
      'script-src': `'self' 'unsafe-inline' ${this.getTrustedDomains('script')}`,
      'style-src': `'self' 'unsafe-inline' ${this.getTrustedDomains('style')}`,
    };
    return Object.entries(RuleMaps).map(i => i.join(' ')).join('; ');
  }
}


// exports
module.exports = {
  ContentSecurityPolicy,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
