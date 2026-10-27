HISTORIAS INTERACTIVAS (libro de decisiones)
Al abrir el libro eliges una de dos historias: «Número desconocido: El enlace» (suspenso, 7 finales) y «Lo que no era suyo» (drama, 2 finales). Cada una guarda por separado su progreso, su marcapáginas y sus finales. Los ajustes de lectura, sonido y música son comunes.

NÚMERO DESCONOCIDO: EL ENLACE
Cuento digital interactivo de suspenso (HTML + CSS + JavaScript, sin dependencias externas)

CÓMO ABRIRLO
1. Descomprime el ZIP completo.
2. Haz doble clic en index.html y ábrelo en un navegador moderno.
3. Si el navegador bloquea recursos locales, ejecuta un servidor local sencillo desde esta carpeta.
No necesita instalación, cuenta ni conexión a internet.

CÓMO SE JUEGA
- Pulsa «Comenzar historia».
- Elige las opciones para cambiar las escenas y los desenlaces.
- «Anterior» vuelve a la escena previa y descarta las decisiones posteriores.
- «Volver a la portada» reinicia el recorrido.
- «Sonido» controla los efectos (pasar página, mensajes, golpes, etc.) y «Música» activa o silencia la música de fondo. Cada escena tiene su propio tema: calma, tensión, oscuridad, tristeza, esperanza o vacío, según lo que ocurre; al cambiar de escena el tema anterior se desvanece y entra el nuevo. Todo se genera localmente mediante Web Audio (sin archivos de audio) y solo suena tras una interacción del usuario.
- «Mostrar todo» permite saltar la aparición progresiva del texto de una escena.

ESTRUCTURA NARRATIVA
Esteban es el protagonista; el lector lo aconseja. Portada -> Primer mensaje -> tres rutas (A responder, B investigar, C llamar a Camila). Las decisiones cambian las escenas siguientes y no todas pasan por la página del enlace. Hay 5 desenlaces: acceso comprometido, una pista suficiente, Esteban no está solo, las luces apagadas (abierto) y cerrar a tiempo (amargo). La última página muestra cuáles has encontrado.

ARCHIVOS
index.html: estructura.
tema.css: capa visual (tipografía, cabecera, decisiones, páginas).
audio.js: motor de sonido (ambiente, páginas, mensajes, decisiones, finales).
styles.css: diseño, libro, responsive y animaciones.
script.js: escenas, ramificaciones, navegación y efectos de audio.
assets/: ilustraciones locales e iconos SVG.
CHANGELOG.txt: cambios realizados en esta versión.
AUDITORIA.txt: problemas detectados, mejoras aplicadas, pruebas y limitaciones conocidas.

PRIVACIDAD Y SEGURIDAD
El proyecto no realiza solicitudes de red, no envía datos y no recoge contraseñas. El formulario representado dentro del cuento es únicamente una composición visual no editable. Los dominios del relato usan .example y no navegan a sitios reales. Los detalles técnicos de seguridad quedan en este archivo, no en carteles dentro de las escenas.


LO QUE NO ERA SUYO
Mateo (19 años, Colombia) debe el arriendo, que vence el viernes, y una noche cubre la tienda de don Elías. El lector lo aconseja. Tres rutas de inicio, el cierre de la tienda y un último dilema llevan a 2 desenlaces. Es un drama de decisiones y consecuencias; no contiene instrucciones para robar. Archivo de la historia: historia-robo.js.
