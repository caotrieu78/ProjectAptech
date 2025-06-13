<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::with('category')->get());
    }

    public function show($id)
    {
        $product = Product::with('category')->find($id);
        if (!$product) {
            return response()->json(['message' => 'Sản phẩm không tồn tại'], 404);
        }
        return response()->json($product);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ProductName' => 'required|string|max:200',
            'Description' => 'nullable|string|max:500',
            'Gender' => 'required|in:Male,Female,Unisex',
            'CategoryID' => 'required|exists:ProductCategory,CategoryID',
            'ThumbnailURL' => 'nullable|url|max:300',
        ]);

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Không tìm thấy sản phẩm'], 404);
        }

        $validated = $request->validate([
            'ProductName' => 'sometimes|string|max:200',
            'Description' => 'nullable|string|max:500',
            'Gender' => 'in:Male,Female,Unisex',
            'CategoryID' => 'exists:ProductCategory,CategoryID',
            'ThumbnailURL' => 'nullable|url|max:300',
        ]);

        $product->update($validated);
        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Không tìm thấy sản phẩm'], 404);
        }

        $product->delete();
        return response()->json(['message' => 'Đã xoá sản phẩm']);
    }


    public function __construct()
    {
        // Chỉ cho admin
        $this->middleware('admin')->only(['store', 'update', 'destroy']);

        // Cho user đã login
        $this->middleware('auth:sanctum')->only(['index', 'show']);
    }
}
