from django.db import migrations, models

class Migration(migrations.Migration):
	operations = [
		migrations.CreateModel(
			name='Game',
			fields=[
				('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
				('name', models.CharField(max_length=50)),
				('genre', models.CharField(max_length=50)),
				('publisher', models.CharField(max_length=50)),
				('platforms', models.CharField(max_length=50)),
				('ageRange', models.CharField(max_length=50)),
				('gameMode', models.CharField(max_length=50)),
				('releaseDate', models.DateTimeField(auto_now_add=True, blank=True)),
				('length', models.DecimalField(max_digits=10, decimal_places=2)),
				('rating', models.DecimalField(max_digits=10, decimal_places=2)),
				('difficulty', models.CharField(max_length=50)),
			],
		),
		migrations.CreateModel(
			name='Review',
			fields=[
				('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
				('rating', models.IntegerField()),
				('gameId', models.IntegerField()),
				('reviewerId', models.IntegerField()),
				('comment', models.TextField()),
			],
		),
		migrations.CreateModel(
			name='User',
			fields=[
				('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
				('name', models.CharField(max_length=50)),
				('password', models.CharField(max_length=50)),
				('isAdmin', models.BooleanField(initial=False)),
			],
		),
	]