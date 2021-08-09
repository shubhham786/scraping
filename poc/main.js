let request=require("request");

let ch=require("cheerio");
let path=require("path");

let fs=require("fs");
let xlsx=require("xlsx");

let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/full-scorecard";

request(url,cb);

//console.log("after");

function cb(error,response,html)
{
//     console.error('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     console.log('body:', body); // Print the HTML for the Google homepage.

      if(error)
      {
          console.log(error);

      }
      else if(response && response.statusCode==404)
          console.log("page not found");
      else{
        //console.log(html);
        extractData(html);
      }    
 }

 function extractData(html)
 {
       //cheerio.load parse the html
       // and returns a function that is used to select elements from that html page using css selector
       let $=ch.load(html);
       // agar unique element hai tu unique element nahi tu array 
       let ele=$(".Collapsible");
      // console.log(ele.length);
      // console.log(ele.text());

         for(let i=0;i<ele.length;i++)
         {
            let InningElement = $(ele[i]);

            let teamname=InningElement.find("h5").text();
            
            let stringArr = teamname.split("INNINGS");
            teamname = stringArr[0].trim();
            console.log(teamname);

            let playerRows = InningElement.find(".table.batsman tbody tr");
            for (let j = 0; j < playerRows.length; j++) {
                let col = $(playerRows[j]).find("td");
                let isallowed=$(col[0]).hasClass("batsman-cell")
                if (isallowed) {
                   
                    // console.log($(playerRows[j]).text());
                    // console.log();
                    let playername=$(col[0]).text().trim();
                    let runs=$(col[2]).text().trim();
                    let balls=$(col[3]).text().trim();
                    let fours=$(col[5]).text().trim();
                    let sixes=$(col[6]).text().trim();
                    let sr=$(col[7]).text().trim();

                    //console.log(`${playername} played for ${teamname} and scored ${runs} runs in ${balls} balls with SR : ${sr}`)

                      // data -> required folder ,required file data add 
                processPlayer(playername, runs, balls, sixes, fours, sr, teamname);
                }
            }
            console.log("``````````````````````````````````````````");


         }
 }

 function processPlayer(playerName, runs, balls, sixes, fours, sr, teamName) {
    // data -> 
    let playerObject = {
        playerName: playerName,
        runs: runs,
        balls: balls, sixes,
        fours: fours,
        sr: sr, teamName
    }
      // check -> task 
    // check -> folder exist ? (check file ? data append: file create data add):create folder -> create file data enter 
    let dirExist = checkExistence(teamName);
     if(dirExist)
     {

     }
     else
     {
         createfolder(teamName);
     }

     //let playerfilename=path.join(__dirname,teamName,playerName+".json");
     let playerfilename=path.join(__dirname,teamName,playerName+".xlsx");
     
     let fileExist=checkExistence(playerfilename);
     let playerEntries = [];
     if(fileExist)
     {
         // append
        // nodejs.dev
        // file system
        // let binarydata = fs.readFileSync(playerFilename);
        let jsondata=excelReader(playerfilename,playerName);
        
        // console.log(binary)
        // parse -> JSON
         //playerEntries = JSON.parse(binarydata);
         playerEntries=jsondata;
        
        playerEntries.push(playerObject);
        //override
         //fs.writeFileSync(playerfilename, JSON.stringify(playerEntries));
         excelWriter(playerfilename, playerEntries, playerName);
     }
     else{
         //create file
         // file create data add
        playerEntries.push(playerObject);
        // file exist -> content -> override -> 
         //fs.writeFileSync(playerfilename, JSON.stringify(playerEntries));
           
         excelWriter(playerfilename, playerEntries, playerName);

     }
}


function checkExistence(teamName){

    return fs.existsSync(teamName);
}

function createfolder(teamName)
{
    fs.mkdirSync(teamName);
}

function excelReader(filePath, name) {
    if (!fs.existsSync(filePath)) {
        return null;
    } else {
        // workbook => excel
        let wt = xlsx.readFile(filePath);
        // csk -> msd
        // get data from workbook
        let excelData = wt.Sheets[name];
        // convert excel format to json => array of obj
        let ans = xlsx.utils.sheet_to_json(excelData);
        // console.log(ans);
        return ans;
    }
}

function excelWriter(filePath, json, name) {
    // console.log(xlsx.readFile(filePath));
    let newWB = xlsx.utils.book_new();
    // console.log(json);
    let newWS = xlsx.utils.json_to_sheet(json);
    // msd.xlsx-> msd
    xlsx.utils.book_append_sheet(newWB, newWS, name);  //workbook name as param
    //   file => create , replace
    xlsx.writeFile(newWB, filePath);
}