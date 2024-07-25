document.addEventListener('DOMContentLoaded', () => {
    let filterGoodDogs = false;

    fetchPups();

    const filterButton = document.getElementById('good-dog-filter');
    filterButton.addEventListener('click', toggleFilter);

    function toggleFilter() {
        filterGoodDogs = !filterGoodDogs;
        filterButton.textContent = `Filter good dogs: ${filterGoodDogs ? 'ON' : 'OFF'}`;
        fetchPups();
    }

    function fetchPups() {
        fetch('http://localhost:3000/pups')
            .then(res => res.json())
            .then(pups => {
                if (filterGoodDogs) {
                    pups = pups.filter(pup => pup.isGoodDog);
                }
                displayPups(pups);
            })
            .catch(error => alert(`Fetching Pups: ${error}`));
    }

    function displayPups(pups) {
        const dogBar = document.getElementById('dog-bar');
        dogBar.innerHTML = '';
        pups.forEach(pup => displayPup(pup));
    }

    function displayPup(pup) {
        const dogBar = document.getElementById('dog-bar');
        const dogName = document.createElement('span');
        dogName.textContent = pup.name;
        dogName.addEventListener('click', () => showPupInfo(pup));
        dogBar.appendChild(dogName);
    }

    function showPupInfo(pup) {
        const dogInfo = document.getElementById('dog-info');
        dogInfo.innerHTML = `
            <img src="${pup.image}" alt="${pup.name}">
            <h2>${pup.name}</h2>
            <button id="toggle-good-dog">${pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
        `;
        const button = document.getElementById('toggle-good-dog');
        button.addEventListener('click', () => toggleGoodDog(pup, button));
    }

    function toggleGoodDog(pup, button) {
        pup.isGoodDog = !pup.isGoodDog;
        button.textContent = pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';

        fetch(`http://localhost:3000/pups/${pup.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isGoodDog: pup.isGoodDog }),
        })
        .then(res => res.json())
        .then(updatedPup => {
            pup.isGoodDog = updatedPup.isGoodDog;
        })
        .catch(error => alert(`Updating Pup: ${error}`));
    }
});
