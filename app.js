
const displayPeople = ({ catagory, contents, html }) => {
    const { results, next } = contents;
    html +=
    `<div class="card-box">
        <h3>${catagory.toUpperCase()}</h3>`;

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


const displayFilms = ({ catagory, contents, html }) => {
    const { results, next } = contents;
    html += `<div class="card-box">
        <h3>${catagory.toUpperCase()}</h3>`;

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


const displayvehicles = ({ catagory, contents, html }) => {
    const { results, next } = contents;
    html += `<div class="card-box">
        <h3>${catagory.toUpperCase()}</h3>`;

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


const displayStarships = ({ catagory, contents, html }) => {
    const { results, next } = contents;
    html += `<div class="card-box">
        <h3>${catagory.toUpperCase()}</h3>`;

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


const renderFields = dataObj => {

    for (let key in dataObj) {
        if (key) { //hack to get around linter error, need to get rid of this rule
            const catagoryObj = {};
            catagoryObj.catagory = key;
            catagoryObj.contents = dataObj[key];
            catagoryObj.html = '';

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
