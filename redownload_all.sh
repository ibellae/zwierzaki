#!/bin/bash
API="j3t7wIORx8aQUxLnSl7HHvF7WzvcPky8w1QAT4wf"
DIR="C:/Users/izabe/Desktop/code/animal-sounds-app/sounds"
mkdir -p "$DIR"

# Very specific queries for each animal - the sound they actually make
declare -A QUERIES=(
    ["bear"]="bear growl roar"
    ["alpaca"]="alpaca humming"
    ["cat"]="cat meowing meow"
    ["dog"]="dog barking bark"
    ["cow"]="cow mooing moo"
    ["horse"]="horse neigh whinny"
    ["pig"]="pig oink squeal"
    ["sheep"]="sheep baa bleating"
    ["goat"]="goat bleat"
    ["chicken"]="chicken clucking hen"
    ["rooster"]="rooster crowing cock"
    ["duck"]="duck quacking quack"
    ["goose"]="goose honking honk"
    ["turkey"]="turkey gobble gobbling"
    ["wolf"]="wolf howling howl"
    ["lion"]="lion roaring roar"
    ["tiger"]="tiger growl roar"
    ["elephant"]="elephant trumpet call"
    ["monkey"]="monkey screeching chattering"
    ["gorilla"]="gorilla chest beating grunt"
    ["owl"]="owl hooting hoot"
    ["frog"]="frog croaking ribbit"
    ["crow"]="crow cawing caw"
    ["eagle"]="eagle screeching cry"
    ["parrot"]="parrot talking squawking"
    ["dolphin"]="dolphin clicking whistle"
    ["whale"]="whale song singing"
    ["seal"]="seal barking"
    ["snake"]="snake hissing rattle"
    ["bee"]="bee buzzing buzz"
    ["cricket"]="cricket chirping"
    ["cicada"]="cicada singing buzzing"
    ["mosquito"]="mosquito buzzing"
    ["pigeon"]="pigeon cooing coo"
    ["seagull"]="seagull call crying"
    ["penguin"]="penguin call"
    ["hyena"]="hyena laughing"
    ["donkey"]="donkey braying bray"
    ["camel"]="camel grunting"
    ["deer"]="deer call stag"
    ["moose"]="moose call bull"
    ["fox"]="fox barking cry"
    ["coyote"]="coyote howling"
    ["raccoon"]="raccoon chittering"
    ["squirrel"]="squirrel chattering"
    ["mouse"]="mouse squeaking squeak"
    ["bat"]="bat screeching echolocation"
    ["hawk"]="hawk screeching cry"
    ["peacock"]="peacock calling cry"
    ["swan"]="swan call honk"
    ["flamingo"]="flamingo honking call"
    ["toucan"]="toucan call croaking"
    ["woodpecker"]="woodpecker drumming pecking"
    ["sparrow"]="sparrow chirping singing"
    ["canary"]="canary singing bird song"
    ["chimpanzee"]="chimpanzee screeching hooting"
    ["hippo"]="hippo grunting"
    ["rhino"]="rhinoceros grunt snort"
    ["zebra"]="zebra barking call"
    ["giraffe"]="giraffe humming"
    ["koala"]="koala bellowing call"
    ["kangaroo"]="kangaroo grunting"
    ["panda"]="panda bleating"
    ["jaguar"]="jaguar growling snarling"
    ["leopard"]="leopard growl snarl"
    ["cheetah"]="cheetah chirping purring"
    ["panther"]="panther growl snarl big cat"
    ["buffalo"]="buffalo bellowing grunt"
    ["bison"]="bison bellowing"
    ["walrus"]="walrus bellowing"
    ["otter"]="otter squeaking chirping"
    ["beaver"]="beaver slapping"
    ["hedgehog"]="hedgehog snuffling"
    ["hamster"]="hamster squeaking"
    ["guinea_pig"]="guinea pig squeaking wheeking"
    ["rabbit"]="rabbit thumping squealing"
    ["wild_boar"]="wild boar grunting snorting"
    ["vulture"]="vulture hissing"
    ["stork"]="stork bill clattering"
    ["pelican"]="pelican grunting"
    ["hummingbird"]="hummingbird humming wings"
    ["nightingale"]="nightingale singing bird song"
    ["cuckoo"]="cuckoo bird call"
    ["magpie"]="magpie chattering call"
    ["raven"]="raven croaking call"
)

total=${#QUERIES[@]}
count=0
ok=0
fail=0

for animal in $(echo "${!QUERIES[@]}" | tr ' ' '\n' | sort); do
    count=$((count + 1))
    query="${QUERIES[$animal]}"
    encoded=$(printf '%s' "$query" | sed 's/ /+/g')

    resp=$(curl -s -m 10 -H "Authorization: Token $API" "https://freesound.org/apiv2/search/text/?query=${encoded}&fields=id,name,previews,duration&page_size=5&sort=rating_desc&filter=duration:%5B0.5+TO+10%5D")

    # Get the best short result
    url=$(echo "$resp" | grep -o '"preview-hq-mp3":"[^"]*"' | head -1 | cut -d'"' -f4)
    name=$(echo "$resp" | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)

    if [ -z "$url" ]; then
        echo "[$count/$total] $animal - NO RESULT for: $query"
        fail=$((fail + 1))
        sleep 0.5
        continue
    fi

    curl -s -m 15 -o "$DIR/$animal.mp3" "$url"
    size=$(wc -c < "$DIR/$animal.mp3" 2>/dev/null || echo 0)

    if [ "$size" -gt 1000 ]; then
        echo "[$count/$total] $animal - OK (${size}b) [$name]"
        ok=$((ok + 1))
    else
        echo "[$count/$total] $animal - DOWNLOAD FAIL"
        fail=$((fail + 1))
    fi

    sleep 0.5
done

echo ""
echo "DONE: $ok OK, $fail FAILED out of $total"
