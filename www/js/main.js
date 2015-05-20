var graficar = function(nat){
    var canvas = document.getElementById('grafica');
    var ctx = canvas.getContext('2d');
    
    var offset = 50;
    
    var w = canvas.width - 2*offset, h = canvas.height-2*offset;
    
    //Determinando el numero de iteraciones
    var iteracion = {
        max: nat.length-1,
        intervalo: (w/(nat.length-1))
    };
    
    //Determinando el maximo valor de Celulas vivas que ha tomado
    var maxC = 0;
    for (var i = nat.length - 1; i >= 0; i--) {
        if(nat[i] > maxC){
            maxC = nat[i];
        }
    }

    var celula = {
        max: maxC + (10 - maxC % 10),
        intervalo: (h/(maxC + (10 - maxC % 10)))
    };
   
    //Construyendo La Grafica               
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "18px Arial";
    ctx.textAlign = "right";
    ctx.fillText("Iteraciones ("+iteracion.max+")",w+offset,h+offset+25);
    ctx.textAlign = "left";
    ctx.fillText("("+celula.max+") Celulas Vivas (Inicial:"+(nat[0])+";Final:"+(nat[nat.length-1])+")",offset,offset-10);
    ctx.fillRect(offset, offset, w,h);
    ctx.beginPath();
    ctx.moveTo(offset, offset);
    ctx.lineTo(w+offset,offset);
    ctx.lineTo(w+offset,h+offset);
    ctx.lineTo(offset,h+offset);
    ctx.lineTo(offset, offset);
    ctx.moveTo(offset+(iteracion.intervalo*(nat.length-1)),canvas.height-offset-(celula.intervalo*nat[nat.length-1]));
    for (var i = nat.length - 2; i >= 0; i--) {
        ctx.lineTo(offset+(iteracion.intervalo*i),canvas.height-offset-(celula.intervalo*nat[i]));
    }
    ctx.stroke();
    
}

//Para generar el aleatorio un poco mas balanceadamente
function getRandom(caleatoria){
    if(Math.random() < (caleatoria/10)){
        return 0;
    }else{
        return 1;
    }
}

//Funcion para evitar caracteres no numericos
function esNumero(evt)
{
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

//Funciones de la interfaz
var interfaz = {
    
    canvas: document.getElementById("lienzo"),
    canvasg: document.getElementById("grafica"),
    
    label: {
        estado: document.getElementById("estado"),
        cvivo: document.getElementById("labelcvivo"),
        cmuerto: document.getElementById("labelcmuerto"),
        clinea: document.getElementById("labelclinea")
    },
    
    input: {
        tamano: document.getElementById("tamano"),
        filas: document.getElementById("filas"),
        columnas: document.getElementById("columnas"),
        aleatorio: document.getElementById("aleatorio"),
        velocidad: document.getElementById("velocidad"),
        cvivo: document.getElementById("cvivo"),
        cmuerto: document.getElementById("cmuerto"),
        clinea: document.getElementById("clinea")
    },
    
    boton: {
        iterar: document.getElementById("botonIterar"),
        grafica: document.getElementById("botonGrafica"),
        play: document.getElementById("botonPlay"),
        reiniciar: document.getElementById("botonReiniciar"),
        creiniciar: document.getElementById("botonSetCanvas")
    },

    pausa: function(){
        if(controlador.estado == "play"){
            controlador.estado = "pausa";
            this.boton.play.innerHTML = "Play";
            this.boton.play.className = "btn btn-success";
            this.label.estado.innerHTML = "Pausado";
            this.label.estado.className = "label label-danger";
            this.boton.iterar.disabled = "";
            this.boton.grafica.disabled = "";
        }else{
            controlador.estado = "play";
            this.boton.play.innerHTML = "Pausa";
            this.boton.play.className = "btn btn-danger";
            this.label.estado.innerHTML = "Ejecutandose";
            this.label.estado.className = "label label-success";
            this.boton.iterar.disabled = "disabled";
            this.boton.grafica.disabled = "disabled";
        }
    },
    
    iterar: function(){
        controlador.iterar();
    },
    
    reiniciar: function(){
        this.setCanvas();
        this.setCelulas();
        controlador.caleatoria = parseInt(aleatorio.value);
        controlador.reiniciar();
    },
    
    grafica: function(){
        if (controlador.estado == "grafica") {
            controlador.estado = "pausa";
            this.canvasg.style.display = "none";
            this.canvas.style.display = "";
            this.boton.grafica.innerHTML = "Grafica de Evoluci&oacute;n";
            this.boton.play.disabled = "";
            this.boton.iterar.disabled = "";
            this.boton.reiniciar.disabled = "";
            this.boton.creiniciar.disabled = "";
        } else {
            controlador.estado = "grafica";
            this.canvas.style.display = "none";
            this.canvasg.style.display = "";
            this.boton.grafica.innerHTML = "Cerrar Grafica";
            this.boton.play.disabled = "disabled";
            this.boton.iterar.disabled = "disabled";
            this.boton.reiniciar.disabled = "disabled";
            this.boton.creiniciar.disabled = "disabled";
            graficar(controlador.tablero.hnat);
        }
    },
    
    setCanvas: function(){
        this.canvas.width = this.input.tamano.value * this.input.columnas.value;
        this.canvas.height = this.input.tamano.value * this.input.filas.value;
    },
    
    setCelulas: function(){
        controlador.filas = parseInt(this.input.filas.value);
        controlador.columnas = parseInt(this.input.columnas.value);
    },
    
    setVelocidad: function(){
        controlador.stop();
        controlador.ejecutar(parseInt(this.input.velocidad.value));
    },
    
    setColores: function(){
        this.label.cvivo.style.backgroundColor = this.input.cvivo.value;
        controlador.render.vivo = this.input.cvivo.value;
        this.label.cmuerto.style.backgroundColor = this.input.cmuerto.value;
        controlador.render.muerto = this.input.cmuerto.value;
        this.label.clinea.style.backgroundColor = this.input.clinea.value;
        controlador.render.linea = this.input.clinea.value;
        this.canvas.style.borderColor = this.input.clinea.value;
    },
    
    setAdicionales: function(){
        this.setVelocidad();
        this.setColores();
    }

}

var controlador;
window.onload = function(){
    controlador = new Controlador();
    controlador.ejecutar(parseInt(interfaz.input.velocidad.value));
}