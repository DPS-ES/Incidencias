let tradProyectos: any;
let isSGI: any;
let msg: any;
let $: any;
let M: any;
let gApi: any;
let gErr: any;

function incidencia(
  options: any,
  jquery: any,
  materialize: any,
  api: any,
  err: any,
  message: any
) {
  tradProyectos = {};
  isSGI = options.sgi;
  $ = jquery;
  M = materialize;
  gApi = api;
  gErr = err;
  msg = message;

  console.log({ options, isSGI });

  if (options.showIfPerm) {
    console.log('Calling perm show');
    api
      .get('/incidencias', null, true)
      .then((data: any) => {
        if (!data || data.status !== 'ok') return;
        showIncidencia();
      })
      .catch(err);
  } else showIncidencia();

  $('#modal-incidencia-crear').removeMe();
  $('#loader-incidencia').removeMe();
  $('body').appendChild(
    $('<dps-spinner id="loader-incidencia" full-page></dps-spinner>')
  );
  $('body').appendChild(
    $(`
    <div id="modal-incidencia-crear" class="modal modal-fixed-footer">
      <form>
        <div class="modal-content">
          <h4>Reportar a DPS</h4>
          <div class="input-field descripcion-incidencia-crear-modal">
            <textarea id="descripcion-incidencia-crear-modal" class="materialize-textarea change-input" required></textarea>
            <label id="descripcion-incidencia-crear-label" for="descripcion-incidencia-crear-modal">Descripción</label>
          </div>
          <div class="tipo-incidencia-container input-field">
            <dps-select label="Tipo" id="tipo-incidencia-crear-modal" first-empty="true"
              options="Duda||Modificación / Ampliación / Nuevo desarrollo||Incidencia crítica||Incidencia no crítica" values="2||3||1||0" required>
            </dps-select>
            <i data-html="true" class="material-icons tooltipped help-tipo-incidencia" data-position="bottom">help</i>
          </div>
          ${
            isSGI
              ? `
          <div class="input-field modal-proyecto-incidencia">
            <input id="proyecto-incidencia-crear-modal" name="proyecto" class="validate" type="text" autocomplete="off"
            list="proyecto-incidencia-list-crear-modal" required />
            <label id="proyecto-incidencia-crear-label" for="proyecto-incidencia-crear-modal">Proyecto</label>
            <datalist id="proyecto-incidencia-list-crear-modal"></datalist>
          </div>
          `
              : ''
          }
          <div id="explicacion-video-incidencia-modal"></div>
          <div class="container-botones hide-on-med-and-down">
            <a class="waves-effect waves-light btn teal" id="grabar-pantalla-incidencia">Grabar pantalla</a>
            <a class="waves-effect waves-light btn brown" id="capturar-pantalla-incidencia">Capturar pantalla</a>
          </div>
          <p class="text-center">Puede subir archivos adjuntos cuando termine de rellenar este formulario y pulse "Reportar".</p>
          <video id="video-capturar-incidencia" autoplay playsinline muted></video>
          <canvas id="canvas-capturar-incidencia" class="hide"></canvas>
          <input id="info-incidencia-modal" class="hide"></input>
          <div class="container-previsualizacion-incidencia">
            <video id="video-grabar-incidencia" class="hide" autoplay muted loop></video>
            <img id="img-capturar-incidencia" src=""/>
          </div>
        </div>
        <div class="modal-footer">
          <dps-button id="cancelar-incidencias-modal" class="left" color="red" texto="Cancelar"></dps-button>
          <dps-button submit class="right reportar-btn" texto="Reportar"></dps-button>
        </div>
      </form>
    </div>
    `)
  );

  const styleSheet = document.createElement('style');
  styleSheet.innerText = `
    #modal-incidencia-crear {
      max-width: 700px;
    }
    #modal-incidencia-crear .input-field {
      margin: 14px 0;
    }
    #modal-incidencia-crear .descripcion-incidencia-crear-modal {
      margin-top: 26px;
    }
    #modal-incidencia-crear .modal-proyecto-incidencia {
      margin-top: 24px;
      margin-bottom: 16px;
    }
    #modal-incidencia-crear dps-select label {
      left: 0;
    }
    #modal-incidencia-crear .container-botones {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 16px;
    }
    #modal-incidencia-crear .text-center {
      text-align: center;
    }
    
    #modal-incidencia-crear #video-capturar-incidencia {
      height: 1px;
      width: 1px;
      opacity: 0;
    }
    #modal-incidencia-crear .tipo-incidencia-container {
      position: relative;
    }
    #modal-incidencia-crear .help-tipo-incidencia {
      position: absolute;
      cursor: default;
      top: 8px;
      right: 0;
      color: gray;
    }
    #modal-incidencia-crear .container-previsualizacion-incidencia {
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 16px;
    }
    #img-capturar-incidencia,
    #video-grabar-incidencia {
      width: 100%;
    }
    .tooltip-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .tooltip-content p {
      margin-bottom: 0;
      margin-top: 5px;
      text-align: start;
      margin-left: 10px;
    }
    .tooltip-content li {
      text-align: start;
    }
    .tooltip-content p:first-child {
      margin-left: 0;
    }
  `;
  document.head.appendChild(styleSheet);

  $('.help-tipo-incidencia').data(
    'tooltip',
    `
    <ul>
      <li>•	<b>Duda</b>: Tengo una duda sobre el funcionamiento de la plataforma.</li>
      <li>•	<b>Modificación / Amplicación / Nuevo desarrollo</b>: Quiero crear una tarea al backlog de trabajo.</li>
      <li>•	<b>Incidencia crítica</b>: Me impide seguir desarrollando mi trabajo.</li>
      <li>•	<b>Incidencia no crítica</b>: Puedo seguir trabajando, pero debe resolverse cuanto antes.</li>
    </ul>
  `
  );
  M.Modal.init($('#modal-incidencia-crear').el(), {});
  $('.create-incidencia').onClick(() => {
    $('#tipo-incidencia-crear-modal').val('');
    $('#descripcion-incidencia-crear-modal').val('');
    if (isSGI) $('#proyecto-incidencia-crear-modal').val('');
    $('#info-incidencia-modal').val('');
    $('#img-capturar-incidencia').el().src = '';
    $('#video-grabar-incidencia').el().src = '';
    M.Modal.getInstance($('#modal-incidencia-crear').el()).open();
    M.Sidenav.getInstance($('#sidenav').el()).close();
  });

  if (isSGI) {
    console.log('Calling proyectos');
    api
      .get('/incidencias/proyectos')
      .then(({ proyectos }: any) => {
        const datalist = $('#proyecto-incidencia-list-crear-modal');
        proyectos.forEach((p: any) => {
          tradProyectos[p.nombre] = p.id;
          datalist.appendChild(
            $(`<option value="${p.nombre}">${p.nombre}</option>`)
          );
        });
        $('#proyecto-incidencia-crear-modal').prop(
          'pattern',
          proyectos
            .map((item: any) =>
              item.nombre.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
            )
            .join('|')
        );
        if (proyectos.length === 1) {
          $('#proyecto-incidencia-crear-modal').val(proyectos[0].nombre);
          M.updateTextFields();
        }
      })
      .catch(err);
  }

  $('#modal-incidencia-crear form').off('submit', submitIncidencia);
  $('#modal-incidencia-crear form').on('submit', submitIncidencia);
  if (!window.location.pathname.includes('/incidencias/grabar')) {
    $('#grabar-pantalla-incidencia').off('click', grabarPantalla);
    $('#grabar-pantalla-incidencia').on('click', grabarPantalla);
  }
  $('#cancelar-incidencias-modal').on('click', closeModal);
  $('#cancelar-incidencias-modal').on('click', closeModal);
  $('#capturar-pantalla-incidencia').off('click', capturarPantalla);
  $('#capturar-pantalla-incidencia').on('click', capturarPantalla);
}

function submitIncidencia(e: any) {
  e.preventDefault();
  const data: any = getDataExtraIncidencia();
  M.Modal.getInstance($('#modal-incidencia-crear').el()).close();

  if ($('#video-grabar-incidencia').el().src.includes('data:video/webm')) {
    data.video = $('#video-grabar-incidencia').el().src;
    $('#video-grabar-incidencia').el().src = '';
  }

  if ($('#img-capturar-incidencia').el().src.includes('data:image/png')) {
    data.img = $('#img-capturar-incidencia').el().src;
  }

  start($('#loader-incidencia'));
  gApi
    .post('/incidencias/create', data)
    .then((id: any) => {
      if (!window.location.pathname.includes('/incidencias/grabar')) {
        if (isSGI) {
          localStorage.esNuevaTarea = true;
          location.href = `/tareas/tarea?id=${id.id}`;
        } else {
          msg('Reporte enviado. Nuestro equipo la resolverá lo antes posible.');
          stop($('#loader-incidencia'));
        }
      } else {
        window.close();
      }
    })
    .catch(gErr);
}

function grabarPantalla() {
  const url = `${location.origin}/incidencias/grabar`;
  M.Modal.getInstance($('#modal-incidencia-crear').el()).close();
  const win: any = window.open(
    url,
    'reporting',
    'status=no,width=1260,height=900'
  );
  win.addEventListener('load', () => {
    setTimeout(() => {
      const descripcion = win.document.getElementById(
        'descripcion-incidencia-crear-modal'
      );
      const tipo = win.document.getElementById('tipo-incidencia-crear-modal');

      const descripcionLabel = win.document.getElementById(
        'descripcion-incidencia-crear-label'
      );
      const proyectoLabel = win.document.getElementById(
        'proyecto-incidencia-crear-label'
      );
      const info = win.document.getElementById('info-incidencia-modal');
      descripcion.value = $('#descripcion-incidencia-crear-modal').val();
      descripcionLabel.classList.add('active');
      tipo.value = $('#tipo-incidencia-crear-modal').val();

      if (isSGI) {
        const proyecto = win.document.getElementById(
          'proyecto-incidencia-crear-modal'
        );
        proyecto.value = $('#proyecto-incidencia-crear-modal').val();
        proyectoLabel.classList.add('active');
      }

      info.value = JSON.stringify(getDataExtraIncidencia());
      if ($('#img-capturar-incidencia').el().src.includes('data:image/png')) {
        const img = win.document.getElementById('img-capturar-incidencia');
        img.src = $('#img-capturar-incidencia').el().src;
      }
    }, 1000);
  });
}

async function capturarPantalla() {
  const video = $('#video-capturar-incidencia').el();
  const canvas = $('#canvas-capturar-incidencia').el();
  const img = $('#img-capturar-incidencia').el();
  const captureStream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
  });
  video.srcObject = captureStream;
  M.Modal.getInstance($('#modal-incidencia-crear').el()).close();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  canvas.height = video.videoHeight;
  canvas.width = video.videoWidth;
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0);
  const frame = canvas.toDataURL('image/png');
  captureStream.getTracks().forEach((track) => track.stop());
  img.src = frame;
  M.Modal.getInstance($('#modal-incidencia-crear').el()).open();
}

function closeModal() {
  if (!window.location.pathname.includes('/incidencias/grabar')) {
    M.Modal.getInstance($('#modal-incidencia-crear').el()).close();
  } else {
    window.close();
  }
}

function getDataExtraIncidencia() {
  return {
    tipoIncidencia: $('#tipo-incidencia-crear-modal').val(),
    project: isSGI
      ? tradProyectos[$('#proyecto-incidencia-crear-modal').val()]
      : null,
    descripcionCliente: $('#descripcion-incidencia-crear-modal').val(),
    historial: JSON.parse(localStorage?.history || '[]').slice(-10),
    url: { href: window.location.href },
    inputs: Object.fromEntries(
      $(
        'textarea , input:not([type="checkbox"]) , select , dps-select , dps-textarea'
      ).map((e: any) => [e.id || e.name, e.value])
    ),
  };
}

function showIncidencia() {
  console.log('Show incidencia');
  $('#sidenav .create-incidencia').removeClass('hide');
  $('.context-menu').addClass('context-menu-big');
  $('.context-menu .menu-options').appendChild(
    $('<li class="menu-option create-incidencia">Reportar a DPS</li>')
  );
  $('.create-incidencia').onClick(() => {
    M.Modal.getInstance($('#modal-incidencia-crear').el()).open();
  });
}

function start(node: any, callback?: () => void) {
  window.requestAnimationFrame(() => {
    node.find('.loading').css('display', 'block');
    window.requestAnimationFrame(() => {
      node.find('.loading').css('opacity', '1');
      window.requestAnimationFrame(() => {
        if (callback) callback();
      });
    });
  });
}

function stop(node: any) {
  window.requestAnimationFrame(() => {
    node.find('.loading').css('opacity', '0');
    window.requestAnimationFrame(() => {
      setTimeout(() => $('.loading').css('display', 'none'), 1000);
      node.find('.loading-progress').text(' ');
    });
  });
}

export { incidencia };
