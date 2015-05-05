var bower = require('bower');

var archivo = 'underscore';

bower.commands
	.install([archivo], { save: true }, { /* custom config */ })
	.on('end', function (installed) {
		console.log("Archivo instalado");
		console.log(installed);
	    console.log(installed[archivo].canonicalDir + "/" + installed[archivo].pkgMeta.main);
	})
	.on('error' , function (err) {
		if (err.code === "ENOTFOUND") {
			console.log("Archivo no encontrado");
		}
	});
