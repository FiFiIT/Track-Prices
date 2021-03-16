const request = require("request");
const cheerio = require("cheerio");
const { Product } = require("./product");

class SHOP {
  constructor(name, url, excludeName = "") {
    this.name = name;
    this.url = url;
    this.excludeName = excludeName;
    this.pageData = {};

    this.gatherLinks = this.gatherLinks.bind(this);
    this.skipLink = this.skipLink.bind(this);
    this.products = [];
  }

  findProducts = () => {
    this.gatherLinks()
      .then((itmes) => {
        itmes.forEach((link) => {
          this.checkLink(link).then((v) => {
            if (v.available) console.log(v.text());
          });
        });
      })
      .catch((e) => {
        console.log("Something goes wrong:\n" + e);
      });
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
        var container = $(this.pageData.mainContiner).html();

        container.children().each((i, e) => {
          var name = $(e).find("h2").first().text();
          var link = $(e).find("a").first().attr("href");
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

exports.SHOP = SHOP;
