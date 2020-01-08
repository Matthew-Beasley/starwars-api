/*
display data from four of the endpoints
people
films
vehicles
starships
*/
const displayPeople = (data) => {
    /*const results = data; //review how to destructure this
    console.log(results);
    let html =
    '<ul>';
    results.forEach(item => {
           html += `<li>${item.name}</li>`
        })
    html += '</ul>';
    document.querySelector('#right-panel').innerHTML = html;*/
}

const fetchData = async (event) => {
    event.preventDefault();
    const people = axios.get('http://star-cors.herokuapp.com/people');
    const films = axios.get('http://star-cors.herokuapp.com/films');
    const vehicles = axios.get('http://star-cors.herokuapp.com/vehicles');
    const starships = axios.get('http://star-cors.herokuapp.com/starships');
    const results = await Promise.all([people, films, vehicles, starships] );
    console.log(results);

    displayPeople();
}

window.addEventListener('load', fetchData);
