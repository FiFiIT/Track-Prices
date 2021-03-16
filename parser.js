const request = require("request");
const cheerio = require("cheerio");

const serachOptions = {
  excludeName: "Sony PlayStation 4",
};

const XKomProducts = [
  {
    product: "RTX 3080",
    url:
      "https://www.x-kom.pl/szukaj?q=rtx%203080&f%5Bgroups%5D%5B5%5D=1&sort_by=accuracy_desc&f%5Bcategories%5D%5B345%5D=1",
    excludeName: "",
  }, //X-Kom RTX3080
  {
    product: "RTX 3060 ti",
    url:
      "https://www.x-kom.pl/szukaj?q=3060%20ti&f%5Bgroups%5D%5B5%5D=1&sort_by=accuracy_desc&f%5Bcategories%5D%5B345%5D=1",
    excludeName: "",
  },
  {
    product: "RTX 3070",
    url:
      "https://www.x-kom.pl/szukaj?q=3070&f%5Bgroups%5D%5B5%5D=1&sort_by=accuracy_desc&f%5Bcategories%5D%5B346%5D=1", // 3070
    excludeName: "",
  },
  {
    product: "6800/6800xt",
    url:
      "https://www.x-kom.pl/szukaj?q=6800&f%5Bgroups%5D%5B5%5D=1&sort_by=accuracy_desc&f%5Bcategories%5D%5B345%5D=1", // 3070
    excludeName: "",
  },
  {
    product: "6900",
    url:
      "https://www.x-kom.pl/szukaj?q=6900&f%5Bgroups%5D%5B5%5D=1&sort_by=accuracy_desc&f%5Bcategories%5D%5B345%5D=1", // 3070
    excludeName: "",
  },
  {
    product: "Playstation 5",
    url: "https://www.x-kom.pl/g-7/c/2572-konsole-playstation.html", //konsole playstation
    excludeName: "Sony PlayStation 4",
  },
];

const args = process.argv.slice(2);

const SHOW_ALL = args[0] == 1;

async function gatherXKomLinks(url, excludeName = "") {
  var links = [];
  const options = {
    url: url,
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Charset": "utf-8",
      "User-Agent": "my-reddit-client",
    },
  };

  return new Promise(function (resolve, reject) {
    request(options, (err, res, body) => {
      if (err) reject("Error on request:\n" + err);

      const $ = cheerio.load(body, null, false);
      var container = $("#listing-container");
      // var container = $("#listing-container a").attr(
      //   "class",
      //   "sc-1h16fat-0 sc-1yu46qn-9 elgoMT"
      // );

      container.children().each((i, e) => {
        var skipLink = false;
        var name = $(e).find("h3").first().text();
        if (excludeName && name.includes(excludeName)) {
          skipLink = true;
        }
        var link = $(e).find("a").attr("href");
        var extension = link.split(".").slice(-1);
        if (extension == "html" && !skipLink) {
          links.push("https://www.x-kom.pl" + link);
        }
      });

      links = links.filter((v, i, a) => a.indexOf(v) === i);
      resolve(links);
    });
  });
}

function checkXKomLink(link) {
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

      resolve({
        name: cardName,
        type: mapNameToType(cardName),
        price: $(".u7xnnm-4").text(),
        available: $(".sc-1jultii-1").first().text() != "Czasowo niedostępny",
        link: link,
      });
    });
  });
}

function mapNameToType(name) {
  const types = [
    { type: "RTX 3060ti", name: "3080 TI" },
    { type: "RTX 3080", name: "3080" },
    { type: "RTX 3090", name: "3090" },
    { type: "6900xt", name: "6900 XT" },
    { type: "6800xt", name: "6800 XT" },
    { type: "6800", name: "6800" },
  ];

  var type = types.filter((t) => name.includes(t.name))[0];

  return type?.type ?? "OTHER";
}

XKomProducts.forEach((product) => {
  gatherXKomLinks(product.url, product.excludeName)
    .then((v) => {
      v.forEach((l) =>
        checkXKomLink(l).then((v) =>
          v.available || SHOW_ALL ? console.log(v) : ""
        )
      );
    })
    .catch((e) => console.log("Something goes wrong:\n" + e));
});
