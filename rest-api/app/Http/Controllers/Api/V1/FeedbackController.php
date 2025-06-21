<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function __construct()
    {
        // Anyone can send feedback
        $this->middleware('auth:sanctum')->only(['index', 'show']); // only logged-in users can view
        $this->middleware('admin')->only(['destroy']); // only admin can delete
    }
    // Người dùng gửi phản hồi
    public function store(Request $request)
    {
        $validated = $request->validate([
            'Name' => 'required|string|max:100',
            'Email' => 'required|email|max:100',
            'Message' => 'required|string'
        ]);
        $feedback = Feedback::create($validated);

        return response()->json([
            'message' => 'Cảm ơn bạn đã phản hồi!',
            'data' => $feedback
        ], 201);
    }
    // Admin: xem danh sách phản hồi
    public function index()
    {
        return response()->json(Feedback::orderByDesc('SubmittedAt')->get());
    }

    // Admin: xem chi tiết phản hồi
    public function show($id)
    {
        $feedback = Feedback::find($id);
        if (!$feedback) {
            return response()->json(['message' => 'Không tìm thấy phản hồi'], 404);
        }

        return response()->json($feedback);
    }

    // Admin: xoá phản hồi
    public function destroy($id)
    {
        $feedback = Feedback::find($id);
        if (!$feedback) {
            return response()->json(['message' => 'Không tìm thấy phản hồi'], 404);
        }

        $feedback->delete();
        return response()->json(['message' => 'Đã xoá phản hồi']);
    }
}