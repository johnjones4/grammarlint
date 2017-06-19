const {JSDOM} = require('jsdom');

exports.fetch = (url,done) => {
  JSDOM.fromURL(url)
    .then((dom) => {
      if (dom.window.document.body) {
        const mainContent = dom.window.document.body.querySelector('[role="main"]') || dom.window.document.body;
        const paraElements = mainContent.querySelectorAll('h1,h2,h3,h4,h5,h6,p,ul,ol,dl');
        const paras = [];
        for(var i = 0; i < paraElements.length; i++) {
          const line = paraElements[i].textContent.replace(/\s\s+/g, ' ').trim();
          paras.push(line);
        }
        const text = paras.join('\n');
        done(null,text);
      } else {
        done(new Error('No document body.'));
      }
    })
    // .catch(done);
}
