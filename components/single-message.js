import { convertDate } from '../utils.js';

export default class SingleMessage extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['message'];
    }

    get message() {
        return JSON.parse(this.getAttribute('message'));
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
              <h4>${this.message.Header}</h4>
              <p class="update">Senast uppdaterad: ${convertDate(
        this.message.LastUpdateDateTime
    )}</p>
              <p class="description">${this.message.ExternalDescription}</p>
          `;
    }
}
