export default class DelayView extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `<map-outlet></map-outlet>`;
    }
}
