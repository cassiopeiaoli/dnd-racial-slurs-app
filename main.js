const path = 'dnd-racial-slurs.json';
const buttonsContainer = document.querySelector('.buttons');
const input = document.querySelector('input');
const slurs = document.querySelector('.slurs');

let showingSlurs = false;

async function getSlurs(race = undefined) {
    if (race === undefined) {
        const data = await fetch(path);
        return data.json();
    }

    return (await getSlurs()).filter(r => r.title === race)[0];
}

function renderButtons(races) {
    races.forEach(({ title }) => {
        const button = document.createElement('button');
        button.textContent = title;
        buttonsContainer.appendChild(button);
        button.addEventListener('click', async () => {
            showingSlurs = false;
            const race = await getSlurs(title);
            const raceSlurs = race.list;
            slurs.innerHTML = `
            <h2>${title}</h2>
            <ul class='slurs-list'></ul>`;
            slurs.style.display = 'block';
            const list = document.querySelector('.slurs-list');
            raceSlurs.forEach(slur => {
                const li = document.createElement('li');
                li.textContent = slur;
                list.appendChild(li);
            });
            showingSlurs = true;
        });
    });
}

window.addEventListener('click', () => {
    if (showingSlurs) {
        slurs.style.display = 'none';
        showingSlurs = false;
    }
});

(async ()=> {
    const races = await getSlurs();
    renderButtons(races);
    input.addEventListener('input', () => {
        buttonsContainer.innerHTML = '';
        const text = input.value;
        if (text === '') {
            renderButtons(races);
        } else {
            renderButtons(
                races.filter(({title}) => title.toLowerCase().includes(text.toLowerCase()))
            );
        }
    });
})();