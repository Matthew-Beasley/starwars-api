
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
        const { name, birth_year, films } = person; // Im going to have to loop through these eventually
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


const commonHTML = (catagory) => {
    const common =
        `<div class="card-box">
            <label for="filter-input" >Filter</label>
            <input type="text" value="" class="filter-input ${catagory}-input"></input>
            <button type="submit" class="submit ${catagory}-submit">Get Data</button>
            <h3>${catagory.toUpperCase()}</h3>`;
    return common;
}


//not sure if these belong here or higher up
// not sure if I can't just have one method and control with cat obj
const filterCatagory = ({target}) => {
    const catObj = catagoryObjects.filter(cat => { return cat.catName === 'people' });
    console.log(catObj, target)

}


const getMoreData = (event) => {
    event.preventDefault();
    const { target } = event;
    const catObj = catagoryObjects.filter(cat => { return cat.catName === 'people' });
    console.log(catObj, target)
}


const renderFields = dataObj => {

    for (let key in dataObj) {
        if (key) { //hack to get around linter error, need to get rid of this rule
            const catagoryObj = {};
            catagoryObj.catName = key;
            catagoryObj.contents = dataObj[key];
            catagoryObj.html = commonHTML(key);
            catagoryObj.paginator = makePaginator();
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


// eslint-disable-next-line complexity
document.addEventListener('input', event => {
    if (event.target && event.target.classList.contains('people-input')) {
        filterCatagory(event)
    }
    else if (event.target && event.target.classList.contains('films-input')) {
        filterCatagory(event)
    }
    else if (event.target && event.target.classList.contains('vehicles-input')) {
        filterCatagory(event)
    }
    else if (event.target && event.target.classList.contains('starships-input')) {
        filterCatagory(event)
    }
});

// eslint-disable-next-line complexity
document.addEventListener('click', event => {
    if (event.target && event.target.classList.contains('people-submit')) {
        getMoreData(event)
    }
    else if (event.target && event.target.classList.contains('films-submit')) {
        getMoreData(event)
    }
    else if (event.target && event.target.classList.contains('vehicles-submit')) {
        getMoreData(event)
    }
    else if (event.target && event.target.classList.contains('starships-submit')) {
        getMoreData(event)
    }
});

window.addEventListener('load', fetchData); //this will probably have to go to make filtering work
