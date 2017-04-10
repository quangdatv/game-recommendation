import clips

# Get all games
def get_all_games():
	# Load template
	clips.Clear()
	clips.Load("clips/templates.clp")
	clips.Load("clips/games.clp")
	clips.Reset()

	# Run clips
	clips.Run()

	# load game from facts
	games = []
	facts = clips.FactList()
	for fact in facts:
		if fact.Relation != 'game':
			continue
		game = {
			'id': int(fact.Slots['id']), 'name': fact.Slots['name'],
			'description': fact.Slots['description'],
			'genre': list(fact.Slots['genre']),
			'platform': list(fact.Slots['platform']),
			'age-range': fact.Slots['age-range'],
			'game-mode': fact.Slots['game-mode'],
			'release-date': fact.Slots['release-date'],
			'length': fact.Slots['length'],
			'difficulty': fact.Slots['difficulty'],
			'image': fact.Slots['image']
		}
		games.append(game)
		# print fact.Slots['id'], list(fact.Slots['genre'])
	return games


# Get recommended games from like list
def get_recommended_games(like_list):
	# Get all games
	games = get_all_games()
	# Get genres user liked and disliked
	genre_score = {}
	# genre_score['sports'] = 4
	# genre_score['role-playing'] = -4
	# genre_score['visual-novel'] = -3
	for like in like_list:
		is_liked = 1 if like.is_liked else -1
		for genre in games[like.game_id-1]['genre'] or []:
			if genre_score.get(genre) is None:
				genre_score[genre] = is_liked
			else:
				genre_score[genre] += is_liked
	# normalize genres
	max_value = 1
	min_value = 0
	for genre, value in genre_score.iteritems():
		max_value = max(max_value, value)
		min_value = min(min_value, value)
	for genre in genre_score.iterkeys():
		genre_score[genre] = float(genre_score[genre] - min_value) / (max_value - min_value)
	# calculate jaccard similarity
	for game in games:
		sum_min = 0.0
		sum_max = 0.0
		for genre, tk in genre_score.iteritems():
			sk = 1.0 if genre in game['genre'] else 0.0
			sum_min += min(sk, tk)
			sum_max += max(sk, tk)
		game['score'] = sum_min / sum_max if sum_max > 0.0 else 0.0
	# sort game by similarity
	sorted_games = sorted(games, key=lambda x: -x['score'])[:20]
	# Debug
	for game in sorted_games:
		print game['name'], game['genre'], game['score']
	return sorted_games


# Generate facts from game list
if __name__ == "__main__":
	get_games(7)
	# get_all_games()
