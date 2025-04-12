
import { useState, useEffect } from "react";
import { useCrud } from "@/hooks/use-crud";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ProductionOrder, Product, PurchaseOrder } from "@/types";
import { mockProductionOrders, mockProducts, mockPurchaseOrders } from "@/services/mockData";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Check, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function ProductionPage() {
  const {
    data,
    setData,
    editItem,
    deleteItem,
    formOpen,
    deleteDialogOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    confirmDelete,
    closeForm,
    closeDeleteDialog,
    saveItem,
  } = useCrud<ProductionOrder>({
    items: mockProductionOrders,
    itemName: "Production Order",
  });

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState<Partial<ProductionOrder>>({
    purchaseOrderId: undefined,
    productId: 0,
    productName: "",
    productionStart: format(new Date(), "yyyy-MM-dd"),
    productionEnd: format(new Date(), "yyyy-MM-dd"),
    completed: false,
  });

  // Initialize form data when editing an item
  useEffect(() => {
    if (editItem) {
      setFormData({
        purchaseOrderId: editItem.purchaseOrderId,
        productId: editItem.productId,
        productName: editItem.productName,
        productionStart: editItem.productionStart,
        productionEnd: editItem.productionEnd,
        completed: editItem.completed,
      });
      setStartDate(new Date(editItem.productionStart));
      setEndDate(new Date(editItem.productionEnd));
    } else {
      setFormData({
        purchaseOrderId: undefined,
        productId: 0,
        productName: "",
        productionStart: format(new Date(), "yyyy-MM-dd"),
        productionEnd: format(new Date(), "yyyy-MM-dd"),
        completed: false,
      });
      setStartDate(new Date());
      setEndDate(new Date());
    }
  }, [editItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the product name based on the selected product ID
    const selectedProduct = mockProducts.find(p => p.id === formData.productId);
    
    const orderData: ProductionOrder = {
      id: editItem?.id || 0,
      purchaseOrderId: formData.purchaseOrderId,
      productId: formData.productId || 0,
      productName: selectedProduct?.name || "",
      productionStart: format(startDate, "yyyy-MM-dd"),
      productionEnd: format(endDate, "yyyy-MM-dd"),
      completed: formData.completed || false,
    };
    
    saveItem(orderData);
  };

  const handleMarkComplete = (order: ProductionOrder) => {
    const updatedData = data.map(item => 
      item.id === order.id ? { ...item, completed: true } : item
    );
    setData(updatedData);
  };

  const columns: ColumnDef<ProductionOrder>[] = [
    {
      accessorKey: "productName",
      header: "Product",
      cell: ({ row }) => <div>{row.getValue("productName")}</div>,
    },
    {
      accessorKey: "purchaseOrderId",
      header: "Purchase Order ID",
      cell: ({ row }) => (
        <div>
          {row.getValue("purchaseOrderId") ? `#${row.getValue("purchaseOrderId")}` : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "productionStart",
      header: "Start Date",
      cell: ({ row }) => <div>{row.getValue("productionStart")}</div>,
    },
    {
      accessorKey: "productionEnd",
      header: "End Date",
      cell: ({ row }) => <div>{row.getValue("productionEnd")}</div>,
    },
    {
      accessorKey: "completed",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge variant={row.getValue("completed") ? "completed" : "pending"}>
          {row.getValue("completed") ? "Completed" : "In Progress"}
        </StatusBadge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex space-x-2">
            {!order.completed && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleMarkComplete(order)}
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => handleEdit(order)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(order)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Production Orders</h1>
        <p className="text-muted-foreground">
          Manage your production workflow
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchField="productName"
        searchPlaceholder="Search by product..."
      />

      <Dialog open={formOpen} onOpenChange={closeForm}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editItem ? "Edit Production Order" : "Create Production Order"}</DialogTitle>
              <DialogDescription>
                Enter details for the {editItem ? "production order" : "new production order"}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productId" className="text-right">
                  Product
                </Label>
                <Select 
                  value={formData.productId?.toString()}
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, productId: parseInt(value) }))
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts.map(product => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="purchaseOrderId" className="text-right">
                  Purchase Order
                </Label>
                <Select 
                  value={formData.purchaseOrderId?.toString() || "none"}
                  onValueChange={(value) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      purchaseOrderId: value === "none" ? undefined : parseInt(value) 
                    }))
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a purchase order (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {mockPurchaseOrders.map(po => (
                      <SelectItem key={po.id} value={po.id.toString()}>
                        #{po.id} - {po.productName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "col-span-3 justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "col-span-3 justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="completed" className="text-right">
                  Status
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                    id="completed"
                    checked={formData.completed}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, completed: !!checked }))
                    }
                  />
                  <label
                    htmlFor="completed"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mark as completed
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the production order
              {deleteItem && <strong> for "{deleteItem.productName}"</strong>} and remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
