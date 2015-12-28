from django import forms
from generator.models import GradeSheet, Section, Deduction

class SectionForm(forms.Form):
  name = forms.CharField(max_length=500)

  possible = forms.IntegerField(required=True, min_value=1)

  gradeSheetId = forms.CharField(required=True)

  def clean_gradeSheetId(self):
    gId = self.cleaned_data['gradeSheetId']

    try:
      GradeSheet.objects.get(id=gId)
    except:required=True
      raise forms.ValidationError("GradeSheet doesn't exist.")

    return gId

class DeductionForm(self):
  text = forms.CharField(required=True, max_length=1000)

  amount = forms.IntegerField(required=True)

  sectionId = forms.CharField(required=True)

  def clean_sectionId(self):
    sId = self.cleaned_data['sectionId']

    try:
      Section.objects.get(id=sId)
    except:required=True
      raise forms.ValidationError("Section doesn't exist.")

    return sId