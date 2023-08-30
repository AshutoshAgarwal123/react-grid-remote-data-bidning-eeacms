export const handleFilter = async (
  args,
  setFilterParam,
  linksData,
  listColumns
) => {
  if (args?.action === 'clearFilter') {
    const removedFilter = args?.currentFilterObject?.field;
    setFilterParam((prev) => ({
      ...prev,
      filters: prev.filters.filter(
        (filter) => filter?.columnName !== removedFilter
      ),
    }));
    return;
  }
  const filters = args.columns?.map((item) => {
    const colType = getFieldDataType(item.properties?.field, listColumns);
    return {
      columnName: item.properties?.field ?? '',
      columnType: colType ?? 'string',
      filterType: item.properties?.operator ?? '',
      value: item.properties?.value ?? '',
    };
  });
  await setFilterParam((prev) => ({
    ...prev,
    filters: filters,
  }));
};
export const handlePillDelete = async (setRequestParam, removedFilter) => {
  await setRequestParam((prevRequestParam) => ({
    ...prevRequestParam,
    filters: prevRequestParam.filters.filter(
      (filter) => filter?.columnName !== removedFilter
    ),
  }));
};

const getFieldDataType = (fieldValue, dataArray) => {
  const matchingField = dataArray.find((item) => item.field === fieldValue);
  return matchingField ? matchingField.type : null;
};

export const handleSorting = async (args, setRequestParam) => {
  if (args.direction === 'Ascending') {
    await setRequestParam((prev) => ({
      ...prev,
      isAscendingOrder: true,
      orderBy: String(args.columnName),
    }));
  } else {
    await setRequestParam((prev) => ({
      ...prev,
      isAscendingOrder: false,
      orderBy: String(args.columnName),
    }));
  }
};
