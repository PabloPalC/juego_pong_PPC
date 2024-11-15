window.onload = function () {
   
    const TOPESUPERIOR = 10;
    const TOPEINFERIOR = 265;
    const fps = 60;
    let canvas, ctx;
    let jugador1, jugador2, pelota;
    let yArriba, yAbajo;
    let marcadorJugador1=8;
    let marcadorJugador2=0;
    let id;

    //Clase para crear la pelota.
    class Ball {
        constructor() {
            this.x = 300;
            this.y = 175;
            this.lado = 15;
            this.color = "white";
            this.velocidad = 3.5;
            this.bajando=false;
        }

        moverPelota(){
            if (this.y < 0) { 

                this.bajando=true;

                }

            else if(this.y > 335 ) {
                
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
            this.y = 137;
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
        id = setInterval(pintarPong, 1000/fps);
    }

    //Funcion del juego

    function pintarPong() {


        ctx.clearRect(0, 0, 600, 350);
        ctx.fillRect(pelota.x, pelota.y, pelota.lado, pelota.lado);
        ctx.fillRect(jugador1.x, jugador1.y, jugador1.anchura, jugador1.altura);
        ctx.fillRect(jugador2.x, jugador2.y, jugador2.anchura, jugador2.altura);
        ctx.fillStyle = pelota.color;

        terminarPartida();

        if (yArriba) jugador1.generarPosicionArriba();
        if (yAbajo) jugador1.generarPosicionAbajo();

        pelota.moverPelota();

        pintarMarcador();
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

    // Funcion para terminar la partida.

    function terminarPartida(){
        if(marcadorJugador1 === 10){
            ctx.font="25px Arial"
            ctx.fillStyle = "yellow"
            ctx.fillText("EL JUGADOR 1 HA GANADO LA PARTIDA.", 50, 325)
            clearInterval(id);

        } else if(marcadorJugador2 === 10){
            ctx.font="25px Arial"
            ctx.fillStyle = "yellow"
            ctx.fillText("EL JUGADOR 2 HA GANADO LA PARTIDA.", 50, 325)
            clearInterval(id);

        }
    
    }

    // Funcion de suma de puntos.

    function haSidoPunto(){

        if(pelota.x<0 && pelota.x < -3){
            marcadorJugador2++;
            pelota.x = 300;
            pelota.y = 175;
            pelota.moverPelota();
        } else if(pelota.x>600 && pelota.x<602){
            marcadorJugador1++;
            pelota.x = 300;
            pelota.y = 175;
            pelota.moverPelota();
        }

    }

    // Funcion para detectar colisiones.

    /* function colisionConJugador(){

        if (( R1Der > R2Izq ) & ( R1Izq < R2Der ) & ( R1Up > R2Down) & ( R1Down < R2Up) ) {
        }

    */ 
        
    // Funcion para mostrar el marcador.
    function pintarMarcador(){
         ctx.font="50px Arial"
         ctx.fillText(marcadorJugador1, 200, 55);
         ctx.fillText(marcadorJugador2, 400, 55);
         haSidoPunto();

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
