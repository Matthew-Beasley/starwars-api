/*
display data from four of the endpoints
people
films
vehicles
starships
*/
const refreshData = document.querySelector('#refresh');

const displayData = (data) => {
    const results = data.data.results; //review how to destructure this
    console.log(results);
    let html =
    '<ul>';
    results.forEach(item => {
           html += `<li>${item.name}</li>`
        })
    '</ul>';
    document.querySelector('#right-panel').innerHTML = html;
}

const fetchData = async (event) => {
    const people = axios.get('http://star-cors.herokuapp.com/people');
    const films = axios.get('http://star-cors.herokuapp.com/films');
    const results [peeps, flicks] = await Promise.all([people, films]);
    console.log(results);
    displayData(people);
}

refreshData.addEventListener('click', fetchData);
window.addEventListener('load', fetchData);
