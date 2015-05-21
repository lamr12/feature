//Creamos el objeto Tablero, que sera el que armara y calculara el juego
var Tablero = function(filas, columnas){
    this.reiniciar(filas, columnas);
};

//Funcion reinicializadora
Tablero.prototype.reiniciar = function (filas, columnas, caleatoria){
    
    this.iteraciones = 0;
    this.nat = 0;
    this.hnat = [];
    this.filas = filas;
    this.columnas = columnas;
    this.caleatoria = caleatoria || 8;
    this.matriz = new Array(filas);
    
    for (var i = this.matriz.length - 1; i >= 0; i--) {
        this.matriz[i] = new Array(this.columnas);
        //Empezamos a inicializar casillas aqui para mejorar el rendimiento
        for (var j = this.matriz[i].length - 1; j >= 0; j--) {
            this.matriz[i][j] = getRandom(this.caleatoria);
            if(this.matriz[i][j] == 1){
                this.nat++;
            }
        }
    }  
    this.hnat.push(this.nat);
};

//Funcion que se encargara de calcular cada iteracion
Tablero.prototype.iterar = function(){
    
    //Inicializar Numero de Vivas totales
    this.nat = 0;
    //Contadores creados al principio para mejorar rendimiento
    var na, imenos, imas, jmenos, jmas;
    var tmatriz = new Array(this.filas);
    for (var i = tmatriz.length - 1; i >= 0; i--) {
        tmatriz[i] = new Array(this.columnas);
        for (var j = tmatriz[i].length - 1; j >= 0; j--) {
            na = 0;
            //Variable usadas para mejorar la lectura del codigo
            imenos = i-1;
            imas = i+1;
            jmenos = j-1;
            jmas = j+1;
            //Chequeando los bordes
            if(imenos < 0){ imenos = this.filas - 1; }
            if(imas >= this.filas) { imas = 0; }
            if(jmenos < 0){ jmenos = this.columnas - 1; }
            if(jmas >= this.columnas){ jmas = 0; }
            //contando las vivas
            na+=this.matriz[imenos][jmenos];
            na+=this.matriz[i][jmenos];
            na+=this.matriz[imas][jmenos];
            na+=this.matriz[imenos][j];
            na+=this.matriz[imas][j];
            na+=this.matriz[imenos][jmas];
            na+=this.matriz[i][jmas];
            na+=this.matriz[imas][jmas];
            //aplicando las reglas
            if (na < 2) {
                tmatriz[i][j] = 0;
            } else if(na > 3) {
                tmatriz[i][j] = 0;
            } else if(na == 3){
                tmatriz[i][j] = 1;
                this.nat++;
            } else {
                tmatriz[i][j] = this.matriz[i][j];
                if(tmatriz[i][j] == 1){ this.nat++; }
            }
        }
    }
    this.matriz = tmatriz;
    this.hnat.push(this.nat);
    this.iteraciones++;
};