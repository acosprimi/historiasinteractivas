/* Historia 2: «Lo que no era suyo». Drama de decisiones. Todos los personajes, lugares y cifras son ficticios. */
window.HISTORIA_ROBO = (() => {
  const narr = (texto, extra = {}) => ({ t: 'narr', texto, ...extra });
  const msg = (de, texto, extra = {}) => ({ t: 'msg', de, texto, ...extra });
  const tel = (nombre, estado, avatar) => ({ t: 'telefono', nombre, estado, avatar });

  // Dibujos provisionales: la parte 3 los reemplaza por arte propio.
  const IMG = {
    portada: ['assets/mateo-habitacion.webp', 'Mateo, de noche, frente a un escritorio lleno de cuentas y un celular con el saldo en pantalla.'],
    casa: ['assets/mateo-habitacion.webp', 'Mateo, de noche, frente a un escritorio lleno de cuentas y un celular con el saldo en pantalla.'],
    tienda: ['assets/mateo-tienda.webp', 'Mateo tras el mostrador de la tienda, con la tarjeta del banco en la mano y la caja registradora al lado.'],
    calle: ['assets/mateo-calle.webp', 'Mateo camina de noche con el sobre en una mano y el celular encendido en la otra.'],
    final1: ['assets/mateo-final-arriendo.webp', 'Mateo sentado frente a la tienda cerrada, con el recibo del arriendo en la mano y la mochila vacía a su lado.'],
    final2: ['assets/mateo-final-pedir.webp', 'Mateo y su prima Lucía en la asociación del barrio, con papeles y un café sobre la mesa.'],
  };

  const contexto = (camino) => ({
    sub: ['r2a', 'r2b', 'r2c'].find((x) => camino.includes(x)) || null,
    pidioJefe: camino.includes('r2a'),
    pidioAyuda: camino.includes('r2b'),
    orgullo: camino.includes('r2c'),
    tomo: camino.includes('r4'),
  });

  const ESCENAS = {
    portada: { tipo: 'portada', progreso: 0 },

    /* ---------- Capítulo 1 ---------- */
    r1: {
      progreso: 1, img: 'casa', kicker: 'Capítulo 1', titulo: 'La cuenta que no cuadra', sello: '9:40 p. m.',
      pasos: () => [
        narr('Mateo tiene diecinueve años y hace dos meses perdió su trabajo en la bodega. Desde entonces cubre algunas noches en la tienda de don Elías, en la esquina de su barrio. Con eso apenas alcanza para el mercado.'),
        narr('Esta noche, antes de salir, abre la aplicación del banco. Saldo: treinta y ocho mil pesos. Cierra la aplicación y la vuelve a abrir, como si el número pudiera cambiar.'),
        tel('Doña Marta', 'ahora', 'M'),
        msg('in', 'Mateo, el arriendo vence el viernes. Ya te esperé dos veces. No puedo esperar más.', { hora: '9:41 p. m.', vibra: true }),
        narr('Faltan seis días y el arriendo son seiscientos cincuenta mil pesos. Su mamá vende frutas en una plaza y su hermana Sofi, de diez años, acaba de dormirse en el cuarto de al lado. Mateo mira el techo.'),
        { t: 'pensamiento', texto: 'Tiene que haber una salida. Solo necesito una.' },
        { t: 'pregunta', texto: 'Mateo respira hondo y te mira. ¿Qué le aconsejas?', opciones: [
          { id: 'R1A', insignia: 'A', icono: 'i-mensaje', estilo: 'a', texto: 'Que le pida un adelanto a don Elías, su jefe', siguiente: 'r2a' },
          { id: 'R1B', insignia: 'B', icono: 'i-ayuda', estilo: 'c', texto: 'Que hable con su prima Lucía, que trabaja en una asociación del barrio', siguiente: 'r2b' },
          { id: 'R1C', insignia: 'C', icono: 'i-alerta', estilo: 'd', texto: 'Que no pida nada: no quiere dar lástima', siguiente: 'r2c' },
        ] },
      ],
    },

    /* ---------- Capítulo 2 ---------- */
    r2a: {
      progreso: 2, img: 'casa', kicker: 'Ruta A · Pedir un adelanto', titulo: 'Después del viernes', sello: '10:05 p. m.',
      pasos: () => [
        narr('Mateo le escribe a don Elías antes de arrepentirse. Borra el mensaje dos veces y lo manda corto.'),
        tel('Don Elías', 'en línea', 'E'),
        msg('out', 'Don Elías, ¿sería posible un adelanto del sueldo? Es por el arriendo.', { hora: '10:05 p. m.' }),
        msg('in', 'Hijo, esta semana la caja está floja. Después del viernes lo hablamos, ¿sí?', { hora: '10:12 p. m.', vibra: true }),
        msg('in', 'Hoy cierra tú. Llevo a mi esposa al médico y no regreso. Deja todo bajo llave.', { hora: '10:13 p. m.', vibra: true }),
        narr('«Después del viernes» es justo el día en que vence el plazo. Mateo guarda el teléfono, se pone la chaqueta y sale hacia la tienda.'),
        { t: 'continuar', texto: 'Ir a la tienda', siguiente: 'r3' },
      ],
    },
    r2b: {
      progreso: 2, img: 'casa', kicker: 'Ruta B · Hablar con Lucía', titulo: 'Una cita el lunes', sello: '10:05 p. m.',
      pasos: (c) => [
        narr(c.orgullo
          ? 'Mateo había decidido no pedir nada, pero la imagen de Sofi dormida lo hace cambiar de idea. Marca el número de Lucía antes de que le dé tiempo a sentir vergüenza.'
          : 'Mateo piensa en Lucía, su prima, que ayuda a familias del barrio con trámites y subsidios. Le escribe sin dar demasiadas vueltas.'),
        tel('Lucía', 'en línea', 'L'),
        msg('out', 'Prima, estoy complicado con el arriendo. No sé por dónde empezar.', { hora: '10:05 p. m.' }),
        msg('in', 'Gracias por decírmelo. Hay un fondo de emergencia del barrio. La cita es el lunes a las ocho.', { hora: '10:09 p. m.', vibra: true }),
        msg('in', 'El viernes no llegamos, pero con un papel de la asociación Doña Marta puede darte más plazo. No te rindas.', { hora: '10:10 p. m.', vibra: true }),
        narr('Es una ayuda real, pero lenta. Mateo anota la dirección y vuelve a mirar el calendario: el viernes sigue ahí. Le toca cubrir el turno de la noche en la tienda.'),
        { t: 'continuar', texto: 'Ir a la tienda', siguiente: 'r3' },
      ],
    },
    r2c: {
      progreso: 2, img: 'casa', kicker: 'Ruta C · Callar', titulo: 'El orgullo pesa', sello: '10:05 p. m.',
      pasos: () => [
        narr('Mateo deja el teléfono boca abajo. Piensa que pedir ayuda es admitir que no puede solo, y no quiere ver esa cara en su mamá.'),
        tel('Mamá', 'ahora', 'R'),
        msg('in', 'Mijo, no se preocupe por nada, ya veremos cómo hacemos. Usted descanse.', { hora: '10:03 p. m.', vibra: true }),
        narr('Eso lo hace sentir peor. Ella no tiene cómo ayudarlo y aun así intenta tranquilizarlo. Sobre la mesa, el dibujo que Sofi le dejó dice «para mi hermano, el valiente».'),
        { t: 'pregunta', texto: 'Mateo duda. ¿Qué le aconsejas ahora?', opciones: [
          { id: 'R2C1', insignia: '1', icono: 'i-alerta', estilo: 'd', texto: 'Que siga callado y se concentre en el turno', siguiente: 'r3' },
          { id: 'R2C2', insignia: '2', icono: 'i-ayuda', estilo: 'c', texto: 'Que llame a Lucía aunque le dé vergüenza', siguiente: 'r2b' },
        ] },
      ],
    },

    /* ---------- Capítulo 3 ---------- */
    r3: {
      progreso: 3, img: 'tienda', kicker: 'Capítulo 3', titulo: 'La hora del cierre', sello: '11:20 p. m.',
      pasos: (c) => [
        { t: 'eco', texto: c.pidioAyuda
            ? 'Mateo todavía tiene anotada la cita del lunes a las ocho, pero el lunes queda lejos.'
            : c.pidioJefe
              ? 'A Mateo todavía le suena la frase de don Elías: «Después del viernes lo hablamos».'
              : 'Mateo sigue pensando en lo que no dijo.' },
        narr('La tienda está vacía y la calle también. Mateo baja la reja, ordena las neveras y cuenta las monedas del día. Al sacar el cajón de la caja registradora ve un sobre amarillo, cerrado, con letra de don Elías: «Banco, lunes».'),
        narr('Son las ventas de toda la semana. Don Elías, con las prisas del médico, se olvidó de llevárselo. Mateo lo sostiene un momento y calcula sin querer: alcanza para el arriendo completo.'),
        { t: 'pausa', ms: 900 },
        { t: 'pensamiento', texto: 'Nadie lo notaría hasta el lunes. Lo devolvería apenas pudiera.' },
        narr('Afuera pasa un carro y se aleja. La tienda vuelve a quedarse en silencio. Mateo tiene en la mano algo que no es suyo, y también tiene muchísimas razones para llevárselo.'),
        { t: 'pregunta', texto: 'Mateo te mira con el sobre en la mano. ¿Qué le aconsejas?', opciones: [
          { id: 'R3A', insignia: '1', icono: 'i-alerta', estilo: 'd', texto: 'Que se lleve el sobre y lo devuelva en cuanto pueda', siguiente: 'r4' },
          { id: 'R3B', insignia: '2', icono: 'i-ayuda', estilo: 'c', texto: 'Que lo deje bajo llave y le avise a don Elías', siguiente: 'r_f2' },
        ] },
      ],
    },
    r4: {
      progreso: 4, img: 'calle', kicker: 'Capítulo 4', titulo: 'Lo que pesa', sello: '11:48 p. m.',
      pasos: () => [
        narr('Mateo guarda el sobre en el bolsillo interior de la chaqueta y cierra con llave. Camina rápido, mirando al suelo. No le pesa el papel, pero siente cada paso como si cargara algo mucho más grande.'),
        tel('Mamá', 'ahora', 'R'),
        msg('in', '¿Ya vienes, mijo? Te guardé arepa. Sofi quiere contarte algo.', { hora: '11:49 p. m.', vibra: true }),
        msg('in', 'Estamos muy orgullosas de ti.', { hora: '11:49 p. m.', vibra: true }),
        narr('Mateo se detiene bajo un poste de luz. La palabra «orgullosas» le da vueltas en la cabeza. Todavía está a tiempo de dar la vuelta, y también de seguir caminando.'),
        { t: 'pregunta', texto: 'Mateo está parado a media cuadra de su casa. ¿Qué le aconsejas?', opciones: [
          { id: 'R4A', insignia: '1', icono: 'i-ayuda', estilo: 'c', texto: 'Que vuelva a la tienda y deje el sobre donde estaba', siguiente: 'r_f2' },
          { id: 'R4B', insignia: '2', icono: 'i-alerta', estilo: 'd', texto: 'Que siga caminando y pague el arriendo mañana', siguiente: 'r_f1' },
        ] },
      ],
    },

    /* ---------- Finales ---------- */
    r_f1: {
      progreso: 5, final: true, img: 'final1', kicker: 'Desenlace', titulo: 'Lo que costó el arriendo',
      pasos: (c) => [
        narr('A la mañana siguiente Mateo le paga a Doña Marta. Ella cuenta los billetes, lo mira un segundo de más y dice «gracias». Por primera vez en semanas, Mateo duerme. No dura mucho.'),
        tel('Don Elías', 'llamada perdida', 'E'),
        msg('in', 'Mateo, ¿pasaste por la tienda anoche? Falta el sobre de la caja.', { hora: '8:30 a. m. (lunes)', vibra: true }),
        { t: 'pausa', ms: 1000 },
        msg('in', c.pidioAyuda
          ? 'Lucía me contó lo del fondo del barrio. Tenías la cita hoy a las ocho. Me habría gustado que me lo hubieras dicho a mí también.'
          : c.pidioJefe
            ? 'Te dije que lo hablábamos después del viernes. Solo había que esperar unos días, hijo.'
            : 'No me pediste nada. Si me hubieras contado, algo habríamos hecho.', { hora: '8:34 a. m.', vibra: true }),
        narr('Don Elías no llama a nadie más. Pide que Mateo le devuelva el dinero poco a poco y que no vuelva a la tienda. La confianza de años en el barrio se rompió en una noche, y esa deuda no se paga con billetes.'),
        narr('Mateo conserva la casa, pero pierde el trabajo, la palabra de su jefe y la tranquilidad de poder mirar a su familia sin pensar en el sobre. El arriendo está pagado. Lo otro, todavía no.'),
        { t: 'tituloFinal', texto: 'Final 1: Lo que costó el arriendo' },
        { t: 'continuar', texto: 'Cerrar el libro', siguiente: 'cierre' },
      ],
    },
    r_f2: {
      progreso: 5, final: true, img: 'final2', kicker: 'Desenlace', titulo: 'Pedir también es una salida',
      pasos: (c) => [
        narr(c.tomo
          ? 'Mateo da media vuelta. Camina de regreso con el corazón golpeándole el pecho, abre la tienda, deja el sobre en el cajón y lo cierra con llave. Tarda un rato en soltar el aire.'
          : 'Mateo deja el sobre en el cajón, lo cierra con llave y vuelve a revisar la reja. Es la decisión más difícil de la noche, y también la más silenciosa.'),
        tel('Don Elías', 'en línea', 'E'),
        msg('out', c.tomo
          ? 'Don Elías, le debo contar algo mañana. Dejé el sobre del banco bajo llave en la caja.'
          : 'Don Elías, se le quedó el sobre del banco en la caja. Lo dejé bajo llave.', { hora: '11:58 p. m.' }),
        msg('in', c.tomo
          ? 'Gracias por avisarme. Mañana hablamos tranquilos.'
          : 'Gracias, hijo. No sabes qué susto me quitas. Mañana hablamos tranquilos.', { hora: '12:03 a. m.', vibra: true }),
        narr(c.tomo
          ? 'Al día siguiente Mateo le cuenta toda la verdad. Don Elías se queda callado un buen rato. Después dice que esto queda entre los dos, que la llave la guardará él un tiempo, y que le adelanta la mitad del arriendo. Confiar de nuevo tomará tiempo.'
          : 'Al día siguiente don Elías le adelanta parte del sueldo y le ofrece más turnos. No es mucho, pero es verdad.'),
        { t: 'lista', items: [
          'Habla con don Elías sobre un adelanto y más turnos',
          c.pidioAyuda ? 'Va a la cita del lunes en el fondo del barrio' : 'Le pide a Lucía que lo acompañe al fondo del barrio',
          'Le enseña a Doña Marta el papel de la asociación y negocia unos días más',
        ] },
        narr('El arriendo se paga con retraso, en dos partes y sin celebraciones. Todavía faltan meses difíciles. Pero esta noche Mateo no tuvo que esconderse de nadie, y Sofi sigue creyendo que su hermano es valiente.'),
        { t: 'tituloFinal', texto: 'Final 2: Pedir también es una salida' },
        { t: 'continuar', texto: 'Cerrar el libro', siguiente: 'cierre' },
      ],
    },

    cierre: { tipo: 'cierre', progreso: 6, img: 'portada', kicker: 'Última página', titulo: 'Fin' },
  };

  return {
    meta: {
      id: 'robo', inicio: 'r1', clave: 'lo-que-no-era-suyo:v1', titulo: 'Lo que no era suyo', sub: '', docTitulo: 'Lo que no era suyo',
      tag: 'Una historia interactiva de decisiones difíciles', genero: 'Drama',
      tarjeta: 'Mateo no llega a fin de mes y encuentra algo que no es suyo. Dos desenlaces.',
      texto: 'Mateo tiene diecinueve años, el arriendo sin pagar y una noche larga por delante. Esta noche tendrá que decidir qué hace con lo que tiene, y tú serás quien lo aconseje.',
      cierre: 'La noche de Mateo termina aquí. Lo que decidió no borra lo difícil que era, pero cambió lo que viene después.',
      contexto,
    },
    ESCENAS, IMG,
    FINALES: ['r_f1', 'r_f2'],
    FINAL_TITULOS: { r_f1: 'Lo que costó el arriendo', r_f2: 'Pedir también es una salida' },
    TONOS: { r_f1: 'amargo', r_f2: 'esperanzador' },
    PISTAS: { r_f1: 'Lo que se toma sin permiso casi siempre se cobra.', r_f2: 'A veces la salida es pedir a tiempo.' },
    NOMBRES_PROGRESO: ['Portada', 'Inicio', 'Decisión', 'El cierre', 'Lo que pesa', 'Desenlace', 'Cierre'],
  };
})();
