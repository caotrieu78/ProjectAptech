<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    // GET /api/v1/users
    public function index()
    {
        return response()->json(User::all());
    }

    // GET /api/v1/users/{id}
    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại'], 404);
        }
        return response()->json($user);
    }

    // PUT /api/v1/users/{id}
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng'], 404);
        }

        $request->validate([
            'FullName' => 'nullable|string|max:100',
            'Email' => 'nullable|email|max:100',
            'IsActive' => 'nullable|boolean',
            'RoleID' => 'nullable|integer|exists:Roles,RoleID',
        ]);

        $user->update($request->only(['FullName', 'Email', 'IsActive', 'RoleID']));

        return response()->json(['message' => 'Cập nhật thành công', 'user' => $user]);
    }

    // DELETE /api/v1/users/{id}
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Xóa người dùng thành công']);
    }
    // PUT /api/v1/users/me
    public function updateSelf(Request $request)
    {
        $user = $request->user(); // Lấy user hiện tại từ token

        $request->validate([
            'FullName' => 'nullable|string|max:100',
            'Email' => 'nullable|email|max:100|unique:Users,Email,' . $user->UserID . ',UserID',
        ]);

        $user->update($request->only(['FullName', 'Email']));

        return response()->json([
            'message' => 'Cập nhật hồ sơ thành công',
            'user' => $user,
        ]);
    }
}
