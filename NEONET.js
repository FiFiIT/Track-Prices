const base = require("./SHOP");

class NEONET extends base.SHOP {
  constructor(name, url, excludeName = "") {
    super(name, url, excludeName);

    this.pageData = {
      mainContiner: ".listingMobileCss-gallery-hFt",
    };
  }
}

exports.NEONET = NEONET;
