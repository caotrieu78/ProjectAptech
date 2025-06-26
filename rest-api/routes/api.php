<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BranchController;
use App\Http\Controllers\Api\V1\CartController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ColorController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\ProductVariantController;
use App\Http\Controllers\Api\V1\SizeController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\FeedbackController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\StatisticsController;
use App\Http\Controllers\Api\V1\VisitorLogController;

Route::prefix('v1')->group(function () {

    // ✅ Public routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/feedback', [FeedbackController::class, 'store']);
    Route::post('/visitor-log', [VisitorLogController::class, 'store']);
    Route::get('/visitor-log/count', [VisitorLogController::class, 'count']);
    Route::get('/visitor-log/online', [VisitorLogController::class, 'onlineUsers']);

    // ✅ Public view routes (không cần login)
    Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
    Route::apiResource('products', ProductController::class)->only(['index', 'show']);
    Route::apiResource('product-variants', ProductVariantController::class)->only(['index', 'show']);
    Route::apiResource('branches', BranchController::class)->only(['index', 'show']);
    Route::apiResource('sizes', SizeController::class)->only(['index', 'show']);
    Route::apiResource('colors', ColorController::class)->only(['index', 'show']);

    // ✅ Protected routes (cần login)
    Route::middleware('auth:sanctum')->group(function () {

        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::put('/users/me', [UserController::class, 'updateSelf']);
        // ✅ Giỏ hàng - Cart (dạng chuẩn gọn gàng)

        Route::controller(CartController::class)->prefix('cart')->group(function () {
            Route::get('/', 'index');
            Route::post('/', 'store');
            Route::put('/', 'update');
            Route::delete('/', 'destroy');
            Route::delete('/clear', 'clearAll');
        });
        // ✅ Đơn hàng - user
        Route::apiResource('orders', OrderController::class)->only(['index', 'show', 'store']);

        // ✅ Feedback viewing
        Route::get('/feedback', [FeedbackController::class, 'index']);
        Route::get('/feedback/{id}', [FeedbackController::class, 'show']);

        // ✅ Admin-only routes
        Route::middleware('admin')->group(function () {

            Route::get('/admin-only', function () {
                return response()->json([
                    'message' => 'Chào Admin!',
                    'user' => auth()->user()
                ]);
            });

            // ✅ Quản lý người dùng
            Route::apiResource('users', UserController::class)->only(['index', 'show', 'update', 'destroy']);

            // ✅ Quản lý feedback
            Route::delete('/feedback/{id}', [FeedbackController::class, 'destroy']);

            // ✅ Quản lý đơn hàng
            Route::get('/admin/orders', [OrderController::class, 'adminIndex']);
            Route::put('/orders/{id}', [OrderController::class, 'update']);
            Route::delete('/orders/{id}', [OrderController::class, 'destroy']);

            // ✅ Admin quản lý categories, products, v.v.
            Route::apiResource('categories', CategoryController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('products', ProductController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('product-variants', ProductVariantController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('branches', BranchController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('sizes', SizeController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('colors', ColorController::class)->only(['store', 'update', 'destroy']);

            // ✅ Thống kê
            Route::get('/admin/statistics', [StatisticsController::class, 'index']);
        });
    });
});
