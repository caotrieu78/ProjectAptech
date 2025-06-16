<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BranchController;
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

    // ✅ Protected routes
    Route::middleware('auth:sanctum')->group(function () {

        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::put('/users/me', [UserController::class, 'updateSelf']);

        // ✅ User-accessible resources
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('products', ProductController::class);
        Route::apiResource('product-variants', ProductVariantController::class);
        Route::apiResource('sizes', SizeController::class);
        Route::apiResource('colors', ColorController::class);
        Route::apiResource('branches', BranchController::class);
        Route::middleware(['auth:sanctum', 'admin'])->get('/v1/admin/statistics', [StatisticsController::class, 'index']);
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
            Route::apiResource('users', UserController::class)->only([
                'index',
                'show',
                'update',
                'destroy'
            ]);

            // ✅ Xoá phản hồi
            Route::delete('/feedback/{id}', [FeedbackController::class, 'destroy']);

            // ✅ Quản lý đơn hàng
            Route::get('/admin/orders', [OrderController::class, 'adminIndex']);
            Route::put('/orders/{id}', [OrderController::class, 'update']);
            Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
        });
    });
});