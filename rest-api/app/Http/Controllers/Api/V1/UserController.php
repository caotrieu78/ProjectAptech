<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::with('role')->get());
    }

    public function show($id)
    {
        $user = User::with('role')->where('UserID', $id)->first(); // UUID
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại'], 404);
        }
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::where('UserID', $id)->first(); // UUID
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng'], 404);
        }

        $validated = $request->validate([
            'FullName' => 'nullable|string|max:100',
            'Email' => 'nullable|email|max:100',
            'IsActive' => 'nullable|boolean',
            'RoleID' => 'nullable|integer|exists:Roles,RoleID',
            'Avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('Avatar')) {
            if ($user->Avatar) {
                $oldPath = public_path(parse_url($user->Avatar, PHP_URL_PATH));
                if (File::exists($oldPath)) File::delete($oldPath);
            }

            $image = $request->file('Avatar');
            $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/avatar'), $filename);
            $validated['Avatar'] = url('images/avatar/' . $filename);
        }

        $user->update($validated);
        return response()->json(['message' => 'Cập nhật thành công', 'user' => $user]);
    }

    public function destroy($id)
    {
        $user = User::where('UserID', $id)->first(); // UUID
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại'], 404);
        }

        if ($user->Avatar) {
            $oldPath = public_path(parse_url($user->Avatar, PHP_URL_PATH));
            if (File::exists($oldPath)) File::delete($oldPath);
        }

        $user->delete();
        return response()->json(['message' => 'Xoá người dùng thành công']);
    }

    public function updateSelf(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'FullName' => 'nullable|string|max:100',
            'Email' => 'nullable|email|max:100|unique:Users,Email,' . $user->UserID . ',UserID',
            'Avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('Avatar')) {
            if ($user->Avatar) {
                $oldPath = public_path(parse_url($user->Avatar, PHP_URL_PATH));
                if (File::exists($oldPath)) File::delete($oldPath);
            }

            $image = $request->file('Avatar');
            $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/avatar'), $filename);
            $validated['Avatar'] = url('images/avatar/' . $filename);
        }

        $user->update($validated);
        return response()->json(['message' => 'Cập nhật hồ sơ thành công', 'user' => $user]);
    }
}