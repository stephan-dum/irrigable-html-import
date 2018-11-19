const cheerio = require("cheerio");
const { Writable } = require("stream");

class Embedded extends Writable {
  constructor(elem, dependencies) {
    super({ objectMode : true });

    this.dependencies = dependencies;
    this.elem = elem;
  }
  _write(file, encoding, callback) {
    this.dependencies.push(...file.dependencies);

    let doc = cheerio(file.contents.toString());
    //let elem = this.elems.get(file.history[0]);

    doc.insertBefore(this.elem);
    this.elem.remove();

    callback();
  }
}

module.exports = Embedded;
