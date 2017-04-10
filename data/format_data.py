#!/usr/bin/env python

import sys
import helpers
from unidecode import unidecode

def format_str(str):
	return unidecode(str.replace('"', ''))

def multislot(genre_list):
	genres = ''
	if genre_list is None:
		return ''
	for genre in genre_list:
		genres += ' "{}"'.format(genre)
	return genres.strip()

# Generate clips facts
def gen_facts():
	# Init file
	file = open('clips/games.clp', 'w')
	file.write('; Game facts\n')
	file.write('(deffacts games\n')
	#
	game_list = helpers.read_json_from_file('data/game_list.json')
	cnt = 0
	fact_template = '(game ' \
				  + '(id {id}) ' \
				  + '(name "{title}") ' \
				  + '(description "{description}") ' \
				  + '(genre {genres}) ' \
				  + '(publisher "{publisher}") ' \
				  + '(platform {platforms}) ' \
				  + '(age-range "{age_range}") ' \
				  + '(game-mode {game_modes}) ' \
				  + '(release-date "{release_date}") ' \
				  + '(length "{length}") ' \
				  + '(difficulty "{difficulty}") ' \
				  + '(image "{cover}") ' \
				  + ')'
	for game in game_list:
		cnt += 1
		file.write('    ')
		file.write(fact_template.format(
			id=cnt,
			title=format_str(game.get('title')),
			description=format_str(game.get('description')),
			genres=multislot(game.get('genres')),
			publisher=format_str(game.get('publisher') or u''),
			platforms=multislot(game.get('platforms')),
			age_range=game.get('esrb'),
			game_modes=multislot(game.get('modes')),
			release_date=game.get('release_date') or 'Not available',
			length=game.get('length') or 'Not available',
			difficulty=game.get('difficulty') or 'Not available',
			cover=game.get('cover') or 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/WPVG_icon_2016.svg/160px-WPVG_icon_2016.svg.png'
		))
		file.write('\n')
	# Close file
	file.write(')')
	file.close()


def get_properties():
	game_list = helpers.read_json_from_file('data/game_list.json')
	# Get genre score
	genre_score = {}
	game_modes = set()
	platforms = set()
	age_ranges = set()
	difficulties = set()
	for game in game_list:
		for genre in game.get('genres'):
			if genre_score.get(genre):
				genre_score[genre] += 1
			else:
				genre_score[genre] = 1
		for mode in game.get('modes') or []:
			game_modes.add(mode)
		for platform in game.get('platforms') or []:
			platforms.add(platform)
		age_ranges.add(game.get('esrb') or 'None')
		difficulties.add(game.get('difficulty') or 'Not available')
	# Sort genre by score
	genres = sorted(genre_score.iterkeys(), key=lambda x: -genre_score[x])[:10]
	# Make json
	game_properties = {
		'genres': genres,
		'game_modes': list(game_modes),
		'platforms': list(platforms),
		'age_ranges': list(age_ranges),
		'difficulties': list(difficulties)
	}
	# Write to file
	helpers.write_json_to_file('data/game_properties.json', game_properties)


# Generate facts from game list
if __name__ == "__main__":
	# gen_facts()
	get_properties()
