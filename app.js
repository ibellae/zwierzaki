const imageContainer = document.getElementById('imageContainer');
const animalNameEl = document.getElementById('animalName');
const statusText = document.getElementById('statusText');
const micBtn = document.getElementById('micBtn');
const hintText = document.getElementById('hintText');
const searchInput = document.getElementById('searchInput');
const animalGrid = document.getElementById('animalGrid');
const listSearchInput = document.getElementById('listSearchInput');

let currentAnimalEn = null;
let recognition = null;
let micActive = false;
let restartTimer = null;

// --- Single reusable Audio element (iOS requires user-gesture unlock) ---
const sharedAudio = new Audio();
sharedAudio.preload = 'auto';
let audioReady = false; // true after first user-gesture play

function unlockAudio() {
    if (audioReady) return;
    // Play silent data URI to "bless" this element
    sharedAudio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAgAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAbD/2wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAALAAJkAUAAAP/////////////////////////////////////////////////////////////////////////////////+MYxDAAAANIAAAAAP///////////////////////////////////////////////////////////////////////////////w==';
    sharedAudio.play().then(() => {
        sharedAudio.pause();
        sharedAudio.currentTime = 0;
        audioReady = true;
    }).catch(() => {});
}
document.addEventListener('touchstart', unlockAudio, { once: false });
document.addEventListener('click', unlockAudio, { once: false });

// Wire up audio events for playing state
sharedAudio.addEventListener('playing', () => {
    imageContainer.classList.add('playing');
});
sharedAudio.addEventListener('ended', () => {
    imageContainer.classList.remove('playing');
});
sharedAudio.addEventListener('pause', () => {
    imageContainer.classList.remove('playing');
});
sharedAudio.addEventListener('error', () => {
    imageContainer.classList.remove('playing');
});

// --- Speech Recognition ---
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
            return;
        }
        statusText.textContent = 'Sprobuj ponownie.';
    };

    recognition.onend = () => {
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

function toggleMic() {
    if (!recognition) return;

    if (micActive) {
        micActive = false;
        clearTimeout(restartTimer);
        try { recognition.stop(); } catch (e) {}
        micBtn.classList.remove('listening');
        micBtn.classList.add('muted');
        statusText.textContent = 'Mikrofon wylaczony';
        hintText.textContent = 'Tapnij mikrofon aby sluchac';
    } else {
        micActive = true;
        micBtn.classList.remove('muted');
        micBtn.classList.add('listening');
        statusText.textContent = 'Slucham...';
        hintText.textContent = 'Powiedz np. "jak brzmi krowa"';
        try { recognition.start(); } catch (e) {
            setTimeout(() => {
                try { recognition.start(); } catch (e2) {}
            }, 500);
        }
    }
}

// --- Sentence parsing ---
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

// --- Display & Sound ---
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
    // Reuse the single shared Audio element
    sharedAudio.pause();
    sharedAudio.currentTime = 0;
    sharedAudio.src = `sounds/${enName}.mp3`;
    sharedAudio.play().catch(() => {
        // If play fails (iOS not unlocked yet), it will work on next tap
        imageContainer.classList.remove('playing');
    });
}

function stopSound() {
    sharedAudio.pause();
    sharedAudio.currentTime = 0;
    imageContainer.classList.remove('playing');
}

// Tap image to play/stop
imageContainer.addEventListener('click', () => {
    if (!sharedAudio.paused) {
        stopSound();
    } else if (currentAnimalEn) {
        playSound(currentAnimalEn);
    }
});

// --- Search ---
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

// --- Animal list ---
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
