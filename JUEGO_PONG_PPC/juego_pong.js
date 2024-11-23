window.onload = function () {

    // Declaracion de variables.

    const TOPESUPERIOR = 0;
    const TOPEINFERIOR = 200;
    const fps = 60;
    const botonStart = document.getElementById("start");
    const botonPause = document.getElementById("pause");
    let canvas, ctx;
    let jugador1, jugador2, pelota;
    let yArriba, yAbajo;
    let marcadorJugador1 = 0;
    let marcadorJugador2 = 0;
    let id;
    let rebotesPelota = 0;
    let pausado = false;
    let partidaActiva = false;

    const imagenSprite = new Image(); // Declaro que sea una imagen

    imagenSprite.src = "assets/img/sprites.png"; // Ruta del sprite

    // Clase para la pelota

    class Ball {
        constructor() {
            this.x = 300;
            this.y = 175;
            this.radio = 10;
            this.color = "white";
            this.velocidad = 9;
            this.direccionX = 1;
            this.direccionY = 0;
        }

        // Funcion que mueve la pelota.

        moverPelota() {
            this.x += this.velocidad * this.direccionX;
            this.y += this.velocidad * this.direccionY;
    
            // Rebote en los bordes de arriba y abajo.

            if (this.y - this.radio <= 0 || this.y + this.radio >= 350) {
                this.direccionY *= -1; // Cambia la dirección vertical
                this.y = Math.max(this.radio, Math.min(this.y, 350 - this.radio)); // Ajusta posición
            }
    
            // Verificar si la pelota ha pasado el limite de los lados.

            if (this.x - this.radio < 0 || this.x + this.radio > 600) {
                haSidoPunto();
            }
        }
    
        // Dibujar círculo que actúa como pelota

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
        this.velocidad = 2;
        this.spriteX = coordenadasSprite[0];
        this.spriteY = coordenadasSprite[1];
    }

    generarPosicionArriba() {
        this.y -= this.velocidad;
        if (this.y < TOPESUPERIOR) this.y = TOPESUPERIOR; // No permite pasar el borde de arriba.
    }

    generarPosicionAbajo() {
        this.y += this.velocidad;
        if (this.y > TOPEINFERIOR) this.y = TOPEINFERIOR; // No permite pasar el borde de abajo
    }

    dibujarJugador(ctx) {
        ctx.drawImage(
            imagenSprite,
            this.spriteX,
            this.spriteY,
            this.anchura,
            this.altura,
            this.x,
            this.y,
            this.anchura,
            this.altura
        );
    }
}


    // Configuración de jugadores con sprites

    jugador1 = new Jugadores(15, [0, 0]); 

    // Aqui creo los jugadores con la X y las coordenadas del sprite.

    jugador2 = new Jugadores(535, [50, 0]);

    // Funcion para comenzar la partida.

    function empezarPartida() {

        pintarPong(); // Pinta todo 

        id = setInterval(pintarPong, 1000 / fps); // Establezco el intervalo de ejecucion

        botonStart.disabled = true; // Desactivo el boton de start

        botonPause.disabled = false; // Activo el boton de pause.

        partidaActiva = true; // Activo el flag de que la partida ha comenzado

    }

    // Funcion que reinicia la partida y restablece valores.

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
            let texto = marcadorJugador1 === 10 ? "EL JUGADOR ROJO HA GANADO LA PARTIDA." : "EL JUGADOR AZUL HA GANADO LA PARTIDA.";
            ctx.fillText(texto, 25, 325); // Pinta el texto y sus proporciones
            clearInterval(id); // Termina la ejecución de la funcion que pinta todo.
            botonPause.disabled = true; // Deshabilita el boton de pause
            partidaActiva = false; // Pone el flag a false ya que la partida a terminado.

        }
    }

    // Funcion para pausar la partida.

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

    // Funcion que pinta todo el juego.

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

        aumentarVelocidad() // Aumenta la velocidad de la pelota si hay mas de 5 rebotes en los jugadores.

        colisionConJugador(); // Llamo a la funcion de las colisiones

        pintarMarcador(); // LLamo a la funcion de pintar marcador
    }

    // Funcion para que el jugador 2 actue como una IA.

    function moverJugador2() {

        // Verifica que si la mitad del jugador Y y su posicion es mayor que la posicion Y de la pelota, se mueve hacia arriba.

        if (pelota.y < jugador2.y + jugador2.altura / 2) { 
            jugador2.y -= jugador2.velocidad;

            if (jugador2.y < TOPESUPERIOR) jugador2.y = TOPESUPERIOR;


        // Verifica que si la mitad del jugador Y y su posicion es menor que la posicion Y de la pelota, se mueve hacia abajo.

        } else if (pelota.y > jugador2.y + jugador2.altura / 2) { 

            jugador2.y += jugador2.velocidad;

            if (jugador2.y > TOPEINFERIOR) jugador2.y = TOPEINFERIOR;

        }   
    }

    // Funcion de colisiones.

    function colisionConJugador() {
        // Bordes de la pelota
        let pelotaIzq = pelota.x - pelota.radio;
        let pelotaDer = pelota.x + pelota.radio;
        let pelotaArriba = pelota.y - pelota.radio;
        let pelotaAbajo = pelota.y + pelota.radio;
    
        // Bordes del jugador 1
        let jugador1Izq = jugador1.x;
        let jugador1Der = jugador1.x + jugador1.anchura-15;
        let jugador1Arriba = jugador1.y;
        let jugador1Abajo = jugador1.y + jugador1.altura-15;
    
        // Bordes del jugador 2
        let jugador2Izq = jugador2.x;
        let jugador2Der = jugador2.x + jugador2.anchura-15;
        let jugador2Arriba = jugador2.y;
        let jugador2Abajo = jugador2.y + jugador2.altura-15;
    
        // Colisión con jugador 1

        if (
            pelotaDer-15 > jugador1Izq-15 &&              // Pelota toca borde derecho del jugador
            pelotaIzq-15 < jugador1Der-15 &&              // Pelota toca borde izquierdo del jugador
            pelotaAbajo-15 > jugador1Arriba-25 &&         // Pelota toca borde superior del jugador
            pelotaArriba-15 < jugador1Abajo-25           // Pelota toca borde inferior del jugador
        ) {
            pelota.direccionX = Math.abs(pelota.direccionX); // Rebota a la derecha
            pelota.x = jugador1Der + pelota.radio; // Ajusta posición fuera del jugador
    
            // Calcula el ángulo basado en la posición relativa del impacto
            let impacto = (pelota.y - (jugador1.y + jugador1.altura / 2)) / (jugador1.altura / 2);
            pelota.direccionY = impacto * 1.5; // Ajusta el ángulo con factor de rebote más realista
    
            normalizarDireccion();
            rebotesPelota++;
        }
    
        // Colisión con jugador 2

        if (
            pelotaIzq-15 < jugador2Der-15 &&              // Pelota toca borde derecho del jugador
            pelotaDer-15 > jugador2Izq-15 &&              // Pelota toca borde izquierdo del jugador
            pelotaAbajo-15 > jugador2Arriba-25 &&         // Pelota toca borde superior del jugador
            pelotaArriba-15 < jugador2Abajo-25            // Pelota toca borde inferior del jugador
        ) {
            pelota.direccionX = -Math.abs(pelota.direccionX); // Rebota a la izquierda

            pelota.x = jugador2Izq - pelota.radio; // Ajusta posición fuera del jugador

    
            // Calcula el ángulo basado en la posición relativa del impacto

            let impacto = (pelota.y - (jugador2.y + jugador2.altura / 2)) / (jugador2.altura / 2);

            pelota.direccionY = impacto * 1.5; // Ajusta el ángulo con factor de rebote más realista
    
            normalizarDireccion();
        }

    }
    
    function normalizarDireccion() {
        // Asegura que la dirección no sea demasiado plana o inclinada
        let velocidadTotal = Math.sqrt(pelota.direccionX ** 2 + pelota.direccionY ** 2);
        pelota.direccionX /= velocidadTotal;
        pelota.direccionY /= velocidadTotal;
    }

    // Funcion para sumar punto.

    function haSidoPunto() {
        if (pelota.x - pelota.radio < 15) { // Gol en el lado izquierdo
            marcadorJugador2++;
            resetPelota();
        } else if (pelota.x + pelota.radio > 585) { // Gol en el lado derecho
            marcadorJugador1++;
            resetPelota();
        }

        pelota.velocidad = 9; 
    }

    // Funcion para aumentar velocidad

    function aumentarVelocidad() {

        if(rebotesPelota===5){
            pelota.velocidad += 1.5;
            rebotesPelota = 0;
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

    // Manejadores de eventos para teclas.

    document.addEventListener("keydown", activaMovimiento);
    document.addEventListener("keyup", desactivaMovimiento);

    // Manejadores de eventos para botones del HTML.

    document.getElementById("start").onclick = empezarPartida;
    document.getElementById("restart").onclick = reiniciarPartida;
    document.getElementById("pause").onclick = pausarPartida;

};



