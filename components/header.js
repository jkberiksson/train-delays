export default class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `<header><img src="./img/tt.png" alt="logo"></header>`;
    }
}
