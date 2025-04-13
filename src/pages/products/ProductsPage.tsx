import { useEffect } from "react";
import { useCrud } from "@/hooks/use-crud";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
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
import { Product } from "@/types";
import { mockProducts } from "@/services/mockData";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Link2, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function ProductsPage() {
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
  } = useCrud<Product>({
    items: mockProducts,
    itemName: "Product",
    storageKey: "erp-products",
  });

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    material: "",
    thickness: 0,
    length: 0,
    width: 0,
    links: "",
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        material: editItem.material,
        thickness: editItem.thickness,
        length: editItem.length,
        width: editItem.width,
        links: editItem.links,
      });
    } else {
      setFormData({
        name: "",
        material: "",
        thickness: 0,
        length: 0,
        width: 0,
        links: "",
      });
    }
  }, [editItem]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "thickness" || name === "length" || name === "width"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: Product = {
      id: editItem?.id || 0,
      name: formData.name || "",
      material: formData.material || "",
      thickness: formData.thickness || 0,
      length: formData.length || 0,
      width: formData.width || 0,
      links: formData.links || "",
    };
    
    saveItem(productData);
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setViewOpen(true);
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "material",
      header: "Material",
      cell: ({ row }) => <div>{row.getValue("material")}</div>,
    },
    {
      accessorKey: "thickness",
      header: "Thickness (mm)",
      cell: ({ row }) => <div>{row.getValue("thickness")}</div>,
    },
    {
      accessorKey: "length",
      header: "Length (mm)",
      cell: ({ row }) => <div>{row.getValue("length")}</div>,
    },
    {
      accessorKey: "width",
      header: "Width (mm)",
      cell: ({ row }) => <div>{row.getValue("width")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleView(product)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(product)}>
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
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground">
          Manage your product catalog
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchField="name"
        searchPlaceholder="Search products..."
      />

      <Dialog open={formOpen} onOpenChange={closeForm}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editItem ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                Enter details for the {editItem ? "product" : "new product"}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="material" className="text-right">
                  Material
                </Label>
                <Input
                  id="material"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="thickness" className="text-right">
                  Thickness (mm)
                </Label>
                <Input
                  id="thickness"
                  name="thickness"
                  type="number"
                  step="0.1"
                  value={formData.thickness}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="length" className="text-right">
                  Length (mm)
                </Label>
                <Input
                  id="length"
                  name="length"
                  type="number"
                  step="0.1"
                  value={formData.length}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="width" className="text-right">
                  Width (mm)
                </Label>
                <Input
                  id="width"
                  name="width"
                  type="number"
                  step="0.1"
                  value={formData.width}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="links" className="text-right">
                  Links
                </Label>
                <Textarea
                  id="links"
                  name="links"
                  value={formData.links}
                  onChange={handleChange}
                  placeholder="Enter comma-separated URLs"
                  className="col-span-3"
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
              This action cannot be undone. This will permanently delete the product
              {deleteItem && <strong> "{deleteItem.name}"</strong>} and remove it from the system.
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

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-muted-foreground">Name</h3>
                  <p>{selectedProduct.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Material</h3>
                  <p>{selectedProduct.material}</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Thickness</h3>
                  <p>{selectedProduct.thickness} mm</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Length</h3>
                  <p>{selectedProduct.length} mm</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Width</h3>
                  <p>{selectedProduct.width} mm</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-muted-foreground">External Links</h3>
                {selectedProduct.links ? (
                  <div className="mt-2 space-y-2">
                    {selectedProduct.links.split(",").map((link, index) => (
                      <a
                        key={index}
                        href={link.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-steel-500 hover:text-steel-700"
                      >
                        <Link2 className="mr-1 h-4 w-4" />
                        {link.trim()}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p>No external links available</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
