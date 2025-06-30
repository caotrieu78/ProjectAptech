<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Color;
use Illuminate\Http\Request;

class ColorController extends Controller
{
    public function __construct()
    {
        $this->middleware('admin')->only(['store', 'update', 'destroy']);
    }

    public function index()
    {
        return response()->json(Color::all());
    }

    public function show($id)
    {
        $color = Color::find($id);
        if (!$color) {
            return response()->json(['message' => 'Không tìm thấy màu sắc'], 404);
        }
        return response()->json($color);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ColorName' => 'required|string|max:50'
        ]);

        $color = Color::create($validated);
        return response()->json($color, 201);
    }

    public function update(Request $request, $id)
    {
        $color = Color::find($id);
        if (!$color) {
            return response()->json(['message' => 'Không tìm thấy màu sắc'], 404);
        }

        $validated = $request->validate([
            'ColorName' => 'required|string|max:50'
        ]);

        $color->update($validated);
        return response()->json($color);
    }
    public function destroy($id)
    {
        $color = Color::find($id);
        if (!$color) {
            return response()->json(['message' => 'Không tìm thấy màu sắc'], 404);
        }

        $color->delete();
        return response()->json(['message' => 'Đã xoá màu sắc']);
    }
}
