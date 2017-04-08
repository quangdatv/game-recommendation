# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-08 18:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('description', models.TextField()),
                ('genre', models.CharField(max_length=50)),
                ('publisher', models.CharField(max_length=50)),
                ('platforms', models.CharField(max_length=50)),
                ('ageRange', models.CharField(max_length=50)),
                ('gameMode', models.CharField(max_length=50)),
                ('releaseDate', models.DateTimeField(auto_now_add=True)),
                ('length', models.DecimalField(decimal_places=2, max_digits=10)),
                ('rating', models.DecimalField(decimal_places=2, max_digits=10)),
                ('difficulty', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField()),
                ('gameId', models.IntegerField()),
                ('reviewerId', models.IntegerField()),
                ('comment', models.TextField()),
            ],
        ),
    ]
