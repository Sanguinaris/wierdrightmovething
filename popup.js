document.getElementById('Submit').onclick = setCordsStuff;
document.getElementById('maxTimeSlider').oninput = updateTimeSlider;

function setCordsStuff()
{
    const lat = document.getElementById('targetLat').value;
    const long = document.getElementById('targetLong').value;
    const maxTime = document.getElementById('maxTimeSlider').value * 60;

    chrome.storage.local.set({'lat': lat, 'lng': long, 'maxtime': maxTime});
}

function updateTimeSlider(evt)
{
    document.getElementById('maxTimeSliderLable').innerText = `Max time: ${evt.target.value}m`;
}

chrome.storage.local.get(['lat', 'lng', 'maxtime'], (res) => {
    if(res.lat)
        document.getElementById('targetLat').value = res.lat;
    if(res.lng)
        document.getElementById('targetLong').value = res.lng;
    if(res.maxtime){
        document.getElementById('maxTimeSliderLable').innerText = `Max time: ${res.maxtime / 60}m`;
        document.getElementById('maxTimeSlider').value = res.maxtime / 60;
    }
});