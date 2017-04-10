import clips
import json

# Get all games
def get_all_games():
	return read_json_from_file('data/game_list.json')

# Read json from file
def read_json_from_file(file_name):
	with open(file_name) as file:
		return json.load(file)
	return {}


def get_games(user_id):
	# Get all games
	games = get_all_games()
	# TODO: Get genres user liked and disliked
	genre_score = {}
	genre_score['sports'] = 1
	genre_score['role-playing'] = 4
	genre_score['visual-novel'] = -3
	# normalize genres
	max_value = 1
	min_value = 0
	for genre, value in genre_score.iteritems():
		max_value = max(max_value, value)
		min_value = min(min_value, value)
	for genre in genre_score.iterkeys():
		genre_score[genre] = (genre_score[genre] - min_value) / (max_value - min_value)
	# calculate jaccard similarity
	for game in games:
		sum_min = 0
		sum_max = 0
		for genre, tk in genre_score.iteritems():
			sk = 1 if genre in game['genres'] else 0
			sum_min += min(sk, tk)
			sum_max += max(sk, tk)
		game['score'] = sum_min / sum_max if sum_max > 0 else 0
	# sort game by similarity
	sorted_games = sorted(games, key=lambda x: -x['score'])[:20]
	# Debug
	# for game in sorted_gamess:
	# 	print game['title'], game['genres'], game['score']
	return sorted_games


# Generate facts from game list
if __name__ == "__main__":
	get_games(6)




	