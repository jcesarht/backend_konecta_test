para implementar el backend. Se debe contar con las siguientes herramientas
NODE,
MYSQL,
GITHUB

1.) Enciende servicio mySQL
2.) Crea una base de datos con el nombre "konecta_prueba"
3.) se debe crear dos tablas asi que copia y pega el siguiente código MySQL.

"CREATE TABLE `empleados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_ingreso` datetime NOT NULL DEFAULT current_timestamp(),
  `nombre` varchar(50) DEFAULT NULL,
  `salario` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4;"

"CREATE TABLE `solicitudes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) DEFAULT NULL,
  `descripcion` varchar(50) DEFAULT NULL,
  `resumen` varchar(50) DEFAULT NULL,
  `id_empleado` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `empleado_id_xd` (`id_empleado`),
  CONSTRAINT `empleado_id_xd` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
"
4.) ve al directorio donde descargó el proyecto y abre la terminal de comandos
ejecuta el comando "npm run dev"

Desde este momento ya cuentas con el servicio backend
