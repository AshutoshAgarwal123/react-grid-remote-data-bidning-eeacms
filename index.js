import './index.css';
import { createRoot } from 'react-dom/client';
import * as React from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Page,
  Filter,
  Sort, ColumnMenu,Resize
} from '@syncfusion/ej2-react-grids';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import {useState, useEffect,useRef} from "react"
import { handlePillDelete, handleFilter, handleSorting, handlePaging } from "./actions"
import {gridColumns} from "./columns"
function Grid() {
  // let data = new DataManager({
  //   url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Orders',
  //   adaptor: new ODataV4Adaptor(),
  // });
  const gridIns = useRef(null)
  const handleGridRef = (ref) => {
    gridIns.current = ref
  }
  const [requestParam, setRequestParam] = useState({
    pageNumber: 1,
    pageSize: 8,
    isAscendingOrder: false,
    orderBy: "",
    filters: [] ,
  });
  const [gridData, setGridData] = useState();
useEffect(() => {
  getData();
}, [requestParam]);
  async function getData() {
    const data = await fetch(
      "https://frameworkapidev.aurigo.net/api/PageBuilder/GetPageListWithFiltersAndPaginationAsync" +
        "?pageNumber=" +
        requestParam.pageNumber +
        "&pageSize=" +
        requestParam.pageSize +
        "&isAscendingOrder=" +
        requestParam.isAscendingOrder +
        "&orderby=" +
        requestParam.orderBy +
        "&filters=" +
        JSON.stringify(requestParam?.filters ?? [])
    );
    const json = await data.json();
    //  console.log(json);
    //  setGridData({ result: json.pageListData, count: json.count });

    if (!json || !json?.pageListData) return;
    try {
      const pages = json?.pageListData.map((item) => {
        return {
          OrderID: item?.pageName,
          CustomerID: item.aur_createdOn ? new Date(item.aur_createdOn) : "",
          IsWorkflowAssociated: item?.associatedProcess,
          Aur_ModifiedBy: item?.modifiedBy || "John Doe",
        };
      });
      if(gridData?.result==pages){
        console.log("equal");
      }
      setGridData({result:pages,count:json.count});
      
      console.log("setdata complete");
    } catch (error) {
      // showToastr({title : "Error!", content: "Something went wrong, please try again", state : "error"})
    }
  }   
   const actionHandler = ( args) => {
     if (args?.requestType?.toLowerCase() === "filterbeforeopen") {
       args.cancel = true;
     }
    if (args?.requestType === "filtering") {
      handleFilter(args, setRequestParam, gridIns?.current?.dataSource,gridColumns);
      console.log("filter complete");
    }
     if (args?.requestType === "sorting") {
       handleSorting(args, setRequestParam);
     }
     if (args.requestType === "paging") {
       handlePaging(args, setRequestParam);
     }
   };
  
  return (
    <GridComponent
      dataSource={gridData}
      allowPaging={true}
      allowFiltering={true}
      pageSettings={{ pageCount: 5 }}
      filterSettings={{ type: 'Menu' }}
      allowSorting={true}
      showColumnMenu={true} 
      allowResizing={true}
      actionBegin={actionHandler}
      ref={handleGridRef}
    >
      <ColumnsDirective>
      {gridColumns.map((column) => (
            <ColumnDirective
              disableHtmlEncode={false}
              key={column.field}
              field={column.field}
              displayAsCheckBox={column.dataType === "boolean"}
              headerText={column.columnName}
              visible={column.autoVisible}
              minWidth={column.minWidth}
              maxWidth={column.maxWidth}
              textAlign={column.textAlign}
              width={column.width}
              template={column.template}
              type={column?.type}
              editType={column?.editType}
              edit={column?.edit}
              format={column?.format}
              editTemplate={column?.editTemplate}
              headerTemplate={column?.headerTemplate}
              allowEditing={column?.allowEditing}
              allowFiltering={column?.allowFiltering??true}
              allowSorting={column?.allowSorting??true}
            />
          ))}       
      </ColumnsDirective>
      <Inject services={[Page, Filter,Sort, ColumnMenu,Resize]} />
    </GridComponent>
  );
}
export default Grid;

const root = createRoot(document.getElementById('sample'));
root.render(<Grid />);
