<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum', 'admin']);
    }

    // ✅ Tổng quan: số đơn, doanh thu, trạng thái
    public function overview(Request $request)
    {
        $query = Order::query();

        if ($request->has('from') && $request->has('to')) {
            $query->whereBetween('OrderDate', [$request->from, $request->to]);
        }

        if ($request->has('month') && $request->has('year')) {
            $query->whereMonth('OrderDate', $request->month)
                ->whereYear('OrderDate', $request->year);
        }

        return response()->json([
            'totalOrders' => $query->count(),
            'totalRevenue' => $query->sum('TotalAmount'),
            'byStatus' => $query->select('Status', DB::raw('count(*) as count'))
                ->groupBy('Status')
                ->get(),
        ]);
    }

    // ✅ Thống kê theo tháng trong năm
    public function monthly(Request $request)
    {
        $year = $request->input('year', now()->year);

        $stats = Order::select(
            DB::raw("DATE_FORMAT(OrderDate, '%Y-%m') as month"),
            DB::raw("SUM(TotalAmount) as revenue"),
            DB::raw("COUNT(*) as orders")
        )
            ->whereYear('OrderDate', $year)
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return response()->json($stats);
    }

    // ✅ Top sản phẩm bán chạy
    public function topProducts(Request $request)
    {
        $top = DB::table('order_details')
            ->join('product_variants', 'order_details.VariantID', '=', 'product_variants.VariantID')
            ->join('products', 'product_variants.ProductID', '=', 'products.ProductID')
            ->select('products.ProductName', DB::raw('SUM(order_details.Quantity) as total'))
            ->groupBy('products.ProductName')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        return response()->json($top);
    }

    // ✅ Top khách hàng chi tiêu nhiều nhất
    public function topCustomers()
    {
        $top = Order::join('users', 'orders.UserID', '=', 'users.UserID')
            ->select(
                'users.FullName',
                'users.Email',
                DB::raw('SUM(TotalAmount) as total_spent'),
                DB::raw('COUNT(orders.OrderID) as orders')
            )
            ->groupBy('users.UserID', 'users.FullName', 'users.Email')
            ->orderByDesc('total_spent')
            ->limit(5)
            ->get();

        return response()->json($top);
    }
}
