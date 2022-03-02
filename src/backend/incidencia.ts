const axios = require('axios');

function routerIncidencias(router: any, err: any, dpsUrl: any, token: any) {
  router.get('/incidencias', (req: any, res: any) =>
    havePermissionIncidencias(req, res).catch((error: any) =>
      err(req, res, error)
    )
  );

  async function havePermissionIncidencias(req: any, res: any) {
    res.send({ status: 'ok' });
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
    delete req.body.inputs['descripcion-incidencia-crear-modal'];
    delete req.body.inputs['tipo-incidencia-crear-modal'];
    delete req.body.inputs['proyecto-incidencia-crear-modal'];
    delete req.body.inputs['info-incidencia-modal'];
    await axios({
      method: 'post',
      url: `${dpsUrl}/api/exposed/${token}/incidencia`,
      data: req.body,
    }).catch((error: any) => {
      err(error);
      return null;
    });
    res.send({ status: 'ok' });
  }
}

//

// const { routerIncidencias } = require('incidencias/lib/backend/incidencia');

// routerIncidencias(
//   router,
//   err,
//   axios,
//   ,
//
// );

export { routerIncidencias };
