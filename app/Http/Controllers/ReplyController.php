<?php

namespace App\Http\Controllers;

use App\Models\Reply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReplyController extends Controller
{
    public function store(Request $request) {
        
        $fields = $request->validate([
            'event_id' => 'required',
            'comment_id' => 'required',
            'reply' => 'required|max:255',
        ]);
        $fields['user_id'] = Auth::id();

        $created = Reply::create($fields);

        return response()->json([
            'message' => 'Successfully created a reply!',
            'data' => $created->load('user'),
        ], 201);

    }

    public function getAllRepliesLinkedToComment($id) {

        $data = Reply::where('comment_id',$id)->with('user')->get();
        return response()->json([
            'data' => $data
        ], 200);

    }
}
