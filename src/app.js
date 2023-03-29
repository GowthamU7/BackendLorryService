var express = require("express")
var app = express()
const PORT = 3000 || process.env.PORT
var routes = require("../src/routers")
var router = express.Router()
var cors = require("cors")
var middleWare = require("../writer/utilities")

app.use(cors())
app.use(express.json({type: ['application/json', 'text/plain']}))
app.use(express.urlencoded({extended:true}))


app.get("/check",routes.check)

router.post("/register",routes.register)
router.post("/login",routes.login)
router.get("/lorries",middleWare.middleWare,routes.getLorries)
router.post("/addlorry",middleWare.middleWare,routes.addLorry)

router.delete("/logout",middleWare.middleWare,routes.logout)
router.delete("/logoutAll",middleWare.middleWare,routes.logoutAll)

router.delete("/deletelorry",middleWare.middleWare,routes.deleteLorry)


app.use(router)

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}..`)
})