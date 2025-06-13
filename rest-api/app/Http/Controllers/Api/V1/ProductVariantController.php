<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->only(['index', 'show']);
        $this->middleware('admin')->only(['store', 'update', 'destroy']);
    }

    public function index()
    {
        return response()->json(ProductVariant::with(['product', 'size', 'color'])->get());
    }

    public function show($id)
    {
        $variant = ProductVariant::with(['product', 'size', 'color'])->find($id);
        if (!$variant) {
            return response()->json(['message' => 'Không tìm thấy biến thể'], 404);
        }
        return response()->json($variant);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ProductID' => 'required|exists:Product,ProductID',
            'SizeID' => 'required|exists:Size,SizeID',
            'ColorID' => 'required|exists:Color,ColorID',
            'Price' => 'required|numeric|min:0',
            'StockQuantity' => 'required|integer|min:0',
            'ImageURL' => 'nullable|url|max:300'
        ]);

        $variant = ProductVariant::create($validated);
        return response()->json($variant, 201);
    }

    public function update(Request $request, $id)
    {
        $variant = ProductVariant::find($id);
        if (!$variant) {
            return response()->json(['message' => 'Không tìm thấy biến thể'], 404);
        }

        $validated = $request->validate([
            'ProductID' => 'sometimes|exists:Product,ProductID',
            'SizeID' => 'sometimes|exists:Size,SizeID',
            'ColorID' => 'sometimes|exists:Color,ColorID',
            'Price' => 'sometimes|numeric|min:0',
            'StockQuantity' => 'sometimes|integer|min:0',
            'ImageURL' => 'nullable|url|max:300'
        ]);

        $variant->update($validated);
        return response()->json($variant);
    }

    public function destroy($id)
    {
        $variant = ProductVariant::find($id);
        if (!$variant) {
            return response()->json(['message' => 'Không tìm thấy biến thể'], 404);
        }

        $variant->delete();
        return response()->json(['message' => 'Đã xoá biến thể']);
    }
}
