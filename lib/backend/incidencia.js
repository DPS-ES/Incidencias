"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incidenciaCliente = void 0;
function incidenciaCliente(router, err, axios, dpsUrl, token) {
    router.post('/create', (req, res) => nuevaIncidencia(req, res).catch((error) => err(req, res, error)));
    async function nuevaIncidencia(req, res) {
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
exports.incidenciaCliente = incidenciaCliente;
