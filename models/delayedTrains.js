let url = 'https://trafik.emilfolino.se';

async function getDelayedTrains() {
    const response = await fetch(`${url}/delayed`);

    const result = await response.json();

    return result;
}

const DelayedTrainsModel = {
    getDelayedTrains,
};

export default DelayedTrainsModel;
