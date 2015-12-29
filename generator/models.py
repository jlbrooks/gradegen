from django.db import models

# Create your models here.

class GradeSheet(models.Model):
  title = models.CharField(max_length=200)

  def as_dict(self, with_attributes, with_relationships):
    data = {
      'id': self.id
    }

    if with_attributes:
      data['title'] = self.title

    if with_relationships:
      data['sections'] = [a.as_dict(True,True) for a in self.section_set.all()]

    return data

class Section(models.Model):
  name = models.CharField(max_length=500)

  possible = models.IntegerField()

  gradeSheet = models.ForeignKey(GradeSheet)

  def as_dict(self, with_attributes, with_relationships):
    data = {
      'id': self.id
    }

    if with_attributes:
      data['name'] = self.name
      data['possible'] = self.possible

    if with_relationships:
      data['deductions'] = [a.as_dict(True,True) for a in self.section_set.all()]

    return data

class Deduction(models.Model):
  text = models.CharField(max_length=1000)

  amount = models.IntegerField()

  section = models.ForeignKey(Section)

  def as_dict(self, with_attributes, with_relationships):
    data = {
      'id': self.id
    }

    if with_attributes:
      data['text'] = self.text
      data['amount'] = self.amount

    return data