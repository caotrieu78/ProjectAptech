<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\OrderDetail;

class StatisticsController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum', 'admin']);
    }

    public function index()
    {
        // ✅ Tổng doanh thu
        $totalRevenue = Order::sum('TotalAmount');

        // ✅ Tổng số đơn hàng
        $totalOrders = Order::count();

        // ✅ Doanh thu theo tháng (trong năm hiện tại)
        $monthlyRevenue = Order::selectRaw('MONTH(OrderDate) as month, SUM(TotalAmount) as revenue')
            ->whereYear('OrderDate', now()->year)
            ->groupByRaw('MONTH(OrderDate)')
            ->orderByRaw('MONTH(OrderDate)')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => 'Tháng ' . $item->month,
                    'revenue' => (int)$item->revenue
                ];
            });

        // ✅ Top sản phẩm bán chạy
        $topProducts = OrderDetail::select('Product.ProductName', DB::raw('COUNT(*) as total'))
            ->join('ProductVariant', 'OrderDetail.VariantID', '=', 'ProductVariant.VariantID')
            ->join('Product', 'Product.ProductID', '=', 'ProductVariant.ProductID')
            ->groupBy('Product.ProductName')
            ->orderByDesc('total')
            ->take(5)
            ->get();

        return response()->json([
            'totalRevenue' => $totalRevenue,
            'totalOrders' => $totalOrders,
            'revenueChart' => $monthlyRevenue,
            'topProducts' => $topProducts,
        ]);
    }
}