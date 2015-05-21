var Controlador = function(){
    
    this.filas = 50;
    this.columnas = 80;
    //Constante de aleatoriedad
    this.caleatoria = 8;
    this.estado = "inicial";
    
    //Guardar la funcion iterante
    this.intervalo;
    
    //Objeto donde se guardan los DOM de las labels par amostrar informacion
    this.label = {
        iteracion: document.getElementById("iteraciones"),
        vivas: document.getElementById("vivas")
    };
    
    //Objeto que guarda y realiza todo lo referente al tablero
    this.tablero = new Tablero(this.filas, this.columnas);
    
    //El render solo se encargara de dibujar el tablero
    this.render = new Render('lienzo');
    
}

Controlador.prototype.ciclo = function(){
    if(this.estado == "inicial"){
        this.label.iteracion.innerHTML = 0;
        this.label.vivas.innerHTML = this.tablero.nat;
        this.render.dibujar(this.tablero.matriz);
        this.estado = "play";
    }else if(this.estado == "play"){
        this.tablero.iterar();
        this.render.dibujar(this.tablero.matriz);
        this.label.iteracion.innerHTML = this.tablero.iteraciones;
        this.label.vivas.innerHTML = this.tablero.nat;
    }
}

Controlador.prototype.ejecutar = function(ips){
    var ctrl = this;
    this.intervalo = setInterval(function(){
        ctrl.ciclo()
    }, (1000/ips));
}

Controlador.prototype.stop = function(){
    clearInterval(this.intervalo);
}

//Funcion que hace una sola iteracion y la dibuja
Controlador.prototype.iterar = function(){
    this.tablero.iterar();
    this.render.dibujar(this.tablero.matriz);
    this.label.iteracion.innerHTML = this.tablero.iteraciones;
    this.label.vivas.innerHTML = this.tablero.nat;
}

//Funcion que reinicia el sistema
Controlador.prototype.reiniciar = function(){
    this.tablero.reiniciar(this.filas, this.columnas, this.caleatoria);
    this.render.dibujar(this.tablero.matriz);
    this.label.iteracion.innerHTML = 0;
    this.label.vivas.innerHTML = this.tablero.nat;
}