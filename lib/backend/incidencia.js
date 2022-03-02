"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permIncidencias = exports.routerIncidencias = void 0;
const axios = require('axios');
function routerIncidencias(isSGI, router, err, dpsUrl, token, callbackPermission) {
    router.get('/incidencias', (req, res) => havePermissionIncidencias(req, res).catch((error) => err(req, res, error)));
    async function havePermissionIncidencias(req, res) {
        if (callbackPermission(req)) {
            res.send({ status: 'ok' });
        }
        else {
            res.send({ error: 'Insuficient permissions' });
        }
    }
    router.post('/incidencias/create', (req, res) => nuevaIncidencia(req, res).catch((error) => err(req, res, error)));
    async function nuevaIncidencia(req, res) {
        req.body.whoami = {
            userid: req.session.userid,
            name: req.session.name,
            email: req.session.email,
        };
        if (isSGI) {
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
        }).catch((error) => {
            err(error);
            return null;
        });
        if (isSGI) {
            res.send({ id: incidencia.data.id });
        }
        else {
            res.send({ status: 'ok' });
        }
    }
}
exports.routerIncidencias = routerIncidencias;
const permIncidencias = {
    static: ['^/incidencias/grabar(/(index.html)?)?$'],
    api: ['^/incidencias$', '^/incidencias/create$', '^/incidencias/proyectos$'],
};
exports.permIncidencias = permIncidencias;
