var fs = require("fs")
var path = require("path")
var globalPath = path.join(__dirname,"../data/userdata/")

var en_de = require("bcryptjs")

var j_token = require("jsonwebtoken")

var randonId = ()=>{
    var nums = [1,2,3,4,5,6,7,8,9,0]
    var alphabets  = 'abcdefghij'
    var alphabets1 = 'klmnopqrst'
    var alphabets2 = 'uvwxyz9999'
    var specials   = 'ABCDEFGHIJ'
    var specials1  = 'KLMNOPQRST'
    var specials2  = 'UVWZYZ1111'
    var tools = [nums,alphabets,specials,alphabets1,alphabets2,nums,specials1,specials2,alphabets1,specials]
    var Id=""
    while(Id.length<20){
        Id+=(tools[parseInt(Math.random()*10)][parseInt(Math.random()*10)])

    }
    return Id
}




var createHash = (pass) =>{
    return en_de.hashSync(pass,8)
}


var decodeHash = (pass,hashed_pass) =>{
    return en_de.compareSync(pass,hashed_pass)
}

var createToken = (data) =>{
   return token =  j_token.sign({exp:Math.floor(Date.now() / 1000)+60*3,data},"secret")
}

var verifyToken = (token,cb) =>{
    try{
        j_token.verify(token,"secret")
        return true
   }catch(e){
        return false
   }
}



var middleWare = (req,res,next)=>{
    try{
        var json_content =  JSON.parse(fs.readFileSync(globalPath+`${req.query.uname}.json`,"utf-8"))
        try{
            // console.log(req.query,json_content)
            let token = json_content.tokens[req.query.tkn] != undefined ? json_content.tokens[req.query.tkn] : new Error("TokenId doesn't exit please login")
            let decs = verifyToken(token)
            if(decs){
                var newToken = createToken({tokenId:req.query.tkn})
                json_content.tokens[req.query.tkn]=newToken
                fs.writeFileSync(globalPath+`${req.query.uname}.json`,JSON.stringify(json_content))
                return next()
            }else{
                delete json_content.tokens[req.query.tkn]
                fs.writeFileSync(globalPath+`${req.query.uname}.json`,JSON.stringify(json_content))
                return res.send({"msg":"session expired, please login."})
            }
        }
        catch(e){
            return res.send({"msg":"session not found"})
        }
    }
    catch(e)
        {
            res.send({"msg":"user not found try registering.."})
        }
}

module.exports = {
    createHash,
    decodeHash,
    randonId,
    createToken,
    verifyToken,
    middleWare
}