document.getElementById('Submit').onclick = setCordsStuff;

function setCordsStuff()
{
    const lat = document.getElementById('targetLat').value;
    const long = document.getElementById('targetLong').value;

    chrome.storage.local.set({'lat': lat, 'lng': long});
}

chrome.storage.local.get(['lat', 'lng'], (res) => {
    document.getElementById('targetLat').value = res.lat;
    document.getElementById('targetLong').value = res.lng;
});