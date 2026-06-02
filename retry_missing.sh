#!/bin/bash
API="j3t7wIORx8aQUxLnSl7HHvF7WzvcPky8w1QAT4wf"
DIR="C:/Users/izabe/Desktop/code/animal-sounds-app/sounds"

# Simpler, broader queries without duration filter
declare -A QUERIES=(
    ["bat"]="bat squeak"
    ["beaver"]="beaver"
    ["bison"]="bison"
    ["buffalo"]="buffalo"
    ["camel"]="camel"
    ["canary"]="canary singing"
    ["cheetah"]="cheetah"
    ["chimpanzee"]="chimpanzee"
    ["cicada"]="cicada"
    ["deer"]="deer"
    ["dolphin"]="dolphin"
    ["eagle"]="eagle"
    ["flamingo"]="flamingo"
    ["fox"]="fox"
    ["giraffe"]="giraffe"
    ["gorilla"]="gorilla"
    ["guinea_pig"]="guinea pig"
    ["hawk"]="hawk"
    ["hedgehog"]="hedgehog"
    ["hippo"]="hippopotamus"
    ["hummingbird"]="hummingbird"
    ["jaguar"]="jaguar animal"
    ["kangaroo"]="kangaroo"
    ["koala"]="koala"
    ["leopard"]="leopard"
    ["magpie"]="magpie bird"
    ["monkey"]="monkey"
    ["moose"]="moose"
    ["otter"]="otter"
    ["panda"]="panda"
    ["panther"]="panther animal"
    ["peacock"]="peacock"
    ["pelican"]="pelican"
    ["rabbit"]="rabbit"
    ["raccoon"]="raccoon"
    ["rhino"]="rhino"
    ["seal"]="seal animal"
    ["snake"]="snake hiss"
    ["sparrow"]="sparrow"
    ["stork"]="stork"
    ["toucan"]="toucan"
    ["vulture"]="vulture"
    ["walrus"]="walrus"
    ["wild_boar"]="boar"
    ["woodpecker"]="woodpecker"
    ["zebra"]="zebra"
)

total=${#QUERIES[@]}
count=0
ok=0

for animal in $(echo "${!QUERIES[@]}" | tr ' ' '\n' | sort); do
    count=$((count + 1))
    query="${QUERIES[$animal]}"
    encoded=$(printf '%s' "$query" | sed 's/ /+/g')

    resp=$(curl -s -m 10 -H "Authorization: Token $API" "https://freesound.org/apiv2/search/text/?query=${encoded}&filter=tag:animal&fields=id,name,previews,duration&page_size=3&sort=rating_desc")
    url=$(echo "$resp" | grep -o '"preview-hq-mp3":"[^"]*"' | head -1 | cut -d'"' -f4)

    # If no result with animal tag, try without
    if [ -z "$url" ]; then
        resp=$(curl -s -m 10 -H "Authorization: Token $API" "https://freesound.org/apiv2/search/text/?query=${encoded}&fields=id,name,previews,duration&page_size=3&sort=rating_desc")
        url=$(echo "$resp" | grep -o '"preview-hq-mp3":"[^"]*"' | head -1 | cut -d'"' -f4)
    fi

    if [ -z "$url" ]; then
        echo "[$count/$total] $animal - STILL NO RESULT"
        sleep 0.5
        continue
    fi

    name=$(echo "$resp" | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)
    curl -s -m 15 -o "$DIR/$animal.mp3" "$url"
    size=$(wc -c < "$DIR/$animal.mp3" 2>/dev/null || echo 0)

    if [ "$size" -gt 1000 ]; then
        echo "[$count/$total] $animal - OK (${size}b) [$name]"
        ok=$((ok + 1))
    else
        echo "[$count/$total] $animal - FAIL"
    fi

    sleep 0.5
done

echo ""
echo "RETRY DONE: $ok out of $total"
