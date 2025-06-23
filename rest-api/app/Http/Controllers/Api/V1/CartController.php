<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // 🛒 Lấy danh sách sản phẩm trong giỏ hàng
    public function index()
    {
        $cartItems = CartItem::with('variant.product', 'variant.size', 'variant.color')
            ->where('UserID', auth()->id())
            ->get();

        return response()->json($cartItems);
    }

    // ➕ Thêm sản phẩm vào giỏ hàng (nếu đã có thì cộng dồn số lượng)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'VariantID' => 'required|exists:ProductVariant,VariantID',
            'Quantity' => 'required|integer|min:1',
        ]);

        $userId = auth()->id();
        $variant = \App\Models\ProductVariant::find($validated['VariantID']);

        if (!$variant || $variant->StockQuantity < $validated['Quantity']) {
            return response()->json(['message' => 'Số lượng vượt quá tồn kho'], 400);
        }

        $item = CartItem::where('UserID', $userId)
            ->where('VariantID', $validated['VariantID'])
            ->first();

        $newQuantity = $item ? $item->Quantity + $validated['Quantity'] : $validated['Quantity'];

        if ($newQuantity > $variant->StockQuantity) {
            return response()->json(['message' => 'Không thể thêm quá số lượng tồn kho'], 400);
        }

        if ($item) {
            $item->Quantity = $newQuantity;
            $item->save();
        } else {
            CartItem::create([
                'UserID' => $userId,
                'VariantID' => $validated['VariantID'],
                'Quantity' => $validated['Quantity'],
            ]);
        }

        return response()->json(['message' => 'Đã thêm vào giỏ hàng thành công']);
    }


    // 🔁 Cập nhật số lượng sản phẩm trong giỏ hàng
    public function update(Request $request)
    {
        $validated = $request->validate([
            'VariantID' => 'required|exists:ProductVariant,VariantID',
            'Quantity' => 'required|integer|min:1',
        ]);

        $item = CartItem::where('UserID', auth()->id())
            ->where('VariantID', $validated['VariantID'])
            ->first();

        if (!$item) {
            return response()->json(['message' => 'Không tìm thấy sản phẩm trong giỏ hàng'], 404);
        }

        $variant = \App\Models\ProductVariant::find($validated['VariantID']);

        if (!$variant || $validated['Quantity'] > $variant->StockQuantity) {
            return response()->json(['message' => 'Số lượng vượt quá tồn kho'], 400);
        }

        $item->Quantity = $validated['Quantity'];
        $item->save();

        return response()->json(['message' => 'Đã cập nhật số lượng sản phẩm']);
    }


    // ❌ Xoá sản phẩm khỏi giỏ hàng
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'VariantID' => 'required|exists:ProductVariant,VariantID'
        ]);

        $deleted = CartItem::where('UserID', auth()->id())
            ->where('VariantID', $validated['VariantID'])
            ->delete();

        if ($deleted) {
            return response()->json(['message' => 'Đã xoá sản phẩm khỏi giỏ hàng']);
        }

        return response()->json(['message' => 'Không tìm thấy sản phẩm'], 404);
    }

    // ❎ Xoá toàn bộ giỏ hàng
    public function clearAll()
    {
        CartItem::where('UserID', auth()->id())->delete();

        return response()->json(['message' => 'Đã xoá toàn bộ giỏ hàng']);
    }
}