import { apiKey } from '../utils.js';

let url = 'https://auth.emilfolino.se';

async function login(email, password) {
    const user = {
        email: email,
        password: password,
        api_key: apiKey,
    };

    const response = await fetch(`${url}/login`, {
        body: JSON.stringify(user),
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    const result = await response.json();

    sessionStorage.setItem('token', result.data.token);
    sessionStorage.setItem('email', email);

    return result;
}

async function register(email, password) {
    const user = {
        email: email,
        password: password,
        api_key: apiKey,
    };

    const response = await fetch(`${url}/register`, {
        body: JSON.stringify(user),
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    const result = await response.json();

    return result;
}

async function createUserData(station, location, token) {
    let obj = {
        station,
        location,
    };
    let data = {
        artefact: JSON.stringify(obj),
        api_key: apiKey,
    };

    const response = await fetch(`${url}/data`, {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',
            'x-access-token': token,
        },
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    const result = await response.json();

    return result;
}

async function getUserData(token) {
    const response = await fetch(`${url}/data?api_key=${apiKey}`, {
        headers: {
            'x-access-token': token,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    const result = await response.json();

    return result;
}

async function deleteUserData(id, token) {
    var data = {
        id: id,
        api_key: apiKey,
    };

    const response = await fetch(`${url}/data`, {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',
            'x-access-token': token,
        },
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
}

const authModel = {
    login,
    register,
    createUserData,
    getUserData,
    deleteUserData,
};

export default authModel;
