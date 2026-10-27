/* Modo lectura: tamaño de letra y fondo oscuro. Se guarda aparte del progreso. */
(function () {
  'use strict';
  const CLAVE = 'numero-desconocido:lectura';
  const ESCALAS = [0.9, 1, 1.15, 1.3, 1.5];
  const NOMBRES = ['Pequeña', 'Normal', 'Grande', 'Muy grande', 'Enorme'];
  const raiz = document.documentElement;
  let st = { nivel: 1, tema: 'papel' };
  try {
    const d = JSON.parse(localStorage.getItem(CLAVE) || 'null');
    if (d) {
      if (Number.isInteger(d.nivel) && d.nivel >= 0 && d.nivel < ESCALAS.length) st.nivel = d.nivel;
      if (d.tema === 'noche') st.tema = 'noche';
    }
  } catch (e) { /* sin almacenamiento */ }

  const barra = document.querySelector('.barra');
  const btnIni = document.getElementById('btn-reiniciar');
  if (!barra || !btnIni) return;

  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'btn-barra btn-lectura'; btn.id = 'btn-lectura';
  btn.setAttribute('aria-haspopup', 'dialog'); btn.setAttribute('aria-controls', 'lectura-panel'); btn.setAttribute('aria-expanded', 'false');
  btn.title = 'Modo lectura: letra y fondo';
  btn.innerHTML = '<span class="aa" aria-hidden="true">A<small>a</small></span><span class="txt">Lectura</span>';
  barra.insertBefore(btn, btnIni);

  const panel = document.createElement('div');
  panel.id = 'lectura-panel'; panel.className = 'lectura-panel'; panel.hidden = true;
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Modo lectura');
  panel.innerHTML = '<button type="button" class="lectura-cerrar" aria-label="Cerrar">×</button>' +
    '<h2>Modo lectura</h2>' +
    '<h3>Tamaño de letra</h3>' +
    '<div class="lectura-fila"><button type="button" id="lec-menos" aria-label="Letra más pequeña">A−</button>' +
    '<span class="lectura-nivel" id="lec-nivel" aria-live="polite"></span>' +
    '<button type="button" id="lec-mas" aria-label="Letra más grande">A+</button></div>' +
    '<h3>Fondo</h3>' +
    '<div class="lectura-temas"><button type="button" data-tema="papel">Papel</button><button type="button" data-tema="noche">Noche</button></div>';
  document.body.appendChild(panel);

  const menos = panel.querySelector('#lec-menos'), mas = panel.querySelector('#lec-mas'), nivel = panel.querySelector('#lec-nivel');
  const temas = panel.querySelectorAll('[data-tema]');

  function aplicar(guardar) {
    raiz.style.setProperty('--escala-letra', ESCALAS[st.nivel]);
    if (st.tema === 'noche') raiz.setAttribute('data-lectura', 'noche'); else raiz.removeAttribute('data-lectura');
    nivel.textContent = NOMBRES[st.nivel];
    menos.disabled = st.nivel === 0; mas.disabled = st.nivel === ESCALAS.length - 1;
    temas.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tema === st.tema)));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = st.tema === 'noche' ? '#0a0806' : '#1c1612';
    if (guardar) { try { localStorage.setItem(CLAVE, JSON.stringify(st)); } catch (e) { /* nada */ } }
  }
  menos.addEventListener('click', () => { if (st.nivel > 0) { st.nivel--; aplicar(true); } });
  mas.addEventListener('click', () => { if (st.nivel < ESCALAS.length - 1) { st.nivel++; aplicar(true); } });
  temas.forEach((b) => b.addEventListener('click', () => { st.tema = b.dataset.tema; aplicar(true); }));

  function abrir() { panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); (st.tema === 'noche' ? temas[1] : mas).focus(); }
  function cerrar(devolverFoco) { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (devolverFoco) btn.focus(); }
  btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar(true)));
  panel.querySelector('.lectura-cerrar').addEventListener('click', () => cerrar(true));
  document.addEventListener('pointerdown', (e) => { if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) cerrar(false); });
  // las flechas dentro del panel no deben pasar la página
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') { cerrar(true); e.stopPropagation(); } else if (e.key.startsWith('Arrow')) e.stopPropagation(); });

  aplicar(false);
})();
