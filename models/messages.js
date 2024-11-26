let url = 'https://trafik.emilfolino.se';

async function getAllMessages() {
    const response = await fetch(`${url}/messages`);

    const result = await response.json();

    return result;
}

const messagesModel = {
    getAllMessages,
};

export default messagesModel;
