
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPurchaseOrders, mockProductionOrders, mockSalesOrders, mockProducts } from "@/services/mockData";
import { Package, ShoppingCart, Truck, ArrowUp, ArrowDown, DollarSign, Clock } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function DashboardPage() {
  // Calculate metrics
  const totalPurchases = mockPurchaseOrders.reduce((acc, curr) => acc + curr.totalCost, 0);
  const totalSales = mockSalesOrders.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const completedProduction = mockProductionOrders.filter(order => order.completed).length;
  const pendingProduction = mockProductionOrders.filter(order => !order.completed).length;
  
  // Format for display
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  
  // Data for charts
  const salesData = mockSalesOrders.map(order => ({
    name: order.productName,
    sales: order.totalPrice,
  }));
  
  const productionStatusData = [
    { name: "Completed", value: completedProduction },
    { name: "In Progress", value: pendingProduction },
  ];
  
  const COLORS = ["#2186db", "#616e7c"];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your metalwork business
        </p>
      </div>
      
      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchase Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPurchases)}</div>
            <p className="text-xs text-muted-foreground">
              {mockPurchaseOrders.length} orders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              {mockSalesOrders.length} orders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSales - totalPurchases)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {totalSales > totalPurchases ? (
                <>
                  <ArrowUp className="mr-1 h-3 w-3 text-green-600" />
                  <span className="text-green-600">Profitable</span>
                </>
              ) : (
                <>
                  <ArrowDown className="mr-1 h-3 w-3 text-red-600" />
                  <span className="text-red-600">Loss</span>
                </>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Status</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProduction} / {mockProductionOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              Orders completed
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Product</CardTitle>
            <CardDescription>
              Revenue distribution across products
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end"
                  tick={{ fontSize: 12 }}
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value}`, "Sales"]}
                />
                <Bar dataKey="sales" fill="#2186db" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Production Status</CardTitle>
            <CardDescription>
              Overview of production order status
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productionStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {productionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => [value, "Orders"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recent Activity</h2>
        
        <div className="space-y-2">
          <h3 className="font-medium">Production Orders</h3>
          <div className="rounded-md border">
            <div className="p-4">
              <div className="space-y-3">
                {mockProductionOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{order.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.productionStart} to {order.productionEnd}
                        </p>
                      </div>
                    </div>
                    <StatusBadge variant={order.completed ? "completed" : "pending"}>
                      {order.completed ? "Completed" : "In Progress"}
                    </StatusBadge>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/production" className="text-sm text-steel-500 hover:text-steel-700">
                  View all production orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
