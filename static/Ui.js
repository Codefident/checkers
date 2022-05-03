class Ui {
    constructor() {
        this.statementConsole()
        this.login()
        this.me = null
        this.meNum = null
    }

    login() {

        //kontener
        let div = $("<div>")
            .attr("id", "login")
        $("body").append(div)

        //header
        div = $("<div>")
            .attr("id", "login_header")
            .text("Logowanie")
        $("#login").append(div)

        //nickname input
        let input = $("<input>")
            .attr("type", "text")
            .attr("id", "login_nick")
            .attr("placeholder", "Wpisz swój nick")
        $("#login").append(input)
        $("#login").append($("<br/>"))

        //loguj button
        let button = $("<button>")
            .attr("id", "login_loguj")
            .text("Loguj")
            .on("click", function () {
                let nickname = $("#login_nick").val()
                if (nickname.length == 0)
                    ui.displayStatement("Logowanie", "Nie wpisałeś nicku")
                else
                    net.sendData({
                        action: "ADD_USER",
                        user: nickname
                    })
            })
        $("#login").append(button)
        $("#login").append($("<br/>"))

        //reset button
        button = $("<button>")
            .attr("id", "login_reset")
            .text("Reset")
            .on("click", function () {
                net.sendData({ action: "RESET_GAME" })
            })
        $("#login").append(button)
    }

    statementConsole() {

        let div = $("<div>")
            .attr("id", "console")
        $("body").append(div)

        let t = $("<h1>")
            .attr("id", "console_action")
            .text("Logowanie")
        $("#console").append(t)

        t = $("<p>")
            .attr("id", "console_desc")
            .text("...")
        $("#console").append(t)
    }

    displayStatement(up_statement, statement) {
        $("#console_action").text(up_statement)
        $("#console_desc").text(statement)
    }

    hideLogin() {
        $("#login").css("display", "none")
    }
}