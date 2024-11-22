window.onload = function () {
    const TOPESUPERIOR = 10;
    const TOPEINFERIOR = 265;
    const fps = 60;
    const botonStart = document.getElementById("start");
    const botonPause = document.getElementById("pause");
    let canvas, ctx;
    let jugador1, jugador2, pelota;
    let yArriba, yAbajo;
    let marcadorJugador1 = 0;
    let marcadorJugador2 = 0;
    let id;
    let pausado = false;
    let partidaActiva = false;

    const imagenSprite = new Image();
    imagenSprite.src = "assets/img/sprites.png"; // Ruta del sprite

    // Clase para la pelota

    class Ball {
        constructor() {
            this.x = 300;
            this.y = 175;
            this.radio = 10;
            this.color = "white";
            this.velocidad = 4.5;
            this.direccionX = 1;
            this.direccionY = 0;
        }

        moverPelota() {
            this.x += this.velocidad * this.direccionX;
            this.y += this.velocidad * this.direccionY;

            if (this.y - this.radio <= 0 || this.y + this.radio >= 350) {
                this.direccionY *= -1;
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

        constructor(x, coordenadasSprite) {

            this.x = x;

            this.y = 137;

            this.anchura = 50;

            this.altura = 150; // Ajustado al tamaño del sprite

            this.velocidad = 3;

            this.spriteX = coordenadasSprite[0];

            this.spriteY = coordenadasSprite[1];

        }

        generarPosicionArriba() {

            this.y -= this.velocidad;

            if (this.y < TOPESUPERIOR) this.y = TOPESUPERIOR;

        }

        generarPosicionAbajo() {

            this.y += this.velocidad;

            if (this.y > TOPEINFERIOR) this.y = TOPEINFERIOR;

        }

        dibujarJugador(ctx) {
            ctx.drawImage(
                imagenSprite,
                this.spriteX,          // Coordenada X del sprite
                this.spriteY,          // Coordenada Y del sprite
                this.anchura,          // Ancho del sprite
                this.altura,           // Alto del sprite
                this.x,                // Posición X en el canvas
                this.y,                // Posición Y en el canvas
                this.anchura,          // Ancho en el canvas
                this.altura            // Altura en el canvas
            );
        }
    }

    // Configuración de jugadores con sprites

    jugador1 = new Jugadores(15, [0, 0]); 

    // Aqui creo los jugadores con la X y las coordenadas del sprite.

    jugador2 = new Jugadores(535, [50, 0]);

    function empezarPartida() {

        pintarPong(); // Pinta todo 

        id = setInterval(pintarPong, 1000 / fps); // Establezco el intervalo de ejecucion

        botonStart.disabled = true; // Desactivo el boton de start

        botonPause.disabled = false; // Activo el boton de pause.

        partidaActiva = true; // Activo el flag de que la partida ha comenzado

    }

    function reiniciarPartida() {

        clearInterval(id); // Termino el intervalo de que pinte el pong.

        marcadorJugador1 = 0;

        marcadorJugador2 = 0;

        pelota = new Ball(); // Creo de nuevo la partida.

        jugador1 = new Jugadores(15, [0, 0]); // Lo pongo en su sitio otra vez

        jugador2 = new Jugadores(535, [50, 0]); // Lo pongo en su sitio otra vez

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpio el canvas

        document.getElementById("start").disabled = false; // Activo el boton de start

        pausado = false; // El flag lo pongo en falso ya que no esta pausado

        partidaActiva = false; // Desactivo el flag ya que la partida ha terminado

        botonPause.disabled = false; // Activo el boton de pausar

        pintarMarcador(); // Pinto el marcador a 0 otra vez
    }

    // Funcion para que detecte si la partida ha terminado 

    function terminarPartida() {
        if (marcadorJugador1 === 10 || marcadorJugador2 === 10) {
            ctx.font = "25px Arial"; // Tamaño de la letra del ctx
            ctx.fillStyle = "yellow"; // Color del ctx
            let texto = marcadorJugador1 === 10 ? "EL JUGADOR 1 HA GANADO." : "EL JUGADOR 2 HA GANADO.";
            ctx.fillText(texto, 100, 325); // Pinta el texto y sus proporciones
            clearInterval(id); // Termina la ejecución de la funcion que pinta todo.
            botonPause.disabled = true; // Deshabilita el boton de pause
            partidaActiva = false; // Pone el flag a false ya que la partida a terminado.
        }
    }

    function pausarPartida() {
        if (!partidaActiva) return;

        if (!pausado) {
            clearInterval(id);
            pausado = true;
        } else if (pausado) {
            id = setInterval(pintarPong, 1000 / fps);
            pausado = false;
        }
    }

    function pintarPong() {

        ctx.clearRect(0, 0, 600, 350); // Limpio el canvas

        pelota.dibujarPelota(ctx); // Dibujo la pelota

        jugador1.dibujarJugador(ctx); // Dibujo al jugador 1

        jugador2.dibujarJugador(ctx); // Dibujo al jugador 2

        terminarPartida(); // LLamo a la funcion de terminar partida cuando se cumpla

        if (yArriba) jugador1.generarPosicionArriba();

        // Aqui pongo las condiciones del movimiento de jugador 1

        if (yAbajo) jugador1.generarPosicionAbajo(); 

        moverJugador2(); // Aqui es donde se ejecuta el movimiento de IA del jugador 2

        pelota.moverPelota(); // LLamo a la funcion que hace el movimiento de la pelota

        colisionConJugador(); // Llamo a la funcion de las colisiones

        pintarMarcador(); // LLamo a la funcion de pintar marcador
    }

    function moverJugador2() {
        if (pelota.y < jugador2.y + jugador2.altura / 2) {

            jugador2.y -= jugador2.velocidad;

            if (jugador2.y < TOPESUPERIOR) jugador2.y = TOPESUPERIOR;

        } else if (pelota.y > jugador2.y + jugador2.altura / 2) {

            jugador2.y += jugador2.velocidad;

            if (jugador2.y > TOPEINFERIOR) jugador2.y = TOPEINFERIOR;

        }
    }

    function colisionConJugador() {

        let pelotaIzq = pelota.x - pelota.radio;
        let pelotaDer = pelota.x + pelota.radio;
        let pelotaArriba = pelota.y - pelota.radio;
        let pelotaAbajo = pelota.y + pelota.radio;

        let jugador1Izq = jugador1.x;
        let jugador1Der = jugador1.x + jugador1.anchura;
        let jugador1Arriba = jugador1.y;
        let jugador1Abajo = jugador1.y + jugador1.altura;

        let jugador2Izq = jugador2.x;
        let jugador2Der = jugador2.x + jugador2.anchura;
        let jugador2Arriba = jugador2.y;
        let jugador2Abajo = jugador2.y + jugador2.altura;

    }

    function haSidoPunto() {
        if (pelota.x - pelota.radio < -6) {
            marcadorJugador2++;
            resetPelota();
        } else if (pelota.x + pelota.radio > 605) {
            marcadorJugador1++;
            resetPelota();
        }
    }

    // Esta funcion resetea la pelota cuando se marca gol.

    function resetPelota() {
        pelota.x = 300;
        pelota.y = 175;
        pelota.direccionX *= -1;
        pelota.direccionY = 0;
    }

    // Funcion para pintar el marcador y que llama a otra para que actualice el marcador.

    function pintarMarcador() {
        ctx.font = "50px Arial";
        ctx.fillText(marcadorJugador1, 200, 55);
        ctx.fillText(marcadorJugador2, 400, 55);
        haSidoPunto();
    }

    // Funcion que controla el flag de si estoy pulsando alguna de las teclas que se indican

    function activaMovimiento(evt) {
        if (!partidaActiva) return;
        if (evt.keyCode === 38) yArriba = true;
        if (evt.keyCode === 40) yAbajo = true;
        if (evt.keyCode === 27) pausarPartida();
    }

    // Funcion que controla el flag de si no estoy pulsando alguna de las teclas que se indican

    function desactivaMovimiento(evt) {
        if (evt.keyCode === 38) yArriba = false;
        if (evt.keyCode === 40) yAbajo = false;
    }

    pelota = new Ball(); // Creo la pelota

    canvas = document.getElementById("miCanvas"); // LLamo al canvas del html.

    ctx = canvas.getContext("2d"); // Cojo el contexto del canvas

    // Manejadores de eventos.

    document.addEventListener("keydown", activaMovimiento);
    document.addEventListener("keyup", desactivaMovimiento);

    document.getElementById("start").onclick = empezarPartida;
    document.getElementById("restart").onclick = reiniciarPartida;
    document.getElementById("pause").onclick = pausarPartida;
};



