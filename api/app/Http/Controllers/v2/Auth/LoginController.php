<?php

namespace App\Http\Controllers\v2\Auth;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\APIController;

class LoginController extends APIController
{

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            return $this->responseUnauthorized();
        }

        // Get the user data.
        $user = auth()->user();

        return response()->json([
            'status' => 200,
            'message' => 'Authorized.',

            'user' => array(
                'id' => $user->hashid,
                'name' => $user->name,
                'roles' => $user->roles,
                'lang' => $user->lang,
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60,
            )
        ], 200);
    }
}
