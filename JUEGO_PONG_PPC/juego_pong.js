window.onload = function () {
    const TOPESUPERIOR = 5;
    const fps = 60;
    const TOPEINFERIOR = 270;
    let canvas, ctx;
    let pelota;
    let yArriba, yAbajo;

    class Ball {
        constructor() {
            this.x = 300;
            this.y = 175;
            this.lado = 15;
            this.color = "white";
        }
    }

    class Jugadores {
        constructor(x) {
            this.x = x;
            this.y = 130;
            this.anchura = 15;
            this.altura = 75;
            this.velocidad = 3;
            this.color = "white";
        }

        generarPosicionArriba() {
            this.y = this.y - this.velocidad;

            if (this.y < TOPESUPERIOR) this.y = TOPESUPERIOR;
        }

        generarPosicionAbajo() {
            this.y = this.y + this.velocidad;

            if (this.y > TOPEINFERIOR) this.y = TOPEINFERIOR;
        }
    }

    function empezarPartida() {
        pintarPong();
        let id = setInterval(pintarPong, 1000/fps);
    }

    function pintarPong() {
        ctx.clearRect(0, 0, 600, 350);
        ctx.fillRect(pelota.x, pelota.y, pelota.lado, pelota.lado);
        ctx.fillRect(jugador1.x, jugador1.y, jugador1.anchura, jugador1.altura);
        ctx.fillRect(jugador2.x, jugador2.y, jugador2.anchura, jugador2.altura);
        ctx.fillStyle = pelota.color;

        if (yArriba) jugador1.generarPosicionArriba();
        if (yAbajo) jugador1.generarPosicionAbajo();
    }

    function activaMovimiento(evt) {
        switch (evt.keyCode) {
            // Arriba
            case 38:
                yArriba = true;
                break;

            // Abajo.
            case 40:
                yAbajo = true;
                break;
        }
    }

    function desactivaMovimiento(evt) {
        switch (evt.keyCode) {
            // Arriba
            case 38:
                yArriba = false;
                break;

            // Abajo.
            case 40:
                yAbajo = false;
                break;
        }
    }

    pelota = new Ball();
    jugador1 = new Jugadores(15);
    jugador2 = new Jugadores(570);

    document.addEventListener("keydown", activaMovimiento, false);
    document.addEventListener("keyup", desactivaMovimiento, false);

    canvas = document.getElementById("miCanvas");
    ctx = canvas.getContext("2d");
    document.getElementById("start").onclick = empezarPartida;
};
