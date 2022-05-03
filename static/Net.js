var waitingForPlayer
var updatePionki

class Net {

    constructor() {
    }

    sendData(toSend) {
        toSend = JSON.stringify(toSend)
        $.ajax({

            url: "/",

            data: { toSend },

            type: "POST",

            success: function (data) {

                switch (data.status) {
                    case 0: //logowanie
                        ui.displayStatement("Logowanie", "RESET - usunięto graczy z serwera")
                        break;

                    case 1: //za dużo graczy
                        ui.displayStatement("Nie udało się połączyć", "Za dużo graczy w sesji")
                        break;

                    case 2: //jest już taki gracz
                        ui.displayStatement("Wpisz inny nick", "Jest już gracz z takim nickiem")
                        break;

                    case 3: //zalogowano, oczekiwanie
                        ui.displayStatement(`Pomyślnie zalogowano ${data.me}, grasz białymi`, "Oczekiwanie na drugiego gracza")
                        ui.me = data.me
                        ui.meNum = data.which
                        game.pionkiGenerate()
                        game.setCamera(data.which)
                        waitingForPlayer = setInterval(net.waiting, 500)
                        break;

                    case 4: //czy przeciwnik zalogował się
                        if (data.users.length == 2) {
                            console.log("STOP")
                            clearInterval(waitingForPlayer)
                            ui.hideLogin()

                            let opponentColor
                            let dispColor

                            if (ui.meNum == 1) {
                                dispColor = "białymi"
                                opponentColor = "czarnymi"
                            } else {
                                dispColor = "czarnymi"
                                opponentColor = "białymi"
                            }

                            let opponent = data.users[0] == ui.me ? data.users[1] : data.users[0]


                            ui.displayStatement(
                                `Grasz ${dispColor}`,
                                `Twój przeciwnik ${opponent} gra ${opponentColor}`
                            )

                            game.isRunning = true

                            updatePionki = setInterval(function () {
                                net.sendData({ action: "UPDATE", pionki: game.pionki })
                            }, 500)

                        }
                        break;

                    case 5: //odświeżanie tablicy
                        if (data.change) {
                            console.log("change: ", data)
                            for (let el of data.toChange) {

                                game.update(el.color, el.x, el.z)
                            }
                        }
                        break;
                }

            },

            error: function (xhr, status, error) {
                console.log("xhr", xhr)
            }

        })

    }

    waiting() {
        net.sendData({ action: "WAITING" })
        //console.log("waiting")
    }
}

