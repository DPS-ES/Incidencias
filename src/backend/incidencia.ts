function incidenciaCliente(
  router: any,
  err: any,
  axios: any,
  dpsUrl: any,
  token: any
) {
  router.post('/create', (req: any, res: any) =>
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
    console.log(req.body);
    // await axios({
    //   method: 'post',
    //   url: `${dpsUrl}/api/exposed/${token}/incidencia`,
    //   data: req.body,
    // }).catch((error: any) => {
    //   err(error);
    //   return null;
    // });
    res.send({ status: 'ok' });
  }
}

export { incidenciaCliente };
