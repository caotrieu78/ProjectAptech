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
        // ✅ Người dùng đã đăng nhập có thể tạo, xem đơn hàng của chính họ
        $this->middleware('auth:sanctum')->only(['index', 'show', 'store']);

        // ✅ Admin có thể xem, sửa, xoá tất cả (tùy mở rộng sau)
        $this->middleware('admin')->only(['destroy']);
    }

    // ✅ Danh sách đơn hàng của user hiện tại
    public function index()
    {
        $orders = Order::with('details.variant')
            ->where('UserID', auth()->id())
            ->orderByDesc('OrderDate')
            ->get();

        return response()->json($orders);
    }

    // ✅ Chi tiết đơn hàng của user hiện tại
    public function show($id)
    {
        $order = Order::with('details.variant')
            ->where('UserID', auth()->id())
            ->find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        return response()->json($order);
    }

    // ✅ Đặt đơn hàng mới (user login)
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
}
