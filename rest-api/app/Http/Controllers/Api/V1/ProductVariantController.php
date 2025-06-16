<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
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
            'Image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // ✅
        ]);

        if ($request->hasFile('Image')) {
            $image = $request->file('Image');
            $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/productv2'), $filename);
            $validated['ImageURL'] = url('images/productv2/' . $filename);
        }

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
            'Image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // ✅
        ]);

        if ($request->hasFile('Image')) {
            // Xoá ảnh cũ nếu tồn tại
            if ($variant->ImageURL) {
                $oldPath = public_path(parse_url($variant->ImageURL, PHP_URL_PATH));
                if (File::exists($oldPath)) {
                    File::delete($oldPath);
                }
            }

            $image = $request->file('Image');
            $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/productv2'), $filename);
            $validated['ImageURL'] = url('images/productv2/' . $filename);
        }

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
