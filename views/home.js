import stationsModel from '../models/stations.js';

export default class HomeView extends HTMLElement {
    constructor() {
        super();

        this.stations = [];
    }

    async connectedCallback() {
        const res = await stationsModel.getAllStations();

        this.stations = res.data;

        this.renderHtml();

        this.renderStations(this.stations);

        const searchInput = this.querySelector('.search');

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
                return `<single-station station='${JSON.stringify(station)}'>
                    </single-station>`;
            })
            .join('');

        listHtml.innerHTML = list;
    }

    renderHtml() {
        this.innerHTML = `
    <input class="search" type="text" placeholder="Sök station...">
    <div class="info">
      <p>Namn</p>
      <p>Signatur</p>
    </div>
    <div class="list"></div>`;
    }
}
