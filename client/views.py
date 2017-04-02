from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from client.models import Game, Review, User
from PIL import Image, ImageOps
import datetime
import os.path
import clips
import ast
import time

def index(request):
    return render(request, 'index.html')

def recommend(request):
    return render(request, 'recommend.html')

def new(request):
    return render(request, 'new.html')

#Insert new game into DB & facts file
#DB is for getting id purpose only
@csrf_exempt
def addNewGame (request):
	id = insertGameIntoDB(request.POST)
	insertGameIntoClips(id, request.POST)
	return HttpResponse('')

@csrf_exempt
def addNewReview (request):
	id = insertReviewIntoDB(request.POST)
	insertReviewIntoClips(id, request.POST)
	return HttpResponse('')

@csrf_exempt
def searchMatching (request):
	result = clipsSearchMatching(request.POST)
	print(result)
	return HttpResponse(result, content_type='application/json')

# Utilty function - DB
def insertGameIntoDB (data):
	game = Game(name=data['name'],
		description=date['description'],
		genre=data['genre'],
		publisher=data['publisher'],
		platforms=data['platforms'],
		ageRange=data['ageRange'],
		gameMode=data['gameMode'],
		releaseDate=data['releaseDate'],
		length=data['length'],
		rating=data['rating'],
		difficulty=data['difficulty']
	)

	print(game)
	game.save()
	return game.id

def insertReviewIntoDB (data):
	review = Review(rating=data['rating'],
		gameId=data['gameId'],
		reviewerId=data['reviewerId'],
		comment=data['comment']
	)

	print(review)
	review.save()
	return review.id

#Utility function - facts file
def insertGameIntoClips(id, data):
    # check if a fact-file exists
    FactsFile = settings.CLIPS_DIR + "/games.clp"
    if not os.path.isfile(FactsFile):
        file = open(FactsFile, 'w+')
        file.write("(deffacts games)\n")
        file.close()

    # modify facts
    lines = open(FactsFile, 'r+').readlines()
    n = len(lines)
    lines[n - 1] = lines[n-1][:-2] + "\n"
    lines.append('  (game '
                '(id '+str(id)+')'
                '(name "'+data['name']+'") '
                '(description "'+data['description']+'") '
                '(genre "'+data['genre']+'") '
                '(publisher "'+data['publisher']+'") '
                '(platforms "'+data['platforms']+'") '
                '(age-range "'+data['ageRange']+'")'
                '(game-mode "'+data['game-mode']+'") '
                '(release-date "'+data['releaseDate']+'") '
                '(length "'+data['length']+'") '
                '(difficulty "'+data['difficulty']+'") '
                '(rating -1)))\n')

    # new facts
    open(FactsFile, 'w').writelines(lines)

def insertReviewIntoClips(id, data):
    # check if a fact-file exists
    FactsFile = settings.CLIPS_DIR + "/reviews.clp"
    if not os.path.isfile(FactsFile):
        file = open(FactsFile, 'w+')
        file.write("(deffacts reviews)\n")
        file.close()

    # modify facts
    lines = open(FactsFile, 'r+').readlines()
    n = len(lines)
    lines[n - 1] = lines[n-1][:-2] + "\n"
    lines.append('  (game '
                '(id '+str(id)+')'
                '(game-id "'+data['game-id']+'") '
                '(reviewer-id "'+data['reviewer-id']+'") '
                '(comment "'+data['comment']+'") '
                '(rating "'+data['rating']+'")))\n')

    # new facts
    open(FactsFile, 'w').writelines(lines)

def clipsSearchMatching (data):
    search = '(search ' +\
				'(genre "'+data['genre']+'") ' +\
				'(game-mode "'+data['game-mode']+'") ' +\
				'(platform "'+data['platform']+'") ' +\
				'(age-range "'+data['age-range']+'") ' +\
				'(difficulty "'+data['difficulty']+'"))'

    #CLIPS
    clips.Clear()
    clips.BatchStar(settings.CLIPS_DIR + "/templates.clp")
    if os.path.isfile(settings.CLIPS_DIR + "/games.clp"):
        clips.BatchStar(settings.CLIPS_DIR + "/games.clp")
    if os.path.isfile(settings.CLIPS_DIR + "/reviews.clp"):
        clips.BatchStar(settings.CLIPS_DIR + "/reviews.clp")
    clips.BatchStar(settings.CLIPS_DIR + "/rules.clp")
    clips.Reset()
    clips.Assert(search)
    clips.Run()
    return clips.StdoutStream.Read()
