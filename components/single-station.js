/**
 *
 *
 * @author Jakob Eriksson
 * @export
 * @class SingleStation
 * @extends {HTMLElement}
 */
export default class SingleStation extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['station'];
    }

    get station() {
        return JSON.parse(this.getAttribute('station'));
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
        <div>
            <p>${this.station.AdvertisedLocationName}</p>
            <p>${this.station.LocationSignature}</p>
        </div>
        `;
    }
}
