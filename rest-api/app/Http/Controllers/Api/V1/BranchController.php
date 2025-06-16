<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function __construct()
    {
        // Người dùng có thể xem
        $this->middleware('auth:sanctum')->only(['index', 'show']);
        // Admin mới được thêm/sửa/xoá
        $this->middleware('admin')->only(['store', 'update', 'destroy']);
    }

    public function index()
    {
        return response()->json(Branch::all());
    }

    public function show($id)
    {
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['message' => 'Không tìm thấy chi nhánh'], 404);
        }
        return response()->json($branch);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'BranchName' => 'required|string|max:100',
            'Address' => 'required|string|max:300',
            'City' => 'required|string|max:100',
            'Latitude' => 'nullable|numeric',
            'Longitude' => 'nullable|numeric',
            'Phone' => 'nullable|string|max:20',
            'Email' => 'nullable|email|max:100',
        ]);

        $branch = Branch::create($validated);
        return response()->json($branch, 201);
    }

    public function update(Request $request, $id)
    {
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['message' => 'Không tìm thấy chi nhánh'], 404);
        }

        $validated = $request->validate([
            'BranchName' => 'sometimes|string|max:100',
            'Address' => 'sometimes|string|max:300',
            'City' => 'sometimes|string|max:100',
            'Latitude' => 'nullable|numeric',
            'Longitude' => 'nullable|numeric',
            'Phone' => 'nullable|string|max:20',
            'Email' => 'nullable|email|max:100',
        ]);

        $branch->update($validated);
        return response()->json($branch);
    }

    public function destroy($id)
    {
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['message' => 'Không tìm thấy chi nhánh'], 404);
        }

        $branch->delete();
        return response()->json(['message' => 'Đã xoá chi nhánh']);
    }
}