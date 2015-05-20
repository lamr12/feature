//Objeto encargado de dibujar el tablero
var Render = function(elemento, colorVivo, colorMuerto, colorLinea){
    
    this.vivo = colorVivo || "#999";
    this.muerto = colorMuerto || "#fff";
    this.linea = colorLinea || "#37b";
    
    this.canvas = document.getElementById(elemento);
    this.ctx = this.canvas.getContext('2d');
    
    this.w=0; this.filas=0;this.tFil=0;this.tCol=0;
}

Render.prototype.dibujar = function(matriz){
    
    this.w = this.canvas.width; this.h = this.canvas.height;
    this.filas = matriz.length; this.columnas = matriz[0].length;
    this.tFil = this.canvas.height / this.filas;
    this.tCol = this.canvas.width / this.columnas;
    
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(0,0,this.w, this.h);
    
    //Dibujamos el tablero
    for (var i = matriz.length - 1; i >= 0; i--) {
        for(var j = matriz[i].length - 1; j >= 0; j--){
            this.ctx.fillStyle = (matriz[i][j] == 1) ? this.vivo : this.muerto;
            this.ctx.fillRect(j*this.tCol, i*this.tFil, this.tCol, this.tFil);
        }
    }
    
    //Dibujamos Lineas Guias
    this.ctx.strokeStyle = this.linea;
    this.ctx.beginPath();
    for (var i = this.filas - 1; i > 0; i--) {
        this.ctx.moveTo(0,i*this.tFil);
        this.ctx.lineTo(this.w,i*this.tFil);
    }
    
    for (var i = this.columnas - 1; i > 0; i--) {
        this.ctx.moveTo(i*this.tCol,0);
        this.ctx.lineTo(i*this.tCol,this.h);
    }
    this.ctx.stroke();
}
