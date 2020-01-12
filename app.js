
const main = document.querySelector('main');
const catagoryObjects = [];

const makePaginator = () => {
    let page = 1;

    return (action, setPage) => {

        if (action === 'set' && page !== undefined) {
            page = setPage;
        }
        else if (action === 'forward') {
            page++;
        }
        else if (action === 'back') {
            if (page > 2) {
                page--;
            }
            else {
                page = 1;
            }
        }
        else if (action === 'reset') {
            page = 1;
        }
        else if (!action) {
            return page;
        }
    }
}


const displayPeople = (dataObj) => {
    const { results } = dataObj.contents;
    let html = `<p>Viewing Page ${dataObj.paginator()}</p>
    <p>Tolal number of records is ${dataObj.contents.count}</p>`;
    results.forEach(person => {
        const { name, birth_year, films } = person; // Im going to have to loop through these eventually to get dynamic data fields
        html +=
        `<div>
            <ul>
                <li class="box-header">${name}</li>
                <li>Appeared in ${films.length} films</>
                <li>Born ${birth_year}</li>
            </ul>
        </div>`;
    });
    document.querySelector(`.${dataObj.catName}-inner-div`).innerHTML = html;
}


const displayFilms = (dataObj) => {
    const { results } = dataObj.contents;
    let html = `<p>Viewing Page ${dataObj.paginator()}</p>
    <p>Tolal number of records is ${dataObj.contents.count}</p>`;

    results.forEach(film => {
        const { title, episode, director, producer, release_date } = film; // Im going to have to loop through these eventually
        html += `
        <div>
            <ul>
                <li class="box-header">${title}</li>
                <li>Episode: ${episode}</li>
                <li>Director: ${director}</li>
                <li>Producer: ${producer}</li>
                <li>Release Date: ${release_date}</li>
            </ul>
        </div>`;
    });
   document.querySelector(`.${dataObj.catName}-inner-div`).innerHTML = html;
}


const displayvehicles = (dataObj) => {
    const { results } = dataObj.contents;
    let html = `<p>Viewing Page ${dataObj.paginator()}</p>
    <p>Tolal number of records is ${dataObj.contents.count}</p>`;

    results.forEach(vehicle => {
        const { name, model, manufacturer } = vehicle; // Im going to have to loop through these eventually
        html += `
        <div>
            <ul>
                <li class="box-header">${name}</li>
                <li>Model: ${model}</li>
                <li>Manufacturer: ${manufacturer}</li>
            </ul>
        </div>`;
    });
    document.querySelector(`.${dataObj.catName}-inner-div`).innerHTML = html;
}


const displayStarships = (dataObj) => {
    const { results } = dataObj.contents;
    let html = `<p>Viewing Page ${dataObj.paginator()}</p>
    <p>Tolal number of records is ${dataObj.contents.count}</p>`;

    results.forEach(ship => {
        const { name, model, manufacturer } = ship; // Im going to have to loop through these eventually
        html += `
        <div>
            <ul>
                <li class="box-header">${name}</li>
                <li>Model: ${model}</li>
                <li>Manufacturer: ${manufacturer}</li>
            </ul>
        </div>`;
    });
    document.querySelector(`.${dataObj.catName}-inner-div`).innerHTML = html;
}


const commonHTML = (dataObj) => {
    const { contents, catName, paginator } = dataObj;
    const common =
    `   <label for="filter-input" >Filter</label>
        <input type="text" value="" class="filter-input ${catName}-input"></input>
        <button type="submit" class="submit ${catName}-submit">Get Data</button>
        <button type="submit" class="back ${catName}-back">Back</button>
        <h3>${catName.toUpperCase()}</h3>`;
    return common;
}


// Maybe make this more robust by replacing the hard coded ordinals (or not)
const filterCatagory = ({ target }) => {
    const divClass = target.classList[1].split('-')[0];
    const innerDivs = document.querySelectorAll(`.${divClass}-inner-div > div`);
    [...innerDivs].forEach(div => div.classList.add('hidden'));

    const searchStr = document.querySelector(`.${target.classList[1]}`).value;

    [...innerDivs].forEach(div => {
        if (div.children[0].children[0].innerText.toLowerCase().includes(searchStr.toLowerCase())) {
            div.classList.remove('hidden');
        }
        else if (!div.classList.contains('hidden')) {
            div.classList.add('hidden');
        }
    });
}


const repeatFetch = async (catagoryObject, direction) => {

    let promise;
    if (direction === 'forward') {
        promise = await axios.get(catagoryObject.contents.next);
        catagoryObject.paginator('forward');
    }
    else if (direction === 'back') {
        promise = await axios.get(catagoryObject.contents.previous);
        catagoryObject.paginator('back');
    }

    const { results, next, previous } = promise.data;
    catagoryObject.contents.next = next;
    catagoryObject.contents.previous = previous
    catagoryObject.html = commonHTML(catagoryObject);
    catagoryObject.contents.results = results;

    switch (catagoryObject.catName) {
        case 'people':
            displayPeople(catagoryObject);
            break;
        case 'films':
            displayFilms(catagoryObject);
            break;
        case 'vehicles':
            displayvehicles(catagoryObject);
            break;
        case 'starships':
            displayStarships(catagoryObject);
            break;
        default:
            break;
    }
}


const getMoreData = event => {
    event.preventDefault();
    const { target } = event;
    const nameFromClass = target.classList[1].split('-')[0];

    for (let i = 0; i < catagoryObjects.length; i++) {
        if (catagoryObjects[i].catName === nameFromClass) {
            repeatFetch(catagoryObjects[i], 'forward');
        }
    }
}


const getLessData = event => {
    event.preventDefault();
    const { target } = event;
    const nameFromClass = target.classList[1].split('-')[0];

    for (let i = 0; i < catagoryObjects.length; i++) {
        if (catagoryObjects[i].catName === nameFromClass) {
            repeatFetch(catagoryObjects[i], 'back');
        }
    }
}


const renderFields = dataObj => {

    // eslint-disable-next-line guard-for-in
    for (let key in dataObj) {

        const catagoryObj = {};
        catagoryObj.catName = key;
        catagoryObj.contents = dataObj[key];
        catagoryObj.url = dataObj.next;
        catagoryObj.paginator = makePaginator();
        catagoryObj.html = `
        <div class="card-box ${catagoryObj.catName}-card-box">`;
            catagoryObj.html += commonHTML(catagoryObj);
            catagoryObj.html += `
            <div class="${catagoryObj.catName}-inner-div inner-div">        
            </div>
        </div>`;
        catagoryObjects.push(catagoryObj);

        main.innerHTML += catagoryObj.html;

        switch (catagoryObj.catName) {
            case 'people':
                displayPeople(catagoryObj);
                break;
            case 'films':
                displayFilms(catagoryObj);
                break;
            case 'vehicles':
                displayvehicles(catagoryObj);
                break;
            case 'starships':
                displayStarships(catagoryObj);
                break;
            default:
                break;
        }
    }
}


const fetchData = async event => {
    event.preventDefault();

    const baseUrl = 'http://star-cors.herokuapp.com/';
    const catagories = ['people', 'films', 'vehicles', 'starships'];

    const promises = catagories.map(cat => {return axios.get(`${baseUrl}${cat}`)});
    const requestResults = await Promise.all(promises);

    const sanitizedObj = requestResults.reduce((acc, item, idx) => {
        acc[catagories[idx]] = item.data;
        return acc;
    }, {})

    renderFields(sanitizedObj);
}


main.addEventListener('input', event => {
    if (event.target && event.target.classList.contains('filter-input')) {
        filterCatagory(event)
    }
});

main.addEventListener('click', event => {
    if (event.target && event.target.classList.contains('submit')) {
        getMoreData(event)
    }
});

main.addEventListener('click', event => {
    if (event.target && event.target.classList.contains('back')) {
        getLessData(event)
    }
});

window.addEventListener('load', fetchData);
