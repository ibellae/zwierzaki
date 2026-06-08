const imageContainer = document.getElementById('imageContainer');
const animalNameEl = document.getElementById('animalName');
const statusText = document.getElementById('statusText');
const micBtn = document.getElementById('micBtn');
const hintText = document.getElementById('hintText');
const searchInput = document.getElementById('searchInput');
const animalGrid = document.getElementById('animalGrid');
const listSearchInput = document.getElementById('listSearchInput');

let currentAudio = null;
let currentAnimalEn = null;
let recognition = null;
let micActive = false; // true = mic is on and listening continuously
let restartTimer = null;

// Unlock audio on first touch (iOS requirement)
let audioUnlocked = false;
function unlockAudio() {
    if (audioUnlocked) return;
    const silence = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAgAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAbD/2wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAALAAJkAUAAAP/////////////////////////////////////////////////////////////////////////////////+MYxDAAAANIAAAAAP///////////////////////////////////////////////////////////////////////////////w==');
    silence.play().then(() => {
        audioUnlocked = true;
        silence.pause();
    }).catch(() => {});
}
document.addEventListener('touchstart', unlockAudio, { once: true });
document.addEventListener('click', unlockAudio, { once: true });

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    document.body.classList.add('no-speech');
    statusText.textContent = 'Wpisz nazwe zwierzecia ponizej';
}

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'pl-PL';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript = event.results[i][0].transcript;
        }
        statusText.textContent = `"${transcript}"`;

        if (event.results[event.results.length - 1].isFinal) {
            handleAnimalQuery(transcript.trim().toLowerCase());
        }
    };

    recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
            micActive = false;
            micBtn.classList.remove('listening');
            micBtn.classList.add('muted');
            statusText.textContent = 'Brak dostepu do mikrofonu. Sprawdz ustawienia.';
            return;
        }
        if (event.error === 'no-speech' || event.error === 'aborted') {
            // normal — will auto-restart via onend
            return;
        }
        statusText.textContent = 'Sprobuj ponownie.';
    };

    recognition.onend = () => {
        // Auto-restart if mic should be active
        if (micActive) {
            clearTimeout(restartTimer);
            restartTimer = setTimeout(() => {
                if (micActive) {
                    try { recognition.start(); } catch (e) {}
                }
            }, 300);
        }
    };
}

// Toggle mic on/off — user taps once to activate, then it stays on
function toggleMic() {
    if (!recognition) return;

    if (micActive) {
        // Turn off
        micActive = false;
        clearTimeout(restartTimer);
        try { recognition.stop(); } catch (e) {}
        micBtn.classList.remove('listening');
        micBtn.classList.add('muted');
        statusText.textContent = 'Mikrofon wylaczony';
        hintText.textContent = 'Tapnij mikrofon aby sluchac';
    } else {
        // Turn on
        micActive = true;
        micBtn.classList.remove('muted');
        micBtn.classList.add('listening');
        statusText.textContent = 'Slucham...';
        hintText.textContent = 'Powiedz np. "jak brzmi krowa"';
        try { recognition.start(); } catch (e) {
            // If start fails, retry once
            setTimeout(() => {
                try { recognition.start(); } catch (e2) {}
            }, 500);
        }
    }
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

    if (!query) return;

    const fromSentence = extractAnimalFromSentence(query);
    if (fromSentence && ANIMALS_DB[fromSentence]) {
        const data = ANIMALS_DB[fromSentence];
        showAnimal(fromSentence, data.en, data.emoji);
        return;
    }

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
        statusText.textContent = `Nie znam "${query}". Sprobuj innego zwierzecia.`;
        return;
    }

    showAnimal(found.pl, found.en, found.emoji);
}

function showAnimal(plName, enName, emoji) {
    currentAnimalEn = enName;
    animalNameEl.textContent = plName.toUpperCase();
    statusText.textContent = '';

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
        currentAudio = null;
    }

    imageContainer.classList.remove('playing');

    const audio = new Audio(`sounds/${enName}.mp3`);
    currentAudio = audio;

    audio.addEventListener('canplaythrough', () => {
        imageContainer.classList.add('playing');
    }, { once: true });

    audio.addEventListener('ended', () => {
        imageContainer.classList.remove('playing');
    });

    audio.addEventListener('error', () => {
        imageContainer.classList.remove('playing');
    });

    // Timeout safety - remove playing state after 30s max
    const safetyTimeout = setTimeout(() => {
        imageContainer.classList.remove('playing');
    }, 30000);

    audio.addEventListener('ended', () => clearTimeout(safetyTimeout));
    audio.addEventListener('error', () => clearTimeout(safetyTimeout));

    audio.play().catch(() => {
        imageContainer.classList.remove('playing');
        clearTimeout(safetyTimeout);
    });
}

function stopSound() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    imageContainer.classList.remove('playing');
}

// Tap image to play/stop
imageContainer.addEventListener('click', () => {
    if (currentAudio && !currentAudio.paused) {
        stopSound();
    } else if (currentAnimalEn) {
        playSound(currentAnimalEn);
    }
});

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
        e.preventDefault();
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
