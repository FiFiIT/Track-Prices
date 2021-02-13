const request = require("request");
const cheerio = require("cheerio");

const RTXs = [
  "https://www.x-kom.pl/szukaj?q=rtx%203080&f%5Bgroups%5D%5B5%5D=1&sort_by=accuracy_desc&f%5Bcategories%5D%5B345%5D=1", //X-Kom RTX3080
  "https://www.x-kom.pl/szukaj?q=3060%20ti&f%5Bgroups%5D%5B5%5D=1&sort_by=accuracy_desc&f%5Bcategories%5D%5B345%5D=1", //RTX 3060 Ti
];

async function gatherXKomLinks(url) {
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
      const $ = cheerio.load(body, null, false);
      var container = $("#listing-container a").attr(
        "class",
        "sc-1h16fat-0 sc-1yu46qn-9 elgoMT"
      );

      container.each((i, e) => {
        var link = $(e).attr("href");
        var extension = link.split(".").slice(-1);
        if (extension == "html") {
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
      var ava = $(".sc-1jultii-1").first().text();

      resolve({
        name: $(".sc-1bker4h-4").text(),
        price: $(".u7xnnm-4").text(),
        available: $(".sc-1jultii-1").first().text() != "Czasowo niedostępny",
      });
    });
  });
}

RTXs.forEach((rtx) => {
  gatherXKomLinks(rtx)
    .then((v) => {
      v.forEach((l) =>
        checkXKomLink(l).then((v) => (v.available ? console.log(v) : ""))
      );
    })
    .catch((e) => console.log("Something goes wrong:\n" + e));
});
