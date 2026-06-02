const imageContainer = document.getElementById('imageContainer');
const animalNameEl = document.getElementById('animalName');
const statusText = document.getElementById('statusText');
const micBtn = document.getElementById('micBtn');
const replayBtn = document.getElementById('replayBtn');
const searchInput = document.getElementById('searchInput');
const animalGrid = document.getElementById('animalGrid');
const listSearchInput = document.getElementById('listSearchInput');

let currentAudio = null;
let currentAnimalEn = null;
let isListening = false;
let recognition = null;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    document.body.classList.add('no-speech');
    statusText.textContent = 'Wpisz nazwę zwierzęcia poniżej';
}

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'pl-PL';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript = event.results[i][0].transcript;
        }
        statusText.textContent = `Słyszę: "${transcript}"`;

        if (event.results[event.results.length - 1].isFinal) {
            stopListening();
            handleAnimalQuery(transcript.trim().toLowerCase());
        }
    };

    recognition.onerror = (event) => {
        stopListening();
        if (event.error === 'no-speech') {
            statusText.textContent = 'Nie usłyszałem. Spróbuj jeszcze raz.';
        } else {
            statusText.textContent = 'Błąd mikrofonu. Spróbuj ponownie.';
        }
    };

    recognition.onend = () => {
        stopListening();
    };
}

function toggleListening() {
    if (isListening) {
        recognition.stop();
        stopListening();
    } else {
        startListening();
    }
}

function startListening() {
    if (!recognition) return;
    isListening = true;
    micBtn.classList.add('listening');
    statusText.textContent = 'Słucham...';
    try {
        recognition.start();
    } catch (e) {
        stopListening();
    }
}

function stopListening() {
    isListening = false;
    micBtn.classList.remove('listening');
}

const SENTENCE_PATTERNS = [
    /jak (?:brzmi|robi|mówi|krzyczy|śpiewa|ryczy|warczy|miauczy|szczeka|wyje) (.+)/,
    /jaki (?:dźwięk|odgłos|głos) (?:wydaje|robi|ma) (.+)/,
    /jaki (?:dźwięk|odgłos|głos) (.+?) (?:wydaje|robi|ma)/,
    /(?:odtwórz|puść|zagraj|włącz|pokaż) (?:dźwięk|odgłos|głos) (.+)/,
    /(?:odtwórz|puść|zagraj|włącz|pokaż) (.+)/,
    /co (?:mówi|robi) (.+)/,
    /jak robi (.+)/,
    /(.+?) (?:jak (?:brzmi|robi|mówi))/,
];

function normalizeAnimalName(word) {
    if (ANIMALS_DB[word]) return word;
    if (DECLENSION_MAP[word]) return DECLENSION_MAP[word];
    return null;
}

function extractAnimalFromSentence(query) {
    for (const pattern of SENTENCE_PATTERNS) {
        const match = query.match(pattern);
        if (match) {
            const fragment = match[1].trim();
            const name = normalizeAnimalName(fragment);
            if (name) return name;
            const words = fragment.split(/\s+/);
            for (const w of words) {
                const n = normalizeAnimalName(w);
                if (n) return n;
            }
        }
    }
    return null;
}

function handleAnimalQuery(query) {
    query = query.replace(/[?.!,]/g, '').trim();

    // 1. Try sentence patterns first ("jak brzmi pies", "odtwórz dźwięk krowy")
    const fromSentence = extractAnimalFromSentence(query);
    if (fromSentence && ANIMALS_DB[fromSentence]) {
        const data = ANIMALS_DB[fromSentence];
        showAnimal(fromSentence, data.en, data.emoji);
        return;
    }

    // 2. Try direct match or declension on individual words
    const words = query.split(/\s+/);
    let found = null;

    for (let len = words.length; len >= 1; len--) {
        for (let i = 0; i <= words.length - len; i++) {
            const phrase = words.slice(i, i + len).join(' ');
            if (ANIMALS_DB[phrase]) {
                found = { pl: phrase, ...ANIMALS_DB[phrase] };
                break;
            }
            const normalized = normalizeAnimalName(phrase);
            if (normalized && ANIMALS_DB[normalized]) {
                found = { pl: normalized, ...ANIMALS_DB[normalized] };
                break;
            }
        }
        if (found) break;
    }

    if (!found) {
        for (const [pl, data] of Object.entries(ANIMALS_DB)) {
            if (query.includes(pl)) {
                found = { pl, ...data };
                break;
            }
        }
    }

    // 3. Try each word through declension as last resort
    if (!found) {
        for (const w of words) {
            const base = normalizeAnimalName(w);
            if (base && ANIMALS_DB[base]) {
                found = { pl: base, ...ANIMALS_DB[base] };
                break;
            }
        }
    }

    if (!found) {
        statusText.textContent = `Nie znam "${query}". Spróbuj innego zwierzęcia.`;
        return;
    }

    showAnimal(found.pl, found.en, found.emoji);
}

function showAnimal(plName, enName, emoji) {
    currentAnimalEn = enName;
    animalNameEl.textContent = plName.toUpperCase();
    statusText.textContent = '';
    replayBtn.classList.add('visible');

    const img = document.createElement('img');
    img.alt = plName;
    img.onload = () => { imageContainer.innerHTML = ''; imageContainer.appendChild(img); };
    img.onerror = () => { imageContainer.innerHTML = `<div class="placeholder-icon">${emoji}</div>`; };
    img.src = `images/${enName}.jpg`;

    playSound(enName);

    const listOverlay = document.getElementById('animalList');
    if (listOverlay.classList.contains('open')) {
        listOverlay.classList.remove('open');
    }
}

function playSound(enName) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    const audio = new Audio(`sounds/${enName}.mp3`);
    currentAudio = audio;

    imageContainer.classList.add('playing');
    audio.addEventListener('ended', () => {
        imageContainer.classList.remove('playing');
    });
    audio.addEventListener('error', () => {
        imageContainer.classList.remove('playing');
        statusText.textContent = 'Brak dźwięku dla tego zwierzęcia';
    });

    audio.play().catch(() => {
        imageContainer.classList.remove('playing');
        statusText.textContent = 'Dotknij ekranu i spróbuj ponownie';
    });
}

function replaySound() {
    if (currentAnimalEn) {
        playSound(currentAnimalEn);
    }
}

function searchAnimal() {
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
        handleAnimalQuery(query);
        searchInput.value = '';
        searchInput.blur();
    }
}

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchAnimal();
    }
});

function toggleList() {
    const overlay = document.getElementById('animalList');
    overlay.classList.toggle('open');
    if (overlay.classList.contains('open')) {
        renderGrid();
        listSearchInput.value = '';
        listSearchInput.focus();
    }
}

function renderGrid(filter = '') {
    animalGrid.innerHTML = '';
    const entries = Object.entries(UNIQUE_ANIMALS)
        .sort((a, b) => a[1].pl.localeCompare(b[1].pl, 'pl'));

    for (const [en, data] of entries) {
        if (filter && !data.pl.includes(filter)) continue;

        const tile = document.createElement('div');
        tile.className = 'animal-tile';
        tile.innerHTML = `<span class="tile-emoji">${data.emoji}</span><span class="tile-name">${data.pl}</span>`;
        tile.addEventListener('click', () => {
            showAnimal(data.pl, en, data.emoji);
        });
        animalGrid.appendChild(tile);
    }
}

function filterList() {
    renderGrid(listSearchInput.value.trim().toLowerCase());
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
