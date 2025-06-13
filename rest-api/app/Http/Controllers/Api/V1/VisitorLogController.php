<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\VisitorLog;
use Illuminate\Http\Request;

class VisitorLogController extends Controller
{
    // Ghi log mỗi lượt truy cập (guest hoặc đã login)
    public function store(Request $request)
    {
        VisitorLog::create([
            'IPAddress' => $request->ip(),
            'Location' => $request->input('location') ?? 'Unknown',
            'UserID' => auth()->check() ? auth()->id() : null
        ]);

        return response()->json(['message' => 'Logged']);
    }

    // Tổng số lượt truy cập
    public function count()
    {
        $total = VisitorLog::count();
        return response()->json(['total_visits' => $total]);
    }

    // Đếm số user đang online (trong 5 phút gần nhất)
    public function onlineUsers()
    {
        $users = VisitorLog::whereNotNull('UserID')
            ->where('VisitTime', '>=', now()->subMinutes(5))
            ->distinct('UserID')
            ->count('UserID');

        return response()->json(['online_users' => $users]);
    }
}
