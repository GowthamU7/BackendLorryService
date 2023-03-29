var fs = require("fs")
var path = require("path")
var uts = require("./utilities")



var globalPath = path.join(__dirname,"../data")

var createUser = (data,cb)=>{

    fs.open(globalPath+`/userdata/${data.email.split("@")[0]+".json"}`,"wx+",(err,fd)=>{
        
        if(err) return cb({"msg":"Account already exists."})

        fs.open(globalPath+`/OwnersData/${data.email.split("@")[0]+"_lorryDetails.json"}`,"wx+",(err,fd)=>{
        
            if(err) return cb({"msg":"Account already exists."})
            let file_content = {
                lorries:{}
            }
            fs.write(fd,JSON.stringify(file_content),(err,size_written,str)=>{
                if(err){
                    return cb({"msg":"Error while creating lorry account"})
                }
            })
    
        })    

        var file_content = { 
            email:data.email,
            password:uts.createHash(data.password),
            type:data.type,
            tokens:{}
        }

        fs.write(fd,JSON.stringify(file_content),(err,size_written,str)=>{
            if(err){
                return cb({"msg":"Error while creating user, try again"})
            }return cb({"msg":"User created!"})
        })

    })
}

var loginUser = (data,cb)=>{
    fs.open(globalPath+`/userdata/${data.email.split("@")[0]+".json"}`,(err,fd)=>{
        
        if(err) return cb({"msg":"User doesn't exist, try registering with us"})
        
        fs.readFile(fd,"utf-8",(err,dt)=>{
            
            var json_content = JSON.parse(dt)
            
            if(uts.decodeHash(data.password,json_content["password"])){
               
                var id = uts.randonId()

                json_content["tokens"][id]=uts.createToken({tokenId:id})
                
                fs.writeFile(globalPath+`/userdata/${data.email.split("@")[0]+".json"}`,JSON.stringify(json_content),(err)=>{
                    if(err){
                        return cb({"msg":"Unable to create token"})
                    }
                    return cb({tokenId:id,email:json_content["email"]})
                })
            }
            else{
                cb({"msg":"Password doesnt match"})
            }
        })
    })
}

// createUser({email:"abc@gmail.com",password:"password",type:"owner"},(msg)=>{
//     if(typeof msg == "object"){
//         console.log("User already exists")
//     }
// })

// loginUser({email:"abc@gmail.com",password:"password",type:"owner"},(msg)=>{
//     console.log(msg)
// })


var checkExpiry = (data,cb)=>{
    fs.readFile(globalPath+`/userdata/${data.uname}.json`,"utf-8",(err,dt)=>{
        var json_content = JSON.parse(dt)
        if(json_content["tokens"][data.tokenId]){
            if(uts.verifyToken(json_content["tokens"][data.tokenId])){
                return cb({"access":true})
            }
        }return cb({"access":false})
    })
}

var getAll = ()=>{
    const dirs = fs.readdirSync(globalPath+"/userdata/")
    let data = []
    for(var i in dirs){
        data.push(JSON.parse(fs.readFileSync(globalPath+"/userdata/"+dirs[i],"utf-8")))
    }
    return data
}


var getLorries = (data,cb) =>{
    fs.readFile(globalPath+`/OwnersData/${data.uname}_lorryDetails.json`,"utf-8",(err,data)=>{
        if(err){
            return cb({"msg":"cannot get lorry details"})
        }
        let json_content = JSON.parse(data)
        return cb(json_content)
    })
}


var createLorry = (data,cb) =>{
    fs.readFile(globalPath+`/OwnersData/${data.uname}_lorryDetails.json`,
    "utf-8",(err,fileContent)=>{
        
        if(err) return cb({"msg":"Could not Add lorry details"})
        
        let json_content = JSON.parse(fileContent)
        
        let lorryDetails = 
        {
            maxLoad:data.maxLoad,
            status:"free",
            currentLoad:0,
            permit:data.permit,
            lId:data.lId
        }
        
        json_content["lorries"][data.lId]=lorryDetails
        
        fs.writeFileSync(
            globalPath+`/OwnersData/${data.uname}_lorryDetails.json`,
            JSON.stringify(json_content)
        )
        
        cb({"msg":"lorry added successfully"})
    })
}

// createLorry({uname:"gowthammdb7",lId:"AP075868",maxLoad:100,permit:"All India Permit"},(d)=>{
//     console.log(d)
// })



function logout(data,cb){
    fs.open(globalPath+`/userdata/${data.uname}.json`,(err,fd)=>{
        if(err) return cb({"msg":"user doesnot exist"})
        fs.readFile(fd,"utf-8",(err,stdata)=>{
            if(err) return cb({"msg":"please try later."})
            let json_content = JSON.parse(stdata)
            if(json_content["tokens"][data.tkn] != undefined){
                delete json_content["tokens"][data.tkn]
                fs.writeFile(globalPath+`/userdata/${data.uname}.json`,JSON.stringify(json_content),(err)=>{
                    if(err) return cb({"msg":"error while logging you out, please try later"})
                })
                return cb({"msg":"Loggout successfuly"})
            }
            return cb({"msg":"session doesn't exist"})
        })
    })
}


function logoutAll(data,cb){
    fs.open(globalPath+`/userdata/${data.uname}.json`,(err,fd)=>{
        if(err) return cb({"msg":"user doesnot exist"})
        fs.readFile(fd,"utf-8",(err,stdata)=>{
            if(err) return cb({"msg":"please try later."})
            let json_content = JSON.parse(stdata)
            json_content["tokens"]={}
                fs.writeFile(globalPath+`/userdata/${data.uname}.json`,JSON.stringify(json_content),(err)=>{
                    if(err) return cb({"msg":"error while logging you out, please try later"})
                })
                return cb({"msg":"Loggout successfuly"})
        })
    })
}

function deleteLorry(data,cb){
    fs.open(globalPath+`/OwnersData/${data.uname}_lorryDetails.json`,(err,fd)=>{
        if(err){
            return cb({"msg":"Error while deleting lorry"})
        }
        fs.readFile(fd,"utf-8",(err,fileContent)=>{
            if(err){
                return cb({"msg":"Error while deleting lorry"})
            }
            let json_content = JSON.parse(fileContent)
            delete json_content["lorries"][data.lId]
            fs.writeFile(globalPath+`/OwnersData/${data.uname}_lorryDetails.json`,JSON.stringify(json_content),(err)=>{
                if(err) return cb({"msg":"Error while deleting lorry"})
                return cb({"msg":"Deleted successfully"})
            })
        })
    })
}


module.exports = {
    createUser,
    loginUser,
    checkExpiry,
    getAll,
    getLorries,
    createLorry,
    logout,
    logoutAll,
    deleteLorry
}