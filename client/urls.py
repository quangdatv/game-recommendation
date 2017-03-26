from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^recommend.html/$', views.recommend, name='recommend'),
    url(r'^api/search$', views.searchMatching, name='searchMatching'),
    url(r'^api/addGame$', views.addNewGame, name='addNewGame'),
    url(r'^api/addReview', views.addNewReview, name='addNewReview'),
]