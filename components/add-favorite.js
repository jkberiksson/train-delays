import stationsModel from '../models/stations.js';

export default class AddFavorite extends HTMLElement {
    constructor() {
        super();

        this.stations = [];
    }

    async connectedCallback() {
        const res = await stationsModel.getAllStations();

        this.stations = res.data;

        this.render();

        this.renderStations(this.stations);

        const closeBtn = this.querySelector('.close');

        closeBtn.addEventListener('click', () => {
            const modal = document.querySelector('.add-favorite');

            modal.classList.add('hidden');
        });

        const searchInput = this.querySelector('.search-station');

        searchInput.addEventListener('input', (e) => {
            const searchQuery = e.target.value.trim().toLowerCase();

            this.handleSearchInput(searchQuery);
        });
    }

    handleSearchInput(searchInput) {
        const filteredStations = this.stations.filter((station) => {
            return (
                station.AdvertisedLocationName.toLowerCase().includes(searchInput) ||
        station.LocationSignature.toLowerCase().includes(searchInput)
            );
        });

        this.renderStations(filteredStations);
    }

    renderStations(stations) {
        const listHtml = document.querySelector('.list');

        const list = stations
            .map((station) => {
                return `<single-add-favorite station='${JSON.stringify(station)}'>
                    </single-add-favorite>`;
            })
            .join('');

        listHtml.innerHTML = list;
    }

    render() {
        this.innerHTML = `
        <div class="modal">
            <span class="material-symbols-outlined close">close</span>
            <input class="search-station" type="text" placeholder="Sök station"/> 
            <div class="list"></div>
        </div>
      `;
    }
}
