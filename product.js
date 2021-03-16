class Product {
  constructor(name, price, available, link) {
    this.types = [
      { type: "RTX 3060ti", name: "3080 TI" },
      { type: "RTX 3080", name: "3080" },
      { type: "RTX 3090", name: "3090" },
      { type: "6900xt", name: "6900 XT" },
      { type: "6800xt", name: "6800 XT" },
      { type: "6800", name: "6800" },
    ];

    this.name = name;
    this.price = price;
    this.available = available;
    this.type = this.mapNameToType(name);
    this.url = link;
  }

  mapNameToType = (name) => {
    var type = this.types.filter((t) => name.includes(t.name))[0];
    return type?.type ?? "OTHER";
  };

  text = () => {
    return {
      type: this.type,
      name: this.name,
      price: this.price,
      available: this.available,
      url: this.url,
    };
  };
}

exports.Product = Product;
