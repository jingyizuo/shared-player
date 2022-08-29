# store all the urls local to our app
from django.urls import path

from .models import Room
from .views import JoinRoom, LeaveRoom, RoomView, UpdataRoom, UserInRoom
from .views import CreateRoomView, GetRoom

urlpatterns = [
    path('room', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('get-room', GetRoom.as_view()),
    path('join-room', JoinRoom.as_view()),
    path('user-in-room', UserInRoom.as_view()),
    path('leave-room', LeaveRoom.as_view()),
    path('update-room', UpdataRoom.as_view()),
]