const ANIMALS_DB = {
    "niedźwiedź": { en: "bear", emoji: "🐻" },
    "alpaka": { en: "alpaca", emoji: "🦙" },
    "kot": { en: "cat", emoji: "🐱" },
    "kocur": { en: "cat", emoji: "🐱" },
    "kotek": { en: "cat", emoji: "🐱" },
    "pies": { en: "dog", emoji: "🐶" },
    "piesek": { en: "dog", emoji: "🐶" },
    "krowa": { en: "cow", emoji: "🐄" },
    "koń": { en: "horse", emoji: "🐴" },
    "świnia": { en: "pig", emoji: "🐷" },
    "prosiak": { en: "pig", emoji: "🐷" },
    "owca": { en: "sheep", emoji: "🐑" },
    "owieczka": { en: "sheep", emoji: "🐑" },
    "koza": { en: "goat", emoji: "🐐" },
    "kurczak": { en: "chicken", emoji: "🐔" },
    "kura": { en: "chicken", emoji: "🐔" },
    "kogut": { en: "rooster", emoji: "🐓" },
    "kaczka": { en: "duck", emoji: "🦆" },
    "gęś": { en: "goose", emoji: "🪿" },
    "indyk": { en: "turkey", emoji: "🦃" },
    "wilk": { en: "wolf", emoji: "🐺" },
    "lew": { en: "lion", emoji: "🦁" },
    "tygrys": { en: "tiger", emoji: "🐯" },
    "słoń": { en: "elephant", emoji: "🐘" },
    "małpa": { en: "monkey", emoji: "🐒" },
    "goryl": { en: "gorilla", emoji: "🦍" },
    "sowa": { en: "owl", emoji: "🦉" },
    "żaba": { en: "frog", emoji: "🐸" },
    "wrona": { en: "crow", emoji: "🐦‍⬛" },
    "orzeł": { en: "eagle", emoji: "🦅" },
    "papuga": { en: "parrot", emoji: "🦜" },
    "delfin": { en: "dolphin", emoji: "🐬" },
    "wieloryb": { en: "whale", emoji: "🐋" },
    "foka": { en: "seal", emoji: "🦭" },
    "wąż": { en: "snake", emoji: "🐍" },
    "pszczoła": { en: "bee", emoji: "🐝" },
    "świerszcz": { en: "cricket", emoji: "🦗" },
    "cykada": { en: "cicada", emoji: "🪲" },
    "komar": { en: "mosquito", emoji: "🦟" },
    "gołąb": { en: "pigeon", emoji: "🕊️" },
    "mewa": { en: "seagull", emoji: "🐦" },
    "pingwin": { en: "penguin", emoji: "🐧" },
    "hiena": { en: "hyena", emoji: "🦊" },
    "osioł": { en: "donkey", emoji: "🫏" },
    "wielbłąd": { en: "camel", emoji: "🐫" },
    "jeleń": { en: "deer", emoji: "🦌" },
    "łoś": { en: "moose", emoji: "🫎" },
    "lis": { en: "fox", emoji: "🦊" },
    "lisek": { en: "fox", emoji: "🦊" },
    "kojot": { en: "coyote", emoji: "🐺" },
    "szop": { en: "raccoon", emoji: "🦝" },
    "szop pracz": { en: "raccoon", emoji: "🦝" },
    "wiewiórka": { en: "squirrel", emoji: "🐿️" },
    "mysz": { en: "mouse", emoji: "🐭" },
    "myszka": { en: "mouse", emoji: "🐭" },
    "nietoperz": { en: "bat", emoji: "🦇" },
    "jastrząb": { en: "hawk", emoji: "🦅" },
    "paw": { en: "peacock", emoji: "🦚" },
    "łabędź": { en: "swan", emoji: "🦢" },
    "flaming": { en: "flamingo", emoji: "🦩" },
    "tukan": { en: "toucan", emoji: "🐦" },
    "dzięcioł": { en: "woodpecker", emoji: "🐦" },
    "wróbel": { en: "sparrow", emoji: "🐦" },
    "kanarek": { en: "canary", emoji: "🐤" },
    "szympans": { en: "chimpanzee", emoji: "🐵" },
    "hipopotam": { en: "hippo", emoji: "🦛" },
    "nosorożec": { en: "rhino", emoji: "🦏" },
    "zebra": { en: "zebra", emoji: "🦓" },
    "żyrafa": { en: "giraffe", emoji: "🦒" },
    "koala": { en: "koala", emoji: "🐨" },
    "kangur": { en: "kangaroo", emoji: "🦘" },
    "panda": { en: "panda", emoji: "🐼" },
    "leopard": { en: "leopard", emoji: "🐆" },
    "gepard": { en: "cheetah", emoji: "🐆" },
    "pantera": { en: "panther", emoji: "🐆" },
    "bizon": { en: "bison", emoji: "🦬" },
    "mors": { en: "walrus", emoji: "🦭" },
    "wydra": { en: "otter", emoji: "🦦" },
    "bóbr": { en: "beaver", emoji: "🦫" },
    "jeż": { en: "hedgehog", emoji: "🦔" },
    "chomik": { en: "hamster", emoji: "🐹" },
    "świnka morska": { en: "guinea_pig", emoji: "🐹" },
    "królik": { en: "rabbit", emoji: "🐰" },
    "dzik": { en: "wild_boar", emoji: "🐗" },
    "sęp": { en: "vulture", emoji: "🦅" },
    "bocian": { en: "stork", emoji: "🪽" },
    "koliber": { en: "hummingbird", emoji: "🐦" },
    "słowik": { en: "nightingale", emoji: "🐦" },
    "kukułka": { en: "cuckoo", emoji: "🐦" },
    "sroka": { en: "magpie", emoji: "🐦" },
    "kruk": { en: "raven", emoji: "🐦‍⬛" },
    "krokodyl": { en: "crocodile", emoji: "🐊" },
    "grzechotnik": { en: "rattlesnake", emoji: "🐍" },
    "drozd": { en: "thrush", emoji: "🐦" },
    "sikora": { en: "titmouse", emoji: "🐦" },
    "sikorka": { en: "titmouse", emoji: "🐦" },
    "ryba": { en: "fish", emoji: "🐟" },
    "rybka": { en: "fish", emoji: "🐟" },
    "mrówka": { en: "ant", emoji: "🐜" },
    "żółw": { en: "turtle", emoji: "🐢" },
    "biedronka": { en: "ladybug", emoji: "🐞" },
};

// Polish declension forms → base form (nominative)
const DECLENSION_MAP = {
    // pies
    "psa": "pies", "psu": "pies", "psem": "pies", "psie": "pies",
    "pieska": "piesek", "piesku": "piesek", "pieskiem": "piesek",
    // kot
    "kota": "kot", "kotu": "kot", "kotem": "kot", "kocie": "kot",
    "kotka": "kotek", "kotku": "kotek", "kotkiem": "kotek",
    "kocura": "kocur",
    // krowa
    "krowy": "krowa", "krowie": "krowa", "krowę": "krowa", "krową": "krowa",
    // koń
    "konia": "koń", "koniowi": "koń", "koniem": "koń", "koniu": "koń",
    // świnia
    "świni": "świnia", "świnię": "świnia", "świnią": "świnia",
    "prosiaka": "prosiak", "prosiakiem": "prosiak",
    // owca
    "owcy": "owca", "owcę": "owca", "owcą": "owca",
    "owieczki": "owieczka", "owieczką": "owieczka", "owieczce": "owieczka",
    // koza
    "kozy": "koza", "kozie": "koza", "kozę": "koza", "kozą": "koza",
    // kura/kurczak
    "kury": "kura", "kurze": "kura", "kurę": "kura", "kurą": "kura",
    "kurczaka": "kurczak", "kurczakiem": "kurczak",
    // kogut
    "koguta": "kogut", "kogutem": "kogut",
    // kaczka
    "kaczki": "kaczka", "kaczce": "kaczka", "kaczkę": "kaczka", "kaczką": "kaczka",
    // gęś
    "gęsi": "gęś", "gęsią": "gęś",
    // indyk
    "indyka": "indyk", "indykiem": "indyk",
    // wilk
    "wilka": "wilk", "wilkiem": "wilk", "wilku": "wilk",
    // lew
    "lwa": "lew", "lwu": "lew", "lwem": "lew", "lwie": "lew",
    // tygrys
    "tygrysa": "tygrys", "tygrysem": "tygrys",
    // słoń
    "słonia": "słoń", "słoniem": "słoń", "słoniu": "słoń",
    // małpa
    "małpy": "małpa", "małpie": "małpa", "małpę": "małpa", "małpą": "małpa",
    // goryl
    "goryla": "goryl", "gorylem": "goryl",
    // sowa
    "sowy": "sowa", "sowie": "sowa", "sowę": "sowa", "sową": "sowa",
    // żaba
    "żaby": "żaba", "żabie": "żaba", "żabę": "żaba", "żabą": "żaba",
    // wrona
    "wrony": "wrona", "wronie": "wrona", "wronę": "wrona", "wroną": "wrona",
    // orzeł
    "orła": "orzeł", "orłem": "orzeł", "orle": "orzeł",
    // papuga
    "papugi": "papuga", "papudze": "papuga", "papugę": "papuga", "papugą": "papuga",
    // delfin
    "delfina": "delfin", "delfinem": "delfin",
    // wieloryb
    "wieloryba": "wieloryb", "wielorybem": "wieloryb",
    // foka
    "foki": "foka", "foce": "foka", "fokę": "foka", "foką": "foka",
    // wąż
    "węża": "wąż", "wężem": "wąż", "wężu": "wąż",
    // pszczoła
    "pszczoły": "pszczoła", "pszczole": "pszczoła", "pszczołę": "pszczoła", "pszczołą": "pszczoła",
    // niedźwiedź
    "niedźwiedzia": "niedźwiedź", "niedźwiedziem": "niedźwiedź", "niedźwiedziu": "niedźwiedź",
    // alpaka
    "alpaki": "alpaka", "alpace": "alpaka", "alpakę": "alpaka", "alpaką": "alpaka",
    // gołąb
    "gołębia": "gołąb", "gołębiem": "gołąb", "gołębiu": "gołąb",
    // mewa
    "mewy": "mewa", "mewie": "mewa", "mewę": "mewa", "mewą": "mewa",
    // pingwin
    "pingwina": "pingwin", "pingwinem": "pingwin",
    // hiena
    "hieny": "hiena", "hienie": "hiena", "hienę": "hiena", "hieną": "hiena",
    // osioł
    "osła": "osioł", "osłem": "osioł", "ośle": "osioł",
    // wielbłąd
    "wielbłąda": "wielbłąd", "wielbłądem": "wielbłąd",
    // jeleń
    "jelenia": "jeleń", "jeleniem": "jeleń", "jeleniu": "jeleń",
    // łoś
    "łosia": "łoś", "łosiem": "łoś",
    // lis
    "lisa": "lis", "lisem": "lis",
    "liska": "lisek", "lisku": "lisek", "liskiem": "lisek",
    // kojot
    "kojota": "kojot", "kojotem": "kojot",
    // szop
    "szopa": "szop", "szopem": "szop",
    // wiewiórka
    "wiewiórki": "wiewiórka", "wiewiórce": "wiewiórka", "wiewiórkę": "wiewiórka", "wiewiórką": "wiewiórka",
    // mysz
    "myszy": "mysz", "myszą": "mysz",
    "myszki": "myszka", "myszce": "myszka", "myszkę": "myszka", "myszką": "myszka",
    // nietoperz
    "nietoperza": "nietoperz", "nietoperzem": "nietoperz",
    // jastrząb
    "jastrzębia": "jastrząb", "jastrzębiem": "jastrząb",
    // paw
    "pawia": "paw", "pawiem": "paw", "pawiu": "paw",
    // łabędź
    "łabędzia": "łabędź", "łabędziem": "łabędź",
    // flaming
    "flaminga": "flaming", "flamingiem": "flaming",
    // tukan
    "tukana": "tukan", "tukanem": "tukan",
    // dzięcioł
    "dzięcioła": "dzięcioł", "dzięciołem": "dzięcioł",
    // wróbel
    "wróbla": "wróbel", "wróblem": "wróbel",
    // kanarek
    "kanarka": "kanarek", "kanarkiem": "kanarek",
    // szympans
    "szympansa": "szympans", "szympansem": "szympans",
    // hipopotam
    "hipopotama": "hipopotam", "hipopotamem": "hipopotam",
    // nosorożec
    "nosorożca": "nosorożec", "nosorożcem": "nosorożec",
    // zebra
    "zebry": "zebra", "zebrze": "zebra", "zebrę": "zebra", "zebrą": "zebra",
    // żyrafa
    "żyrafy": "żyrafa", "żyrafie": "żyrafa", "żyrafę": "żyrafa", "żyrafą": "żyrafa",
    // koala
    "koali": "koala", "koalę": "koala", "koalą": "koala",
    // kangur
    "kangura": "kangur", "kangurem": "kangur",
    // panda
    "pandy": "panda", "pandzie": "panda", "pandę": "panda", "pandą": "panda",
    // leopard
    "leoparda": "leopard", "leopardem": "leopard",
    // gepard
    "geparda": "gepard", "gepardem": "gepard",
    // pantera
    "pantery": "pantera", "panterze": "pantera", "panterę": "pantera", "panterą": "pantera",
    // bizon
    "bizona": "bizon", "bizonem": "bizon",
    // mors
    "morsa": "mors", "morsem": "mors",
    // wydra
    "wydry": "wydra", "wydrze": "wydra", "wydrę": "wydra", "wydrą": "wydra",
    // bóbr
    "bobra": "bóbr", "bobrem": "bóbr",
    // jeż
    "jeża": "jeż", "jeżem": "jeż",
    // chomik
    "chomika": "chomik", "chomikiem": "chomik",
    // świnka morska
    "świnki morskiej": "świnka morska",
    // królik
    "królika": "królik", "królikiem": "królik",
    // dzik
    "dzika": "dzik", "dzikiem": "dzik",
    // sęp
    "sępa": "sęp", "sępem": "sęp",
    // bocian
    "bociana": "bocian", "bocianem": "bocian",
    // koliber
    "kolibra": "koliber", "kolibrem": "koliber",
    // słowik
    "słowika": "słowik", "słowikiem": "słowik",
    // kukułka
    "kukułki": "kukułka", "kukułce": "kukułka", "kukułkę": "kukułka", "kukułką": "kukułka",
    // sroka
    "sroki": "sroka", "sroce": "sroka", "srokę": "sroka", "sroką": "sroka",
    // kruk
    "kruka": "kruk", "krukiem": "kruk",
    // krokodyl
    "krokodyla": "krokodyl", "krokodylem": "krokodyl",
    // grzechotnik
    "grzechotnika": "grzechotnik", "grzechotnikiem": "grzechotnik",
    // drozd
    "drozda": "drozd", "drozdem": "drozd",
    // sikora
    "sikory": "sikora", "sikorze": "sikora", "sikorę": "sikora", "sikorą": "sikora",
    "sikorki": "sikorka", "sikorce": "sikorka", "sikorkę": "sikorka", "sikorką": "sikorka",
    // ryba
    "ryby": "ryba", "rybie": "ryba", "rybę": "ryba", "rybą": "ryba",
    "rybki": "rybka", "rybce": "rybka", "rybkę": "rybka", "rybką": "rybka",
    // mrówka
    "mrówki": "mrówka", "mrówce": "mrówka", "mrówkę": "mrówka", "mrówką": "mrówka",
    // żółw
    "żółwia": "żółw", "żółwiem": "żółw", "żółwiu": "żółw",
    // biedronka
    "biedronki": "biedronka", "biedronce": "biedronka", "biedronkę": "biedronka", "biedronką": "biedronka",
    // świerszcz
    "świerszcza": "świerszcz", "świerszczem": "świerszcz",
    // cykada
    "cykady": "cykada", "cykadzie": "cykada", "cykadę": "cykada", "cykadą": "cykada",
    // komar
    "komara": "komar", "komarem": "komar",
};

const UNIQUE_ANIMALS = {};
for (const [pl, data] of Object.entries(ANIMALS_DB)) {
    if (!UNIQUE_ANIMALS[data.en]) {
        UNIQUE_ANIMALS[data.en] = { pl, emoji: data.emoji };
    }
}
