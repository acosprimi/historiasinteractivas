/* ==========================================================================
   Número desconocido: el enlace — lógica de la historia
   --------------------------------------------------------------------------
   - Las escenas son datos (ESCENAS). Cada escena es una lista de "pasos".
   - El estado es el CAMINO recorrido (array de ids de escena). Las decisiones
     se deducen del camino, así que volver atrás nunca deja decisiones
     contradictorias: al elegir otra opción el camino se corta y se recalcula.
   - Todo es local: sin red, sin formularios, sin almacenamiento permanente.
   ========================================================================== */
(() => {
  'use strict';

  /* ---------------------------------------------------------------- datos */
  let IMG = {
    portada: ['assets/portada.webp', 'Dibujo a lápiz de un teléfono que brilla sobre una mesilla en una habitación oscura, con una ventana y la luna al fondo.'],
    habitacion: ['assets/habitacion.webp', 'Dibujo a lápiz de Esteban sentado en la cama, de noche, mirando el teléfono que vibra y brilla sobre la mesilla.'],
    cafe: ['assets/fotografia-cafe.webp', 'Fotografía dibujada a mano: Esteban sonríe sentado en la terraza de un café, con una taza humeante sobre la mesa.'],
    foro: ['assets/investigacion-foro.webp', 'Dibujo a lápiz de Esteban, de noche, frente al ordenador, leyendo un foro en una pantalla que brilla en violeta.'],
    pagina: ['assets/pagina-sospechosa.webp', 'Dibujo a lápiz de Esteban con gesto de duda ante una página web sospechosa; una lupa señala la barra de direcciones.'],
    final1: ['assets/final-cuenta-comprometida.webp', 'Dibujo a lápiz: Esteban, asustado, ante un teléfono con un triángulo de alerta, mientras una mano oscura se extiende desde la sombra.'],
    final2: ['assets/final-investigacion.webp', 'Dibujo a lápiz: de día, Esteban toma notas en su escritorio; el teléfono muestra el contacto bloqueado y hay una lupa sobre la mesa.'],
    final3: ['assets/final-ayuda.webp', 'Dibujo a lápiz: Esteban y una persona de confianza, juntos en un sofá, miran un teléfono apoyado entre ambos.'],
    final4: ['assets/final-luces-apagadas.webp', 'Dibujo a lápiz: amanece; Esteban, sentado en la cama, mira el teléfono apagado en la mesilla, del que sale una señal tenue con un signo de interrogación.'],
    final5: ['assets/final-cerrar-a-tiempo.webp', 'Dibujo a lápiz: Esteban respira aliviado ante el portátil con la pestaña cerrada, mientras el teléfono a su lado muestra un aviso de «Visto».'],
  };

  // Datos totalmente ficticios. El dominio .example está reservado y no existe.
  const URL_OFICIAL = 'conexa.example';
  const URL_FALSA = { antes: 'conexa', extra: '-informe-seguro', despues: '.example/entrar' };
  const ENLACE = 'conexa-informe-seguro.example/entrar';

  const ICONO = (id) => `assets/iconos.svg#${id}`;
  let FINALES = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'];
  let FINAL_TITULOS = { f1: 'El precio de la curiosidad', f2: 'No todas las preguntas merecen una respuesta', f3: 'La decisión fue suya', f4: 'Las luces apagadas', f5: 'Cerrar a tiempo', f6: 'Dos mensajes, una sola historia', f7: 'Lo que había a la vista' };

  const msg = (de, texto, extra = {}) => ({ t: 'msg', de, texto, ...extra });
  const narr = (texto, extra = {}) => ({ t: 'narr', texto, ...extra });
  const enlace = (hora) => ({ t: 'msg', de: 'in', tipo: 'enlace', texto: ENLACE, hora });

  /* Cada escena: progreso (0-6), imagen, kicker, título, sello de hora y pasos(ctx). */
  let ESCENAS = {
    portada: { tipo: 'portada', progreso: 0 },

    /* ---------------- ESCENA 1 ---------------- */
    s1: {
      progreso: 1, img: 'habitacion', kicker: 'Escena 1', titulo: 'El primer mensaje', sello: '11:47 p. m.',
      pasos: () => [
        narr('Esteban está en su habitación, a punto de dormir, cuando su teléfono vibra sobre la mesilla. Es un mensaje de un número desconocido. No lo reconoce, y tampoco recuerda haberle dado su contacto a nadie así.'),
        { t: 'telefono' },
        msg('in', 'Hola. Sé quién eres. Necesito hablar contigo.', { hora: '11:47 p. m.', vibra: true }),
        { t: 'pausa', ms: 1500 },
        msg('in', 'No le digas a nadie que te escribí.', { hora: '11:47 p. m.', vibra: true }),
        narr('Esteban se queda mirando la pantalla. No sabe quién hay al otro lado ni por qué quiere hablar con él. Antes de que pueda decidir nada, el teléfono vuelve a iluminarse.'),
        {
          t: 'pregunta', texto: 'Esteban te mira, esperando una señal. ¿Qué le aconsejas?', opciones: [
            { id: 'A', insignia: 'A', icono: 'i-mensaje', estilo: 'a', texto: 'Que responda: «¿Quién eres y qué quieres?»', siguiente: 's2a' },
            { id: 'B', insignia: 'B', icono: 'i-lupa', estilo: 'b', texto: 'Que revise el número y busque información antes de responder', siguiente: 's2b' },
            { id: 'C', insignia: 'C', icono: 'i-ayuda', estilo: 'c', texto: 'Que llame a Camila, su amiga, antes de hacer nada', siguiente: 's2c' },
          ],
        },
      ],
    },

    /* ---------------- RUTA C ---------------- */
    s2c: {
      progreso: 2, img: 'final3', kicker: 'Ruta C · Pedir ayuda', titulo: 'Una llamada a medianoche', sello: '11:55 p. m.',
      pasos: () => [
        narr('Esteban no quiere resolver esto solo. Deja el mensaje sin responder y escribe a Camila, su amiga de toda la vida, la única que sigue despierta a estas horas.'),
        { t: 'telefono', nombre: 'Camila', estado: 'en línea', avatar: 'C' },
        msg('out', 'Perdona la hora. Me escribió un número raro y no sé qué hacer.', { hora: '11:55 p. m.' }),
        msg('in', 'Mándame captura. ¿Te pidió algo?', { hora: '11:55 p. m.', vibra: true }),
        msg('out', 'Todavía no. Pero dice que sabe quién soy.', { hora: '11:56 p. m.' }),
        msg('in', 'No contestes. Voy para allá.', { hora: '11:56 p. m.', vibra: true }),
        narr('Camila vive a dos calles. Mientras Esteban espera, su teléfono vuelve a iluminarse con otro mensaje del desconocido.'),
        { t: 'telefono' },
        msg('in', 'Estás tardando. Ábrelo antes de que alguien más lo vea.', { hora: '11:58 p. m.', vibra: true }),
        enlace('11:58 p. m.'),
        { t: 'pregunta', texto: 'Camila está en camino y el enlace sigue ahí. ¿Qué le aconsejas a Esteban?', opciones: [
          { id: 'C1', insignia: '1', icono: 'i-ayuda', estilo: 'c', texto: 'Que espere a Camila y lo revisen juntos sin abrirlo', siguiente: 'f3' },
          { id: 'C2', insignia: '2', icono: 'i-enlace', estilo: 'a', texto: 'Que lo abra él solo, rápido, antes de que ella llegue', siguiente: 's3' },
          { id: 'C3', insignia: '3', icono: 'i-mensaje', estilo: 'b', texto: 'Que le pregunte a Camila si le suena ese número', siguiente: 's2cc' },
        ] },
      ],
    },


    /* ---------------- HILO DE CAMILA (nuevo) ---------------- */
    s2cc: {
      progreso: 3, img: 'final3', kicker: 'Ruta C · Camila', titulo: 'Lo que Camila no dijo', sello: '12:04 a. m.',
      pasos: () => [
        narr('Esteban le manda el número antes de que ella llegue. La respuesta tarda más de lo normal. Cuando por fin se enciende la pantalla, no es un mensaje: es una llamada que Camila cuelga a medias.'),
        { t: 'telefono', nombre: 'Camila', estado: 'escribiendo…', avatar: 'C' },
        msg('in', 'Ese número me suena. Espérame, no contestes nada.', { hora: '12:02 a. m.', vibra: true }),
        { t: 'pausa', ms: 1200 },
        msg('in', 'Me escribió a mí la semana pasada. No te lo dije.', { hora: '12:03 a. m.', vibra: true }),
        narr('Camila llega con el abrigo mal abrochado. Se sienta, abre su chat y le enseña el mensaje sin mirarlo a los ojos. Es casi igual que el de Esteban: la misma prisa, el mismo «no se lo digas a nadie».'),
        msg('in', 'Me dio vergüenza. Pensé que de verdad sabía algo de mí.', { hora: '12:04 a. m.' }),
        narr('Esteban entiende por qué Camila calló: el desconocido repite el mismo truco con cada persona. Hace sentir que el secreto es de uno solo, y así nadie compara.'),
        { t: 'pregunta', texto: 'Camila está nerviosa y mira el teléfono de Esteban. ¿Qué le aconsejas?', opciones: [
          { id: 'CC1', insignia: '1', icono: 'i-ayuda', estilo: 'c', texto: 'Que le diga que no es culpa suya y reporten los dos mensajes juntos', siguiente: 'f6' },
          { id: 'CC2', insignia: '2', icono: 'i-alerta', estilo: 'd', texto: 'Que acepte guardar el secreto, tal como pide el desconocido', siguiente: 'f4' },
        ] },
      ],
    },

    /* ---------------- EL DESCONOCIDO HABLA (nuevo) ---------------- */
    s3x: {
      progreso: 4, img: 'habitacion', kicker: 'Escena 3 · Desvío', titulo: 'Lo que el desconocido sabe', sello: '12:14 a. m.',
      pasos: (c) => {
        const r = {
          s2a1: ['Tu perfil es público. La foto del café, tu colegio, la hora a la que sales.', 'Esteban recuerda el momento en que vio la fotografía y pensó «¿cómo la consiguió?». Nunca volvió a la publicación: allí estaba la respuesta, a la vista de cualquiera.'],
          s2a2: ['Tu perfil es público. La foto del café, tu colegio, la hora a la que sales.', 'Esteban se había enfadado con el remitente sin preguntarse de dónde salió la foto. Estaba en su perfil, a la vista de cualquiera.'],
          s2b1: ['Ya te dije lo que quería: que entraras. No hay nada más.', 'Esteban recuerda que el remitente esquivó todas sus preguntas. Había notado esa evasiva y la había dejado pasar; era la señal más clara.'],
          s2b2: ['No eres el primero. Cambio el nombre y el mensaje sirve para todos.', 'El foro lo decía con otras palabras: mensajes casi idénticos para personas distintas. Esteban guardó la captura, pero no hizo caso de lo que mostraba.'],
          s2c: ['Tienes una amiga que vive cerca. Sale en tus fotos. Ella no confía en mí, ¿verdad?', 'Camila le había pedido que esperara. Esteban se adelantó, y ahora ve que el desconocido solo habla de lo que cualquiera deduce mirando sus fotos.'],
        }[c.sub] || ['Solo sé lo que tú mismo me enseñas.', 'Esteban comprende que no hay nada oculto detrás de ese número.'];
        return [
          narr('En vez de seguir la corriente, Esteban hace algo distinto: le exige una prueba. Escribe despacio, para que no le tiemble el pulso.'),
          { t: 'telefono' },
          msg('out', 'Si sabes tanto de mí, demuéstralo. Dime algo que solo yo sepa.', { hora: '12:14 a. m.' }),
          { t: 'escribiendo', ms: 2600 },
          msg('in', r[0], { hora: '12:15 a. m.', vibra: true }),
          msg('in', 'Nada de lo que sé me lo contaste en privado. Solo necesitaba que creyeras que sí.', { hora: '12:15 a. m.', vibra: true }),
          narr(r[1]),
          narr('El desconocido nunca tuvo un secreto de Esteban. Tuvo su prisa, su curiosidad y las cosas que él mismo había dejado a la vista.'),
          { t: 'pregunta', texto: 'Esteban ya sabe que el desconocido no tiene nada. ¿Qué le aconsejas?', opciones: [
            { id: 'X1', insignia: '1', icono: 'i-alerta', estilo: 'd', texto: 'Que corte la conversación, bloquee el número y reporte el mensaje', siguiente: 'f7' },
            { id: 'X2', insignia: '2', icono: 'i-ayuda', estilo: 'c', texto: 'Que cuente lo que descubrió a alguien de confianza', siguiente: 'f3' },
          ] },
        ];
      },
    },

    /* ---------------- RUTA A ---------------- */
    s2a: {
      progreso: 2, img: 'cafe', kicker: 'Ruta A · Responder', titulo: 'La fotografía', sello: '11:48 p. m.',
      pasos: () => [
        narr('Esteban decide responder. Escribe con cuidado, borra una palabra, la vuelve a escribir y pulsa enviar.'),
        { t: 'telefono' },
        msg('out', '¿Quién eres y qué quieres?', { hora: '11:48 p. m.' }),
        msg('in', 'Alguien que sabe más de ti de lo que imaginas.', { hora: '11:48 p. m.', vibra: true }),
        msg('in', '', { tipo: 'foto', hora: '11:48 p. m.', vibra: true }),
        narr('Es una foto de Esteban en la terraza de un café. No es privada, pero el desconocido la usa para hacerle creer que sabe de él mucho más de lo que ha compartido.'),
        msg('in', '¿Quieres saber qué más puedo encontrar?', { hora: '11:49 p. m.', vibra: true }),
        enlace('11:49 p. m.'),
        {
          t: 'pregunta', texto: 'Esteban traga saliva. ¿Qué le sugieres ahora?', opciones: [
            { id: 'A1', insignia: 'A1', icono: 'i-mensaje', estilo: 'a', texto: 'Que pregunte cómo consiguió la fotografía', siguiente: 's2a1' },
            { id: 'A2', insignia: 'A2', icono: 'i-alerta', estilo: 'd', texto: 'Que le exija que explique qué quiere de él', siguiente: 's2a2' },
          ],
        },
      ],
    },
    s2a1: {
      progreso: 3, img: 'cafe', kicker: 'Ruta A · Preguntar', titulo: 'Una respuesta amable', sello: '11:50 p. m.',
      pasos: () => [
        narr('Esteban pulsa enviar antes de pensarlo dos veces. Quiere entender cómo llegó esa imagen a manos del desconocido.'),
        { t: 'telefono' },
        msg('out', '¿Cómo conseguiste esa foto?', { hora: '11:50 p. m.' }),
        msg('in', 'La publicaste tú mismo. A veces contamos más de lo que creemos.', { hora: '11:50 p. m.', vibra: true }),
        msg('in', 'Aquí puedes comprobarlo.', { hora: '11:51 p. m.', vibra: true }),
        enlace('11:51 p. m.'),
        narr('La respuesta no explica nada y, sin embargo, tiene sentido: la foto estaba en sus redes. Lo inquietante es que alguien se tomara el trabajo de guardarla.'),
        {
          t: 'pregunta', texto: 'Esteban ya tiene el enlace delante. ¿Qué le aconsejas?', opciones: [
            { id: 'A1a', insignia: '1', icono: 'i-enlace', estilo: 'a', texto: 'Que lo abra para averiguar qué quiere', siguiente: 's3' },
            { id: 'A1b', insignia: '2', icono: 'i-lupa', estilo: 'b', texto: 'Que vuelva a la publicación original y revise la foto sin abrirlo', siguiente: 's2acheck' },
          ],
        },
      ],
    },
    s2a2: {
      progreso: 3, img: 'habitacion', kicker: 'Ruta A · Exigir', titulo: 'Un silencio con prisa', sello: '11:50 p. m.',
      pasos: () => [
        narr('A Esteban le molesta sentirse observado. Escribe rápido, sin suavizar nada.'),
        { t: 'telefono' },
        msg('out', 'Deja de enviarme cosas. ¿Qué quieres de mí?', { hora: '11:50 p. m.' }),
        msg('in', 'Solo quiero que veas algo. Después entenderás.', { hora: '11:50 p. m.', vibra: true }),
        enlace('11:51 p. m.'),
        { t: 'escribiendo', ms: 2400 },
        narr('Esteban espera otra respuesta. El indicador de escritura aparece, desaparece y vuelve a aparecer. Después, nada: el desconocido deja de responder y solo queda el enlace brillando en la pantalla.'),
        {
          t: 'pregunta', texto: 'El enlace sigue ahí. ¿Qué le recomiendas a Esteban?', opciones: [
            { id: 'A2a', insignia: '1', icono: 'i-enlace', estilo: 'a', texto: 'Que lo abra para descubrir qué ocurre', siguiente: 's3' },
            { id: 'A2b', insignia: '2', icono: 'i-ayuda', estilo: 'c', texto: 'Que guarde los mensajes y pida una segunda opinión', siguiente: 'f3' },
            { id: 'A2c', insignia: '3', icono: 'i-alerta', estilo: 'd', texto: 'Que bloquee el número y apague el teléfono', siguiente: 'f4' },
          ],
        },
      ],
    },

    s2acheck: {
      progreso: 3, img: 'cafe', kicker: 'Ruta A · Investigar', titulo: 'La foto no era un secreto', sello: '11:52 p. m.',
      pasos: () => [
        narr('Esteban vuelve a la publicación original en lugar de abrir el enlace. La fotografía sigue en su perfil y recuerda que cualquiera podía verla. El desconocido no necesitaba conocerlo; bastaba con revisar lo que él mismo había compartido.'),
        narr('Relee el mensaje. El remitente quiere que sienta que sabe mucho de él, pero la única prueba que mostró sale de una publicación pública.'),
        { t: 'pregunta', texto: 'Esteban ya sabe de dónde salió la foto. ¿Qué le aconsejas?', opciones: [
          { id: 'A1c', insignia: '1', icono: 'i-lupa', estilo: 'b', texto: 'Que guarde las pruebas y reporte el mensaje', siguiente: 'f2' },
          { id: 'A1d', insignia: '2', icono: 'i-ayuda', estilo: 'c', texto: 'Que lo comparta con alguien de confianza antes de actuar', siguiente: 'f3' },
        ] },
      ],
    },

    /* ---------------- RUTA B ---------------- */
    s2b: {
      progreso: 2, img: 'foro', kicker: 'Ruta B · Investigar', titulo: 'Las primeras pistas', sello: '11:58 p. m.',
      pasos: () => [
        narr('Esteban decide no responder todavía. Copia el número y lo busca en internet. Al cabo de unos minutos encuentra un foro donde varias personas hablan de mensajes parecidos.'),
        {
          t: 'foro', posts: [
            { autor: 'Usuario 1', texto: 'Me escribió un número desconocido, me envió información que parecía personal y después me pidió entrar en un enlace.' },
            { autor: 'Usuario 2', texto: 'La página parecía legítima, pero me solicitaba las credenciales de mi cuenta. Preferí no introducirlas.' },
          ],
        },
        narr('Sigue leyendo. No sabe si esas personas recibieron mensajes del mismo remitente, pero el parecido lo preocupa.'),
        narr('El teléfono vuelve a vibrar sobre la mesa.'),
        { t: 'telefono' },
        msg('in', '¿Vas a responder? Aquí está la explicación.', { hora: '12:03 a. m.', vibra: true }),
        enlace('12:03 a. m.'),
        {
          t: 'pregunta', texto: 'Esteban levanta la vista hacia ti. ¿Qué le propones?', opciones: [
            { id: 'B1', insignia: 'B1', icono: 'i-mensaje', estilo: 'a', texto: 'Que responda: «¿Por qué quieres que entre en ese enlace?»', siguiente: 's2b1' },
            { id: 'B2', insignia: 'B2', icono: 'i-lupa', estilo: 'b', texto: 'Que no responda y siga revisando los comentarios del foro', siguiente: 's2b2' },
          ],
        },
      ],
    },
    s2b1: {
      progreso: 3, img: 'habitacion', kicker: 'Ruta B · Preguntar', titulo: 'Una respuesta esquiva', sello: '12:05 a. m.',
      pasos: () => [
        narr('Con el foro todavía abierto, Esteban decide probar con una sola pregunta.'),
        { t: 'telefono' },
        msg('out', '¿Por qué quieres que entre en ese enlace?', { hora: '12:05 a. m.' }),
        msg('in', 'Lo importante es que sepas la verdad.', { hora: '12:05 a. m.', vibra: true }),
        narr('El remitente esquiva lo que Esteban le pregunta y vuelve a insistir en que abra la página.'),
        msg('in', 'Ábrela. Es lo único que te pido.', { hora: '12:06 a. m.', vibra: true }),
        enlace('12:06 a. m.'),
        { t: 'pregunta', texto: 'El remitente insiste, pero no explica nada. ¿Qué le aconsejas a Esteban?', opciones: [
          { id: 'B1a', insignia: '1', icono: 'i-enlace', estilo: 'a', texto: 'Que abra el enlace y lo compruebe', siguiente: 's3' },
          { id: 'B1b', insignia: '2', icono: 'i-lupa', estilo: 'b', texto: 'Que vuelva al foro y mire si otros encontraron la misma página', siguiente: 's2b2' },
          { id: 'B1c', insignia: '3', icono: 'i-alerta', estilo: 'd', texto: 'Que bloquee el número y deje de leer sobre esto por esta noche', siguiente: 'f4' },
        ] },
      ],
    },
    s2b2: {
      progreso: 3, img: 'foro', kicker: 'Ruta B · Seguir leyendo', titulo: 'Esto no parece una coincidencia', sello: '12:08 a. m.',
      pasos: () => [
        narr('Esteban sigue leyendo comentarios y da con el testimonio de otra persona que recibió un mensaje casi idéntico. También le mandaron un enlace para supuestamente comprobar la seguridad de su cuenta.'),
        {
          t: 'foro', posts: [
            { autor: 'Usuario 3', destacado: true, captura: true, texto: 'A mí me llegó un mensaje casi igual. Me mandaron un enlace para «comprobar la seguridad de mi cuenta». No entré.' },
          ],
        },
        { t: 'pensamiento', texto: 'Esto no parece una coincidencia.' },
        narr('Esteban guarda una captura de la publicación. Todavía no sabe quién está detrás de los mensajes, pero ya tiene motivos para desconfiar. El enlace sigue ahí, aunque ahora sabe que otras personas recibieron propuestas parecidas.'),
        { t: 'pregunta', texto: 'Con lo que Esteban ha encontrado, ¿qué le aconsejas?', opciones: [
          { id: 'B2a', insignia: '1', icono: 'i-lupa', estilo: 'b', texto: 'Que compare la dirección y reporte el mensaje sin abrirlo', siguiente: 'f2' },
          { id: 'B2b', insignia: '2', icono: 'i-ayuda', estilo: 'c', texto: 'Que pida ayuda a alguien de confianza', siguiente: 'f3' },
          { id: 'B2c', insignia: '3', icono: 'i-enlace', estilo: 'a', texto: 'Que abra el enlace a pesar de las advertencias', siguiente: 's3' },
        ] },
      ],
    },

    /* ---------------- ESCENA 3 ---------------- */
    s3: {
      progreso: 4, img: 'pagina', kicker: 'Escena 3', titulo: 'La página desconocida',
      sello: (c) => (c.inicio === 'A' ? '11:56 p. m.' : '12:12 a. m.'),
      pasos: (c) => [
        {
          t: 'eco', texto: {
            s2a1: 'A Esteban todavía le suena la frase: «La publicaste tú mismo».',
            s2a2: 'Esteban sigue pensando en cómo el desconocido dejó de responder justo después de enviarle el enlace.',
            s2b1: 'Esteban todavía repasa la respuesta evasiva: «Lo importante es que sepas la verdad».',
            s2b2: 'Esteban todavía tiene presente la captura del foro que acaba de guardar.',
            s2c: 'Esteban todavía oye el último aviso de Camila: «No contestes. Voy para allá».',
          }[c.sub],
        },
        narr('Finalmente, Esteban decide examinar el enlace. La página tarda unos segundos en cargar. Tiene un diseño sencillo y un mensaje destacado.'),
        { t: 'web', modo: 'formulario' },
        c.inicio === 'C' ? narr('Suena el timbre. Camila entra, se asoma por encima del hombro de Esteban y ve la pantalla antes de que él pueda esconderla.') : { t: 'pausa', ms: 0 },
        narr('Se fija en la dirección. No corresponde al dominio oficial de la red social y contiene palabras adicionales que no reconoce.'),
        { t: 'telefono' },
        msg('in', 'Solo tienes que iniciar sesión. Es rápido.', { hora: c.inicio === 'A' ? '11:57 p. m.' : '12:13 a. m.', vibra: true }),
        narr('Esteban siente curiosidad. Quiere saber quién es esa persona, qué información tiene sobre él y por qué lo eligió. Sin embargo, algo en la página no le convence.'),
        {
          t: 'pregunta', texto: c.inicio === 'C' ? 'Camila le sujeta el brazo. Esteban os mira a las dos, a ti y a ella. ¿Qué le aconsejas?' : 'Esteban duda con el dedo sobre la pantalla. ¿Qué le dices?',
          opciones: [
            ...(c.inicio === 'C' ? [] : [{ id: '1', insignia: '1', icono: 'i-enlace', estilo: 'a', texto: 'Que introduzca sus datos para obtener el informe', siguiente: 'f1' }]),
            { id: '2', insignia: c.inicio === 'C' ? '1' : '2', icono: 'i-lupa', estilo: 'b', texto: 'Que investigue la dirección del sitio antes de escribir ningún dato', siguiente: 'f2' },
            ...(c.inicio === 'C' ? [] : [{ id: '3', insignia: '3', icono: 'i-ayuda', estilo: 'c', texto: 'Que pida ayuda a alguien de confianza', siguiente: 'f3' }]),
            { id: '4', insignia: c.inicio === 'C' ? '2' : '4', icono: 'i-alerta', estilo: 'd', texto: 'Que cierre la pestaña ahora mismo y cambie sus contraseñas por si acaso', siguiente: 'f5' },
            { id: '5', insignia: c.inicio === 'C' ? '3' : '5', icono: 'i-mensaje', estilo: 'b', texto: 'Que le escriba al desconocido y le exija una prueba de lo que dice saber', siguiente: 's3x' },
          ],
        },
      ],
    },

    /* ---------------- FINALES ---------------- */
    f1: {
      progreso: 5, final: true, img: 'final1', kicker: 'Desenlace', titulo: 'Acceso comprometido',
      pasos: (c) => [
        narr(c.revisoForo
          ? 'Esteban había leído las advertencias, pero la curiosidad pudo más. Abre la página de todas formas. Durante unos segundos parece normal; después, algo cambia.'
          : c.inicio === 'A'
            ? 'La fotografía lo dejó inquieto y quiere saber qué más puede encontrar el desconocido. Pulsa continuar. La página parece normal, hasta que algo cambia.'
            : 'Esteban pulsa continuar. La página parece normal y muestra un indicador de carga. Durante unos segundos no ocurre nada. Entonces aparece una notificación que le corta la respiración.'),
        { t: 'web', modo: 'carga' },
        { t: 'telefono', nombre: 'Aviso de seguridad', estado: 'ahora', avatar: '!' },
        msg('in', 'Se ha detectado un inicio de sesión desde un dispositivo desconocido.', { tipo: 'alerta', hora: '12:15 a. m.', vibra: true }),
        narr('Esteban intenta volver a entrar en su cuenta, pero la página lo devuelve al inicio. Comprende que el enlace no le ofrecía el informe que prometía: pudo haber servido para conseguir sus credenciales.'),
        { t: 'telefono' },
        msg('in', 'Gracias por confiar.', { hora: '12:16 a. m.', vibra: true }),
        { t: 'pausa', ms: 900 },
        msg('out', '¿Quién eres?', { fallido: true }),
        msg('in', 'Este número ya no está disponible.', { tipo: 'sistema' }),
        narr('Esteban quería descubrir un secreto y terminó compartiendo información que debía proteger. La pantalla se oscurece.'),
        { t: 'tituloFinal', texto: 'Final 1: El precio de la curiosidad' },
        { t: 'continuar', texto: 'Cerrar el libro', siguiente: 'cierre' },
      ],
    },
    f2: {
      progreso: 5, final: true, img: 'final2', kicker: 'Desenlace', titulo: 'Una pista suficiente',
      pasos: (c) => [
        narr(c.evitoEnlace
          ? (c.revisoPublicacion
              ? 'Esteban decide no abrir el enlace. Vuelve a la publicación original y comprueba que la fotografía era pública. No necesita entrar en la página para reconocer que el remitente intenta presionarlo.'
              : 'Esteban decide no abrir el enlace. Las advertencias que encontró lo llevan a investigar la dirección por separado, sin entrar en la página que le enviaron.')
          : 'Esteban decide no introducir sus datos. Copia la dirección y busca información sobre el dominio. Encuentra señales de una página que imita un servicio conocido para conseguir contraseñas.'),
        { t: 'comparar' },
        narr(`${c.inicio === 'A' ? 'La fotografía' : c.inicio === 'C' ? 'La hora del mensaje' : 'Los testimonios del foro'}, la insistencia y la dirección extraña empiezan a encajar. El desconocido pudo usar información pública para despertar su curiosidad y convencerlo de confiar en una página falsa.`),
        { t: 'lista', items: ['Guarda las capturas', 'Reporta el mensaje', 'Revisa la seguridad de sus cuentas'] },
        { t: 'telefono' },
        msg('in', 'Pensé que entrarías.', { hora: '12:24 a. m.', vibra: true }),
        narr('Esteban no responde. Esta vez, el desconocido no consigue lo que buscaba. Nunca sabrá quién era, pero ya no necesita saberlo para decidir qué hacer.'),
        { t: 'tituloFinal', texto: 'Final 2: No todas las preguntas merecen una respuesta' },
        { t: 'continuar', texto: 'Cerrar el libro', siguiente: 'cierre' },
      ],
    },
    f3: {
      progreso: 5, final: true, img: 'final3', kicker: 'Desenlace', titulo: 'Esteban no está solo',
      pasos: (c) => c.inicio === 'C' ? [
        narr('Camila llega con el abrigo mal abrochado y no hace preguntas todavía. Se sienta junto a Esteban en el sofá y deja el teléfono entre los dos.'),
        { t: 'telefono', nombre: 'Camila', estado: 'a tu lado', avatar: 'C' },
        msg('in', 'Mira la dirección: no es la oficial. Esto está hecho para que te pique la curiosidad.', { hora: '12:09 a. m.', vibra: true }),
        narr('Revisan los mensajes uno por uno. Ninguno prueba que el desconocido sepa algo de verdad; solo insiste, y la prisa es parte del truco.'),
        narr('Entre los dos guardan las capturas, reportan el número y repasan la seguridad de las cuentas de Esteban.'),
        { t: 'telefono' },
        msg('in', '¿Ya no vas a contestar?', { hora: '12:26 a. m.', vibra: true }),
        narr('Esteban lo mira, respira hondo y bloquea el contacto. Camila le aprieta el hombro. La identidad del remitente sigue siendo un misterio, pero ya no pesa igual.'),
        msg('in', 'Contacto bloqueado', { tipo: 'sistema' }),
        { t: 'tituloFinal', texto: 'Final 3: La decisión fue suya' },
        { t: 'continuar', texto: 'Cerrar el libro', siguiente: 'cierre' },
      ] : [
        narr('Esteban envía una captura a una persona de confianza y le explica lo ocurrido.'),
        { t: 'telefono', nombre: 'Persona de confianza', estado: 'en línea', avatar: 'C' },
        msg('out', 'Captura de pantalla enviada', { tipo: 'captura', hora: '12:18 a. m.' }),
        msg('out', 'Mira lo que me llegó. ¿Tú qué piensas?', { hora: '12:18 a. m.' }),
        msg('in', 'No introduzcas tus datos. La dirección es extraña y el mensaje parece diseñado para despertar tu curiosidad.', { hora: '12:19 a. m.', vibra: true }),
        narr(c.inicio === 'A'
          ? 'Al revisar la fotografía, Esteban recuerda que la había publicado en sus redes días atrás. Quizá el desconocido la encontró allí y la usó para hacerle creer que lo conocía personalmente.'
          : c.revisoForo
            ? 'Al volver a leer los testimonios, Esteban cae en la cuenta de que nadie pudo confirmar quién estaba detrás de aquellos mensajes. El remitente tampoco ha demostrado conocerlo: quizá solo usa frases ambiguas para asustarlo.'
            : 'Esteban recuerda que el remitente esquivó todas sus preguntas y se limitó a insistir en el enlace. No ha visto pruebas de que lo conozca; solo quiere que actúe deprisa.'),
        narr('Decide no entrar en la página, guardar las pruebas, reportar el mensaje y revisar la seguridad de sus cuentas.'),
        { t: 'telefono' },
        msg('in', '¿Ya no vas a contestar?', { hora: '12:26 a. m.', vibra: true }),
        narr('Esteban mira el mensaje, respira hondo y bloquea el contacto. La identidad del remitente sigue siendo un misterio, pero ya no siente que tenga que resolverlo solo.'),
        msg('in', 'Contacto bloqueado', { tipo: 'sistema' }),
        { t: 'tituloFinal', texto: 'Final 3: La decisión fue suya' },
        { t: 'continuar', texto: 'Cerrar el libro', siguiente: 'cierre' },
      ],
    },

    f4: {
      progreso: 5, final: true, img: 'final4', kicker: 'Desenlace', titulo: 'Las luces apagadas',
      pasos: (c) => [
        narr(c.sub === 's2cc'
          ? 'Esteban le dice a Camila que no pasa nada, que lo dejen estar y que no se lo cuenten a nadie. Los dos apagan el teléfono. Camila sonríe sin ganas y se va a casa.'
          : c.inicio === 'A'
          ? 'Esteban ya ha visto suficiente. Bloquea el número, apaga el teléfono y lo deja boca abajo en la mesilla. Sin enlace, sin respuesta, sin saber.'
          : 'Esteban cierra el foro, bloquea el número y deja de buscar por esta noche. Algunas preguntas pueden esperar a que sea de día.'),
        narr('Durante un rato mira el techo. La habitación está en silencio. Demasiado.'),
        { t: 'pausa', ms: 1200 },
        narr('Por la mañana enciende el teléfono. Hay un mensaje nuevo, de otro número.'),
        { t: 'telefono' },
        msg('in', 'No importa cuántos números bloquees. Sigo aquí.', { hora: '7:02 a. m.', vibra: true }),
        narr('Esteban no sabe si es el mismo desconocido, una broma o un intento más de asustarlo. No lo abre, no responde. Pero tampoco sabe todavía cómo termina esto.'),
        { t: 'tituloFinal', texto: 'Final 4: Las luces apagadas' },
        { t: 'continuar', texto: 'Cerrar el libro', siguiente: 'cierre' },
      ],
    },
    f5: {
      progreso: 5, final: true, img: 'final5', kicker: 'Desenlace', titulo: 'Cerrar a tiempo',
      pasos: (c) => [
        narr(c.inicio === 'C'
          ? 'Camila no necesita leer la página entera. «Ciérrala. Ya», dice. Esteban cierra la pestaña antes de escribir una sola letra.'
          : 'Esteban cierra la pestaña antes de escribir nada. El corazón le late fuerte, pero no ha dado ningún dato.'),
        { t: 'telefono' },
        msg('in', 'Gracias por pasar por aquí.', { hora: '12:20 a. m.', vibra: true }),
        narr('Eso es lo que más lo inquieta: ahora el desconocido sabe que alguien abrió el enlace y que hay alguien al otro lado.'),
        { t: 'lista', items: ['Cambia sus contraseñas', 'Activa la verificación en dos pasos', 'Cierra las sesiones abiertas'] },
        msg('in', 'Sé que estás ahí.', { hora: '12:31 a. m.', vibra: true }),
        narr('Esteban bloquea el contacto. No ha pasado nada grave, pero tampoco tiene la tranquilidad de quien ignoró el enlace desde el principio. Abrirlo le costó una noche en vela.'),
        { t: 'tituloFinal', texto: 'Final 5: Cerrar a tiempo' },
        { t: 'continuar', texto: 'Cerrar el libro', siguiente: 'cierre' },
      ],
    },


    f6: {
      progreso: 5, final: true, img: 'final3', kicker: 'Desenlace', titulo: 'Camila también',
      pasos: () => [
        narr('Esteban no abre el enlace. Pone los dos teléfonos sobre la mesa, uno junto al otro, y por primera vez ven la misma frase escrita dos veces.'),
        narr('No hace falta ser experto para notarlo: el mismo texto, la misma prisa, el mismo enlace. Eso no es un secreto; es una plantilla.'),
        { t: 'lista', items: ['Guardan las capturas de los dos chats', 'Reportan el número desde ambos teléfonos', 'Avisan a otros amigos para que no abran el enlace'] },
        { t: 'telefono', nombre: 'Camila', estado: 'a tu lado', avatar: 'C' },
        msg('in', 'Gracias por no dejarme callar. Pensé que era la única.', { hora: '12:31 a. m.', vibra: true }),
        narr('Cuando Esteban bloquea el contacto, el silencio de la habitación ya no es el mismo. El desconocido sigue sin rostro. Pero esta noche dejó de tener a alguien a solas.'),
        { t: 'tituloFinal', texto: 'Final 6: Dos mensajes, una sola historia' },
        { t: 'continuar', texto: 'Cerrar el libro', siguiente: 'cierre' },
      ],
    },
    f7: {
      progreso: 5, final: true, img: 'final2', kicker: 'Desenlace', titulo: 'Lo que había a la vista',
      pasos: (c) => [
        narr('Esteban bloquea el número sin esperar otra respuesta. Antes de reportarlo, relee la conversación completa y se da cuenta de algo incómodo: todas las pruebas del desconocido estaban fuera del teléfono.'),
        { t: 'lista', items: [
          c.inicio === 'A' ? 'La foto salió de su propio perfil público' : c.inicio === 'C' ? 'Camila aparecía en sus fotos, a la vista de todos' : 'El mismo mensaje había llegado a otras personas',
          'Ningún dato era privado',
          'Solo la prisa funcionaba como arma',
        ] },
        narr('Esteban cambia la privacidad de sus redes, revisa qué fotos se pueden ver y guarda las capturas para el reporte.'),
        { t: 'telefono' },
        msg('in', 'Este número ya no está disponible.', { tipo: 'sistema' }),
        narr('No gana la partida por saber más que el desconocido, sino por haber entendido que nunca hubo nada que ganar. A veces la mejor respuesta es notar lo que se ignoró a tiempo.'),
        { t: 'tituloFinal', texto: 'Final 7: Lo que había a la vista' },
        { t: 'continuar', texto: 'Cerrar el libro', siguiente: 'cierre' },
      ],
    },

    /* ---------------- CIERRE ---------------- */
    cierre: { tipo: 'cierre', progreso: 6, img: 'portada', kicker: 'Última página', titulo: 'Fin' },
  };

  let NOMBRES_PROGRESO = ['Portada', 'Primer mensaje', 'Decisión', 'Consecuencia', 'El enlace', 'Desenlace', 'Cierre'];

  /* --------------------------------------------------------------- estado */
  let camino = ['portada'];          // fuente de verdad
  let enMenu = false;                // true mientras se muestra el menú de historias
  let META = null;                   // textos de la historia activa
  const finalesVistos = new Set();   // se guarda en el navegador (localStorage)

  /* ---------- Guardado automático ---------- */
  let CLAVE = 'numero-desconocido:v2';
  let guardado = null;               // { camino, finales, sonido, musica, marca }
  let marca = null;                  // marcapáginas: un camino completo
  const leerGuardado = () => {
    try {
      const d = JSON.parse(localStorage.getItem(CLAVE) || 'null');
      if (!d || typeof d !== 'object') return null;
      const camino = Array.isArray(d.camino) ? d.camino.filter((x) => typeof x === 'string') : [];
      const valido = camino.length > 1 && camino[0] === 'portada' && camino.every((x) => ESCENAS[x]) ? camino : null;
      const mc = Array.isArray(d.marca) ? d.marca.filter((x) => typeof x === 'string') : [];
      const marcaOk = mc.length > 1 && mc[0] === 'portada' && mc.every((x) => ESCENAS[x]) ? mc : null;
      return { marca: marcaOk, camino: valido, finales: (Array.isArray(d.finales) ? d.finales : []).filter((x) => FINALES.includes(x)), sonido: d.sonido !== false, musica: d.musica !== false };
    } catch (e) { return null; }
  };
  function guardar() {
    try {
      const previo = leerGuardado() || {};
      const d = {
        camino: camino.length > 1 ? camino : (previo.camino || null),   // en la portada se conserva la lectura en curso
        finales: [...finalesVistos],
        marca,
        sonido: btnSonido.getAttribute('aria-pressed') !== 'false',
        musica: (document.getElementById('btn-musica') || { getAttribute: () => 'true' }).getAttribute('aria-pressed') !== 'false',
        t: Date.now(),
      };
      localStorage.setItem(CLAVE, JSON.stringify(d));
      guardado = leerGuardado();
    } catch (e) { /* sin almacenamiento: el libro funciona igual */ }
  }
  function borrarProgreso() {
    try { localStorage.removeItem(CLAVE); } catch (e) { /* nada */ }
    finalesVistos.clear(); guardado = null; marca = null; camino = ['portada'];
    mostrar('portada', 'atras');
  }
  let paginaActual = null;           // { el, id, cancelar() }
  let bloqueoOpcion = false;
  let temporizadorLibro = null;
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)');

  const $ = (s, r = document) => r.querySelector(s);
  const contPaginas = $('#paginas');
  const libro = $('#libro');
  const velo = $('#velo');
  const btnAtras = $('#btn-atras');
  const btnReiniciar = $('#btn-reiniciar');
  const btnSonido = $('#btn-sonido');
  const anuncios = $('#anuncios');

  /* Efectos de sonido sintetizados localmente: no hay archivos de audio externos. */
  let sonidoActivado = true;
  let audioContexto = null;
  function prepararAudio() {
    if (!sonidoActivado) return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioContexto) audioContexto = new AudioCtx();
    if (audioContexto.state === 'suspended') audioContexto.resume().catch(() => {});
    return audioContexto;
  }
  function sonidoPagina() {
    if (window.SND) { SND.pagina(); return; }
    const ctx = prepararAudio();
    if (!ctx) return;
    const ahora = ctx.currentTime;
    const duracion = 0.22;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duracion), ctx.sampleRate);
    const datos = buffer.getChannelData(0);
    for (let i = 0; i < datos.length; i++) datos[i] = (Math.random() * 2 - 1) * (1 - i / datos.length);
    const ruido = ctx.createBufferSource();
    ruido.buffer = buffer;
    const filtro = ctx.createBiquadFilter();
    filtro.type = 'bandpass'; filtro.frequency.setValueAtTime(1150, ahora); filtro.Q.value = 0.55;
    const ganancia = ctx.createGain();
    ganancia.gain.setValueAtTime(0.0001, ahora);
    ganancia.gain.exponentialRampToValueAtTime(0.045, ahora + 0.035);
    ganancia.gain.exponentialRampToValueAtTime(0.0001, ahora + duracion);
    ruido.connect(filtro); filtro.connect(ganancia); ganancia.connect(ctx.destination);
    ruido.start(ahora); ruido.stop(ahora + duracion);
    const tono = ctx.createOscillator();
    const tonoG = ctx.createGain();
    tono.type = 'triangle'; tono.frequency.setValueAtTime(115, ahora); tono.frequency.exponentialRampToValueAtTime(76, ahora + 0.16);
    tonoG.gain.setValueAtTime(0.0001, ahora); tonoG.gain.exponentialRampToValueAtTime(0.025, ahora + 0.018); tonoG.gain.exponentialRampToValueAtTime(0.0001, ahora + 0.17);
    tono.connect(tonoG); tonoG.connect(ctx.destination); tono.start(ahora); tono.stop(ahora + 0.18);
  }
  function sonidoSuspenso() {
    if (window.SND) { SND.suspenso(); return; }
    const ctx = prepararAudio();
    if (!ctx) return;
    const ahora = ctx.currentTime;
    [[196, 0.07], [202, 0.045], [98, 0.035]].forEach(([frecuencia, volumen], i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i === 2 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(frecuencia, ahora);
      osc.frequency.exponentialRampToValueAtTime(frecuencia * (i === 2 ? 0.86 : 0.94), ahora + 1.15);
      gain.gain.setValueAtTime(0.0001, ahora);
      gain.gain.exponentialRampToValueAtTime(volumen, ahora + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, ahora + 1.25);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ahora); osc.stop(ahora + 1.28);
    });
  }
  function actualizarControlSonido() {
    btnSonido.setAttribute('aria-pressed', String(sonidoActivado));
    btnSonido.setAttribute('aria-label', sonidoActivado ? 'Desactivar efectos de sonido' : 'Activar efectos de sonido');
    btnSonido.title = sonidoActivado ? 'Efectos de sonido activados' : 'Efectos de sonido desactivados';
    const icon = $('img', btnSonido);
    if (icon) icon.src = ICONO(sonidoActivado ? 'i-sonido' : 'i-silencio');
    const texto = $('span', btnSonido);
    if (texto) texto.textContent = sonidoActivado ? 'Sonido' : 'Silencio';
  }
  document.addEventListener('pointerdown', () => { if (sonidoActivado) prepararAudio(); }, { once: true });
  btnSonido.addEventListener('click', () => {
    sonidoActivado = !sonidoActivado;
    actualizarControlSonido();
    if (sonidoActivado) { prepararAudio(); sonidoPagina(); }
  });
  actualizarControlSonido();

  const contexto = () => (META.contexto ? META.contexto(camino) : contextoNumero());
  const contextoNumero = () => ({
    inicio: camino.includes('s2a') || camino.includes('s2acheck') ? 'A' : camino.includes('s2b') ? 'B' : camino.includes('s2c') ? 'C' : null,
    sub: ['s2cc', 's2a1', 's2a2', 's2b1', 's2b2', 's2acheck', 's2c'].find((x) => camino.includes(x)) || null,
    revisoForo: camino.includes('s2b2'),
    evitoEnlace: !camino.includes('s3'),
    revisoPublicacion: camino.includes('s2acheck'),
  });

  function el(tag, props = {}, hijos = []) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === 'class') e.className = v;
      else if (k === 'texto') e.textContent = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('data-') || k.startsWith('aria-') || k === 'role' || k === 'type' || k === 'src' || k === 'alt' || k === 'width' || k === 'height' || k === 'tabindex' || k === 'datetime') e.setAttribute(k, v);
      else e[k] = v;
    }
    for (const h of [].concat(hijos)) if (h) e.append(h);
    return e;
  }
  const icono = (id, cls = 'icono', tam = 26) => el('img', { class: cls, src: ICONO(id), alt: '', width: String(tam), height: String(tam) });

  /* ----------------------------------------------------- progreso y barra */
  function actualizarBarra() {
    if (enMenu) {
      $('#progreso').setAttribute('aria-valuenow', '0'); $('#progreso').setAttribute('aria-valuetext', 'Menú de historias');
      $('#progreso-texto').textContent = 'Elige una historia';
      document.querySelectorAll('#progreso-puntos li').forEach((li) => li.classList.remove('hecho', 'actual'));
      btnAtras.disabled = true; btnReiniciar.disabled = true; btnIndice.disabled = true; return;
    }
    btnIndice.disabled = false;
    const id = camino[camino.length - 1];
    const p = ESCENAS[id].progreso;
    $('#progreso').setAttribute('aria-valuenow', String(p));
    $('#progreso').setAttribute('aria-valuetext', NOMBRES_PROGRESO[p]);
    $('#progreso-texto').textContent = NOMBRES_PROGRESO[p];
    document.querySelectorAll('#progreso-puntos li').forEach((li, i) => {
      li.classList.toggle('hecho', i < p);
      li.classList.toggle('actual', i === p - 1);
    });
    btnAtras.disabled = camino.length <= 1;
    btnReiniciar.disabled = id === 'portada';
  }

  /* --------------------------------------------------- construir páginas */
  function construirPortada() {
    const [src, alt] = IMG.portada;
    const btn = el('button', { type: 'button', class: 'btn-principal', texto: 'Comenzar historia' });
    btn.addEventListener('click', () => { camino = ['portada']; avanzar(META.inicio || 's1'); });
    const extra = [];
    if (guardado && guardado.camino) {
      const cont = el('button', { type: 'button', class: 'btn-principal btn-continuar', texto: 'Continuar donde lo dejaste' });
      cont.addEventListener('click', () => {
        camino = [...guardado.camino];
        mostrar(camino[camino.length - 1], 'adelante', true);
        guardar();
      });
      extra.push(cont);
    }
    const nf = finalesVistos.size;
    if (nf > 0 || (guardado && guardado.camino)) {
      const borrar = el('button', { type: 'button', class: 'enlace-borrar', texto: 'Borrar progreso' });
      borrar.addEventListener('click', () => { if (window.confirm('¿Borrar los finales encontrados y la página en la que ibas?')) borrarProgreso(); });
      extra.push(el('p', { class: 'cubierta-progreso' }, [document.createTextNode(`Finales encontrados: ${nf} de ${FINALES.length}  ·  `), borrar]));
    }
    const otra = el('button', { type: 'button', class: 'enlace-borrar', texto: '← Elegir otra historia' });
    otra.addEventListener('click', () => mostrarMenu());
    extra.push(el('p', { class: 'cubierta-progreso' }, [otra]));
    const raiz = el('section', { class: 'pagina pagina--cubierta', 'aria-label': 'Portada' }, [
      el('img', { class: 'cubierta-img', src, alt }),
      el('div', { class: 'cubierta-vel' }), el('div', { class: 'cubierta-marco' }),
      el('div', { class: 'cubierta-cont' }, [
        el('div', {}, [
          el('h1', { class: 'cubierta-titulo', tabindex: '-1' }, [document.createTextNode(META.titulo), el('span', { class: 'cubierta-sub', texto: META.sub })]),
          el('p', { class: 'cubierta-tag', texto: META.tag }),
        ]),
        el('div', {}, [
          el('p', { class: 'cubierta-texto', texto: META.texto }),
          el('div', { class: 'cubierta-botones' }, [...(guardado && guardado.camino ? extra.slice(0, 1) : []), btn]),
          ...extra.slice(guardado && guardado.camino ? 1 : 0),
        ]),
      ]),
    ]);
    return { el: raiz, foco: $('.cubierta-titulo', raiz), cancelar() {}, boton: btn };
  }

  function construirCierre() {
    const [src, alt] = IMG.portada;
    const vistos = finalesVistos.size;
    const b1 = el('button', { type: 'button', class: 'btn-secundario es-principal' }, [icono('i-reiniciar', 'icono', 24), el('span', { texto: 'Volver a leer la historia' })]);
    const b2 = el('button', { type: 'button', class: 'btn-secundario' }, [icono('i-lupa', 'icono', 24), el('span', { texto: 'Explorar otro desenlace' })]);
    b1.addEventListener('click', () => reiniciar(true));
    b2.addEventListener('click', () => reiniciar(false));
    const b3 = el('button', { type: 'button', class: 'btn-secundario' }, [icono('i-indice', 'icono', 24), el('span', { texto: 'Elegir otra historia' })]);
    b3.addEventListener('click', () => mostrarMenu());
    const titulo = el('h1', { class: 'titulo-escena', tabindex: '-1', texto: 'Fin' });
    const raiz = el('section', { class: 'pagina', 'data-escena': 'cierre', 'aria-label': 'Última página' }, [
      el('div', { class: 'hoja-izq' }, [el('figure', { class: 'ilustracion' }, [el('img', { src, alt })])]),
      el('div', { class: 'hoja-der' }, [el('div', { class: 'contenido' }, [
        el('p', { class: 'kicker', texto: 'Última página' }), titulo,
        el('p', { class: 'cierre-texto', texto: META.cierre }),
        el('p', { class: 'cierre-cuenta', texto: `Desenlaces encontrados: ${vistos} de ${FINALES.length}.` }),
        el('ul', { class: 'lista-finales' }, FINALES.map((id) => el('li', { class: finalesVistos.has(id) ? 'visto' : '', texto: finalesVistos.has(id) ? FINAL_TITULOS[id] : '· · ·' }))),
        el('div', { class: 'opciones visible', role: 'group', 'aria-label': 'Qué quieres hacer ahora' }, [b1, b2, b3]),
      ])]),
    ]);
    return { el: raiz, foco: titulo, cancelar() {} };
  }

  function construirEscena(id) {
    const esc = ESCENAS[id];
    const ctx = contexto();
    const [src, alt] = IMG[esc.img];
    const sello = typeof esc.sello === 'function' ? esc.sello(ctx) : esc.sello;
    const contenido = el('div', { class: 'contenido' });
    const titulo = el('h1', { class: 'titulo-escena', tabindex: '-1', texto: esc.titulo });
    contenido.append(el('p', { class: 'kicker', texto: esc.kicker }), titulo);
    const btnSaltar = el('button', { type: 'button', class: 'saltar', texto: 'Mostrar todo el texto', 'aria-label': 'Mostrar todo el texto de esta página de inmediato' });
    const figure = el('figure', { class: 'ilustracion' }, [el('img', { src, alt }), sello ? el('span', { class: 'sello-hora', texto: sello }) : null]);
    const raiz = el('section', { class: 'pagina', 'data-escena': id, 'aria-label': `${esc.kicker}: ${esc.titulo}` }, [
      el('div', { class: 'hoja-izq' }, [figure]),
      el('div', { class: 'hoja-der' }, [contenido]),
      btnSaltar,
    ]);
    return { el: raiz, foco: titulo, contenido, btnSaltar, pasos: esc.pasos(ctx), esc, id };
  }

  /* ------------------------------------------------- ejecutor de los pasos */
  function crearEjecutor(p, instantaneo) {
    let saltar = !!instantaneo;
    let vivo = true;
    const esperas = new Set();
    const factor = reducido.matches ? 0.35 : 1;
    const esperar = (ms) => new Promise((res) => {
      if (saltar || !vivo) return res();
      const f = () => { clearTimeout(t); esperas.delete(f); res(); };
      const t = setTimeout(f, ms * factor);
      esperas.add(f);
    });
    p.cancelar = () => { vivo = false; esperas.forEach((f) => f()); };
    p.btnSaltar.addEventListener('click', () => { saltar = true; esperas.forEach((f) => f()); p.btnSaltar.hidden = true; });
    return { esperar, vivo: () => vivo, saltando: () => saltar };
  }

  const ver = (nodo) => nodo.scrollIntoView({ block: 'nearest', behavior: reducido.matches ? 'auto' : 'smooth' });

  async function ejecutar(p, instantaneo) {
    const ex = crearEjecutor(p, instantaneo);
    const cont = p.contenido;
    let tel = null;   // { raiz, pantalla }
    let foro = null;
    const horaPorDefecto = '';

    const agregar = (nodo, entra = true) => { if (entra) nodo.classList.add('bloque', 'entra'); cont.append(nodo); ver(nodo); return nodo; };

    for (const paso of p.pasos) {
      if (!ex.vivo()) return;
      switch (paso.t) {
        case 'narr': {
          const parr = el('p', { class: 'p-oculto', texto: paso.texto });
          agregar(el('div', { class: 'narr' }, [parr]), false);
          requestAnimationFrame(() => requestAnimationFrame(() => { parr.className = 'p-visible'; }));
          await ex.esperar(Math.min(1900, 500 + paso.texto.length * 8));
          break;
        }
        case 'eco': {
          if (!paso.texto) break;
          agregar(el('p', { class: 'narr eco', texto: paso.texto }));
          await ex.esperar(900);
          break;
        }
        case 'pensamiento': {
          agregar(el('p', { class: 'pensamiento', texto: paso.texto }));
          await ex.esperar(1100);
          break;
        }
        case 'pausa': await ex.esperar(paso.ms); break;
        case 'telefono': {
          tel = crearTelefono(paso);
          agregar(tel.raiz);
          await ex.esperar(650);
          break;
        }
        case 'escribiendo': {
          const t = burbujaEscribiendo();
          tel.pantalla.append(t); tel.pantalla.scrollTop = tel.pantalla.scrollHeight;
          if (window.SND && !ex.saltando()) SND.teclas(paso.ms);
          await ex.esperar(paso.ms);
          t.remove();
          break;
        }
        case 'msg': {
          if (!tel) tel = (() => { const t = crearTelefono({}); agregar(t.raiz); return t; })();
          if (paso.de === 'in' && paso.tipo !== 'sistema' && !ex.saltando()) {
            const t = burbujaEscribiendo();
            tel.pantalla.append(t); tel.pantalla.scrollTop = tel.pantalla.scrollHeight;
            if (window.SND && paso.tipo !== 'foto') SND.teclas(700 + Math.min(900, paso.texto.length * 12));
            await ex.esperar(paso.tipo === 'foto' ? 900 : 700 + Math.min(900, paso.texto.length * 12));
            t.remove();
            if (!ex.vivo()) return;
          } else if (paso.de === 'out' && !ex.saltando()) {
            await ex.esperar(450);
          }
          if (paso.tipo === 'foto') sonidoSuspenso();
          anadirMensaje(tel, paso);
          await ex.esperar(550);
          break;
        }
        case 'foro': {
          if (!foro) foro = crearForo();
          if (!foro.raiz.isConnected) agregar(foro.raiz);
          for (const post of paso.posts) {
            foro.raiz.append(crearPost(post));
            if (window.SND && !ex.saltando()) SND.foro();
            ver(foro.raiz.lastElementChild);
            await ex.esperar(1100);
          }
          foro = null;
          break;
        }
        case 'web': { if (window.SND && !ex.saltando()) SND.web(); agregar(crearWeb(paso.modo)); await ex.esperar(900); break; }
        case 'comparar': { if (window.SND && !ex.saltando()) SND.comparar(); agregar(crearComparar()); await ex.esperar(1000); break; }
        case 'lista': {
          const ul = el('ul', { class: 'lista-acciones' }, paso.items.map((t) => el('li', {}, [icono('i-enlace', 'icono', 22), el('span', { texto: t })])));
          // icono distinto: marca de verificación dibujada con CSS (::before) en lugar de un icono de enlace
          ul.querySelectorAll('img').forEach((i) => i.remove());
          agregar(ul);
          await ex.esperar(800);
          break;
        }
        case 'tituloFinal': {
          finalesVistos.add(p.id); guardar();
          if (window.SND && !ex.saltando()) { SND.final(); SND.finalDe(p.id); }
          agregar(el('h2', { class: 'titulo-final', tabindex: '-1', texto: paso.texto }));
          await ex.esperar(700);
          break;
        }
        case 'continuar': {
          const b = el('button', { type: 'button', class: 'btn-secundario es-principal' }, [el('span', { texto: paso.texto }), icono('i-atras', 'icono giro', 24)]);
          b.addEventListener('click', () => avanzar(paso.siguiente));
          agregar(el('div', { class: 'opciones visible', role: 'group', 'aria-label': 'Continuar' }, [b]));
          break;
        }
        case 'pregunta': { agregar(crearPregunta(paso, p)); break; }
        default: break;
      }
    }
    p.btnSaltar.hidden = true;
  }

  /* -------------------------------------------------------- componentes UI */
  function crearTelefono({ nombre = 'Número desconocido', estado = 'mensajes entrantes', avatar = '?' } = {}) {
    const pantalla = el('div', { class: 'tel-pantalla', role: 'log', 'aria-live': 'polite', 'aria-label': `Conversación con ${nombre}` });
    const raiz = el('div', { class: 'telefono resplandor', role: 'group', 'aria-label': `Teléfono: chat con ${nombre}` }, [
      el('div', { class: 'tel-cabecera' }, [
        el('span', { class: 'tel-avatar', 'aria-hidden': 'true', texto: avatar }),
        el('div', { class: 'tel-nombre' }, [document.createTextNode(nombre), el('span', { class: 'tel-estado', texto: estado })]),
      ]),
      pantalla,
    ]);
    return { raiz, pantalla };
  }

  function burbujaEscribiendo() {
    return el('div', { class: 'msg msg-in escribiendo', 'aria-hidden': 'true' }, [el('div', { class: 'burbuja' }, [el('span'), el('span'), el('span')])]);
  }

  function anadirMensaje(tel, m) {
    const quien = m.de === 'out' ? 'Esteban' : (tel.raiz.getAttribute('aria-label').replace('Teléfono: chat con ', ''));
    let nodo;
    if (m.tipo === 'sistema') {
      nodo = el('div', { class: 'msg-sistema', texto: m.texto });
    } else {
      const cont = el('div', { class: `msg ${m.de === 'out' ? 'msg-out' : 'msg-in'}${m.tipo === 'alerta' ? ' msg-alerta' : ''}` });
      let b;
      const prefijo = el('span', { class: 'sr-solo', texto: `${quien}: ` });
      if (m.tipo === 'foto') {
        b = el('div', { class: 'burbuja burbuja-foto' }, [prefijo, el('img', { src: IMG.cafe[0], alt: 'Fotografía de Esteban sentado frente a un café, la que publicó días atrás en sus redes.', width: '190', height: '127' })]);
      } else if (m.tipo === 'enlace') {
        b = el('div', { class: 'burbuja burbuja-enlace' }, [prefijo, icono('i-enlace', 'icono', 22), el('span', { class: 'url', role: 'text', 'aria-label': `Enlace ficticio, no se puede abrir: ${m.texto}`, texto: m.texto })]);
      } else if (m.tipo === 'alerta') {
        b = el('div', { class: 'burbuja' }, [prefijo, icono('i-alerta', 'icono', 24), el('span', { texto: m.texto })]);
      } else if (m.tipo === 'captura') {
        b = el('div', { class: 'burbuja' }, [prefijo, document.createTextNode('▣ ' + m.texto)]);
      } else {
        b = el('div', { class: 'burbuja' }, [prefijo, document.createTextNode(m.texto)]);
      }
      cont.append(b);
      if (m.fallido) cont.append(el('time', { texto: 'No entregado' }));
      else if (m.hora) cont.append(el('time', { texto: m.hora }));
      nodo = cont;
    }
    tel.pantalla.append(nodo);
    tel.pantalla.scrollTop = tel.pantalla.scrollHeight;
    if (window.SND && m.tipo !== 'sistema') { if (m.de === 'out') SND.enviar(); else SND.mensaje(!!m.vibra); }
    if (m.vibra) {
      tel.raiz.classList.remove('vibra');
      void tel.raiz.offsetWidth;
      tel.raiz.classList.add('vibra');
      setTimeout(() => tel.raiz.classList.remove('vibra'), 700);
    }
  }

  function crearForo() {
    return { raiz: el('div', { class: 'foro', role: 'group', 'aria-label': 'Foro ficticio sobre mensajes de números desconocidos' }, [
      el('div', { class: 'foro-cab' }, [el('strong', { texto: 'Foro «Mensajes raros»' }), el('span', { texto: 'Tema: números desconocidos' })]),
    ]) };
  }
  function crearPost(p) {
    return el('div', { class: `post${p.destacado ? ' destacado' : ''}` }, [
      el('div', { class: 'post-autor' }, [el('span', { class: 'av', 'aria-hidden': 'true', texto: p.autor.slice(-1) }), document.createTextNode(p.autor)]),
      el('p', { texto: `«${p.texto}»` }),
      p.captura ? el('span', { class: 'captura-nota', texto: 'Captura guardada' }) : null,
    ]);
  }

  function urlFalsaHTML() {
    return `${URL_FALSA.antes}<b>${URL_FALSA.extra}</b>${URL_FALSA.despues}`;
  }

  function crearWeb(modo) {
    const barra = el('div', { class: 'web-barra' }, [
      el('span', { class: 'puntos', 'aria-hidden': 'true', html: '<i></i><i></i><i></i>' }),
      el('div', { class: 'web-url', role: 'text', 'aria-label': `Dirección ficticia, no navegable: ${URL_FALSA.antes}${URL_FALSA.extra}${URL_FALSA.despues}`, html: urlFalsaHTML() }),
    ]);
    let cuerpo;
    if (modo === 'carga') {
      cuerpo = el('div', { class: 'web-cuerpo' }, [
        el('p', { class: 'web-titular', texto: 'Generando tu informe personalizado…' }),
        el('div', { class: 'carga', role: 'img', 'aria-label': 'Indicador de carga' }, [el('i')]),
        el('p', { class: 'web-campo', texto: 'No se pudo completar la solicitud.' }),
      ]);
    } else {
      cuerpo = el('div', { class: 'web-cuerpo' }, [
        el('p', { class: 'web-titular', texto: 'Comprueba qué información personal está expuesta en internet' }),
        el('p', { class: 'web-campo', texto: 'Inicia sesión con tu cuenta de Conexa para generar un informe personalizado.' }),
        el('div', { class: 'web-campo campo-vacio', 'aria-hidden': 'true', texto: 'Correo o nombre de usuario' }),
        el('div', { class: 'web-campo campo-vacio', 'aria-hidden': 'true', texto: 'Contraseña' }),
        el('div', { class: 'web-boton', 'aria-disabled': 'true', texto: 'Continuar' }),
      ]);
    }
    return el('div', { class: 'web', role: 'group', 'aria-label': 'Página web ficticia y sospechosa' }, [barra, cuerpo]);
  }

  function crearComparar() {
    return el('div', { class: 'comparar', role: 'group', 'aria-label': 'Comparación de direcciones' }, [
      el('div', { class: 'fila' }, [el('span', { class: 'etq', texto: 'Dirección de referencia' }), el('code', { texto: URL_OFICIAL }), el('span', { class: 'veredicto ok', texto: '= referencia' })]),
      el('div', { class: 'fila mala' }, [el('span', { class: 'etq', texto: 'Dirección de la página' }), el('code', { html: urlFalsaHTML() }), el('span', { class: 'veredicto no', texto: '✗ No coincide' })]),
    ]);
  }

  function crearPregunta(paso, p) {
    const idT = `preg-${Math.random().toString(36).slice(2, 7)}`;
    const grupo = el('div', { class: 'opciones visible', role: 'group', 'aria-labelledby': idT });
    const wrap = el('div', { class: 'bloque entra' }, [el('p', { class: 'pregunta', id: idT, texto: paso.texto }), grupo]);
    paso.opciones.forEach((o) => {
      const b = el('button', { type: 'button', class: 'opcion', 'data-estilo': o.estilo, 'data-opcion': o.id }, [
        el('span', { class: 'insignia', 'aria-hidden': 'true', texto: o.insignia }),
        el('span', { class: 'texto-opcion', texto: o.texto }),
        icono(o.icono),
      ]);
      if (FINALES.includes(o.siguiente) && finalesVistos.has(o.siguiente)) b.classList.add('ya-visto');
      b.addEventListener('pointerenter', () => { if (window.SND && !bloqueoOpcion) SND.roce(); });
      b.addEventListener('click', () => {
        if (bloqueoOpcion) return;
        bloqueoOpcion = true;
        setTimeout(() => { bloqueoOpcion = false; }, 1500);   // nunca queda bloqueado
        b.classList.add('elegida');
        if (window.SND) SND.clic();
        b.setAttribute('aria-pressed', 'true');
        grupo.querySelectorAll('.opcion').forEach((x) => { if (x !== b) x.classList.add('apagada'); });
        setTimeout(() => avanzar(o.siguiente), reducido.matches ? 60 : 560);
      });
      grupo.append(b);
    });
    return wrap;
  }

  /* ------------------------------------------------------------ navegación */

  /* ---------- Volteo tipo flipbook: solo la hoja derecha gira sobre el lomo ---------- */
  const anchoLibro = window.matchMedia('(min-width: 881px)');
  function crearHoja(vieja, nueva, dir, dur) {
    const cara = (nodo, cls) => {
      const c = el('div', { class: `cara ${cls}` });
      const base = nodo.cloneNode(true);
      base.removeAttribute('id'); base.classList.remove('saliendo', 'sale-adelante', 'entra-adelante', 'entra-atras', 'sale-atras', 'mitad-izq', 'mitad-der', 'entra-quieta');
      base.setAttribute('aria-hidden', 'true'); base.querySelectorAll('button').forEach((b) => { b.tabIndex = -1; });
      c.append(base); return c;
    };
    // la cara visible al principio y la que queda al final
    const hoja = el('div', { class: `hoja-volteo ${dir === 'adelante' ? 'hv-adelante' : 'hv-atras'}`, 'aria-hidden': 'true' });
    hoja.style.setProperty('--dur', dur + 'ms');
    if (dir === 'adelante') {
      const f = cara(vieja.el, 'cara-der'), b = cara(nueva.el, 'cara-izq-dorso');
      hoja.append(f, b);
    } else {
      const f = cara(nueva.el, 'cara-der'), b = cara(vieja.el, 'cara-izq-dorso');
      hoja.append(f, b);
    }
    hoja.append(el('div', { class: 'hv-brillo' }), el('div', { class: 'hv-sombra-suelo' }));
    return hoja;
  }

  function mostrar(id, dir, forzarInstantaneo) {
    // Cierra cualquier transición anterior para no apilar páginas
    enMenu = false;
    if (paginaActual) paginaActual.cancelar();
    [...contPaginas.children].forEach((n) => { if (!paginaActual || n !== paginaActual.el) n.remove(); });
    clearTimeout(temporizadorLibro);
    libro.classList.remove('lento'); velo.classList.remove('activo');
    bloqueoOpcion = false;

    const esc = ESCENAS[id];
    const vieja = paginaActual;
    if (vieja) sonidoPagina();
    if (window.SND) SND.escena(id);
    const nueva = esc.tipo === 'portada' ? construirPortada() : esc.tipo === 'cierre' ? construirCierre() : construirEscena(id);
    nueva.id = id;
    nueva.cancelar = nueva.cancelar || (() => {});
    contPaginas.append(nueva.el);
    paginaActual = nueva;
    actualizarBarra();
    actualizarMarca();

    const entraFinal = esc.final && dir === 'adelante';
    const dur = entraFinal ? 1550 : 1100;
    if (!vieja || reducido.matches) {
      if (vieja) vieja.el.remove();
    } else {
      if (entraFinal) { libro.classList.add('lento'); velo.classList.add('activo'); }
      const doble = anchoLibro.matches && !vieja.el.classList.contains('pagina--cubierta') && !nueva.el.classList.contains('pagina--cubierta');
      let hojaVolteo = null;
      if (doble) {
        // la página nueva queda debajo; la vieja solo conserva su mitad que no gira
        const iniciar = () => {
          if (paginaActual !== nueva) return;
          hojaVolteo = crearHoja(vieja, nueva, dir, dur);
          vieja.el.classList.add('saliendo', dir === 'adelante' ? 'mitad-izq' : 'mitad-der');
          contPaginas.append(hojaVolteo);
        };
        nueva.el.classList.add('entra-quieta');
        // al retroceder, la página anterior se reconstruye al instante: se espera un instante para copiarla completa
        if (dir === 'adelante') iniciar(); else setTimeout(iniciar, 90);
      } else if (dir === 'adelante') { vieja.el.classList.add('saliendo', 'sale-adelante'); nueva.el.classList.add('entra-adelante'); }
      else { vieja.el.classList.add('saliendo', 'sale-atras'); nueva.el.classList.add('entra-atras'); }
      temporizadorLibro = setTimeout(() => {
        if (hojaVolteo) hojaVolteo.remove();
        contPaginas.querySelectorAll('.hoja-volteo').forEach((h) => h.remove());
        nueva.el.classList.remove('entra-quieta');
        vieja.el.remove();
        nueva.el.classList.remove('entra-adelante', 'entra-atras');
        libro.classList.remove('lento'); velo.classList.remove('activo');
      }, dur + 150);
    }

    anuncios.textContent = `${esc.kicker || 'Portada'}. ${esc.titulo || META.docTitulo}`;
    nueva.foco && nueva.foco.focus({ preventScroll: true });
    if (nueva.pasos) ejecutar(nueva, dir === 'atras' || forzarInstantaneo);
    if (nueva.contenido) $('.hoja-der', nueva.el).scrollTop = 0;
    nueva.el.scrollTop = 0;
  }

  function avanzar(siguiente) {
    if (!ESCENAS[siguiente]) return;
    camino.push(siguiente);   // si venimos de una escena anterior, el camino ya fue recortado por "atras"
    guardar();
    mostrar(siguiente, 'adelante');
  }

  function atras() {
    if (camino.length <= 1) return;
    camino.pop();             // al retroceder se descartan las decisiones posteriores
    guardar();
    mostrar(camino[camino.length - 1], 'atras');
  }

  function reiniciar(total) {
    if (total) { camino = ['portada']; mostrar('portada', 'atras'); }   // los finales encontrados se conservan
    else { const ini = META.inicio || 's1'; camino = ['portada', ini]; guardar(); mostrar(ini, 'adelante'); }
  }

  btnAtras.addEventListener('click', atras);
  btnReiniciar.addEventListener('click', () => reiniciar(true));


  /* ---------- Paso 4: marcapáginas, índice y bordes de página ---------- */
  const btnMarca = $('#btn-marca');
  const btnIndice = $('#btn-indice');
  const bordeIzq = $('#borde-izq');
  const bordeDer = $('#borde-der');
  const mismoCamino = (a, b) => !!a && !!b && a.length === b.length && a.every((x, i) => x === b[i]);
  const tituloDe = (id) => (ESCENAS[id] && ESCENAS[id].titulo) || 'Portada';

  function actualizarMarca() {
    const id = camino[camino.length - 1];
    const visible = !enMenu && id !== 'portada' && id !== 'cierre';
    btnMarca.hidden = !visible;
    const aqui = mismoCamino(marca, camino);
    btnMarca.setAttribute('aria-pressed', String(aqui));
    const txt = aqui ? 'Quitar el marcapáginas de esta página' : (marca ? 'Mover el marcapáginas a esta página' : 'Poner marcapáginas aquí');
    btnMarca.setAttribute('aria-label', txt); btnMarca.title = txt;
    bordeIzq.disabled = camino.length <= 1;
  }
  btnMarca.addEventListener('click', () => {
    marca = mismoCamino(marca, camino) ? null : [...camino];
    if (window.SND) SND.pagina();
    actualizarMarca(); guardar(); if (!indice.hidden) pintarIndice();
    anuncios.textContent = marca ? 'Marcapáginas puesto' : 'Marcapáginas quitado';
  });

  /* Pasar página tocando el borde, con flechas del teclado o deslizando */
  const enVolteo = () => !!contPaginas.querySelector('.hoja-volteo') || !!contPaginas.querySelector('.saliendo');
  function paginaAtras() { if (!indice.hidden || enVolteo() || btnAtras.disabled) return; atras(); }
  function paginaAdelante() {
    if (!indice.hidden || enVolteo() || !paginaActual || enMenu) return;
    const pg = paginaActual;
    if (pg.id === 'portada') { const b = $('.btn-continuar', pg.el) || pg.boton; if (b) b.click(); return; }
    if (pg.btnSaltar && !pg.btnSaltar.hidden) { pg.btnSaltar.click(); return; }
    if (pg.id === 'cierre') return;
    const sig = $('.btn-secundario.es-principal', pg.el);
    if (sig) { sig.click(); return; }
    const ops = $('.opciones', pg.el);
    if (ops) {   // hay que decidir: la lista se sacude
      ops.classList.remove('sacude'); void ops.offsetWidth; ops.classList.add('sacude');
      if (window.SND) SND.roce();
    }
  }
  bordeIzq.addEventListener('click', paginaAtras);
  bordeDer.addEventListener('click', paginaAdelante);
  document.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.key === 'ArrowLeft') paginaAtras();
    else if (e.key === 'ArrowRight') paginaAdelante();
  });
  let toque = null;
  libro.addEventListener('touchstart', (e) => { const t = e.touches[0]; toque = e.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null; }, { passive: true });
  libro.addEventListener('touchend', (e) => {
    if (!toque) return;
    const t = e.changedTouches[0], dx = t.clientX - toque.x, dy = t.clientY - toque.y; toque = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 2) { if (dx < 0) paginaAdelante(); else paginaAtras(); }
  }, { passive: true });

  /* Índice */
  let TONOS = { f1: 'oscuro', f2: 'sereno', f3: 'cálido', f4: 'abierto', f5: 'amargo', f6: 'esperanzador', f7: 'lúcido' };
  let PISTAS = {
    f1: 'Hay curiosidades que cuestan caro.',
    f2: 'A veces, no responder también es una forma de investigar.',
    f3: 'No todo se resuelve en soledad.',
    f4: 'Apagar el mundo… ¿y qué pasa después?',
    f5: 'Cerrar a tiempo no siempre es suficiente.',
    f6: 'A veces el silencio de otra persona esconde la misma historia.',
    f7: 'Hay respuestas que ya estaban a la vista.',
  };
  const indice = el('aside', { class: 'indice', id: 'indice', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Índice del libro' });
  indice.hidden = true;
  document.body.append(indice);
  function pintarIndice() {
    indice.replaceChildren();
    const cerrar = el('button', { type: 'button', class: 'indice-cerrar', 'aria-label': 'Cerrar el índice', texto: '×' });
    cerrar.addEventListener('click', cerrarIndice);
    const fondo = el('div', { class: 'indice-fondo' }); fondo.addEventListener('click', cerrarIndice);

    const marcaTxt = marca
      ? [document.createTextNode('Tu marcapáginas está en '), el('em', { texto: `«${tituloDe(marca[marca.length - 1])}»` }), document.createTextNode('.')]
      : [document.createTextNode('Aún no pusiste marcapáginas. Toca la cinta roja que cuelga arriba del libro para dejarlo en la página que quieras.')];
    const ir = el('button', { type: 'button', class: 'indice-btn', texto: 'Ir al marcapáginas' });
    ir.disabled = !marca;
    ir.addEventListener('click', () => { camino = [...marca]; cerrarIndice(); mostrar(camino[camino.length - 1], 'adelante', true); guardar(); });
    const quitar = el('button', { type: 'button', class: 'indice-btn', texto: 'Quitarlo' });
    quitar.disabled = !marca;
    quitar.addEventListener('click', () => { marca = null; guardar(); actualizarMarca(); pintarIndice(); cerrarFoco(); });
    const cerrarFoco = () => { const c = $('.indice-cerrar', indice); if (c) c.focus(); };

    const lista = el('ul', { class: 'indice-finales' }, FINALES.map((f, i) => {
      const visto = finalesVistos.has(f);
      return el('li', { class: visto ? 'visto' : 'oculto' }, [
        el('span', { class: 'num', 'aria-hidden': 'true', texto: String(i + 1) }),
        el('span', { class: 'tit', texto: visto ? FINAL_TITULOS[f] : '· · ·' }),
        el('span', { class: 'sub', texto: visto ? `Final ${i + 1} · ${TONOS[f]}` : PISTAS[f] }),
      ]);
    }));
    const portada = el('button', { type: 'button', class: 'indice-btn', texto: 'Volver a la portada' });
    portada.disabled = camino.length <= 1;
    portada.addEventListener('click', () => { cerrarIndice(); reiniciar(true); });

    indice.append(fondo, el('div', { class: 'indice-papel' }, [
      cerrar,
      el('p', { class: 'kicker', texto: 'Índice' }),
      el('h2', { texto: 'Número desconocido' }),
      el('h3', { texto: 'Marcapáginas' }),
      el('p', { class: 'indice-marca' }, marcaTxt),
      el('div', { class: 'indice-acciones' }, [ir, quitar]),
      el('h3', { texto: `Finales · ${finalesVistos.size} de ${FINALES.length}` }),
      lista,
      el('h3', { texto: 'El libro' }),
      el('div', { class: 'indice-acciones' }, [portada, (() => { const m = el('button', { type: 'button', class: 'indice-btn', texto: 'Cambiar de historia' }); m.addEventListener('click', () => { cerrarIndice(); mostrarMenu(); }); return m; })()]),
    ]));
  }
  function abrirIndice() {
    pintarIndice(); indice.hidden = false;
    btnIndice.setAttribute('aria-expanded', 'true');
    if (window.SND) SND.pagina();
    const c = $('.indice-cerrar', indice); if (c) c.focus();
  }
  function cerrarIndice() {
    if (indice.hidden) return;
    indice.hidden = true; btnIndice.setAttribute('aria-expanded', 'false'); btnIndice.focus();
  }
  btnIndice.addEventListener('click', () => (indice.hidden ? abrirIndice() : cerrarIndice()));
  document.addEventListener('keydown', (e) => {
    if (indice.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarIndice(); return; }
    if (e.key === 'Tab') {   // el foco se queda dentro del índice
      const f = [...indice.querySelectorAll('button:not(:disabled)')].filter((b) => b.offsetParent !== null);
      if (!f.length) return;
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });


  /* ---------- Varias historias: registro, menú y cambio ---------- */
  const META_NUMERO = {
    id: 'numero', clave: CLAVE, titulo: 'Número desconocido', sub: 'El enlace', docTitulo: 'Número desconocido: el enlace',
    tag: 'Una historia interactiva de suspenso',
    texto: 'A veces, la curiosidad nos lleva a lugares inesperados. Esta noche, Esteban recibe un mensaje de alguien que parece conocerlo. Él decidirá qué hacer, pero no tiene por qué hacerlo solo: tú serás quien lo aconseje.',
    cierre: 'La historia de esta noche termina aquí. El misterio sigue abierto, pero tus consejos le cambiaron el rumbo a Esteban.',
    tarjeta: 'Un mensaje a medianoche, un enlace y una decisión que puedes aconsejar. Siete desenlaces.', genero: 'Suspenso',
  };
  const HISTORIAS = {
    numero: { meta: META_NUMERO, ESCENAS, IMG, FINALES, FINAL_TITULOS, TONOS, PISTAS, NOMBRES_PROGRESO },
  };
  if (window.HISTORIA_ROBO) {
    const R = window.HISTORIA_ROBO;
    HISTORIAS.robo = { meta: R.meta, ESCENAS: R.ESCENAS, IMG: R.IMG, FINALES: R.FINALES, FINAL_TITULOS: R.FINAL_TITULOS, TONOS: R.TONOS, PISTAS: R.PISTAS, NOMBRES_PROGRESO: R.NOMBRES_PROGRESO };
  }
  const progresoDe = (h) => {   // finales encontrados de una historia, leídos de su propio guardado
    try {
      const d = JSON.parse(localStorage.getItem(h.meta.clave) || 'null');
      const f = d && Array.isArray(d.finales) ? d.finales.filter((x) => h.FINALES.includes(x)).length : 0;
      return { finales: f, enCurso: !!(d && Array.isArray(d.camino) && d.camino.length > 1) };
    } catch (e) { return { finales: 0, enCurso: false }; }
  };
  function usarHistoria(id) {
    const h = HISTORIAS[id]; if (!h) return;
    ESCENAS = h.ESCENAS; IMG = h.IMG; FINALES = h.FINALES; FINAL_TITULOS = h.FINAL_TITULOS; TONOS = h.TONOS; PISTAS = h.PISTAS;
    NOMBRES_PROGRESO = h.NOMBRES_PROGRESO; CLAVE = h.meta.clave; META = h.meta;
    document.title = META.docTitulo;
    document.documentElement.dataset.historia = id;
    camino = ['portada']; marca = null; finalesVistos.clear();
    guardado = leerGuardado();
    if (guardado) { guardado.finales.forEach((f) => finalesVistos.add(f)); marca = guardado.marca; }
    Object.values(IMG).forEach(([src]) => { const i = new Image(); i.src = src; });
    mostrar('portada', 'adelante');
  }
  function construirMenu() {
    const tarjetas = Object.entries(HISTORIAS).map(([id, h]) => {
      const p = progresoDe(h);
      const b = el('button', { type: 'button', class: 'tarjeta-historia', 'data-historia': id }, [
        el('img', { class: 'tarjeta-img', src: h.IMG.portada[0], alt: '' }),
        el('span', { class: 'tarjeta-cuerpo' }, [
          el('span', { class: 'tarjeta-genero', texto: h.meta.genero }),
          el('span', { class: 'tarjeta-titulo', texto: h.meta.titulo + (h.meta.sub ? ': ' + h.meta.sub : '') }),
          el('span', { class: 'tarjeta-texto', texto: h.meta.tarjeta }),
          el('span', { class: 'tarjeta-estado', texto: `Finales encontrados: ${p.finales} de ${h.FINALES.length}${p.enCurso ? '  ·  lectura en curso' : ''}` }),
        ]),
      ]);
      b.addEventListener('click', () => usarHistoria(id));
      return b;
    });
    const titulo = el('h1', { class: 'menu-titulo', tabindex: '-1', texto: 'Elige una historia' });
    const raiz = el('section', { class: 'pagina pagina--cubierta pagina--menu', 'aria-label': 'Menú de historias' }, [
      el('div', { class: 'cubierta-marco' }),
      el('div', { class: 'menu-cont' }, [
        el('p', { class: 'kicker', texto: 'Historias interactivas' }), titulo,
        el('p', { class: 'menu-sub', texto: 'En cada una tú aconsejas y decides. Tu progreso se guarda por separado.' }),
        el('div', { class: 'menu-tarjetas' }, tarjetas),
        el('footer', { class: 'menu-pie', texto: 'Sherik Hernández - Karol Bustamante - Acosprimi Polo - Lausabid Polo' }),
      ]),
    ]);
    return { el: raiz, foco: titulo, cancelar() {}, id: 'menu' };
  }
  function mostrarMenu() {
    if (paginaActual) paginaActual.cancelar();
    clearTimeout(temporizadorLibro); libro.classList.remove('lento'); velo.classList.remove('activo'); bloqueoOpcion = false;
    if (!indice.hidden) { indice.hidden = true; btnIndice.setAttribute('aria-expanded', 'false'); }
    [...contPaginas.children].forEach((n) => n.remove());
    enMenu = true;
    const pag = construirMenu();
    contPaginas.append(pag.el); paginaActual = pag;
    document.title = 'Historias interactivas';
    delete document.documentElement.dataset.historia;
    actualizarBarra(); actualizarMarca();
    if (window.SND) { if (SND.pagina) SND.pagina(); SND.escena('portada'); }
    anuncios.textContent = 'Menú de historias. Elige una para empezar.';
    pag.foco.focus({ preventScroll: true });
  }

  /* --------------------------------------------------------------- inicio */
  META = META_NUMERO;
  guardado = leerGuardado();   // ajustes de sonido y música (se guardan dentro de cada historia)
  if (guardado) { guardado.finales.forEach((f) => finalesVistos.add(f)); marca = guardado.marca; }
  mostrarMenu();
  // preferencias de sonido: se restauran cuando audio.js ya enlazó sus botones
  setTimeout(() => {
    if (!guardado) return;
    if (!guardado.sonido) btnSonido.click();
    const bm = document.getElementById('btn-musica');
    if (!guardado.musica && bm) {
      bm.setAttribute('aria-pressed', 'false'); bm.setAttribute('aria-label', 'Activar la música'); bm.title = 'Música desactivada';
      const sp = bm.querySelector('span'); if (sp) sp.textContent = 'Sin música';
      if (window.SND && SND.musicaRefrescar) SND.musicaRefrescar();
    }
  }, 0);
  btnSonido.addEventListener('click', () => setTimeout(guardar, 20));
  const bmus = document.getElementById('btn-musica');
  if (bmus) bmus.addEventListener('click', () => setTimeout(guardar, 20));
})();
