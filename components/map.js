/* global mapboxgl */
/* global io */

import DelayedTrainsModel from '../models/delayedTrains.js';
import StationsModel from '../models/stations.js';
import { mapKey } from '../utils.js';

export default class Map extends HTMLElement {
    constructor() {
        super();

        this.delayed = [];
        this.stations = [];
        this.loading = false;
    }

    async connectedCallback() {
        const res = await DelayedTrainsModel.getDelayedTrains();
        const res1 = await StationsModel.getAllStations();

        this.delayed = res.data;
        this.stations = res1.data;

        this.loading = true;

        this.render();

        navigator.geolocation.getCurrentPosition(
            (position) => this.successLocation(position),
            () => this.errorLocation()
        );
    }

    successLocation(position) {
        this.loading = false;

        this.render();
        this.setupMap([position.coords.longitude, position.coords.latitude]);
    }

    errorLocation() {
        this.loading = false;

        this.render();
        this.setupMap([18.06324, 59.334591]);
    }

    setupMap(center) {
        mapboxgl.accessToken = mapKey;

        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v11',
            center: center,
            zoom: 6,
        });

        this.renderCurrentLocation(center, map);

        this.renderTrainLocation(map);

        this.changeMapView(map);
    }

    renderCurrentLocation(center, map) {
        const popup = new mapboxgl.Popup({
            offset: 25,
            className: 'popup',
        }).setText('Din nuvarande plats');

        new mapboxgl.Marker({ scale: 0.8 })
            .setLngLat(center)
            .setPopup(popup)
            .addTo(map);
    }

    renderTrainLocation(map) {
        const socket = io('https://trafik.emilfolino.se');

        socket.on('position', (data) => {
            const delayedTrain = this.delayed.find(
                (delay) => delay.OperationalTrainNumber === data.train
            );

            if (!delayedTrain) {
                return;
            }

            const station = this.stations.find(
                (station) =>
                    station.LocationSignature === delayedTrain.LocationSignature
            );

            if (!station) {
                return;
            }

            const existingMarker = document.getElementById(`train-${data.train}`);
            const existingPopup = document.querySelector(`.popup-${data.train}`);

            if (existingMarker) {
                existingMarker.remove();
            }
            if (existingPopup) {
                existingPopup.remove();
            }

            const advertisedTime = new Date(delayedTrain.AdvertisedTimeAtLocation);
            const estimatedTime = new Date(delayedTrain.EstimatedTimeAtLocation);
            const timeDifference = estimatedTime - advertisedTime;
            const minutesDifference = timeDifference / (1000 * 60);

            const fromStation = this.stations.find(
                (station) =>
                    station.LocationSignature ===
          delayedTrain.FromLocation[0].LocationName
            );
            const toStation = this.stations.find(
                (station) =>
                    station.LocationSignature === delayedTrain.ToLocation[0].LocationName
            );

            const markerElement = document.createElement('span');

            markerElement.id = `train-${data.train}`;
            markerElement.className = 'material-symbols-outlined train-color';
            markerElement.textContent = 'train';

            const popup = new mapboxgl.Popup({
                offset: 25,
                className: `popup popup-${data.train}`,
            }).setHTML(
                `<div>
          <p>Tåg: ${data.train}</p>
          <p>Från: ${fromStation.AdvertisedLocationName}</p>
          <p>Till: ${toStation.AdvertisedLocationName}</p>
          <p>Senaste station: ${station.AdvertisedLocationName}</p>
          <p>Försenat: ${minutesDifference} min</p>
        </div>`
            );

            new mapboxgl.Marker({
                element: markerElement,
            })
                .setLngLat([data.position[1], data.position[0]])
                .setPopup(popup)
                .addTo(map);
        });
    }

    changeMapView(map) {
        const layerList = document.getElementById('menu');
        const inputs = layerList.getElementsByTagName('input');

        for (const input of inputs) {
            input.onclick = (layer) => {
                const layerId = layer.target.id;

                map.setStyle('mapbox://styles/mapbox/' + layerId);
            };
        }
    }

    render() {
        this.loading
            ? (this.innerHTML = `<div class="loading"><span class="material-symbols-outlined">
          progress_activity</span><h1>Laddar</h1></div>`)
            : (this.innerHTML = `<div id="menu">
        <div>
            <input id="satellite-streets-v12" type="radio" name="rtoggle" value="satellite">
            <label for="satellite-streets-v12">satellite</label>
        </div>
        <div>
            <input id="light-v11" type="radio" name="rtoggle" value="light">
            <label for="light-v11">light</label>
        </div>
        <div>
            <input id="dark-v11" type="radio" name="rtoggle" value="dark" checked="checked">
            <label for="dark-v11">dark</label>
        </div>
        <div>
            <input id="streets-v12" type="radio" name="rtoggle" value="streets">
            <label for="streets-v12">streets</label>
        </div>
        <div>
            <input id="outdoors-v12" type="radio" name="rtoggle" value="outdoors">
            <label for="outdoors-v12">outdoors</label>
        </div>
    </div>
    <div id="map"></div>
    `);
    }
}
