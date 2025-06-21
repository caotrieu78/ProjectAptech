<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Size;
use Illuminate\Http\Request;

class SizeController extends Controller
{
    public function __construct()
    {
        $this->middleware('admin')->only(['store', 'update', 'destroy']);
    }

    public function index()
    {
        return response()->json(Size::all());
    }

    public function show($id)
    {
        $size = Size::find($id);
        if (!$size) {
            return response()->json(['message' => 'Không tìm thấy kích cỡ'], 404);
        }
        return response()->json($size);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'SizeName' => 'required|string|max:50'
        ]);

        $size = Size::create($validated);
        return response()->json($size, 201);
    }

    public function update(Request $request, $id)
    {
        $size = Size::find($id);
        if (!$size) {
            return response()->json(['message' => 'Không tìm thấy kích cỡ'], 404);
        }

        $validated = $request->validate([
            'SizeName' => 'required|string|max:50'
        ]);

        $size->update($validated);
        return response()->json($size);
    }

    public function destroy($id)
    {
        $size = Size::find($id);
        if (!$size) {
            return response()->json(['message' => 'Không tìm thấy kích cỡ'], 404);
        }

        $size->delete();
        return response()->json(['message' => 'Đã xoá kích cỡ']);
    }
}