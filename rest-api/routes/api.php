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
use App\Http\Controllers\Api\V1\VisitorLogController;

Route::prefix('v1')->group(function () {

    // ✅ Public routes (ai cũng dùng được)
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // ✅ Public feedback route (không cần đăng nhập)
    Route::post('/feedback', [FeedbackController::class, 'store']);

    // ✅ VisitorLog routes (ghi log, đếm truy cập, đếm online)
    Route::post('/visitor-log', [VisitorLogController::class, 'store']);
    Route::get('/visitor-log/count', [VisitorLogController::class, 'count']);
    Route::get('/visitor-log/online', [VisitorLogController::class, 'onlineUsers']);

    // ✅ Protected routes (cần đăng nhập bằng Sanctum)
    Route::middleware('auth:sanctum')->group(function () {

        // ✅ Authenticated user actions
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::put('/users/me', [UserController::class, 'updateSelf']);

        // ✅ API resource routes (user đã login)
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('products', ProductController::class);
        Route::apiResource('variants', ProductVariantController::class);
        Route::apiResource('sizes', SizeController::class);
        Route::apiResource('colors', ColorController::class);
        Route::apiResource('branches', BranchController::class);
        Route::apiResource('orders', OrderController::class)->only(['index', 'show', 'store']);
        // ✅ Feedback viewing (chỉ cần login)
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
        });
    });
});
