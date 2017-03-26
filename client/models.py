from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Game(models.Model):
	name = models.CharField(max_length=50)
	description = models.TextField()
	genre = models.CharField(max_length=50)
	publisher = models.CharField(max_length=50)
	platforms = models.CharField(max_length=50)
	ageRange = models.CharField(max_length=50)
	gameMode = models.CharField(max_length=50)
	releaseDate = models.DateTimeField(auto_now_add=True, blank=True)
	length = models.DecimalField(max_digits=10, decimal_places=2)
	rating = models.DecimalField(max_digits=10, decimal_places=2)
	difficulty = models.CharField(max_length=50)

class Review(models.Model):
	rating = models.IntegerField()
	gameId = models.IntegerField()
	reviewerId = models.IntegerField()
	comment = models.TextField()

class User(models.Model):
	isAdmin = models.BooleanField(initial=False)
	name = models.CharField(max_length=50)
	password = models.CharField(max_length=50)