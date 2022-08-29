from django.db import models
import string
import random

# Create your models here.
# in standard database, we would have tables in rows and columns, where we store information
# write python code, and Django will interpret the code and perform database operations

# Room model - we want to group our users, that room will have control over the host music
# one person hosting and controlling the music, other people can join that room
# RULES: we want fat models but thin views, put most of the logic in models

def generate_unique_code():
    length = 6
    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=code).count() == 0:
            break
    return code


class Room(models.Model):
    # define the fields that we want to have for our room 
    # the pieces of information that we want to store in our room
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    current_song = models.CharField(max_length=50, null=True)

    

