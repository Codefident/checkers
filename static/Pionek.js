class Pionek extends THREE.Mesh {

    constructor(geometry, material, color, player, x, z) {
        super(geometry, material) // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
        this.color = color == 1 ? "white" : "black"
        this.player = player
        this.posx = parseInt(x)
        this.posz = parseInt(z)
    }
}

class Pole extends THREE.Mesh {

    constructor(geometry, material, color, x, z) {
        super(geometry, material)
        this.color = color == 1 ? "white" : "black"
        this.posx = parseInt(x)
        this.posz = parseInt(z)
    }
}