from django.db import models

# Create your models here.

class GradeSheet(models.Model):
  title = models.CharField(max_length=200)

class Section(models.Model):
  name = models.CharField(max_length=500)

  possible = models.IntegerField()

  gradeSheet = models.ForeignKey(GradeSheet)

class Deducton(models.Model):
  text = models.CharField(max_length=1000)

  amount = models.IntegerField()

  section = models.ForeignKey(Section)