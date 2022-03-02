"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grabarIncidencia = void 0;
let $;
let M;
let err;
let mediaRecorder;
let stream;
let recording = false;
function grabarIncidencia(jquery, materialize, error) {
    $ = jquery;
    M = materialize;
    err = error;
    $('#explicacion-video-incidencia-modal').appendChild($('<p>La grabación debe hacerse sobre la pantalla principal. Cuando termine debe grabar, pulse en está pantalla secundaria el botón de PARAR y después el botón de CREAR para crear la incidencia.</p>'));
    M.updateTextFields();
    M.Modal.getInstance($('#modal-incidencia-crear').el()).options.dismissible =
        true;
    M.Modal.getInstance($('#modal-incidencia-crear').el()).open();
    record();
    $('#grabar-pantalla-incidencia').onClick(() => {
        if (recording) {
            mediaRecorder.stop();
        }
        else {
            record();
        }
    });
}
exports.grabarIncidencia = grabarIncidencia;
async function record() {
    $('#grabar-pantalla-incidencia').text('Parar grabación');
    $('#capturar-pantalla-incidencia').addClass('disabled');
    $('.reportar-btn').addClass('disabled');
    try {
        stream = await navigator.mediaDevices.getDisplayMedia({
            audio: true,
            // @ts-ignore
            video: { mediaSource: 'screen' },
        });
        // @ts-ignore
    }
    catch (e) { }
    if (stream) {
        recording = true;
        createRecorder();
    }
    else {
        recording = false;
        $('#grabar-pantalla-incidencia').text('Grabar pantalla');
        $('#capturar-pantalla-incidencia').removeClass('disabled');
        $('.reportar-btn').removeClass('disabled');
    }
}
function createRecorder() {
    // the stream data is stored in this array
    const recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }
    };
    mediaRecorder.onstop = () => {
        saveFile(recordedChunks);
    };
    mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
}
function saveFile(recordedChunks) {
    const blob = new Blob(recordedChunks, {
        type: 'video/webm',
    });
    // @ts-ignore
    stream.getTracks().forEach((track) => track.stop());
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
        const base64data = reader.result;
        $('#video-grabar-incidencia').el().src = base64data;
        $('#video-grabar-incidencia').removeClass('hide');
    };
    $('#capturar-pantalla-incidencia').removeClass('disabled');
    $('.reportar-btn').removeClass('disabled');
    $('#grabar-pantalla-incidencia').text('Grabar pantalla');
    $('#explicacion-video-incidencia-modal').addClass('hide');
    recording = false;
}
