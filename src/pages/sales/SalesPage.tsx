
import { useState, useEffect } from "react";
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
  const { toast } = useToast();
  const [data, setData] = useState<SalesOrder[]>([...mockSalesOrders]);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [formData, setFormData] = useState<Partial<SalesOrder>>({
    clientName: "",
    date: format(new Date(), "yyyy-MM-dd"),
    productName: "",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  });

  // Update total price when quantity or unit price changes
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
    
    const newOrder: SalesOrder = {
      id: data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1,
      clientName: formData.clientName || "",
      date: format(selectedDate, "yyyy-MM-dd"),
      productName: formData.productName || "",
      quantity: formData.quantity || 0,
      unitPrice: formData.unitPrice || 0,
      totalPrice: formData.totalPrice || 0,
    };
    
    setData((prev) => [...prev, newOrder]);
    setOpen(false);
    toast({
      title: "Sales Order Created",
      description: `Order for ${newOrder.productName} has been added.`,
    });
    
    // Reset form
    setFormData({
      clientName: "",
      date: format(new Date(), "yyyy-MM-dd"),
      productName: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    });
    setSelectedDate(new Date());
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
      cell: ({ row }) => <div>${row.getValue("unitPrice").toFixed(2)}</div>,
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
      cell: ({ row }) => <div>${row.getValue("totalPrice").toFixed(2)}</div>,
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
        <h1 className="text-3xl font-bold">Sales Orders</h1>
        <p className="text-muted-foreground">
          Manage your client sales orders
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onAdd={() => setOpen(true)}
        searchField="clientName"
        searchPlaceholder="Search by client..."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add New Sales Order</DialogTitle>
              <DialogDescription>
                Enter details for the new sales order.
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
