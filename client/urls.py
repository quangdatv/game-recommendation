from django.conf.urls import url
from . import views
from forms import LoginForm
from django.contrib.auth import views as auth_views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^recommendation/$', views.recommendation, name='recommendation'),
    url(r'^login/$', auth_views.login, {'template_name': 'login.html', 'authentication_form': LoginForm}, name='login'),
    url(r'^signup/$', views.signup, name='signup'),
    url(r'^logout/$', auth_views.logout, {'next_page': '/'}, name="logout"), 
    url(r'^api/search$', views.search_matching, name='search_matching'),
    url(r'^api/comment$', views.add_comment, name='add_comment'),
    url(r'^api/like$', views.like_game, name='like_game'),
    url(r'^api/unlike$', views.unlike_game, name='unlike_game'),
    url(r'^api/dislike$', views.dislike_game, name='dislike_game'),
    url(r'^api/undislike$', views.undislike_game, name='undislike_game')
]