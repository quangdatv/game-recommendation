from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^recommendation/$', views.recommendation, name='recommend'),
    url(r'^api/search$', views.searchMatching, name='searchMatching'),
]