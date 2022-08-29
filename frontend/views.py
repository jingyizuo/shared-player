from django.shortcuts import render

# Create your views here.
# allow us to render the index template, then react can take over and render inside 
def index(request, *args, **kwargs):
    return render( request, 'frontend/index.html')