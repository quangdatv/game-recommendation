import clips

# Generate facts from game list
if __name__ == "__main__":
	# Load template
	clips.Clear()
	clips.Load("clips/templates.clp")
	clips.Load("clips/games.clp")
	clips.Reset()

	# Run clips
	clips.Run()

	# View facts
	facts = clips.FactList()
	for fact in facts:
		if fact.Relation != 'game':
			continue
		print fact.Slots['id'], fact.Slots['name']