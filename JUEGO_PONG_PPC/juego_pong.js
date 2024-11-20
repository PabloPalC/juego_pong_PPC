window.onload = function () {
    const TOPESUPERIOR = 10;
    const TOPEINFERIOR = 265;
    const fps = 60;
    const botonStart = document.getElementById("start");
    let canvas, ctx;
    let jugador1, jugador2, pelota;
    let yArriba, yAbajo;
    let marcadorJugador1 = 0;
    let marcadorJugador2 = 9;
    let id;
    let pausado = false;

    // Clase para la pelota
    class Ball {
        constructor() {
            this.x = 300;
            this.y = 175;
            this.radio = 10;
            this.color = "white";
            this.velocidad = 4.5;
            this.direccionX = 1; // Dirección horizontal (1 para derecha, -1 para izquierda)
            this.direccionY = 0; // Dirección vertical (basada en el impacto)
        }

        moverPelota() {
            // Actualiza la posición según la dirección (ángulo)

            this.x += this.velocidad * this.direccionX;
            this.y += this.velocidad * this.direccionY;

            // Rebote en los bordes de arriba y abajo
            if (this.y - this.radio <= 0 || this.y + this.radio >= 350) {
                this.direccionY *= -1; // Invierte la dirección al lado contrario
            }
        }

        dibujarPelota(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }

    // Clase para los jugadores
    class Jugadores {
        constructor(x) {
            this.x = x;
            this.y = 137;
            this.anchura = 15;
            this.altura = 75;
            this.velocidad = 3;
            this.color = "white";
        }

        generarPosicionArriba() {
            this.y -= this.velocidad;
            if (this.y < TOPESUPERIOR) this.y = TOPESUPERIOR;
        }

        generarPosicionAbajo() {
            this.y += this.velocidad;
            if (this.y > TOPEINFERIOR) this.y = TOPEINFERIOR;
        }
    }

    // Función para iniciar el juego
    function empezarPartida() {
        pintarPong();
        id = setInterval(pintarPong, 1000 / fps);
        botonStart.disabled = true;
    }

    // Función para reiniciar el juego
    function reiniciarPartida() {
        clearInterval(id);
        marcadorJugador1 = 0;
        marcadorJugador2 = 0;
        pelota = new Ball();
        jugador1 = new Jugadores(15);
        jugador2 = new Jugadores(570);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById("start").disabled = false;
        pintarMarcador();
    }

    // Función principal del juego
    function pintarPong() {
        ctx.clearRect(0, 0, 600, 350);
        pelota.dibujarPelota(ctx);
        ctx.fillRect(jugador1.x, jugador1.y, jugador1.anchura, jugador1.altura);
        ctx.fillRect(jugador2.x, jugador2.y, jugador2.anchura, jugador2.altura);
        ctx.fillStyle = pelota.color;

        terminarPartida();

        if (yArriba) jugador1.generarPosicionArriba();
        if (yAbajo) jugador1.generarPosicionAbajo();

        moverJugador2();

        pelota.moverPelota();


        pintarMarcador();
    }

    // Movimiento IA del jugador 2. Provisional (Ejemplo)
    function moverJugador2() {

        if (pelota.y < jugador2.y + jugador2.altura / 2) {
            jugador2.y -= jugador2.velocidad;

            if (jugador2.y < TOPESUPERIOR) jugador2.y = TOPESUPERIOR;
        } else if (pelota.y > jugador2.y + jugador2.altura / 2) {
            jugador2.y += jugador2.velocidad;
            if (jugador2.y > TOPEINFERIOR) jugador2.y = TOPEINFERIOR;
        }
    }

    // Función para sumar puntos
    function haSidoPunto() {
        if (pelota.x - pelota.radio < -6) {
            marcadorJugador2++;
            resetPelota();
        } else if (pelota.x + pelota.radio > 605) {
            marcadorJugador1++;
            resetPelota();
        }
    }

    function resetPelota() {
        pelota.x = 300;
        pelota.y = 175;
        pelota.direccionX *= -1; // Invierte la dirección inicial
        pelota.direccionY = 0; // Resetea dirección vertical
    }

    // Mostrar marcador
    function pintarMarcador() {
        ctx.font = "50px Arial";
        ctx.fillText(marcadorJugador1, 200, 55);
        ctx.fillText(marcadorJugador2, 400, 55);
        haSidoPunto();
    }

    // Terminar partida
    function terminarPartida() {
        if (marcadorJugador1 === 10 || marcadorJugador2 === 10) {
            ctx.font = "25px Arial";
            ctx.fillStyle = "yellow";
            let texto = marcadorJugador1 === 10 ? "EL JUGADOR 1 HA GANADO." : "EL JUGADOR 2 HA GANADO.";
            ctx.fillText(texto, 100, 325);
            clearInterval(id);
        }
    }

    // Funcion para pausar la partida

    function pausarPartida() {

            clearInterval(id);
            console.log("PAUSE");
            pausado=true;

            if(pausado===false){
            setInterval(id);
            console.log("NO PAUSE")
            pausado=false;
        }
    }
    // Detectar teclas
    function activaMovimiento(evt) {
        if (evt.keyCode === 38) yArriba = true;
        if (evt.keyCode === 40) yAbajo = true;
    }

    function desactivaMovimiento(evt) {
        if (evt.keyCode === 38) yArriba = false;
        if (evt.keyCode === 40) yAbajo = false;
    }

    pelota = new Ball();
    jugador1 = new Jugadores(15);
    jugador2 = new Jugadores(570);

    canvas = document.getElementById("miCanvas");
    ctx = canvas.getContext("2d");

    document.addEventListener("keydown", activaMovimiento);
    document.addEventListener("keyup", desactivaMovimiento);

    document.getElementById("start").onclick = empezarPartida;
    document.getElementById("restart").onclick = reiniciarPartida;
    document.getElementById("pause").onclick = pausarPartida;
}
