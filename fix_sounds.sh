#!/bin/bash
API="j3t7wIORx8aQUxLnSl7HHvF7WzvcPky8w1QAT4wf"
DIR="C:/Users/izabe/Desktop/code/animal-sounds-app/sounds"

# Each entry: animal=query|name_must_contain
# name_must_contain ensures the result actually IS about that animal
declare -A FIXES=(
    ["bat"]="bat screech|bat"
    ["bear"]="bear growl|bear"
    ["beaver"]="beaver|beaver"
    ["bison"]="bison|bison"
    ["buffalo"]="water buffalo|buffalo"
    ["cat"]="cat meow|cat"
    ["cheetah"]="cheetah|cheetah"
    ["chimpanzee"]="chimpanzee|chimp"
    ["cricket"]="cricket chirp|cricket"
    ["cuckoo"]="cuckoo|cuckoo"
    ["duck"]="duck quack|duck"
    ["eagle"]="bald eagle|eagle"
    ["elephant"]="elephant trumpet|elephant"
    ["fox"]="fox scream|fox"
    ["frog"]="frog ribbit|frog"
    ["goose"]="goose honk|goose"
    ["gorilla"]="gorilla|gorilla"
    ["guinea_pig"]="guinea pig|guinea"
    ["hamster"]="hamster|hamster"
    ["hedgehog"]="hedgehog|hedgehog"
    ["hippo"]="hippo|hippo"
    ["horse"]="horse neigh|horse"
    ["hummingbird"]="hummingbird|hummingbird"
    ["hyena"]="hyena|hyena"
    ["jaguar"]="jaguar growl|jaguar"
    ["kangaroo"]="kangaroo|kangaroo"
    ["koala"]="koala|koala"
    ["leopard"]="leopard|leopard"
    ["monkey"]="monkey screech|monkey"
    ["moose"]="moose call|moose"
    ["mosquito"]="mosquito|mosquito"
    ["mouse"]="mouse squeak|mouse"
    ["otter"]="otter|otter"
    ["owl"]="owl hoot|owl"
    ["panda"]="panda|panda"
    ["panther"]="panther|panther"
    ["parrot"]="parrot|parrot"
    ["peacock"]="peacock|peacock"
    ["pelican"]="pelican|pelican"
    ["penguin"]="penguin|penguin"
    ["rabbit"]="rabbit|rabbit"
    ["raccoon"]="raccoon|raccoon"
    ["raven"]="raven croak|raven"
    ["rhino"]="rhino|rhino"
    ["seagull"]="seagull|seagull"
    ["snake"]="snake hiss|snake"
    ["squirrel"]="squirrel|squirrel"
    ["stork"]="stork|stork"
    ["swan"]="swan|swan"
    ["tiger"]="tiger growl|tiger"
    ["toucan"]="toucan|toucan"
    ["whale"]="whale|whale"
    ["wild_boar"]="wild boar|boar"
    ["zebra"]="zebra|zebra"
)

total=${#FIXES[@]}
count=0
ok=0
fail=0

for animal in $(echo "${!FIXES[@]}" | tr ' ' '\n' | sort); do
    count=$((count + 1))
    IFS='|' read -r query must_contain <<< "${FIXES[$animal]}"
    encoded=$(printf '%s' "$query" | sed 's/ /+/g')

    # Search with up to 15 results to find one with matching name
    resp=$(curl -s -m 10 -H "Authorization: Token $API" "https://freesound.org/apiv2/search/text/?query=${encoded}&fields=id,name,previews,duration&page_size=15&sort=rating_desc")

    # Parse results and find one whose name contains the animal
    url=""
    match_name=""
    while IFS= read -r line; do
        name=$(echo "$line" | grep -oi "[^\"]*${must_contain}[^\"]*" | head -1)
        if [ -n "$name" ]; then
            # Extract the preview URL for this result
            preview=$(echo "$line" | grep -o '"preview-hq-mp3":"[^"]*"' | cut -d'"' -f4)
            if [ -n "$preview" ]; then
                url="$preview"
                match_name="$name"
                break
            fi
        fi
    done <<< "$(echo "$resp" | tr '},{' '\n')"

    # Fallback: try extracting each result block
    if [ -z "$url" ]; then
        names=$(echo "$resp" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
        urls=$(echo "$resp" | grep -o '"preview-hq-mp3":"[^"]*"' | cut -d'"' -f4)

        i=0
        while IFS= read -r n; do
            i=$((i + 1))
            lower_n=$(echo "$n" | tr 'A-Z' 'a-z')
            lower_m=$(echo "$must_contain" | tr 'A-Z' 'a-z')
            if echo "$lower_n" | grep -q "$lower_m"; then
                url=$(echo "$urls" | sed -n "${i}p")
                match_name="$n"
                break
            fi
        done <<< "$names"
    fi

    if [ -z "$url" ]; then
        echo "[$count/$total] $animal - NO MATCH (nothing contains '$must_contain')"
        fail=$((fail + 1))
        sleep 0.3
        continue
    fi

    curl -s -m 15 -o "$DIR/$animal.mp3" "$url"
    size=$(wc -c < "$DIR/$animal.mp3" 2>/dev/null || echo 0)

    if [ "$size" -gt 1000 ]; then
        echo "[$count/$total] $animal - OK [$match_name] (${size}b)"
        ok=$((ok + 1))
    else
        echo "[$count/$total] $animal - DOWNLOAD FAIL"
        fail=$((fail + 1))
    fi

    sleep 0.3
done

echo ""
echo "FIXED: $ok OK, $fail FAILED out of $total"
