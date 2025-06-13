<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RejectIfNotAuthenticated
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user()) {
            return response()->json([
                'message' => 'Bạn chưa đăng nhập hoặc thiếu token truy cập'
            ], 401);
        }

        return $next($request);
    }
}
