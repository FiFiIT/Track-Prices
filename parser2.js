const request = require("request");
var xcom = require("./XKom");
var neo = require("./NEONET");

const args = process.argv.slice(2);
const SHOW_ALL = args[0] == 1;

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

const SmallProducts = [
  new xcom.XKomShop(
    "6800/6800xt",
    "https://www.x-kom.pl/szukaj?q=6800&f%5Bgroups%5D%5B5%5D=1&sort_by=accuracy_desc&f%5Bcategories%5D%5B345%5D=1" // 3070
  ),
  new xcom.XKomShop(
    "6900",

    "https://www.x-kom.pl/szukaj?q=6900&f%5Bgroups%5D%5B5%5D=1&sort_by=accuracy_desc&f%5Bcategories%5D%5B345%5D=1" // 3070,
  ),
];

const AllProducts = [
  new xcom.XKomShop(
    "RTX 3080",
    "https://www.x-kom.pl/szukaj?q=rtx%203080&f%5Bgroups%5D%5B5%5D=1&sort_by=accuracy_desc&f%5Bcategories%5D%5B345%5D=1"
  ), //X-Kom RTX3080
  new xcom.XKomShop(
    "RTX 3060 ti",
    "https://www.x-kom.pl/szukaj?q=3060%20ti&f%5Bgroups%5D%5B5%5D=1&sort_by=accuracy_desc&f%5Bcategories%5D%5B345%5D=1"
  ),
  new xcom.XKomShop(
    "RTX 3070",
    "https://www.x-kom.pl/szukaj?q=3070&f%5Bgroups%5D%5B5%5D=1&sort_by=accuracy_desc&f%5Bcategories%5D%5B346%5D=1" // 3070
  ),
  new xcom.XKomShop(
    "6700xt",
    "https://www.x-kom.pl/szukaj?q=6700&f%5Bgroups%5D%5B5%5D=1&sort_by=accuracy_desc&f%5Bcategories%5D%5B345%5D=1" // 3070
  ),
  new xcom.XKomShop(
    "6800",
    "https://www.x-kom.pl/szukaj?q=6800&f%5Bgroups%5D%5B5%5D=1&sort_by=accuracy_desc&f%5Bcategories%5D%5B345%5D=1" // 3070
  ),
  new xcom.XKomShop(
    "6900",
    "https://www.x-kom.pl/szukaj?q=6900&f%5Bgroups%5D%5B5%5D=1&sort_by=accuracy_desc&f%5Bcategories%5D%5B345%5D=1" // 3070,
  ),
  // new xcom.XKomShop(
  //   "Playstation 5",
  //   "https://www.x-kom.pl/g-7/c/2572-konsole-playstation.html", //konsole playstation
  //   "Sony PlayStation 4"
  // ),
];

const ProductsRTX = [
  new xcom.XKomShop(
    "RTX 3080",
    "https://www.x-kom.pl/szukaj?q=rtx%203080&f%5Bgroups%5D%5B5%5D=1&sort_by=accuracy_desc&f%5Bcategories%5D%5B345%5D=1"
  ), //X-Kom RTX3080
  new xcom.XKomShop(
    "RTX 3060 ti",
    "https://www.x-kom.pl/szukaj?q=3060%20ti&f%5Bgroups%5D%5B5%5D=1&sort_by=accuracy_desc&f%5Bcategories%5D%5B345%5D=1"
  ),
  new xcom.XKomShop(
    "RTX 3070",
    "https://www.x-kom.pl/szukaj?q=3070&f%5Bgroups%5D%5B5%5D=1&sort_by=accuracy_desc&f%5Bcategories%5D%5B346%5D=1" // 3070
  ),
  new neo.NEONET(
    "Karty Graficzne",
    "https://www.neonet.pl/podzespoly-komputerowe/karty-graficzne.html?order=final_price"
  ),
];

const NEO_RTX = [
  new neo.NEONET(
    "Playstation 5",
    "https://www.neonet.pl/konsole-i-gry/playstation-5.html?order=final_price",
    "Sony PlayStation 4",
    () => mapNameToType()
  ),
];

var timer = setInterval(() => {
  AllProducts.forEach((p) => p.findProducts());
}, 60000);
