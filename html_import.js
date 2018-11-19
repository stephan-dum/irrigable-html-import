const path = require("path");
const Embedded = require("./embedded.js")
const PathNormalize = require("./pathnormalize.js");
const hasProtocol = PathNormalize.hasProtocol;

class HTMLImport {
  constructor(vinyl) {
    this.inputs = [];
    this.dirname = vinyl.dirname;
    this.path = vinyl.path;

    //this.elems = new Map;
    //this.dependencies = vinyl.dependencies;
    //this.references = vinyl.references;
    //this.relative = path.dirname(vinyl.relative).replace(/^[.]$/, "");
    this.input = vinyl.input;
  }
  completeX() {
    if(this.inputs.length) {
      return new Promise((resolve, reject) => {
        this.input.reference(this.path, this.inputs, resolve);
/*
        this.distributer.write({
          config : {
            watch : false,
            base : this.relative,
            last : false,
            inputs : this.inputs,
            complete : resolve,
            pipeline : [{
              construct : PathNormalize
            }],
            outputs : {
              construct : Embedded,
              args : [this.elems, this.dependencies, this.references]
            },
          }
        });*/
      })
    }
  }
  handle(elem, vinyl) {
    let href = elem.attr("href");

    /*if(path.isAbsolute(href)) {
      href = href.slice(1);
    }
    if(!hasProtocol(href)) {
      href = path.join(this.dirname, href);
    }*/

    vinyl.dependencies.push(href);

    //this.elems.set(href, elem);

    return this.input.reference(this.path, {
      watch : false,
      outputs : {
        construct : Embedded,
        args : [elem, vinyl.dependencies]
      },
      glob : href
    });
  }
}

module.exports = function HTMLImportFactory({
  selector = 'link[rel="import"]'
} = {}) {
  return {
    selector,
    construct : HTMLImport,
  }
}
