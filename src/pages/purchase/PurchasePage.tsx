
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
import { PurchaseOrder } from "@/types";
import { mockPurchaseOrders } from "@/services/mockData";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PurchasePage() {
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
  } = useCrud<PurchaseOrder>({
    items: mockPurchaseOrders,
    itemName: "Purchase Order",
    storageKey: "erp-purchases", // Add localStorage key
  });

  const [formData, setFormData] = useState<Partial<PurchaseOrder>>({
    supplierName: "",
    date: format(new Date(), "yyyy-MM-dd"),
    productName: "",
    unitCost: 0,
    totalCost: 0,
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Initialize form data when editing an item
  useEffect(() => {
    if (editItem) {
      setFormData({
        supplierName: editItem.supplierName,
        date: editItem.date,
        productName: editItem.productName,
        unitCost: editItem.unitCost,
        totalCost: editItem.totalCost,
      });
      setSelectedDate(new Date(editItem.date));
    } else {
      setFormData({
        supplierName: "",
        date: format(new Date(), "yyyy-MM-dd"),
        productName: "",
        unitCost: 0,
        totalCost: 0,
      });
      setSelectedDate(new Date());
    }
  }, [editItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "unitCost" || name === "totalCost" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const purchaseData: PurchaseOrder = {
      id: editItem?.id || 0,
      supplierName: formData.supplierName || "",
      date: format(selectedDate, "yyyy-MM-dd"),
      productName: formData.productName || "",
      unitCost: formData.unitCost || 0,
      totalCost: formData.totalCost || 0,
    };
    
    saveItem(purchaseData);
  };

  const columns: ColumnDef<PurchaseOrder>[] = [
    {
      accessorKey: "supplierName",
      header: "Supplier Name",
      cell: ({ row }) => <div>{row.getValue("supplierName")}</div>,
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
      accessorKey: "unitCost",
      header: "Unit Cost",
      cell: ({ row }) => {
        const value = row.getValue("unitCost");
        return <div>${typeof value === "number" ? value.toFixed(2) : "0.00"}</div>;
      },
    },
    {
      accessorKey: "totalCost",
      header: "Total Cost",
      cell: ({ row }) => {
        const value = row.getValue("totalCost");
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
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <p className="text-muted-foreground">
          Manage your supplier purchase orders
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchField="supplierName"
        searchPlaceholder="Search by supplier..."
      />

      <Dialog open={formOpen} onOpenChange={closeForm}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editItem ? "Edit Purchase Order" : "Add New Purchase Order"}</DialogTitle>
              <DialogDescription>
                Enter details for the {editItem ? "purchase order" : "new purchase order"}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="supplierName" className="text-right">
                  Supplier
                </Label>
                <Input
                  id="supplierName"
                  name="supplierName"
                  value={formData.supplierName}
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
                <Input
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unitCost" className="text-right">
                  Unit Cost
                </Label>
                <Input
                  id="unitCost"
                  name="unitCost"
                  type="number"
                  step="0.01"
                  value={formData.unitCost}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="totalCost" className="text-right">
                  Total Cost
                </Label>
                <Input
                  id="totalCost"
                  name="totalCost"
                  type="number"
                  step="0.01"
                  value={formData.totalCost}
                  onChange={handleChange}
                  className="col-span-3"
                  required
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
              This action cannot be undone. This will permanently delete the purchase order
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
