<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/events-page', function () {
    return Inertia::render('Events');
})->middleware(['auth', 'verified'])->name('events-page');

Route::get('/event-detail/{id}', function ($id) {
    return Inertia::render('EventDetail', ['eventId' => $id]);
})->middleware(['auth', 'verified'])->name('event-detail');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

//Event routes
Route::post('/createEvent',[EventController::class,'createEvent'])->middleware('auth');
Route::get('/events',[EventController::class,'getAllEvents']);
Route::get('/event/{id}',[EventController::class,'getEventByID'])->middleware('auth');
Route::get('/user/events',[EventController::class,'getAllEventCreatedBySchool'])->middleware('auth');

//Comment Routes
Route::post('/comment',[CommentController::class,'store'])->middleware('auth');
Route::get('/comment/get/{id}',[CommentController::class,'getAllCommentLinkedToEvent'])->middleware('auth');


require __DIR__.'/auth.php';
