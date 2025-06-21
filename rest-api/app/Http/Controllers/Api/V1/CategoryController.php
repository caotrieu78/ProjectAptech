<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use App\Http\Resources\Api\V1\ProductCategoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    // GET /api/v1/categories
    public function index(): JsonResponse
    {
        $categories = ProductCategory::all();
        return response()->json(ProductCategoryResource::collection($categories));
    }

    // GET /api/v1/categories/{id}
    public function show($id): JsonResponse
    {
        $category = ProductCategory::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json(new ProductCategoryResource($category));
    }

    // POST /api/v1/categories
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'CategoryName' => 'required|string|max:100',
        ]);

        $category = ProductCategory::create($validated);

        return response()->json(new ProductCategoryResource($category), 201);
    }

    // PUT /api/v1/categories/{id}
    public function update(Request $request, $id): JsonResponse
    {
        $category = ProductCategory::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $validated = $request->validate([
            'CategoryName' => 'required|string|max:100',
        ]);

        $category->update($validated);

        return response()->json(new ProductCategoryResource($category));
    }

    // DELETE /api/v1/categories/{id}
    public function destroy($id): JsonResponse
    {
        $category = ProductCategory::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }


    public function __construct()
    {
        // Chỉ cho admin
        $this->middleware('admin')->only(['store', 'update', 'destroy']);
    }
}