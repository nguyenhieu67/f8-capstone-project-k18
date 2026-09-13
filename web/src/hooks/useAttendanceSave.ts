/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";

interface UseAttendanceSaveProps<T> {
  items: T[];
  getItemId: (item: T) => number;
  buildRecord: (item: T) => any;
  saveFn: (records: any[]) => Promise<unknown>;
  toastMsg: {
    success: (msg: string) => void;
    warning: (msg: string) => void;
    error: (msg: string) => void;
  };
  onSuccess: () => void;
}

export default function useAttendanceSave<T>({
  items,
  getItemId,
  buildRecord,
  saveFn,
  toastMsg,
  onSuccess,
}: UseAttendanceSaveProps<T>) {
  const [dirtyIds, setDirtyIds] = useState<Set<number>>(new Set());
  const [hasExistingRecords, setHasExistingRecords] = useState<boolean>(false);

  // Hàm đánh dấu 1 item bị thay đổi
  const markDirty = useCallback((id: number) => {
    setDirtyIds((prev) => new Set(prev).add(id));
  }, []);

  // Hàm thực hiện lưu điểm danh
  const handleSave = useCallback(async () => {
    if (!items || items.length === 0) return;

    if (hasExistingRecords && dirtyIds.size === 0) {
      toastMsg.warning(
        "Dữ liệu điểm danh ngày này đã tồn tại và chưa có thay đổi nào!",
      );
      return;
    }

    try {
      // 1. Tạo mới toàn bộ
      if (!hasExistingRecords) {
        const recordsToCreate = items.map((item) => buildRecord(item));
        await saveFn(recordsToCreate);
        toastMsg.success("Đã lưu điểm danh");
        setHasExistingRecords(true);
        setDirtyIds(new Set());
        return;
      }

      // 2. Chỉ cập nhật những mục bị thay đổi (dirty)
      const dirtyItems = items.filter((item) => dirtyIds.has(getItemId(item)));
      const recordsToUpdate = dirtyItems.map((item) => buildRecord(item));

      await saveFn(recordsToUpdate);
      toastMsg.success("Đã thay đổi dữ liệu điểm danh");
      setDirtyIds(new Set());
      onSuccess();
    } catch (error) {
      console.error("Failed to save attendance:", error);
      toastMsg.error((error as Error).message);
    }
  }, [
    items,
    dirtyIds,
    hasExistingRecords,
    getItemId,
    buildRecord,
    saveFn,
    onSuccess,
    toastMsg,
  ]);

  return {
    dirtyIds,
    setDirtyIds,
    hasExistingRecords,
    setHasExistingRecords,
    markDirty,
    handleSave,
  };
}
