import authModel from '../models/auth.js';
import DelayedTrainsModel from '../models/delayedTrains.js';
import stationsModel from '../models/stations.js';
import { convertDate, toast } from '../utils.js';

export default class FavoriteView extends HTMLElement {
    constructor() {
        super();

        this.favorites = [];
        this.stations = [];
        this.filteredStations = [];
        this.delayedTrains = [];
    }

    async connectedCallback() {
        if (!sessionStorage.getItem('token')) {
            location.hash = 'login';
            return;
        }

        const res = await authModel.getUserData(sessionStorage.getItem('token'));
        const res1 = await stationsModel.getAllStations();
        const res2 = await DelayedTrainsModel.getDelayedTrains();

        this.favorites = res.data;
        this.stations = res1.data;
        this.delayedTrains = res2.data;

        this.render();
        this.renderFilteredStations(this.stations);
        this.renderFavorites(this.favorites);
        this.setupEventListeners();

        const search = this.querySelector('.search-input');
        const addFavoriteBtn = this.querySelector('.add-favorite-btn');
        const logoutBtn = this.querySelector('.logout-btn');
        const closeBtn = this.querySelector('.close');

        search.addEventListener('input', (e) => {
            this.filterStations(e.target.value.toLowerCase());
            this.setupEventListeners();
        });

        addFavoriteBtn.addEventListener('click', () => {
            const modal = document.querySelector('.modal-wrapper');

            modal.classList.remove('hidden');
            this.renderFilteredStations(this.stations);
            this.setupEventListeners();
        });

        logoutBtn.addEventListener('click', () => {
            sessionStorage.clear();
            location.hash = 'login';
        });

        closeBtn.addEventListener('click', () => {
            const modal = document.querySelector('.modal-wrapper');
            const searchInput = modal.querySelector('.search-input');

            searchInput.value = '';
            modal.classList.add('hidden');
        });
    }

    async addFavorite(event) {
        let cityAlreadyExists = false;

        this.favorites.forEach((favorite) => {
            let favoriteCity = JSON.parse(favorite.artefact).station;

            if (favoriteCity === event.target.parentElement.dataset.station) {
                toast(`Ser ut som ${favoriteCity} redan finns i favoriter...`);
                cityAlreadyExists = true;
                return;
            }
        });

        if (cityAlreadyExists) {
            return;
        }

        await authModel.createUserData(
            event.target.parentElement.dataset.station,
            event.target.parentElement.dataset.location,
            sessionStorage.getItem('token')
        );

        const res = await authModel.getUserData(sessionStorage.getItem('token'));

        this.favorites = res.data;

        const modal = document.querySelector('.modal-wrapper');
        const searchInput = modal.querySelector('.search-input');

        searchInput.value = '';
        modal.classList.add('hidden');
        this.renderFavorites(this.favorites);
        this.setupEventListeners();
    }

    async deleteFavorite(event) {
        await authModel.deleteUserData(
            parseInt(
                event.target.parentElement.parentElement.parentElement.dataset.id
            ),
            sessionStorage.getItem('token')
        );

        const res = await authModel.getUserData(sessionStorage.getItem('token'));

        this.favorites = res.data;

        this.renderFavorites(this.favorites);
        this.setupEventListeners();
    }

    expandFavorite(event) {
        const isHidden =
      event.target.parentElement.parentElement.nextElementSibling.classList.contains(
          'hidden'
      );

        if (isHidden) {
            event.target.parentElement.parentElement.nextElementSibling.classList.remove(
                'hidden'
            );
            return;
        }

        event.target.parentElement.parentElement.nextElementSibling.classList.add(
            'hidden'
        );
    }

    setupEventListeners() {
        const addToFavoriteBtns = this.querySelectorAll('.add-to-favorite-btn');
        const deleteFavoriteBtns = this.querySelectorAll('.delete');
        const expandBtns = this.querySelectorAll('.expand');

        addToFavoriteBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                this.addFavorite(e);
            });
        });

        deleteFavoriteBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                this.deleteFavorite(e);
            });
        });

        expandBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                this.expandFavorite(e);
            });
        });
    }

    filterStations(searchInputValue) {
        const list = this.stations.filter((station) => {
            return (
                station.AdvertisedLocationName.toLowerCase().includes(
                    searchInputValue
                ) || station.LocationSignature.toLowerCase().includes(searchInputValue)
            );
        });

        this.renderFilteredStations(list);
    }

    renderFilteredStations(stations) {
        const listHtml = document.querySelector('.search-list');

        const list = stations
            .map((station) => {
                return `<div class="single-search" data-station="${station.AdvertisedLocationName}"
                    data-location="${station.LocationSignature}">
                    <p>${station.AdvertisedLocationName}</p>
                    <button class="add-to-favorite-btn">Lägg till</button>
                </div>`;
            })
            .join('');

        listHtml.innerHTML = list;
    }

    renderDelayedTrains(location) {
        const delayed = this.delayedTrains
            .filter((station) => {
                return station.LocationSignature === location;
            })
            .map((station) => {
                return `
        <div class="delayed-train">
          <div>
            <p>Tåg</p>
            <p>${station.OperationalTrainNumber}</p>
          </div>
          <div class="delay">
            <p>Avgångstid</p>
            <p>${convertDate(station.AdvertisedTimeAtLocation)}</p>
          </div>
          <div>
            <p>Ny avgångstid</p>
            <p>${convertDate(station.EstimatedTimeAtLocation)}</p>
          </div>
        </div>
      `;
            })
            .join('');

        return delayed;
    }

    renderFavorites(favorites) {
        const listHtml = document.querySelector('.favorite-list');

        const list = favorites
            .map((favorite) => {
                return `<div class="single-favorite" data-id=${
                    favorite.id
                } data-station="${favorite.artefact}">
                      <div class="single-favorite-container">
                        <p>${JSON.parse(favorite.artefact).station}</p>
                        <div class="span-container">
                          <span class="material-symbols-outlined expand">expand_more</span>
                          <span class="material-symbols-outlined delete">delete</span>
                        </div>
                      </div>
                      <div class="info-container hidden">
                        ${
    this.renderDelayedTrains(
        JSON.parse(favorite.artefact).location
    ) === ''
        ? '<h4>Inga Försenade tåg</h4>'
        : ''
}
                        ${
    this.renderDelayedTrains(
        JSON.parse(favorite.artefact).location
    ) === ''
        ? ''
        : this.renderDelayedTrains(
            JSON.parse(favorite.artefact).location
        )
}
                      </div>
                  </div>`;
            })
            .join('');

        listHtml.innerHTML = list;
    }

    render() {
        this.innerHTML = `
      <div class="profile">
        <span class="material-symbols-outlined">account_circle</span>
        <p>${sessionStorage.getItem('email')}</p>
        <button class="logout-btn">Logga ut</button>
      </div>
      <button class="add-favorite-btn">Lägg till favorit</button>
      <div class="modal-wrapper hidden">
        <div class="modal">
          <div class="close-btn-container">
            <span class="material-symbols-outlined close">close</span>
          </div>
          <input class="search-input" type="text" placeholder="Sök station"/> 
          <div class="search-list"></div>
        </div>
      </div>
      <div class="favorite-list"></div>`;
    }
}
