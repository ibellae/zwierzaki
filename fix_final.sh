#!/bin/bash
API="j3t7wIORx8aQUxLnSl7HHvF7WzvcPky8w1QAT4wf"
DIR="C:/Users/izabe/Desktop/code/animal-sounds-app/sounds"
FFMPEG="C:/Users/izabe/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.1-full_build/bin/ffmpeg.exe"

# Very targeted queries - onomatopoeia and specific sound descriptions
# Format: animal|query1|query2 (try query1 first, fallback to query2)
BAD_LIST=(
    "alpaca|alpaca humming sound|alpaca call"
    "bear|brown bear growling|bear roar growl"
    "bison|american bison bellowing|bison grunt"
    "buffalo|buffalo bellow|water buffalo call"
    "cat|cat meowing close|kitten meow"
    "cheetah|cheetah chirp bird-like|cheetah purr"
    "crocodile|crocodile growl hiss|alligator hiss growl"
    "cuckoo|common cuckoo call|cuckoo bird singing"
    "duck|mallard duck quacking|duck quack close"
    "eagle|bald eagle cry call|golden eagle screech"
    "elephant|african elephant trumpet|elephant trumpeting call"
    "fox|red fox scream bark|fox screaming night"
    "giraffe|giraffe hum|giraffe sound"
    "goose|canada goose honking|goose honk aggressive"
    "gorilla|silverback gorilla chest beat|gorilla hooting"
    "hamster|hamster squeak|hamster wheel running"
    "horse|horse whinny neigh close|horse neighing"
    "hummingbird|hummingbird wings hovering|hummingbird buzz wing"
    "hyena|spotted hyena laughing|hyena whoop call"
    "jaguar|jaguar roar growl cat|jaguar snarl"
    "kangaroo|kangaroo grunt click|kangaroo boxing"
    "koala|koala bellow mating|koala grunt"
    "leopard|leopard sawing call|leopard growl snarl"
    "moose|bull moose call rut|moose grunt"
    "mosquito|mosquito flying buzz close|mosquito wing buzz"
    "mouse|mouse squeaking close|mice squeaking"
    "otter|sea otter squeak|otter chirp play"
    "owl|great horned owl hooting|barn owl screech"
    "panda|giant panda bleat|panda cub cry"
    "panther|black panther growl|big cat snarl night"
    "parrot|african grey parrot talking|macaw squawking"
    "pelican|brown pelican grunt|pelican colony"
    "rabbit|rabbit scream distress|rabbit thump warning"
    "raccoon|raccoon chittering fight|raccoon purring trill"
    "rattlesnake|diamondback rattlesnake rattle|rattlesnake warning"
    "raven|common raven croak deep|raven calling"
    "rhino|rhinoceros snort grunt|white rhino"
    "seagull|herring gull crying|seagull screech"
    "snake|king cobra hiss|snake rattling hiss"
    "squirrel|red squirrel chattering alarm|squirrel bark"
    "stork|white stork bill clatter|stork clattering"
    "swan|mute swan hissing|swan trumpeting call"
    "tiger|bengal tiger roar growl|tiger snarling"
    "toucan|toucan croaking call|toucan yelp"
    "whale|humpback whale song|blue whale call underwater"
    "zebra|zebra bark call|zebra braying"
)

total=${#BAD_LIST[@]}
count=0
ok=0
fail=0

for entry in "${BAD_LIST[@]}"; do
    IFS='|' read -r animal query1 query2 <<< "$entry"
    count=$((count + 1))

    url=""
    match=""

    for query in "$query1" "$query2"; do
        encoded=$(printf '%s' "$query" | sed 's/ /+/g')
        resp=$(curl -s -m 10 -H "Authorization: Token $API" "https://freesound.org/apiv2/search/text/?query=${encoded}&fields=id,name,previews,duration&page_size=10&sort=score")

        names=$(echo "$resp" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
        urls=$(echo "$resp" | grep -o '"preview-hq-mp3":"[^"]*"' | cut -d'"' -f4)
        durations=$(echo "$resp" | grep -o '"duration":[0-9.]*' | cut -d: -f2)

        check=$(echo "$animal" | tr '_' ' ')
        i=0
        while IFS= read -r n; do
            i=$((i + 1))
            lower=$(echo "$n" | tr 'A-Z' 'a-z')
            # Must contain animal name, skip ambience/field recordings
            if echo "$lower" | grep -qi "$check"; then
                if echo "$lower" | grep -qiE "ambien|field.record|forest.at|night.in|morning|landscape|city|street|river|park.at"; then
                    continue
                fi
                url=$(echo "$urls" | sed -n "${i}p")
                match="$n"
                break
            fi
        done <<< "$names"

        [ -n "$url" ] && break
    done

    # Last resort: take shortest result that has any relevance
    if [ -z "$url" ]; then
        url=$(echo "$urls" | head -1)
        match=$(echo "$names" | head -1)
        match="$match (fallback)"
    fi

    if [ -z "$url" ]; then
        echo "[$count/$total] $animal - NO RESULT"
        fail=$((fail + 1))
        sleep 0.3
        continue
    fi

    # Download
    curl -s -m 15 -o "$DIR/$animal.mp3.raw" "$url"

    if [ ! -f "$DIR/$animal.mp3.raw" ] || [ $(wc -c < "$DIR/$animal.mp3.raw") -lt 1000 ]; then
        echo "[$count/$total] $animal - DOWNLOAD FAIL"
        rm -f "$DIR/$animal.mp3.raw"
        fail=$((fail + 1))
        sleep 0.3
        continue
    fi

    # Normalize with ffmpeg
    "$FFMPEG" -y -i "$DIR/$animal.mp3.raw" -af "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=out:st=7.5:d=0.5" -t 8 -b:a 128k "$DIR/$animal.mp3" 2>/dev/null
    rm -f "$DIR/$animal.mp3.raw"

    if [ -f "$DIR/$animal.mp3" ] && [ $(wc -c < "$DIR/$animal.mp3") -gt 1000 ]; then
        echo "[$count/$total] $animal - OK [$match]"
        ok=$((ok + 1))
    else
        echo "[$count/$total] $animal - ENCODE FAIL"
        fail=$((fail + 1))
    fi

    sleep 0.3
done

echo ""
echo "FINAL: $ok fixed, $fail failed out of $total"
