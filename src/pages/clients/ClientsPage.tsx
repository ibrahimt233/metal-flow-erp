
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCrud } from "@/hooks/use-crud";
import { mockClients } from "@/services/mockData";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClientDialog } from "./components/ClientDialog";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const ClientsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const {
    data: clients,
    formOpen,
    deleteDialogOpen,
    editItem,
    deleteItem,
    handleAdd,
    handleEdit,
    handleDelete,
    confirmDelete,
    closeForm,
    closeDeleteDialog,
    saveItem,
  } = useCrud<Client>({
    items: mockClients,
    itemName: "Client",
    storageKey: "mkmsolutions-clients",
  });

  // Filter clients based on search query
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Management</CardTitle>
          <CardDescription>
            Manage your clients and their information.
          </CardDescription>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No clients found. Add a new client to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.company}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>
                      <Badge variant={client.active ? "success" : "secondary"}>
                        {client.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(client)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(client)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ClientDialog
        open={formOpen}
        onOpenChange={closeForm}
        client={editItem}
        onSave={saveItem}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={closeDeleteDialog}
        title="Delete Client"
        description={`Are you sure you want to delete ${deleteItem?.name}? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ClientsPage;
