import authModel from '../models/auth.js';
import { toast } from '../utils.js';

export default class LoginView extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    async loginUser() {
        const form = this.querySelector('.login-form');
        const formData = new FormData(form);

        const email = formData.get('email');
        const password = formData.get('password');

        try {
            await authModel.login(email, password);
            location.hash = 'favorite';
        } catch (error) {
            toast('Whoops... Något gick fel. Försök igen!');
        }
    }

    render() {
        const form = document.createElement('form');

        form.classList.add('login-form');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.loginUser();
        });

        const username = document.createElement('input');

        username.setAttribute('type', 'email');
        username.setAttribute('placeholder', 'Email');
        username.setAttribute('name', 'email');
        username.setAttribute('required', true);
        username.classList.add('username');

        const password = document.createElement('input');

        password.setAttribute('type', 'password');
        password.setAttribute('placeholder', 'Lösenord');
        password.setAttribute('name', 'password');
        password.setAttribute('required', true);
        password.classList.add('password');

        const loginBtn = document.createElement('input');

        loginBtn.setAttribute('type', 'submit');
        loginBtn.setAttribute('value', 'Logga in');
        loginBtn.classList.add('form-btn', 'login-btn');

        const p = document.createElement('p');

        p.innerHTML =
      '<a class="nav-item" href="#register">Inte medlem? Klicka här</a>';

        form.appendChild(username);
        form.appendChild(password);
        form.appendChild(loginBtn);
        form.appendChild(p);

        this.innerHTML = `<h1>Logga in</h1>`;
        this.appendChild(form);
    }
}
