from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^recommend.html/$', views.recommend, name='recommend'),
    url(r'^api/search$', views.searchMatching, name='searchMatching'),
]