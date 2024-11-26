let url = 'https://trafik.emilfolino.se';

async function getAllStations() {
    const response = await fetch(`${url}/stations`);

    const result = await response.json();

    return result;
}

const stationsModel = {
    getAllStations,
};

export default stationsModel;
