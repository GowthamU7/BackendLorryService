var writer = require("../writer/writer")



var home = (req,res)=>{
    res.send("Hello....")
}

var login = (req,res)=>{
    writer.loginUser(req.body,(dec)=>{
        res.send(dec)
    })
}

var getAll = (req,res)=>{
    res.json(writer.getAll())
}

var check = (req,res)=>{
    writer.checkExpiry({uname:req.query.id,tokenId:req.query.token_id},(dec)=>{
        res.send(dec)
    })
}

var register = (req,res)=>{
    writer.createUser(req.body,(dec)=>{
        res.send(dec)
    })
}


var getLorries = (req,res)=>{
    writer.getLorries({uname:req.query.uname},(data)=>{
        return res.json(data)
    })
}

var addLorry = (req,res)=>{
    writer.createLorry({uname:req.query.uname,lId:req.body.lId,maxLoad:req.body.maxLoad,permit:req.body.permit},(d)=>{
        return res.json(d)
    })
}


var logout = (req,res)=>{
    writer.logout({uname:req.query.uname,tkn:req.query.tkn},(d)=>{
        return res.json(d)
    })
}

var logoutAll = (req,res)=>{
    writer.logoutAll({uname:req.query.uname,tkn:req.query.tkn},(d)=>{
        return res.json(d)
    })
}

var deleteLorry = (req,res)=>{
    writer.deleteLorry(
        {
            uname:req.query.uname,
            lId:req.query.lId
        },(d)=>{
            res.json(d)
        })
}

module.exports ={
    home,
    login,
    register,
    check,
    getAll,
    getLorries,
    addLorry,
    logout,
    logoutAll,
    deleteLorry
}