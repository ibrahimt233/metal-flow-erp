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
import { SalesOrder } from "@/types";
import { mockSalesOrders, mockProducts } from "@/services/mockData";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function SalesPage() {
  const {
    data,
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
  } = useCrud<SalesOrder>({
    items: mockSalesOrders,
    itemName: "Sales Order",
    storageKey: "erp-sales",
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [formData, setFormData] = useState<Partial<SalesOrder>>({
    clientName: "",
    date: format(new Date(), "yyyy-MM-dd"),
    productName: "",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        clientName: editItem.clientName,
        date: editItem.date,
        productName: editItem.productName,
        quantity: editItem.quantity,
        unitPrice: editItem.unitPrice,
        totalPrice: editItem.totalPrice,
      });
      setSelectedDate(new Date(editItem.date));
    } else {
      setFormData({
        clientName: "",
        date: format(new Date(), "yyyy-MM-dd"),
        productName: "",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      });
      setSelectedDate(new Date());
    }
  }, [editItem]);

  useEffect(() => {
    if (formData.quantity && formData.unitPrice) {
      setFormData(prev => ({
        ...prev,
        totalPrice: prev.quantity! * prev.unitPrice!
      }));
    }
  }, [formData.quantity, formData.unitPrice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : 
              name === "unitPrice" || name === "totalPrice" ? parseFloat(value) : 
              value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const salesData: SalesOrder = {
      id: editItem?.id || 0,
      clientName: formData.clientName || "",
      date: format(selectedDate, "yyyy-MM-dd"),
      productName: formData.productName || "",
      quantity: formData.quantity || 0,
      unitPrice: formData.unitPrice || 0,
      totalPrice: formData.totalPrice || 0,
    };
    
    saveItem(salesData);
  };

  const columns: ColumnDef<SalesOrder>[] = [
    {
      accessorKey: "clientName",
      header: "Client Name",
      cell: ({ row }) => <div>{row.getValue("clientName")}</div>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <div>{row.getValue("date")}</div>,
    },
    {
      accessorKey: "productName",
      header: "Product Name",
      cell: ({ row }) => <div>{row.getValue("productName")}</div>,
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
    },
    {
      accessorKey: "unitPrice",
      header: "Unit Price",
      cell: ({ row }) => {
        const value = row.getValue("unitPrice");
        return <div>${typeof value === "number" ? value.toFixed(2) : "0.00"}</div>;
      },
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
      cell: ({ row }) => {
        const value = row.getValue("totalPrice");
        return <div>${typeof value === "number" ? value.toFixed(2) : "0.00"}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex space-x-2">
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
        <h1 className="text-3xl font-bold">Sales Orders</h1>
        <p className="text-muted-foreground">
          Manage your client sales orders
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchField="clientName"
        searchPlaceholder="Search by client..."
      />

      <Dialog open={formOpen} onOpenChange={closeForm}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editItem ? "Edit Sales Order" : "Add New Sales Order"}</DialogTitle>
              <DialogDescription>
                Enter details for the {editItem ? "sales order" : "new sales order"}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientName" className="text-right">
                  Client
                </Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "col-span-3 justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productName" className="text-right">
                  Product
                </Label>
                <Select 
                  value={formData.productName}
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, productName: value }))
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts.map(product => (
                      <SelectItem key={product.id} value={product.name}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unitPrice" className="text-right">
                  Unit Price
                </Label>
                <Input
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="totalPrice" className="text-right">
                  Total Price
                </Label>
                <Input
                  id="totalPrice"
                  name="totalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.totalPrice}
                  onChange={handleChange}
                  className="col-span-3"
                  readOnly
                />
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
              This action cannot be undone. This will permanently delete the sales order
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
