class Game {
    constructor() {

        this.isRunning = false
        this.kliknietyPionek = null
        this.moveFrom = {}
        this.moveTo = {}

        //1 - białe, 2 - czarne
        this.szachownica = [
            [1, 2, 1, 2, 1, 2, 1, 2],
            [2, 1, 2, 1, 2, 1, 2, 1],
            [1, 2, 1, 2, 1, 2, 1, 2],
            [2, 1, 2, 1, 2, 1, 2, 1],
            [1, 2, 1, 2, 1, 2, 1, 2],
            [2, 1, 2, 1, 2, 1, 2, 1],
            [1, 2, 1, 2, 1, 2, 1, 2],
            [2, 1, 2, 1, 2, 1, 2, 1]
        ]

        //1 - białe, 2 - czarne, 0 - puste pole
        this.pionki = [
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0]
        ]

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x000000);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        $("#root").append(this.renderer.domElement);
        this.camera.position.set(800, 500, 0)
        this.camera.lookAt(this.scene.position)
        this.render() // wywołanie metody render
        this.updateSize()
        this.szachownicaGenerate()

        $(document).on("mousedown", function (e) {

            var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
            var mouseVector = new THREE.Vector2()

            mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
            mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;

            raycaster.setFromCamera(mouseVector, game.camera);

            var intersects = raycaster.intersectObjects(game.scene.children);

            if (intersects.length > 0 && game.isRunning) {

                //pionki
                if (intersects[0].object.player == ui.meNum && intersects[0].object.geometry.type == "CylinderGeometry") {

                    if (game.kliknietyPionek)
                        game.kliknietyPionek.material = new THREE.MeshBasicMaterial({
                            side: THREE.DoubleSide,
                            map: game.kliknietyPionek.color == "white" ? new THREE.TextureLoader().load("textures/biale_pionek.png") : new THREE.TextureLoader().load("textures/czarne_pionek.png"),
                            transparent: false
                        })

                    intersects[0].object.material = new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        map: new THREE.TextureLoader().load("textures/zaznaczony_pionek.png"),
                        transparent: false
                    })
                    game.kliknietyPionek = intersects[0].object
                }

                //pola
                else if (intersects[0].object.geometry.type == "BoxGeometry" && intersects[0].object.color == "black") {

                    if (game.kliknietyPionek && game.pionki[intersects[0].object.posz][intersects[0].object.posx] == 0) {

                        game.pionki[game.kliknietyPionek.posz][game.kliknietyPionek.posx] = 0 //skąd - zmiana w tablicy na 0
                        game.kliknietyPionek.position.x = intersects[0].object.position.x //zmiana polozenia na planszy
                        game.kliknietyPionek.position.z = intersects[0].object.position.z
                        game.kliknietyPionek.posx = intersects[0].object.posx   //zmiana polozenia wg tablicy
                        game.kliknietyPionek.posz = intersects[0].object.posz
                        game.kliknietyPionek.material = new THREE.MeshBasicMaterial({
                            side: THREE.DoubleSide,
                            map: game.kliknietyPionek.color == "white" ? new THREE.TextureLoader().load("textures/biale_pionek.png") : new THREE.TextureLoader().load("textures/czarne_pionek.png"),
                            transparent: false
                        })
                        game.pionki[game.kliknietyPionek.posz][game.kliknietyPionek.posx] = game.kliknietyPionek.color == "white" ? 1 : 2 //dokąd
                        game.kliknietyPionek = null
                    }
                }
            }
        })
    }

    szachownicaGenerate() {

        //plansza
        for (let keyZ in this.szachownica)
            for (let keyX in this.szachownica[keyZ]) {
                //800x800 - plansza

                let x = -350 + keyX * 100
                let z = -350 + keyZ * 100

                let geometry = new THREE.BoxGeometry(100, 10, 100)
                let material = new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide,
                    map: this.szachownica[keyZ][keyX] == 1 ? new THREE.TextureLoader().load("textures/biale_pole.png") : new THREE.TextureLoader().load("textures/czarne_pole.png"),
                    transparent: false
                })

                let cube = new Pole(geometry, material, this.szachownica[keyZ][keyX], keyX, keyZ)
                cube.position.set(x, 0, z)
                this.scene.add(cube)

            }
    }

    pionkiGenerate() {
        for (let keyZ in this.pionki)
            for (let keyX in this.pionki[keyZ]) {

                let x = -350 + keyX * 100
                let z = -350 + keyZ * 100

                if (this.pionki[keyZ][keyX] != 0) {

                    let geometry = new THREE.CylinderGeometry(50, 50, 30, 50)
                    let material = new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        map: this.pionki[keyZ][keyX] == 1 ? new THREE.TextureLoader().load("textures/biale_pionek.png") : new THREE.TextureLoader().load("textures/czarne_pionek.png"),
                        transparent: false
                    })

                    if (ui.meNum == this.pionki[keyZ][keyX])
                        var cube = new Pionek(geometry, material, this.pionki[keyZ][keyX], ui.meNum, keyX, keyZ)
                    else
                        var cube = new Pionek(geometry, material, this.pionki[keyZ][keyX], "przeciwnik", keyX, keyZ)

                    cube.position.set(x, 20, z)
                    this.scene.add(cube)

                }
            }
    }

    render() {
        requestAnimationFrame(this.render.bind(this)); // funkcja bind(this) przekazuje obiekt this do metody render
        this.renderer.render(this.scene, this.camera);
    }

    updateSize() {
        $(window).on("resize", function () {
            game.camera.aspect = window.innerWidth / window.innerHeight;
            game.camera.updateProjectionMatrix();
            game.renderer.setSize(window.innerWidth, window.innerHeight);
        })
    }

    setCamera(which) {
        if (which == 1)
            this.camera.position.set(0, 500, -800)
        else
            this.camera.position.set(0, 500, 800)
        this.camera.lookAt(this.scene.position)
    }

    update(color, keyX, keyZ) {

        this.pionki[keyZ][keyX] = color
        console.table(this.pionki)
        if (color == 0) {
            for (let el of this.scene.children)
                if (el.posx == keyX && el.posz == keyZ && el.geometry.type == "CylinderGeometry") {
                    console.log("usuniecie elementu: ", el)
                    el.geometry.dispose()
                    el.material.dispose()
                    this.scene.remove(el)
                }
        }
        else {
            let x = -350 + keyX * 100
            let z = -350 + keyZ * 100
            let geometry = new THREE.CylinderGeometry(50, 50, 30, 50)
            let material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                map: this.pionki[keyZ][keyX] == 1 ? new THREE.TextureLoader().load("textures/biale_pionek.png") : new THREE.TextureLoader().load("textures/czarne_pionek.png"),
                transparent: false
            })

            if (ui.meNum == this.pionki[keyZ][keyX])
                var cube = new Pionek(geometry, material, this.pionki[keyZ][keyX], ui.meNum, keyX, keyZ)
            else
                var cube = new Pionek(geometry, material, this.pionki[keyZ][keyX], "przeciwnik", keyX, keyZ)

            cube.position.set(x, 20, z)
            console.log("dodanie elementu")
            this.scene.add(cube)
        }
    }
}