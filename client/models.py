from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Game(models.Model):
	name = models.CharField(max_length=50)
	description = models.TextField()
	genres = models.CharField(max_length=50)
	publisher = models.CharField(max_length=50)
	platforms = models.CharField(max_length=50)
	age_range = models.CharField(max_length=50)
	game_mode = models.CharField(max_length=50)
	release_date = models.DateTimeField(auto_now_add=True, blank=True)
	length = models.DecimalField(max_digits=10, decimal_places=2)
	difficulty = models.CharField(max_length=50)

class Comment(models.Model):
	game_id = models.IntegerField()
	username = models.CharField(max_length=50)
	comment = models.TextField()

class Like(models.Model):
	game_id = models.IntegerField()
	user_id = models.CharField(max_length=50)
	is_liked = models.BooleanField(default=True)
