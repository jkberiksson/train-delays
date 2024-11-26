import Router from './router.js';

export default class Nav extends HTMLElement {
    constructor() {
        super();

        this.router = new Router();
    }

    connectedCallback() {
        window.addEventListener('hashchange', () => {
            this.render();
        });

        this.render();
    }

    render() {
        let cleanHash = location.hash.replace('#', '');
        const routes = this.router.routes;
        let navLinks = '';

        for (let path in routes) {
            if (routes[path].hidden) {
                continue;
            }

            const navLink = `
        <a href='#${path}'
        ${path === cleanHash ? 'class="active"' : ''}
        >
          ${routes[path].icon}
          <span class="icon-text">${routes[path].name}</span>
        </a>
      `;

            navLinks += navLink;
        }

        this.innerHTML = `<nav class="nav">${navLinks}</nav>`;
    }
}
