import authModel from '../models/auth.js';

export default class SingleFavorite extends HTMLElement {
    constructor() {
        super();

        this.artefact;
    }

    static get observedAttributes() {
        return ['favorite'];
    }

    get favorite() {
        return JSON.parse(this.getAttribute('favorite'));
    }

    connectedCallback() {
        this.artefact = JSON.parse(this.favorite.artefact);

        this.render();
    }

    render() {
        const container = document.createElement('div');

        container.classList.add('single-favorite');

        const p = document.createElement('p');

        p.innerHTML = this.artefact.AdvertisedLocationName;

        const div = document.createElement('div');

        div.classList.add('span-container');

        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        const span3 = document.createElement('span');

        span1.classList.add('material-symbols-outlined');
        span2.classList.add('material-symbols-outlined', 'star');
        span3.classList.add('material-symbols-outlined', 'delete');

        span1.innerHTML = 'expand_more';
        span2.innerHTML = 'star';
        span3.innerHTML = 'delete';

        span3.addEventListener('click', async () => {
            await authModel.deleteUserData(
                this.favorite.id,
                sessionStorage.getItem('token')
            );
            location.reload();
        });

        this.appendChild(container);
        container.appendChild(p);
        container.appendChild(div);
        div.appendChild(span1);
        div.appendChild(span2);
        div.appendChild(span3);
    }
}
