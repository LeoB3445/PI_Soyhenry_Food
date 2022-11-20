const https = require('https');

const fetcher = function(url){
    return new Promise((resolve,reject)=>{
        https.get(url,res=>{
            if(res.statusCode !== 200){ //rejects promise if GET was not successful
                reject(`unexpected status code: ${res.statusCode}`)
            }else{
                res.setEncoding('utf8')

                let rawData = '';
                res.on('data', (chunk)=>{rawData += chunk;})
                res.on('end', ()=>{
                    let parsedData= JSON.parse(rawData);
                    resolve(parsedData); 
                })
            }
        })
    })
}

module.exports = fetcher;