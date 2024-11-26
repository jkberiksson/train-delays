import messagesModel from '../models/messages.js';

export default class AlertView extends HTMLElement {
    constructor() {
        super();

        this.messages = [];
    }

    async connectedCallback() {
        const res = await messagesModel.getAllMessages();

        this.messages = res.data;

        this.renderHtml();

        this.renderMessages(this.messages);

        const searchInput = this.querySelector('.search');

        searchInput.addEventListener('input', (e) => {
            const searchQuery = e.target.value.toLowerCase();

            this.handleSearchInput(searchQuery);
        });
    }

    handleSearchInput(searchInput) {
        const filteredMessages = this.messages.filter((message) => {
            return message.ExternalDescription.toLowerCase().includes(searchInput);
        });

        this.renderMessages(filteredMessages);
    }

    renderMessages(messages) {
        const listHtml = document.querySelector('.list');

        const list = messages
            .map((message) => {
                return `<single-message message='${JSON.stringify(message)}'>
                    </single-message>`;
            })
            .join('');

        listHtml.innerHTML = list;
    }

    renderHtml() {
        this.innerHTML = `
    <input class="search" type="text" placeholder="Sök...">
    <div class="list"></div>`;
    }
}
