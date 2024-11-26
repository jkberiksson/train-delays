export default class Router extends HTMLElement {
    constructor() {
        super();

        this.currentRoute = '';
        this.wildcard = '';

        this.allRoutes = {
            '': {
                view: '<home-view></home-view>',
                icon: '<span class="icon material-symbols-outlined">home</span>',
                name: 'Stationer',
            },
            delay: {
                view: '<delay-view></delay-view>',
                icon: '<span class="icon material-symbols-outlined">railway_alert</span>',
                name: 'Förseningar',
            },
            alert: {
                view: '<alert-view></alert-view>',
                icon: '<span class="icon material-symbols-outlined">info</span>',
                name: 'Information',
            },
            favorite: {
                view: '<favorite-view></favorite-view>',
                icon: '<span class="icon material-symbols-outlined">star</span>',
                name: 'Favoriter',
            },
            login: {
                view: '<login-view></login-view>',
                name: 'Logga in',
                hidden: true,
            },
            register: {
                view: '<register-view></register-view>',
                name: 'Registrera användare',
                hidden: true,
            },
        };
    }

    get routes() {
        return this.allRoutes;
    }

    connectedCallback() {
        window.addEventListener('hashchange', () => {
            this.resolveRoute();
        });

        this.resolveRoute();
    }

    resolveRoute() {
        let cleanHash = location.hash.replace('#', '');

        if (cleanHash.indexOf('/') > -1) {
            let spliitedhash = cleanHash.split('/');

            cleanHash = spliitedhash[0];
            this.wildcard = spliitedhash[1];
        }

        this.currentRoute = cleanHash;

        this.render();
    }

    render() {
        let html = '<not-found></not-found>';

        if (this.routes[this.currentRoute]) {
            html = this.routes[this.currentRoute].view;

            if (this.wildcard) {
                html = html.replace('$wildcard', this.wildcard);
            }
        }
        this.innerHTML = html;
    }
}
