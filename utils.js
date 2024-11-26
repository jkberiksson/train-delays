const apiKey = '73019bbe732d18028e24a949bbd85763';
const mapKey = `pk.eyJ1IjoiamFrb2Jlcmlrc3NvbiIsImEiOiJjbH
ZwNm9udWEwbjk2MmlrMTZwNmVyZmc3In0.lBEnMhOOM1f-cuJmpW2KxQ`;

function toast(msg) {
    const toast = document.querySelector('.toast');

    toast.innerHTML = msg;
    toast.classList.add('visible');

    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
}

function convertDate(dateString) {
    const date = new Date(dateString);

    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };

    const formattedDate = date.toLocaleDateString('sv-SE', options);

    return formattedDate;
}

export { apiKey, toast, convertDate, mapKey };
