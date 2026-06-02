#!/bin/bash
API="j3t7wIORx8aQUxLnSl7HHvF7WzvcPky8w1QAT4wf"
DIR="C:/Users/izabe/Desktop/code/animal-sounds-app/sounds"

# Step 1: Download from Google Sound Library (high quality, CC-BY 4.0)
echo "=== GOOGLE SOUNDS ==="
declare -A GOOGLE=(
    ["cat"]="https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg"
    ["mouse"]="https://actions.google.com/sounds/v1/animals/mouse_squeaking.ogg"
    ["owl"]="https://actions.google.com/sounds/v1/animals/owl_hooting.ogg"
    ["goose"]="https://actions.google.com/sounds/v1/animals/geese_outside.ogg"
)

for animal in "${!GOOGLE[@]}"; do
    curl -s -m 15 -o "$DIR/$animal.mp3" "${GOOGLE[$animal]}"
    size=$(wc -c < "$DIR/$animal.mp3" 2>/dev/null || echo 0)
    echo "$animal - $([ "$size" -gt 1000 ] && echo "OK (${size}b)" || echo "FAIL")"
done

# Step 2: Freesound - very specific, short queries, check name STARTS with animal
echo ""
echo "=== FREESOUND ==="

# Remaining bad sounds not covered by Google
REMAINING="bat bear beaver bison buffalo cheetah chimpanzee cricket cuckoo duck eagle elephant fox frog gorilla guinea_pig hamster hedgehog hippo horse hummingbird hyena jaguar kangaroo koala leopard monkey moose mosquito otter panda panther parrot peacock pelican penguin rabbit raccoon raven rhino seagull snake squirrel stork swan tiger toucan whale wild_boar zebra"

count=0
ok=0
fail=0

for animal in $REMAINING; do
    count=$((count + 1))

    # Simple query = just the animal name
    query="$animal"
    if [ "$animal" = "guinea_pig" ]; then query="guinea+pig"; fi
    if [ "$animal" = "wild_boar" ]; then query="wild+boar"; fi

    # Search with many results, sort by score (relevance)
    resp=$(curl -s -m 10 -H "Authorization: Token $API" "https://freesound.org/apiv2/search/text/?query=${query}&fields=id,name,previews,duration,tags&page_size=15&sort=score")

    # Get all names and URLs
    names=$(echo "$resp" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    urls=$(echo "$resp" | grep -o '"preview-hq-mp3":"[^"]*"' | cut -d'"' -f4)

    # Check animal name (handle underscores)
    check=$(echo "$animal" | tr '_' ' ')

    # Find first result whose name contains the animal (case insensitive)
    url=""
    match=""
    i=0
    while IFS= read -r n; do
        i=$((i + 1))
        lower=$(echo "$n" | tr 'A-Z' 'a-z')
        if echo "$lower" | grep -qi "$check"; then
            # Skip if name suggests field recording / ambience
            if echo "$lower" | grep -qi "ambien\|field.record\|forest.at\|night.in\|morning.in\|afternoon\|landscape"; then
                continue
            fi
            url=$(echo "$urls" | sed -n "${i}p")
            match="$n"
            break
        fi
    done <<< "$names"

    if [ -z "$url" ]; then
        # Fallback: take first result but only if it's short (< 15s)
        durations=$(echo "$resp" | grep -o '"duration":[0-9.]*' | cut -d: -f2)
        first_dur=$(echo "$durations" | head -1)
        first_url=$(echo "$urls" | head -1)
        first_name=$(echo "$names" | head -1)

        if [ -n "$first_url" ] && [ -n "$first_dur" ]; then
            dur_int=$(printf "%.0f" "$first_dur" 2>/dev/null || echo 999)
            if [ "$dur_int" -le 15 ]; then
                url="$first_url"
                match="$first_name (fallback)"
            fi
        fi
    fi

    if [ -z "$url" ]; then
        echo "[$count] $animal - NO GOOD MATCH"
        fail=$((fail + 1))
        sleep 0.3
        continue
    fi

    curl -s -m 15 -o "$DIR/$animal.mp3" "$url"
    size=$(wc -c < "$DIR/$animal.mp3" 2>/dev/null || echo 0)

    if [ "$size" -gt 1000 ]; then
        echo "[$count] $animal - OK [$match] (${size}b)"
        ok=$((ok + 1))
    else
        echo "[$count] $animal - DOWNLOAD FAIL"
        fail=$((fail + 1))
    fi

    sleep 0.3
done

echo ""
echo "TOTAL: Google ${#GOOGLE[@]}, Freesound $ok OK / $fail failed"
