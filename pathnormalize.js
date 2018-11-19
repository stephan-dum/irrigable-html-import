const { Transform } = require("stream");
const cheerio = require("cheerio");
const toURLPath = require("@aboutweb/irrigable-urlpath");
const path = require("path");

const urlAttributes = [
  {
    attribute : "href",
    handler : toURLPath
  }, {
    attribute : "srcsset",
    handler(value, base) {
      return value.replace(/[\t\r\n]/g, "").split(/[,]/g).map((rule) => {
        let [src, ratio] = rule.split(" ");

        return toURLPath(src, base)+" "+ratio;
      }).join(",");
    }
  }, {
    selector : 'input[type="image"], [src]',
    attribute : 'src',
    handler : toURLPath
  }
];

class PathNormalize extends Transform {
  constructor() {
    super({
      objectMode : true
    });
  }
  _transform(file, encoding, callback) {
    let doc = cheerio(file.contents.toString());
    let base = path.dirname(file.relative);
    //let cwd = file.cwd;


    urlAttributes.forEach(({handler, attribute, selector}) => {
      doc.find(`${selector || "["+attribute+"]"}`).each((i, elem) => {
        elem.attribs[attribute] = handler(elem.attribs[attribute], base);
      });
    });

    let html = doc.toString();

    file.contents = new Buffer(html);

    callback(null, file);
  }
  static hasProtocol(url) {
    return hasProtocol.test(url);
  }
}

module.exports = PathNormalize;
