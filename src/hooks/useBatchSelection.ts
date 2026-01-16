'use client';

import { useState, useCallback } from 'react';

export function useBatchSelection<T extends { id: string | number }>(items: T[]) {
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  const toggle = useCallback((id: string | number) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map(item => item.id)));
    }
  }, [items, selected.size]);

  const clear = useCallback(() => {
    setSelected(new Set());
  }, []);

  const getSelected = useCallback(() => {
    return items.filter(item => selected.has(item.id));
  }, [items, selected]);

  return {
    selected,
    toggle,
    toggleAll,
    clear,
    getSelected,
    count: selected.size,
    isAllSelected: selected.size === items.length && items.length > 0,
  };
}
