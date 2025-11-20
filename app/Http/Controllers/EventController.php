<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    public function createEVent(Request $request) {

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
        return response()->json([
            'message' => 'You successfully created an Event'
        ],200);

    }
    public function getAllEvents(Request $request) {
        $events = Event::all();
        if($events->isEmpty()) {
            return response()->json([
                'message' => 'There is no event'
            ],200);
        }
        
        return $events;
    }
}
