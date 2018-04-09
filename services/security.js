class ContentSecurityPolicy {
  constructor() {
    this.whitelist = [];
  }

  addToWhitelist(src, domain) {
    this.whitelist.push([src, domain]);
  }

  getTrustedDomains(src) {
    return this.whitelist.filter(i => i[0].includes(src)).map(j => j[1]).join(' ');
  }

  rules() {
    const RuleMaps  = {
      "default-src" : "'self'",
      "script-src"  : `'self' ${this.getTrustedDomains('script')}`,
      "style-src"   : `'self' 'unsafe-inline' ${this.getTrustedDomains('style')}`,
      "font-src"    : `${this.getTrustedDomains('font')}`,
      "img-src"     : "*",
      "frame-src"   : "'none'",
      "object-src"  : "'none'",
    };
    return Object.entries(RuleMaps).map(i => i.join(' ')).join('; ');
  }
}


function securityHeaderAgent(app) {
  const CSPConfigs = new ContentSecurityPolicy();
  CSPConfigs.addToWhitelist('script, style, font', 'https://maxcdn.bootstrapcdn.com/');
  CSPConfigs.addToWhitelist('script, style', 'https://cdnjs.cloudflare.com/');
  CSPConfigs.addToWhitelist('script', 'https://code.jquery.com/');

  app.set('x-powered-by', false);
  app.use((req, res, next) => {
    res.set({
      "Content-Security-Policy"  : CSPConfigs.rules(),
      "Cache-Control"            : "max-age=0",
      "X-XSS-Protection"         : "1; mode=block",
      "X-Frame-Options"          : "DENY",
    });
    return next();
  });
}



// exports
module.exports = securityHeaderAgent;