from django import forms
from generator.models import GradeSheet, Section, Deduction

class SectionForm(forms.Form):
  name = forms.CharField(max_length=500)

  possible = forms.IntegerField(required=True)

  gradeSheetId = forms.IntegerField(required=True, min_value=1)

  def clean_gradeSheetId(self):
    gId = self.cleaned_data['gradeSheetId']

    try:
      Section.objects.get(id=gId)
    except:
      raise forms.ValidationError("GradeSheet doesn't exist.")

    return gId
