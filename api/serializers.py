# translate our Room class in model into JSON response
from wsgiref.validate import validator
from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        # matches whatever in our model
        # id is an primary key which is an unique integer that can identify the model from other models
        fields = ('id', 'code', 'host', 'guest_can_pause',
                  'votes_to_skip', 'created_at')

# send a post request to the endpoint
class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model=Room
        fields = ('guest_can_pause', 'votes_to_skip')

        
class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])

    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip', 'code')
        
