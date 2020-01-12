const authHeaders = {
    'X-Application-Id': config.ApplicationId,
    'X-Api-Key': config.ApiKey,
    'Content-Type': 'application/json',
    'Accept-Language': 'en-GB',
}

async function ResolvePlace(placeName)
{
    const respo = await fetch(`https://api.traveltimeapp.com/v4/geocoding/search?query=${placeName}&focus.lat=${config.focusLoc.lat}&focus.lng=${config.focusLoc.lng}`, {method: 'GET', headers: authHeaders });
    if(!respo.ok)
        return null;

    return await respo.json();
}

async function DoMeUpFam(locations)
{
    let coolNewArr = [];
    for(let i = 0; i < locations.length; ++i)
    {
        if(coolNewArr.some(o => o.id === locations[i])) continue;

        const resp = await ResolvePlace(locations[i]);
        if(!resp) continue;
        if(resp.features.length <= 0) continue;

        coolNewArr.push({'id': locations[i], 'coords': {
            'lat': resp.features[0].geometry.coordinates[1],
            'lng': resp.features[0].geometry.coordinates[0],
        }})
    }
    return coolNewArr;
}

async function testFetch(locations)
{
    const reqBody = {
        'locations': locations,
        'arrival_searches': {
            'many_to_one': [
                {
                    'id': 'IsReachableWithinTime',
                    'departure_location_ids': locations.slice(0, -1).map(loc => loc.id),
                    'arrival_location_id': 'SavedPlace',
                    'transportation': {
                        'type': 'public_transport'
                      },
                      'arrival_time_period': 'weekday_morning',
                      'travel_time': config.maxTravelTime,
                      'properties': [
                          'travel_time'
                      ]
                }
            ]
        }
    }

    const ret = await fetch('https://api.traveltimeapp.com/v4/time-filter/fast', 
    {method: 'POST', headers: authHeaders, body: JSON.stringify(reqBody)});
    if(ret.ok) return await ret.json();
    return null; 
}

function ShitCanProperty(property)
{
    property.style.backgroundColor = "red";
}

function GudBoiOnMouseOver(evt)
{
    const property = evt.target;

    if(!gudResults) return;
    if(property.getElementsByClassName('mykewlttl').length > 0)
        return;

    const address = property.getElementsByTagName("address")[0].textContent;
    const ttl = gudResults.find(res => res.id === address);

    if(!ttl) return;
    const time = ttl.properties.travel_time;

    const  minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;

    const node = document.createElement('h2');
    node.innerText = `TTL: ${minutes}m ${seconds}s`;
    node.classList.add('propertyCard-title', 'mykewlttl')
    property.getElementsByClassName("propertyCard-link")[0].prepend(node);
}

function GudBoiPropertyNice(property, time)
{
    const  minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    
    property.style.backgroundColor = "green";
    const node = document.createElement('h2');
    node.innerText = `TTL: ${minutes}m ${seconds}s`;
    node.classList.add('propertyCard-title', 'mykewlttl')
    property.getElementsByClassName("propertyCard-link")[0].prepend(node);

    property.onmouseenter = GudBoiOnMouseOver;
}



function FuckUpHtml(result)
{
    for(let i = 0; i < props.length; ++i)
    {
        const property = props[i];
        const address = property.getElementsByTagName("address")[0].textContent;
        const ttl = result.find(res => res.id === address);

        if(!ttl) ShitCanProperty(property);
        else GudBoiPropertyNice(property, ttl.properties.travel_time);
    }
}

const props = document.getElementsByClassName("l-searchResult");
let locationsArr = [];
for(let i = 0; i < props.length; ++i)
{
    const property = props[i];
    const addy = property.getElementsByTagName("address");
    locationsArr.push(addy[0].textContent)
}

let gudResults = undefined;

async function DoTheNeedful()
{
    let locs = await DoMeUpFam(locationsArr);
    locs.push({'id': 'SavedPlace', 'coords': {
        'lat': config.targetLoc.lat,
        'lng': config.targetLoc.lng
    }});
    const result = await testFetch(locs);
    gudResults = result.results[0].locations;
    FuckUpHtml(gudResults);
}

DoTheNeedful()
