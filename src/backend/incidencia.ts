const axios = require('axios');

function routerIncidencias(
  options: any,
  router: any,
  err: any,
  dpsUrl: any,
  token: any
) {
  router.get('/incidencias', (req: any, res: any) =>
    havePermissionIncidencias(req, res).catch((error: any) =>
      err(req, res, error)
    )
  );

  async function havePermissionIncidencias(req: any, res: any) {
    const perm = await options.callbackPermission(req);
    if (perm) res.send({ status: 'ok' });
    else res.send({ error: 'Insuficient permissions' });
  }

  router.post('/incidencias/create', (req: any, res: any) =>
    nuevaIncidencia(req, res).catch((error) => err(req, res, error))
  );

  async function nuevaIncidencia(req: any, res: any) {
    req.body.whoami = {
      userid: req.session.userid,
      name: req.session.name,
      email: req.session.email,
    };
    if (options.sgi) {
      req.body.whoami.cliente = req.session.cliente;
      req.body.creador = { id: req.session.userid, tipo: false };
    }
    delete req.body.inputs['descripcion-incidencia-crear-modal'];
    delete req.body.inputs['tipo-incidencia-crear-modal'];
    delete req.body.inputs['proyecto-incidencia-crear-modal'];
    delete req.body.inputs['info-incidencia-modal'];
    const incidencia = await axios({
      method: 'post',
      url: `${dpsUrl}/api/exposed/${token}/incidencia`,
      data: req.body,
    }).catch((error: any) => {
      err(error);
      return null;
    });
    if (options.sgi) {
      res.send({ id: incidencia.data.id });
    } else {
      res.send({ status: 'ok' });
    }
  }
}

const permIncidencias = {
  static: ['^/incidencias/grabar(/(index.html)?)?$'],
  api: ['^/incidencias$', '^/incidencias/create$', '^/incidencias/proyectos$'],
};

export { routerIncidencias, permIncidencias };
