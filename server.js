var http = require('http')
var fs = require('fs')
var qs = require('querystring')
var users = []

const startTab = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0]
]

var Tab = JSON.parse(JSON.stringify(startTab))
var oTab = JSON.parse(JSON.stringify(startTab))

var server = http.createServer(function (req, res) {

    switch (req.method) {

        case "GET":

            if (req.url == "/") {
                fs.readFile("static/index.html", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                    res.write(data);
                    res.end();
                })
            }

            else {

                let url = req.url.replace(/%20/g, " ")

                url = url.replace(/%C4%84/g, "Ą")
                url = url.replace(/%C4%86/g, "Ć")
                url = url.replace(/%C4%98/g, "Ę")
                url = url.replace(/%C5%81/g, "Ł")
                url = url.replace(/%C5%83/g, "Ń")
                url = url.replace(/%C3%93/g, "Ó")
                url = url.replace(/%C5%9A/g, "Ś")
                url = url.replace(/%C5%B9/g, "Ź")
                url = url.replace(/%C5%BB/g, "Ż")
                url = url.replace(/%C4%85/g, "ą")
                url = url.replace(/%C4%87/g, "ć")
                url = url.replace(/%C4%99/g, "ę")
                url = url.replace(/%C5%82/g, "ł")
                url = url.replace(/%C5%84/g, "ń")
                url = url.replace(/%C3%B3/g, "ó")
                url = url.replace(/%C5%9B/g, "ś")
                url = url.replace(/%C5%BA/g, "ź")
                url = url.replace(/%C5%BC/g, "ż")

                fs.readFile(`static${url}`, function (error, data) {

                    if (error) {
                        return console.log(error)
                    }

                    else if (url.endsWith(".js")) {
                        res.writeHead(200, {
                            'Content-Type': `application/javascript;charset=utf-8`
                        })
                    }

                    else if (url.endsWith(".css")) {
                        res.writeHead(200, {
                            'Content-Type': `text/css`
                        })
                    }

                    else if (url.endsWith(".ico")) {
                        res.writeHead(200, {
                            'Content-Type': `image/x-icon`
                        })
                    }

                    else if (url.endsWith(".png")) {
                        res.writeHead(200, {
                            'Content-Type': `image/png`
                        })
                    }

                    else if (url.endsWith(".jpg") || url.endsWith(".jpeg")) {
                        res.writeHead(200, {
                            'Content-Type': `image/jpeg`
                        })
                    }

                    else if (url.endsWith(".mp3")) {
                        res.writeHead(200, {
                            'Content-Type': 'audio/mpeg'
                        })
                    }

                    res.write(data)
                    res.end()

                })
            }
            break

        case "POST":

            if (req.url == "/") {
                let dataFromAjax = ""
                let dataObj

                req.on("data", function (data) {
                    dataFromAjax += data
                })

                req.on("end", function (data) {
                    dataObj = qs.parse(dataFromAjax) //dane -> obiekt
                    dataObj = JSON.parse(dataObj.toSend)

                    switch (dataObj.action) {
                        case "ADD_USER":
                            addUser(dataObj, res)
                            break;

                        case "RESET_GAME":
                            reset(res)
                            break;

                        case "WAITING":
                            waiting(res)
                            break;
                        case "UPDATE":
                            update(dataObj, res)
                            break;
                        default:
                            console.log("cos innego")
                            break;
                    }
                })

            }
            else { }
            break;
    }


})

server.listen(3000, function () {
    console.log("Checkers, Piotr Klęp 3ID2, port 3000")
})

function addUser(dataObj, res) {

    if (users.length >= 2) {
        let context = { status: 1 } //za dużo graczy
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify(context))
    }

    else if (!users.includes(dataObj.user)) {
        users.push(dataObj.user)
        let context = { status: 3, me: dataObj.user, which: users.length } //dodano gracza
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify(context))
    }

    else {
        let context = { status: 2 } //jest już taki gracz
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify(context))
    }
}

function reset(res) {

    users = []
    Tab = JSON.parse(JSON.stringify(startTab))
    oTab = JSON.parse(JSON.stringify(startTab))
    console.log(users)
    let context = { status: 0 } //jest już taki gracz
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(context))

}

function waiting(res) {
    let context = {
        status: 4,
        users: users
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(context))
}

function update(data, res) {

    let context = { status: 5, change: false, toChange: [] }

    for (let z = 0; z < 8; z++)
        for (let x = 0; x < 8; x++) {

            if (Tab[z][x] != data.pionki[z][x] && oTab[z][x] != data.pionki[z][x]) {   //nasz ruch
                Tab[z][x] = data.pionki[z][x]
                console.log("nowa wartosc w Tab[", z, "][,", x, ",]: = ", Tab[z][x])
            }

            else if (Tab[z][x] != data.pionki[z][x] && oTab[z][x] == data.pionki[z][x]) { //ruch przeciwnika
                oTab[z][x] = Tab[z][x]
                console.log("update u klienta, update starej oTab[", z, "][,", x, ",]: = ", oTab[z][x])
                context.toChange.push({ color: Tab[z][x], x: x, z: z })
                context.change = true
            }
        }

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(context))
}