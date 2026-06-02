#!/bin/bash
DIR="C:/Users/izabe/Desktop/code/animal-sounds-app/sounds"
FFMPEG="C:/Users/izabe/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.1-full_build/bin/ffmpeg.exe"

echo "=== FREEANIMALSOUNDS.ORG ==="

declare -A FAS=(
    ["bison"]="https://freeanimalsounds.org/wp-content/uploads/2017/07/bison.mp3"
    ["cat"]="https://freeanimalsounds.org/wp-content/uploads/2017/07/Katze_miaut.mp3"
    ["crocodile"]="https://freeanimalsounds.org/wp-content/uploads/2017/07/alligator.mp3"
    ["duck"]="https://freeanimalsounds.org/wp-content/uploads/2017/07/Ente_quackt.mp3"
    ["elephant"]="https://freeanimalsounds.org/wp-content/uploads/2017/07/Elefant-2.mp3"
    ["fox"]="https://freeanimalsounds.org/wp-content/uploads/2017/08/fox.mp3"
    ["goose"]="https://freeanimalsounds.org/wp-content/uploads/2017/07/Gaense.mp3"
    ["gorilla"]="https://freeanimalsounds.org/wp-content/uploads/2017/07/Gorilla.mp3"
    ["horse"]="https://freeanimalsounds.org/wp-content/uploads/2017/07/pferd_whinnert.mp3"
    ["leopard"]="https://freeanimalsounds.org/wp-content/uploads/2017/07/Leopard-1.mp3"
    ["mosquito"]="https://freeanimalsounds.org/wp-content/uploads/2017/08/mosquito.mp3"
    ["owl"]="https://freeanimalsounds.org/wp-content/uploads/2017/08/owl.mp3"
    ["parrot"]="https://freeanimalsounds.org/wp-content/uploads/2017/08/amazonmacaw.mp3"
    ["rattlesnake"]="https://freeanimalsounds.org/wp-content/uploads/2017/07/rattlesnake.mp3"
    ["raven"]="https://freeanimalsounds.org/wp-content/uploads/2017/07/rabe.mp3"
    ["rhino"]="https://freeanimalsounds.org/wp-content/uploads/2017/07/Rhinozerus.mp3"
    ["seagull"]="https://freeanimalsounds.org/wp-content/uploads/2017/08/moewe.mp3"
    ["snake"]="https://freeanimalsounds.org/wp-content/uploads/2017/07/cobra.mp3"
    ["squirrel"]="https://freeanimalsounds.org/wp-content/uploads/2017/08/squirrel.mp3"
    ["tiger"]="https://freeanimalsounds.org/wp-content/uploads/2017/07/Tiger.mp3"
    ["panther"]="https://freeanimalsounds.org/wp-content/uploads/2017/07/Puma.mp3"
    ["moose"]="https://freeanimalsounds.org/wp-content/uploads/2017/08/elk.mp3"
)

count=0
ok=0
for animal in $(echo "${!FAS[@]}" | tr ' ' '\n' | sort); do
    count=$((count + 1))
    url="${FAS[$animal]}"
    curl -s -m 15 -o "$DIR/$animal.mp3.raw" "$url"
    size=$(wc -c < "$DIR/$animal.mp3.raw" 2>/dev/null || echo 0)
    if [ "$size" -gt 1000 ]; then
        "$FFMPEG" -y -i "$DIR/$animal.mp3.raw" -af "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=out:st=7.5:d=0.5" -t 8 -b:a 128k "$DIR/$animal.mp3" 2>/dev/null
        rm -f "$DIR/$animal.mp3.raw"
        echo "[$count] $animal - OK (${size}b)"
        ok=$((ok + 1))
    else
        rm -f "$DIR/$animal.mp3.raw"
        echo "[$count] $animal - FAIL"
    fi
    sleep 0.3
done
echo "FAS: $ok OK"

echo ""
echo "=== WIKIMEDIA COMMONS ==="

# Direct known files from Wikimedia
declare -A WIKI=(
    ["whale"]="https://upload.wikimedia.org/wikipedia/commons/6/6a/Humpback_whale_sounds_-_Megaptera_novaeangliae.ogg"
    ["jaguar"]="https://upload.wikimedia.org/wikipedia/commons/b/b4/Jaguar_saw.flac"
    ["stork"]="https://upload.wikimedia.org/wikipedia/commons/5/54/Ciconia_ciconia_-_Weissstorch_-_White_Stork.ogg"
    ["toucan"]="https://upload.wikimedia.org/wikipedia/commons/5/5d/Ramphastos_toco_-_Toco_Toucan_XC109278.ogg"
    ["hyena"]="https://upload.wikimedia.org/wikipedia/commons/d/d5/Crocuta_crocuta_calls.ogg"
    ["pelican"]="https://upload.wikimedia.org/wikipedia/commons/4/45/Pelecanus_onocrotalus.ogg"
    ["hummingbird"]="https://upload.wikimedia.org/wikipedia/commons/4/4b/Archilochus_colubris_-_Ruby-throated_Hummingbird_-_XC241625.ogg"
    ["buffalo"]="https://upload.wikimedia.org/wikipedia/commons/0/09/Syncerus_caffer_caffer.ogg"
)

count2=0
ok2=0
for animal in $(echo "${!WIKI[@]}" | tr ' ' '\n' | sort); do
    count2=$((count2 + 1))
    url="${WIKI[$animal]}"
    curl -s -m 20 -H "User-Agent: AnimalSoundsApp/1.0" -o "$DIR/$animal.raw" -L "$url"
    size=$(wc -c < "$DIR/$animal.raw" 2>/dev/null || echo 0)
    if [ "$size" -gt 1000 ]; then
        "$FFMPEG" -y -i "$DIR/$animal.raw" -af "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=out:st=7.5:d=0.5" -t 8 -b:a 128k "$DIR/$animal.mp3" 2>/dev/null
        rm -f "$DIR/$animal.raw"
        echo "[$count2] $animal - OK"
        ok2=$((ok2 + 1))
    else
        rm -f "$DIR/$animal.raw"
        echo "[$count2] $animal - FAIL"
    fi
    sleep 0.5
done
echo "WIKI: $ok2 OK"

echo ""
echo "=== GOOGLE SOUND LIBRARY ==="

declare -A GOOGLE=(
    ["mouse"]="https://actions.google.com/sounds/v1/animals/mouse_squeaking.ogg"
)

for animal in "${!GOOGLE[@]}"; do
    curl -s -m 15 -o "$DIR/$animal.raw" "${GOOGLE[$animal]}"
    "$FFMPEG" -y -i "$DIR/$animal.raw" -af "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=out:st=7.5:d=0.5" -t 8 -b:a 128k "$DIR/$animal.mp3" 2>/dev/null
    rm -f "$DIR/$animal.raw"
    echo "$animal - OK"
done

echo ""
echo "=== REMAINING (Freesound targeted) ==="

API="j3t7wIORx8aQUxLnSl7HHvF7WzvcPky8w1QAT4wf"
STILL_BAD="alpaca bear cheetah cuckoo eagle giraffe hamster hummingbird hyena kangaroo koala otter panda rabbit raccoon swan whale zebra"

for animal in $STILL_BAD; do
    [ -f "$DIR/$animal.mp3" ] && size=$(wc -c < "$DIR/$animal.mp3") || size=0
    # Skip if we already got a good file from FAS above
    [ "$size" -gt 5000 ] && continue

    encoded=$(printf '%s' "$animal sound call" | sed 's/ /+/g')
    resp=$(curl -s -m 10 -H "Authorization: Token $API" "https://freesound.org/apiv2/search/text/?query=${encoded}&fields=id,name,previews&page_size=10&sort=score")

    names=$(echo "$resp" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    urls=$(echo "$resp" | grep -o '"preview-hq-mp3":"[^"]*"' | cut -d'"' -f4)

    url=""
    i=0
    while IFS= read -r n; do
        i=$((i + 1))
        lower=$(echo "$n" | tr 'A-Z' 'a-z')
        if echo "$lower" | grep -qi "$animal"; then
            if ! echo "$lower" | grep -qiE "ambien|field|forest|morning|city|river"; then
                url=$(echo "$urls" | sed -n "${i}p")
                echo "$animal: [$n]"
                break
            fi
        fi
    done <<< "$names"

    if [ -n "$url" ]; then
        curl -s -m 15 -o "$DIR/$animal.mp3.raw" "$url"
        "$FFMPEG" -y -i "$DIR/$animal.mp3.raw" -af "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=out:st=7.5:d=0.5" -t 8 -b:a 128k "$DIR/$animal.mp3" 2>/dev/null
        rm -f "$DIR/$animal.mp3.raw"
    fi
    sleep 0.5
done

echo ""
echo "ALL DONE"
