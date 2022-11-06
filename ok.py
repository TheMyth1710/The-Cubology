lyrics = "say my name say my name drei zwei eins null baby make it rain baby ruf honigtopf tropft bleibe ganze nacht lang online yeah screenshots kopf na na na na na na na baby ruf honigtopf tropft bleibe ganze nacht lang online yeah screenshots kopf na na na na na na na ah-ah ah-ah ah-ah-ah ah-ah ah-ah ah-ah-ah ah-ah ah-ah ah-ah-ah ah-ah ah-ah ah-ah-ah ah-ah ah-ah ah-ah-ah ah-ah ah-ah ah-ah-ah ah-ah ah-ah ah-ah-ah ah-ah ah-ah ah-ah-ah"

stopwords = [' na ', ' ah', '-ah', 'yeah']

for word in stopwords:
    lyrics = lyrics.replace(word, '')
lyrics = lyrics.replace('  ', ' ') # removes double spaces if needed
print(lyrics)