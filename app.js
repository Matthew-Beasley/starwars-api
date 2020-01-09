

const makePaginator = () => {
    let peoplePage = 1;
    let filmsPage = 1;
    let vehiclesPage = 1;
    let starshipsPage = 1;

    return ({ catagory, contents, html }, action) => {
        let page;
        switch (catagory) {
            case 'people':
                page = peoplePage;
                break;
            case 'films':
                page = filmsPage;
                break;
            case 'vehicles':
                page = vehiclesPage;
                break;
            case 'starships':
                page = starshipsPage;
                break;
            default:
                break;
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
            <input type="text" value="" class="filter-input"></input>
            <h3>${catagory.toUpperCase()}</h3>`;
    return common;
}


const renderFields = dataObj => {

    for (let key in dataObj) {
        if (key) { //hack to get around linter error, need to get rid of this rule
            const catagoryObj = {};
            catagoryObj.catagory = key;
            catagoryObj.contents = dataObj[key];
            catagoryObj.html = commonHTML(key);

            switch (catagoryObj.catagory) {
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


window.addEventListener('load', fetchData);
