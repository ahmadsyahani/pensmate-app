<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
{
    $request->validate([
        'name' => 'required|string|max:255',
        'nrp' => 'required|string|max:15|unique:'.User::class, 
        'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
        'password' => ['required', \Illuminate\Validation\Rules\Password::defaults()],
        'ktm' => 'required|image|mimes:jpeg,png,jpg|max:2048', 
    ]);

    $ktmPath = null;
    if ($request->hasFile('ktm')) {
        $ktmPath = $request->file('ktm')->store('ktm_images', 'public');
    }

    $user = User::create([
        'name' => $request->name,
        'nrp' => $request->nrp,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'ktm_image_path' => $ktmPath,
    ]);

    event(new Registered($user));

    Auth::login($user);

    return redirect(route('dashboard', absolute: false));
}
}
