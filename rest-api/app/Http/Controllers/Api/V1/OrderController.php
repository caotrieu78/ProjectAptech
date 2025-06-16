<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->only(['index', 'show', 'store']);
        $this->middleware('admin')->only(['destroy', 'adminIndex', 'update']);
    }

    // ✅ Lấy đơn hàng của người dùng hiện tại
    public function index()
    {
        $orders = Order::with([
            'details.variant.product',
            'details.variant.size',
            'details.variant.color',
        ])
            ->where('UserID', auth()->id())
            ->orderByDesc('OrderDate')
            ->get();

        return response()->json($orders);
    }

    // ✅ Lấy chi tiết đơn hàng của người dùng hiện tại
    public function show($id)
    {
        $order = Order::with([
            'details.variant.product',
            'details.variant.size',
            'details.variant.color',
        ])
            ->where('UserID', auth()->id())
            ->find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        return response()->json($order);
    }

    // ✅ Tạo đơn hàng mới
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.VariantID' => 'required|exists:ProductVariant,VariantID',
            'items.*.Quantity' => 'required|integer|min:1'
        ]);

        DB::beginTransaction();

        try {
            $total = 0;
            $details = [];

            foreach ($validated['items'] as $item) {
                $variant = \App\Models\ProductVariant::findOrFail($item['VariantID']);
                $subtotal = $variant->Price * $item['Quantity'];
                $total += $subtotal;

                $details[] = [
                    'VariantID' => $variant->VariantID,
                    'Quantity' => $item['Quantity'],
                    'Price' => $variant->Price
                ];
            }

            $order = Order::create([
                'UserID' => auth()->id(),
                'TotalAmount' => $total,
                'Status' => 'Pending'
            ]);

            foreach ($details as $detail) {
                $detail['OrderID'] = $order->OrderID;
                OrderDetail::create($detail);
            }

            DB::commit();

            return response()->json([
                'message' => 'Đặt hàng thành công',
                'order' => $order->load('details.variant')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Không thể đặt hàng',
                'detail' => $e->getMessage()
            ], 500);
        }
    }

    // ✅ Admin: Lấy tất cả đơn hàng kèm quan hệ đầy đủ
    public function adminIndex()
    {
        $orders = Order::with([
            'details.variant.product',
            'details.variant.size',
            'details.variant.color',
            'user'
        ])
            ->orderByDesc('OrderDate')
            ->get();

        return response()->json($orders);
    }

    // ✅ Admin: Cập nhật đơn hàng
    public function update(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        $validated = $request->validate([
            'Status' => 'sometimes|string|max:50',
            'TotalAmount' => 'sometimes|numeric',
            'PaymentStatus' => 'nullable|string|max:50',
            'PaymentMethod' => 'nullable|string|max:50',
        ]);

        $order->update($validated);

        return response()->json([
            'message' => 'Cập nhật đơn hàng thành công',
            'order' => $order->fresh()
        ]);
    }

    // ✅ Admin: Xoá đơn hàng
    public function destroy($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        DB::beginTransaction();
        try {
            OrderDetail::where('OrderID', $id)->delete();
            $order->delete();

            DB::commit();
            return response()->json(['message' => 'Đã xoá đơn hàng']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Lỗi khi xoá đơn hàng', 'detail' => $e->getMessage()], 500);
        }
    }
}