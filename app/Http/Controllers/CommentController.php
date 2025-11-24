<?php

namespace App\Http\Controllers;

use Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Comment;

class CommentController extends Controller
{
    public function store(Request $request) {
        $user = Auth::user();
        if($user->role !== 'student') {
            return response()->json([
                'message' => 'Only students can comment!'
            ],403);
        }
        $fields = $request->validate([
            'comment' => 'required|max:255',
            'event_id' =>'required|numeric'
        ]);
        $fields['user_id'] = Auth::id();
        $created = Comment::create($fields);

        return response()->json([
            'message' => 'successfully created a comment'
        ],200);
    }

    public function getAllCommentLinkedToEvent($id) {
        $data = Comment::where('event_id', $id)->with('user')->get();
        
        return response()->json([
            'data' => $data
        ], 200);
    }
}
