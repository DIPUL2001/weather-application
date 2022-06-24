const http=require("http");
const fs=require('fs');
var requests=require("requests");


const homeFile=fs.readFileSync("home.html","utf-8"); 

const replaceVal=(tempval,orgval)=>{
    let temperature=tempval.replace("{%tempval%}",(orgval.main.temp));
    temperature=temperature.replace("{%tempmin%}",orgval.main.temp_min);
    temperature=temperature.replace("{%tempmax%}",orgval.main.temp_max);
    temperature=temperature.replace("{%location%}",orgval.name);
    temperature=temperature.replace("{%country%}",orgval.sys.country);
    temperature=temperature.replace("{%tempstatus%}",orgval.weather[0].main);
    return temperature;
};
const server=http.createServer((req,res)=>{
    if(req.url=="/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=Delhi&units=metric&appid=ffbfa6a733b543a1c56ecae8b99d185d')
  .on("data",(chunk)=> {
    const objdata=JSON.parse(chunk); 
    const arrdata=[objdata];
  //console.log(arrdata[0].main.temp);
  const realTimedata=arrdata.map(val =>replaceVal(homeFile,val)).join(""); 
 res.write(realTimedata);
// console.log(realTimedata);
})
.on('end',(err) =>{
  if (err) return console.log('connection closed due to errors', err);
  res.end(); 
 
});
    }
    else{
        res.end("Files Not Found");
    } 
}); 
server.listen(9000,"127.0.0.1");