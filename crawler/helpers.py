import json

# Writes to file
def write_to_file(file_name, data):
	file = open(file_name, 'w')
	file.write(data)
	file.close()

# Writes list to file
def write_list_to_file(file_name, data):
	file = open(file_name, 'w')
	# data is a list
	for item in data:
		file.write(item)
		file.write("\n")
	file.close()

# Writes json to file
def write_json_to_file(file_name, data):
	with open(file_name, 'w') as file:
		json.dump(data, file)


# Read list from file
def read_list_from_file(file_name):
	with open(file_name) as file:
		lines = file.readlines()
		lines = [line.rstrip('\n') for line in lines]
		return lines
	return []

# Read json from file
def read_json_from_file(file_name):
	with open(file_name) as file:
		return json.load(file)
	return {}

