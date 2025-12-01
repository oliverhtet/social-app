export const getPagination = (page: number, limit: number, total: number) => {
  const currentPage = page || 1;
  const itemsPerPage = limit || 10;
  const totalPages = Math.ceil(total / itemsPerPage);
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  return {
    currentPage,
    itemsPerPage,
    totalItems: total,
    totalPages,
    hasNext,
    hasPrev,
    nextPage: hasNext ? currentPage + 1 : null,
    prevPage: hasPrev ? currentPage - 1 : null
  };
};
