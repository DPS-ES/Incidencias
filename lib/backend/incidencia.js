"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerIncidencias = void 0;
const axios = require('axios');
function routerIncidencias(router, err, dpsUrl, token) {
    router.get('/incidencias', (req, res) => havePermissionIncidencias(req, res).catch((error) => err(req, res, error)));
    async function havePermissionIncidencias(req, res) {
        res.send({ status: 'ok' });
    }
    router.post('/incidencias/create', (req, res) => nuevaIncidencia(req, res).catch((error) => err(req, res, error)));
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
        await axios({
            method: 'post',
            url: `${dpsUrl}/api/exposed/${token}/incidencia`,
            data: req.body,
        }).catch((error) => {
            err(error);
            return null;
        });
        res.send({ status: 'ok' });
    }
}
exports.routerIncidencias = routerIncidencias;
