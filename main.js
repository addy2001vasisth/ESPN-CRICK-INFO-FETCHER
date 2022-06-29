const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423";
// https://www.espncricinfo.com/series/ipl-2021-1249214
const req = require("request");
const cheerio = require("cheerio");
const aM = require("./allMatches.js");
const { default: DomHandler } = require("domhandler");
const fs = require("fs");
const path = require("path");

// if (fs.existsSync("IPL") == false) {
//   fs.mkdirSync("IPL");
// }

// req(url, function (err, res, html) {
//   if (err) {
//     console.log(err);
//   } else {
//     handle(html);
//   }
// });

// function handle(html) {
//   let $ = cheerio.load(html);
//   let allMatchUrl = $(".widget-items.cta-link a").attr("href");
//   allMatchUrl = "https://www.espncricinfo.com" + allMatchUrl;
//   aM.am(allMatchUrl);
// }


  
req(url,cb)
function cb(err,request,html){
  if(err){
    console.log(err);
  }
  else{
    console.log(html);
  }
}