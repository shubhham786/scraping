// iss code me ek issuse hai ki phle file ko read karega baad me niche wale line chalenge
// readfilesync -->main thread pe kaam kar raha hai
let fs=require("fs");

//sync version
// console.log("before");

// let content=fs.readFileSync("f1.txt");
// console.log("content "+content); // console.log("content",content)  --> "," se type conversion nahi hota hai

// console.log("after");


//Assync
console.log("before");
fs.readFile("F1.txt",function(err,data){
    if(err)
     console.log(err);
   else
    console.log("content "+data);  
});
console.log("after");

while(true);