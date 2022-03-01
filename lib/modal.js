"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DPSIncidencia extends HTMLElement {
    constructor() {
        super();
    }
    getTemplate() {
        const template = document.createElement('template');
        template.innerHTML = `
      <p>Incidencia</p>
      ${this.getStyles()}
    `;
        return template;
    }
    getStyles() {
        return `
      <style>
        
      </style>
    `;
    }
    render() {
        const tmp = document.importNode(this.getTemplate().content, true);
        this.appendChild(tmp);
    }
    connectedCallback() {
        this.render();
    }
}
customElements.define('dps-incidencia', DPSIncidencia);
