
import { useState } from "react";
import { useToast } from "./use-toast";
import { useLocalStorage } from "./use-local-storage";

interface UseCrudOptions<T> {
  items: T[];
  itemName: string;
  storageKey: string; // Add storageKey for localStorage
  onSuccess?: (action: 'create' | 'update' | 'delete', item: T) => void;
}

export function useCrud<T extends { id: number }>({ items, itemName, storageKey, onSuccess }: UseCrudOptions<T>) {
  // Use localStorage hook instead of useState
  const [data, setData] = useLocalStorage<T[]>(storageKey, [...items]);
  const [editItem, setEditItem] = useState<T | null>(null);
  const [deleteItem, setDeleteItem] = useState<T | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAdd = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: T) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: T) => {
    setDeleteItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteItem) {
      const newData = data.filter((item) => item.id !== deleteItem.id);
      setData(newData);
      toast({
        title: `${itemName} Deleted`,
        description: `The ${itemName.toLowerCase()} has been successfully deleted.`,
      });
      if (onSuccess) {
        onSuccess('delete', deleteItem);
      }
      setDeleteDialogOpen(false);
      setDeleteItem(null);
    }
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditItem(null);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteItem(null);
  };

  const saveItem = (item: T) => {
    let newData: T[];
    let toastMessage: string;
    let action: 'create' | 'update';

    if (editItem) {
      // Update existing item
      newData = data.map((i) => (i.id === item.id ? item : i));
      toastMessage = `${itemName} Updated`;
      action = 'update';
    } else {
      // Add new item with a new ID
      const newId = data.length > 0 ? Math.max(...data.map((i) => i.id)) + 1 : 1;
      const newItem = { ...item, id: newId };
      newData = [...data, newItem];
      toastMessage = `${itemName} Created`;
      action = 'create';
    }

    setData(newData);
    setFormOpen(false);
    setEditItem(null);
    
    toast({
      title: toastMessage,
      description: `The ${itemName.toLowerCase()} has been successfully ${action === 'create' ? 'created' : 'updated'}.`,
    });

    if (onSuccess) {
      onSuccess(action, item);
    }
  };

  return {
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
  };
}
