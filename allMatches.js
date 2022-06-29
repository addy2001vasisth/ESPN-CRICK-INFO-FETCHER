const req = require("request");
const cheerio = require("cheerio");
const sC = require("./scoreCard.js");
function allMatches(allMatchUrl) {
  req(allMatchUrl, function (err, res, html) {
    if (err) {
      console.log(err);
    } else {
      let $ = cheerio.load(html);
      let allMatchesEleArr = $("a[data-hover = 'Scorecard']");

      for (let i = 0; i < allMatchesEleArr.length; i++) {
        let matchUrl = $(allMatchesEleArr[i]).attr("href");
        matchUrl = "https://www.espncricinfo.com" + matchUrl;
        sC.sc(matchUrl);
        // console.log(matchUrl)
      }
    }
  });
}


module.exports = {
  am: allMatches,
};
