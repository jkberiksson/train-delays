import authModel from '../models/auth.js';

export default class SingleAddFavorite extends HTMLElement {
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

    async handleSubmit(station) {
        const modal = document.querySelector('.add-favorite');

        await authModel.createUserData(station, sessionStorage.getItem('token'));

        modal.classList.add('hidden');

        location.reload();
    }

    render() {
        const button = document.createElement('button');

        button.classList.add('favoritadd-favorite-btn');
        button.innerHTML = 'Lägg till favorit';
        button.addEventListener('click', () => {
            this.handleSubmit(this.station);
        });

        const p = document.createElement('p');

        p.innerHTML = this.station.AdvertisedLocationName;

        this.appendChild(p);
        this.appendChild(button);
    }
}
