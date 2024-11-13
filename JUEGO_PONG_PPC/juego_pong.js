window.onload = function () {
   
    const TOPESUPERIOR = 10;
    const TOPEINFERIOR = 265;
    const fps = 60;
    let canvas, ctx;
    let jugador1, jugador2, pelota;
    let yArriba, yAbajo;

    //Clase para crear la pelota.
    class Ball {
        constructor() {
            this.x = 300;
            this.y = 175;
            this.lado = 15;
            this.color = "white";
            this.velocidad = 3.75;
            this.bajando=false;
        }

        moverPelota(){

            if (this.y < 15) { 

                this.bajando=true;

                }

            else if(this.y > 335) {
                
                this.bajando=false; 
            }

            if(this.bajando){

                this.x += this.velocidad;
                this.y += this.velocidad;

            } else if(this.bajando===false){

                this.x += this.velocidad;
                this.y -= this.velocidad;
            }

        }
    }

    // Clase para crear los jugadores

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

    // Funcion que activa la partida al darle al boton START.

    function empezarPartida() {
        pintarPong();
        let id = setInterval(pintarPong, 1000/fps);
    }
    //Funcion del juego

    function pintarPong() {
        ctx.clearRect(0, 0, 600, 350);
        ctx.fillRect(pelota.x, pelota.y, pelota.lado, pelota.lado);
        ctx.fillRect(jugador1.x, jugador1.y, jugador1.anchura, jugador1.altura);
        ctx.fillRect(jugador2.x, jugador2.y, jugador2.anchura, jugador2.altura);
        ctx.fillStyle = pelota.color;

        if (yArriba) jugador1.generarPosicionArriba();
        if (yAbajo) jugador1.generarPosicionAbajo();

        pelota.moverPelota();
    }

    // Function para activar la tecla de los movimientos.

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

    // Function para desactivar la tecla de los movimientos.

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
    document.getElementById("start").onclick = empezarPartida; // Manejador para ejecutar la funcion de empezarPartida.
    
};
