<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    public function createEvent(Request $request) {

        $user = Auth::user();
        if(!($user->role === 'school')) {
            return response()->json([
                'message' => 'You cant create events!'
            ],403);
        }
        $fields = $request->validate([
            'event_title' => 'required|max:255',
            'event_description' => 'required|max:255',
            'event_image' => 'sometimes|required'
        ]);
        $fields['organizer_university_id'] = Auth::id();

        $created = Event::create($fields);

        return response()->json([
            'message' => 'You successfully created an Event'
        ],200);

    }
    public function getAllEvents() {
        $events = Event::all();
        if($events->isEmpty()) {
            return response()->json([
                'message' => 'There is no event'
            ],200);
        }
        
        return $events;
    }
    
    public function getEventByID($id) {
        $event = Event::where('id' , $id)->first();
        $eventUniversity = User::where('id',$event->organizer_university_id)->first();
        if(empty($event)) {
            return response()->json([
                'message' => 'Couldnt find event!'
            ],404);
        }
        return response()->json([
            'event' => $event,
            'university' => $eventUniversity
        ],200);
    }

    public function getAllEventCreatedBySchool() {
        $userID = Auth::id();

        $events = Event::where('organizer_university_id',$userID)->first();
        $eventUniversity = User::where('id',$events->organizer_university_id)->first();


        if(empty($events)) {
            return response()->json([
                'message' => 'You dont have any events yet!'
            ]);
        }
        return response()->json([
            'events' => $events,
            'university' => $eventUniversity
        ],200);
        
    }
}
