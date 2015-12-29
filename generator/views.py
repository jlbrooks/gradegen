from django.shortcuts import render
from django.http import JsonResponse
from generator.models import GradeSheet, Section, Deduction

def index(request):
  return render(request, 'index.html')

def gradesheet(request, gId):
  try:
    sheet = GradeSheet.objects.get(id=gId)
  except:
    return JsonResponse({'error': 'Gradesheet not found'})

  return JsonResponse(sheet.as_dict(True,True))