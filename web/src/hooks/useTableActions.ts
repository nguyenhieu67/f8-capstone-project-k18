/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export default function useTableActions<T extends { id?: number | string }>(
  fetchDataList: () => void | Promise<void>,
  deleteApi?: (id: number | string) => Promise<void>,
) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [deleteId, setDeleteId] = useState<number | string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // --- Handlers (Create / Edit) ---
  const handleOpenCreate = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (dataList: T[], row: any) => {
    const originalItem = dataList.find((item) => item.id === row.id) || row;
    setSelectedItem(originalItem);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  // --- Handlers  Delete  ---
  const handleOpenDelete = (row: any) => {
    if (row?.id) {
      setDeleteId(row.id);
      setIsDeleteOpen(true);
    }
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    handleCloseDelete();
    handleCloseForm();

    setDeleteLoading(true);
    try {
      await deleteApi?.(deleteId);
      handleCloseDelete();
      await fetchDataList();
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    // Form States & Handlers
    selectedItem,
    isFormOpen,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,

    // Delete States & Handlers
    isDeleteOpen,
    deleteLoading,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
  };
}
