<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\User;

class AuthController extends Controller
{
    // Đăng ký người dùng mới
    public function register(Request $request)
    {
        $request->validate([
            'Username' => 'required|string|max:100',
            'Password' => 'required|string|min:6',
            'Email'    => 'nullable|email|max:100',
            'FullName' => 'nullable|string|max:100',
        ], [
            'Username.required' => 'Tên đăng nhập không được để trống',
            'Password.required' => 'Vui lòng nhập mật khẩu',
            'Password.min' => 'Mật khẩu phải có ít nhất 6 ký tự',
            'Email.email' => 'Email không hợp lệ',
        ]);

        // Kiểm tra Username tồn tại
        if (User::where('Username', $request->Username)->exists()) {
            return response()->json(['message' => 'Tên đăng nhập đã tồn tại'], 409);
        }

        $user = User::create([
            'UserID'   => (string) Str::uuid(), // sinh UUID thủ công
            'Username' => $request->Username,
            'Password' => Hash::make($request->Password),
            'Email'    => $request->Email,
            'FullName' => $request->FullName,
            'RoleID'   => 2,
        ]);

        return response()->json(['message' => 'Đăng ký thành công'], 201);
    }

    // Đăng nhập
    public function login(Request $request)
    {
        $request->validate([
            'Username' => 'required|string',
            'Password' => 'required|string',
        ]);

        $user = User::where('Username', $request->Username)->first();

        if (!$user) {
            return response()->json(['message' => 'Tài khoản không tồn tại'], 404);
        }

        if (!Hash::check($request->Password, $user->Password)) {
            return response()->json(['message' => 'Mật khẩu không chính xác'], 401);
        }

        if (!$user->IsActive) {
            return response()->json(['message' => 'Tài khoản của bạn đã bị khóa'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập thành công',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'UserID'   => $user->UserID,
                'Username' => $user->Username,
                'Email'    => $user->Email,
                'RoleID'   => $user->RoleID
            ]
        ]);
    }

    // Đăng xuất
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Đăng xuất thành công']);
    }

    // Lấy thông tin người dùng hiện tại
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}