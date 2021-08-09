let requ=require("request");
let cherrio=require("cheerio");
let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";

console.log("before");

requ(url,cb);

console.log("after");

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
       let $=cherrio.load(html);
       // agar unique element hai tu unique element nahi tu array 
       let ele=$(".section-header.border-bottom.border-0.p-0 h5.header-title.label");
       console.log(ele.text());
 }