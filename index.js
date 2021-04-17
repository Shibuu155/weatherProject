const http = require('http');
const fs = require('fs');
let requests = require('requests');

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal , orgVal) =>{
    let tempertaure = tempVal.replace("{%tempval%}",(orgVal.main.temp-273.15).toFixed(2));
    tempertaure = tempertaure.replace("{%tempmin%}",(orgVal.main.temp_min-273.15).toFixed(2));
    tempertaure = tempertaure.replace("{%tempmax%}",(orgVal.main.temp_max-273.15).toFixed(2));
    tempertaure = tempertaure.replace("{%location%}",orgVal.name);
    tempertaure = tempertaure.replace("{%country%}",orgVal.sys.country);
    tempertaure = tempertaure.replace("{%tempstatus%}",orgVal.weather[0].main);
    return tempertaure;
}

const server  = http.createServer((req,res)=>{
    if(req.url == "/"){
        requests(
            "http://api.openweathermap.org/data/2.5/weather?q=Ludhiana&appid=4952e65dca5ce4845ce0d0945bc1cbb4"
        )
        .on("data",(chunk) =>{
            const objData = JSON.parse(chunk);
            const arrData = [objData]
            const realTymData = arrData.map((val)=>{
                return replaceVal(homeFile, val);
            }).join("");
            res.write(realTymData);
        })
        .on("end",(err) =>{
            if(err) return console.log("Connection closed due to errors",err);
            res.end();
        });
    }else{
        res.end("File not Found")
    }
});

server.listen(8000,"127.0.0.1",()=>{
    console.log('listening to the port number');
});