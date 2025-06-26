<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
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
            'Price' => 'nullable|numeric|min:0', // ✅ thêm giá
            'Thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('Thumbnail')) {
            $image = $request->file('Thumbnail');
            $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/product'), $filename);
            $validated['ThumbnailURL'] = url('images/product/' . $filename);
        }

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
            'Price' => 'nullable|numeric|min:0', // ✅ cập nhật giá
            'Thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('Thumbnail')) {
            if ($product->ThumbnailURL) {
                $oldPath = public_path(parse_url($product->ThumbnailURL, PHP_URL_PATH));
                if (File::exists($oldPath)) {
                    File::delete($oldPath);
                }
            }

            $image = $request->file('Thumbnail');
            $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/product'), $filename);
            $validated['ThumbnailURL'] = url('images/product/' . $filename);
        }

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
    }
}
