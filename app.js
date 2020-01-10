
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


const displayPeople = ({ contents, html }) => {
    const { results, next } = contents;

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
    html +=
    '</div>';

    document.querySelector('main').innerHTML += html;
}


const displayFilms = ({ contents, html }) => {
    const { results, next } = contents;

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
    html += '</div>';
    document.querySelector('main').innerHTML += html;
}


const displayvehicles = ({ contents, html }) => {
    const { results, next } = contents;

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
    html += '</div>';
    document.querySelector('main').innerHTML += html;
}


const displayStarships = ({ contents, html }) => {
    const { results, next } = contents;

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
    html += '</div>';
    document.querySelector('main').innerHTML += html
}

// this will not update when I fetch another page (except I will regen entire page?)
const commonHTML = ({ catName, contents, paginator }) => {
    const totalPages = Math.ceil(contents.count / 10);

    const common =
        `<div class="card-box ${catName}-card-box">
            <label for="filter-input" >Filter</label>
            <input type="text" value="" class="filter-input ${catName}-input"></input>
            <p>Viewing Page ${paginator()} of ${totalPages} Pages</p>
            <p>Tolal number of records is ${contents.count}</p>
            <button type="submit" class="submit ${name}-submit">Get Data</button>
            <h3>${catName.toUpperCase()}</h3>`;
    return common;
}


// I think I can make this more robust by replacing the hard coded ordinals
const filterCatagory = ({ target }) => {
    const divClass = target.classList[1].split('-')[0];
    const cardBoxDivs = document.querySelectorAll(`.${divClass}-card-box > div`);
    [...cardBoxDivs].forEach(div => div.classList.add('hidden'));

    const searchStr = document.querySelector(`.${target.classList[1]}`).value;

    [...cardBoxDivs].forEach(div => {
        if (div.children[0].children[0].innerText.toLowerCase().includes(searchStr.toLowerCase())) {
            div.classList.remove('hidden');
        }
        else if (!div.classList.contains('hidden')) {
            div.classList.add('hidden');
        }
    });
}


const getMoreData = (event) => {
    event.preventDefault();
    const { target } = event;
    const catObj = catagoryObjects.filter(cat => { return cat.catName === 'people' });
    console.log(catObj, target)
}


const renderFields = dataObj => {

    // eslint-disable-next-line guard-for-in
    for (let key in dataObj) {

        const catagoryObj = {};
        catagoryObj.catName = key;
        catagoryObj.contents = dataObj[key];
        catagoryObj.paginator = makePaginator();
        catagoryObj.html = commonHTML(catagoryObj);

        // so far this global array of deta objects isn't being used. Yay me!
        catagoryObjects.push(catagoryObj); //pushing to a global array for later use, Refactor this to go global or local, not both

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

//move event listeners into render code (perhaps commonHTML?)
document.querySelector('main').addEventListener('input', event => {
    if (event.target && event.target.classList.contains('filter-input')) {
        filterCatagory(event)
    }
});

document.addEventListener('click', event => {
    if (event.target && event.target.classList.contains('people-submit')) {
        getMoreData(event)
});


window.addEventListener('load', fetchData); //this will probably have to go to make filtering work
