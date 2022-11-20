const {https} = require('node');

const fetcher = function(url){
    return new Promise((resolve,reject)=>{
        https(url,res=>{
            if(res.statusCode !== 200){ //rejects promise if GET was not successful
                reject(new Error(`unexpected status code: ${res.statusCode}`))
            }else{
                res.setEncoding('utf8')

                let rawData = '';
                res.on('data', (chunk)=>{rawdata += chunk;})
                res.on('end', ()=>{
                    let parsedData= JSON.parse(rawData);
                    resolve(parsedData); 
                })
            }
        })
    })
}