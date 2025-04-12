
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const [data, setData] = useState<PurchaseOrder[]>([...mockPurchaseOrders]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<PurchaseOrder>>({
    supplierName: "",
    date: format(new Date(), "yyyy-MM-dd"),
    productName: "",
    unitCost: 0,
    totalCost: 0,
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "unitCost" || name === "totalCost" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOrder: PurchaseOrder = {
      id: data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1,
      supplierName: formData.supplierName || "",
      date: format(selectedDate, "yyyy-MM-dd"),
      productName: formData.productName || "",
      unitCost: formData.unitCost || 0,
      totalCost: formData.totalCost || 0,
    };
    
    setData((prev) => [...prev, newOrder]);
    setOpen(false);
    toast({
      title: "Purchase Order Created",
      description: `Order for ${newOrder.productName} has been added.`,
    });
    
    // Reset form
    setFormData({
      supplierName: "",
      date: format(new Date(), "yyyy-MM-dd"),
      productName: "",
      unitCost: 0,
      totalCost: 0,
    });
    setSelectedDate(new Date());
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
      cell: ({ row }) => <div>${row.getValue("unitCost").toFixed(2)}</div>,
    },
    {
      accessorKey: "totalCost",
      header: "Total Cost",
      cell: ({ row }) => <div>${row.getValue("totalCost").toFixed(2)}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
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
        onAdd={() => setOpen(true)}
        searchField="supplierName"
        searchPlaceholder="Search by supplier..."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add New Purchase Order</DialogTitle>
              <DialogDescription>
                Enter details for the new purchase order.
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
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
