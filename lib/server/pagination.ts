export function getCursorPage<T extends { id: string }>(items: T[], limit: number) {
  if (limit <= 0) {
    return { items: [], nextCursor: null } as const;
  }

  if (items.length <= limit) {
    return { items, nextCursor: null } as const;
  }

  return {
    items: items.slice(0, limit),
    nextCursor: items[limit - 1]?.id ?? null,
  } as const;
}
