"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerIncidencias = void 0;
const axios = require('axios');
function routerIncidencias(isSGI, router, err, dpsUrl, token) {
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
        if (isSGI) {
            req.body.whoami.cliente = req.session.cliente;
            req.body.project = req.session.proyectoId;
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
            res.send({ id: incidencia.id });
        }
        else {
            res.send({ status: 'ok' });
        }
    }
}
exports.routerIncidencias = routerIncidencias;
