const req = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
function scard(url) {
  req(url, function (err, res, html) {
    if (err) {
      console.log(err);
    } else {
      let $ = cheerio.load(html);
      let infoEle = $(".status+.description");
      let info = $(infoEle).text();
      info = info.split(",");
      let venue = info[1];
      let date = info[2];
      let resultEle = $(
        ".match-info.match-info-MATCH.match-info-MATCH-half-width .teams+.status-text"
      );
      let result = $(resultEle).text();

      let inningsArrEle = $(".match-scorecard-page .Collapsible");
      for (let i = 0; i < inningsArrEle.length; i++) {
        
        let oppoIdx = (i == 0 )? 1 : 0;
        let teamEle = $(inningsArrEle[i]).find(".header-title.label");
        let teamName = $(teamEle).text();
        teamName = teamName.split("INNINGS")[0].trim();
        let teamPath = path.join("IPL", teamName);
        if (fs.existsSync(teamPath) == false) {
          fs.mkdirSync(teamPath);
        }
        let oppoteamEle = $(inningsArrEle[oppoIdx]).find(".header-title.label");
        let oppoteamName = $(oppoteamEle).text();
        oppoteamName = oppoteamName.split("INNINGS")[0].trim();

        let batsmanEle = $(inningsArrEle[i]).find(".table.batsman tbody tr");
        for (let j = 0; j < batsmanEle.length; j++) {
          
          let batsRowsEle = $(batsmanEle[j]).find("td");
          if (batsRowsEle.length == 8) {
            let name = $(batsRowsEle[0]).text().trim();
            let runs = $(batsRowsEle[2]).text().trim();
            let balls = $(batsRowsEle[3]).text().trim();
            let fours = $(batsRowsEle[5]).text().trim();
            let sixes = $(batsRowsEle[6]).text().trim();
            let sr = $(batsRowsEle[7]).text().trim();
            let playerPath = path.join(teamPath, name + ".xlsx");
            let data = excelReader(playerPath,teamName);
            
            data.push({
              "NAME": name,
              "TEAM NAME": teamName,
              "OPPONENT": oppoteamName,
              "RUNS": runs,
              "BALLS": balls,
              "FOURS": fours,
              "SIXES": sixes,
              "STRIKE RATE": sr,
              "VENUE": venue,
              "DATE": date,
              "RESULT": result,
            });
            console.log(
              `${name} ${teamName} ${oppoteamName} ${runs} ${balls} ${fours} ${sixes} ${sr} ${venue} ${date} ${result} `
            );
            excelWriter(data, teamName, playerPath);
          }
        }
      }
    }
  });
}
function excelWriter(json_data, sheet_name, filePath) {
  let newWB = xlsx.utils.book_new();
  let newWS = xlsx.utils.json_to_sheet(json_data);
  xlsx.utils.book_append_sheet(newWB, newWS, sheet_name);
  xlsx.writeFile(newWB, filePath);
}

function excelReader(filePath, sheet_name) {
  if(fs.existsSync(filePath) == false){
    return [];
  }
  let wb = xlsx.readFile(filePath);
  let excelData = wb.Sheets[sheet_name];
  let ans = xlsx.utils.sheet_to_json(excelData);
  return ans;
}
module.exports = {
  sc: scard,
};
