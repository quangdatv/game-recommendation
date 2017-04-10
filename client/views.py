from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from client.models import Game, Comment, Like
from client.forms import RegistrationForm
from django.template import RequestContext
from django.contrib.auth.models import User

import datetime
import os.path
import clips
import ast
import time


def index(request):
    return render(request, 'index.html')


def recommendation(request):
    return render(request, 'recommendation.html')


@csrf_protect
def signup(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/')
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = User.objects.create_user(
            username=form.cleaned_data['username'],
            password=form.cleaned_data['password1'],
            email=form.cleaned_data['email'])
            return HttpResponseRedirect('/login/')
    else:
        form = RegistrationForm()

    return render(request, 'signup.html', {'form': form})

#Insert new game into DB & facts file
#DB is for getting id purpose only
@csrf_exempt
def add_comment(request):
    if not request.user.is_authenticated() or request.method != 'POST':
        return HttpResponse(status_code=401)

    is_success = insert_comment_into_db(request)
    if not is_success:
        return HttpResponse(status_code=404)
	return HttpResponse()


@csrf_exempt
def search_matching(request):
    if request.method != 'POST':
        return HttpResponse(status_code=401)
    results = clips_search_matching(request.POST)
    results = results[0: 100]
    games = []
    for raw_game in results:
        game = append_game_extra_data(request, raw_game)
        games.append(game)
    return JsonResponse({'games': games})


def append_game_extra_data(request, game):
    like_count, dislike_count = status_count(request, game['id'])
    game['like_count'] = like_count
    game['dislike_count'] = dislike_count
    if request.user.is_authenticated():
        game['is_liked'] = get_like_status(request.user.id, game['id'])
    return game


@csrf_exempt
def like_game(request, game_id):
    if not request.user.is_authenticated() or request.method != 'POST':
        return HttpResponse(status_code=401)
    user_id = request.user.id
    like = Like.objects.filter(user_id=user_id, game_id=game_id).first()
    if like is not None and like.is_liked:
        return HttpResponse(status_code=404)

    if like is None:
        like = Like(game_id=game_id, user_id=user_id, is_liked=True)
    else:
        like.is_liked = True
    try:
        like.save()
        return JsonResponse({'is_liked': True})
    except Error:
        return HttpResponse(status_code=500)


@csrf_exempt
def unlike_game(request, game_id):
    if not request.user.is_authenticated() or request.method != 'POST':
        return HttpResponse(status_code=401)
    user_id = request.user.id
    like = Like.objects.filter(user_id=user_id, game_id=game_id).first()
    if like is None or not like.is_liked:
        return HttpResponse(status_code=404)

    try:
        like.delete()
        return JsonResponse({})
    except Error:
        HttpResponse(status_code=500)

@csrf_exempt
def dislike_game(request, game_id):
    if not request.user.is_authenticated() or request.method != 'POST':
        return HttpResponse(status_code=401)
    user_id = request.user.id
    like = Like.objects.filter(user_id=user_id, game_id=game_id).first()
    if like is not None and not like.is_liked:
        return HttpResponse(status_code=404)

    if like is None:
        like = Like(game_id=game_id, user_id=user_id, is_liked=False)
    else:
        like.is_liked = False
    try:
        like.save()
        return JsonResponse({'is_liked': False})
    except Error:
        return HttpResponse(status_code=500)


@csrf_exempt
def undislike_game(request, game_id):
    if not request.user.is_authenticated() or request.method != 'POST':
        return HttpResponse(status_code=401)
    user_id = request.user.id
    like = Like.objects.filter(user_id=user_id, game_id=game_id).first()
    if like is None or like.is_liked:
        return HttpResponse(status_code=404)

    try:
        like.delete()
        return JsonResponse({})
    except Error:
        HttpResponse(status_code=500)


def status_count(request, game_id):
    like_count = Like.objects.filter(game_id=game_id, is_liked=True).count()
    dislike_count = Like.objects.filter(game_id=game_id, is_liked=False).count()
    return like_count, dislike_count


def like_status(request, game_id):
    if not request.user.is_authenticated() or request.method != 'GET':
        return HttpResponse(status_code=401)
    is_liked = get_like_status(request.user.id, game_id)
    if is_liked is None:
        return JsonResponse({})
    return JsonResponse({'is_liked': is_liked})


def get_like_status(user_id, game_id):
    like = Like.objects.filter(user_id=user_id, game_id=game_id).first()
    if like is None:
        return None
    return like.is_liked

# Utilty function - DB
def insert_comment_into_db(request):
    comment = Comment(game_id=request.POST['game_id'],
        username=request.user.username,
        comment=request.POST['comment']
    )
    try:
        comment.save()
        return True
    except Error:
        return False


def parse_multislot_value(content):
    content = content[2:-2]
    values = []
    for value in content.split('\" \"'):
        values.append(value)
    return values


def parse_game_facts(content):
    if content is None:
        return []
    games = []
    for game_raw in content.split('~~~')[0: -1]:
        raw = game_raw.split('---')
        game = {'id': raw[0], 'name': raw[1], 'description': raw[2],
                'genre': parse_multislot_value(raw[3]), 'publisher': raw[4],
                'platform': parse_multislot_value(raw[5]), 'age-range': raw[6],
                'game-mode': parse_multislot_value(raw[7]), 'release-date': raw[8],
                'length': raw[9], 'difficulty': raw[10], 'image': raw[11]}
        games.append(game)
    return games


#Utility function - facts file
def clips_search_matching(data):
    search = '(search ' +\
				'(genre "'+data['genre']+'") ' +\
				'(game-mode "'+data['game-mode']+'") ' +\
				'(platform "'+data['platform']+'") ' +\
				'(age-range "'+data['age-range']+'") ' +\
				'(difficulty "'+data['difficulty']+'"))'

    #CLIPS
    print(search)
    clips.Clear()
    clips.Load(settings.CLIPS_DIR + "/templates.clp")
    clips.Load(settings.CLIPS_DIR + "/games.clp")
    clips.Load(settings.CLIPS_DIR + "/rules.clp")
    # clips.Load(settings.CLIPS_DIR + "/test-facts.clp")
    clips.Reset()
    clips.Assert(search)
    clips.Run()
    return parse_game_facts(clips.StdoutStream.Read())
