import Nav from './nav.js';
import Router from './router.js';
import DelayView from './views/delay.js';
import HomeView from './views/home.js';
import AlertView from './views/alert.js';
import FavoriteView from './views/favorite.js';
import LoginView from './views/login.js';
import RegisterView from './views/register.js';
import Header from './components/header.js';
import SingleStation from './components/single-station.js';
import SingleMessage from './components/single-message.js';
import Map from './components/map.js';

customElements.define('router-outlet', Router);
customElements.define('nav-outlet', Nav);
customElements.define('home-view', HomeView);
customElements.define('delay-view', DelayView);
customElements.define('alert-view', AlertView);
customElements.define('favorite-view', FavoriteView);
customElements.define('login-view', LoginView);
customElements.define('register-view', RegisterView);
customElements.define('header-outlet', Header);
customElements.define('single-station', SingleStation);
customElements.define('single-message', SingleMessage);
customElements.define('map-outlet', Map);