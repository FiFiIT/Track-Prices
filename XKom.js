const request = require("request");
const cheerio = require("cheerio");
const { Product } = require("./product");

class XKomShop {
  constructor(name, url, excludeName = "") {
    this.name = name;
    this.url = url;
    this.excludeName = excludeName;

    this.gatherLinks = this.gatherLinks.bind(this);
    this.skipLink = this.skipLink.bind(this);
    this.products = [];
  }

  mapNameToType(name) {
    const types = [
      { type: "RTX 3060ti", name: "3080 TI" },
      { type: "RTX 3080", name: "3080" },
      { type: "RTX 3090", name: "3090" },
      { type: "6900xt", name: "6900 XT" },
      { type: "6800xt", name: "6800 XT" },
      { type: "6800", name: "6800" },
      { type: "6700", name: "6700 XT" },
    ];

    var type = types.filter((t) => name.includes(t.name))[0];
    return type?.type ?? "OTHER";
  }

  findProducts = () => {
    var products = [];

    this.gatherLinks()
      .then((itmes) => {
        itmes.forEach((link) => {
          this.checkLink(link).then((v) => {
            if (v.available) {
              console.log(v.text());
              products.push(v);
            }
          });
        });
      })
      .catch((e) => {
        console.log("Something goes wrong:\n" + e);
      });

    return products;
  };

  checkLink(link) {
    const options = {
      url: link,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Charset": "utf-8",
        "User-Agent": "my-reddit-client",
      },
    };

    return new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        const $ = cheerio.load(body);
        var cardName = $(".sc-1bker4h-4").text();
        var price = $(".u7xnnm-4").text();

        var status = $(".sc-1jultii-1").first().text();
        var available =
          ["Czasowo niedostępny", "Wycofany"].indexOf(status) == -1
            ? status
            : ""; // == "Dostępny";

        resolve(new Product(cardName, price, available, link));
      });
    });
  }

  skipLink = (name) => {
    return this.excludeName && name.includes(this.excludeName);
  };

  gatherLinks = async () => {
    const options = {
      url: this.url,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Charset": "utf-8",
        "User-Agent": "my-reddit-client",
      },
    };

    return new Promise((resolve, reject) => {
      var links = [];
      request(options, (err, res, body) => {
        if (err) reject("Error on request:\n" + err);

        const $ = cheerio.load(body, null, false);
        var container = $("#listing-container");

        container.children().each((i, e) => {
          var name = $(e).find("h3").first().text();
          var link = $(e).find("a").attr("href");
          var extension = link.split(".").slice(-1);
          if (extension == "html" && !this.skipLink(name)) {
            links.push("https://www.x-kom.pl" + link);
          }
        });

        links = links.filter((v, i, a) => a.indexOf(v) === i);
        resolve(links);
      });
    });
  };
}

exports.XKomShop = XKomShop;
