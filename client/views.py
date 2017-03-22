from django.shortcuts import render


def index(request):
    return render(request, 'index.html')

def recommend(request):
    return render(request, 'recommend.html')