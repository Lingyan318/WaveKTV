import React, { useCallback, useState, useEffect } from "react";
import Toolbar from "devextreme-react/toolbar";
import Drawer from "devextreme-react/drawer";
import Sortable from "devextreme-react/sortable";
import TextBox from 'devextreme-react/text-box';
import DataGrid, {
  Column,
  RowDragging,
  Scrolling,
  Lookup
} from "devextreme-react/data-grid";

import MyScheduler from "./MyScheduler";
import Utils from "./utils";

import {
  data,
  recallInstanceData,
  userData,
  objectData,
  failData,
  occupancyData
} from "./data.js";

const App = () => {
  const draggingGroupName = "appointmentsGroup";

  //const [rightPanelOpened, setRightPanelOpened] = useState(false);
  const [showRecallDefinitions, setShowRecallDefinitions] = useState(true);

  const printObject = (obj) => {
    return;
  };

  const DragOccupancyItem = ({ data }) => {
    let itemStyle = {
      width: 200,
      padding: 10,
      fontWeight: "bold"
    };

    return (
      <OccupancyItem
        text={data.itemData.source.name}
        style={itemStyle}
        color={data.itemData.source.color}
      />
    );
  };

  const OccupancyItem = ({ text, handle, color, style }) => {
    style = style || {};
    style = { ...style, backgroundColor: color };
    let className = "occupancy item dx-card dx-theme-text-color";
    if (handle) {
      className += " item-with-handle";
    }
    return (
      <div className={className} style={style}>
        {handle && <i className="handle dx-icon dx-icon-dragvertical" />}
        {text}
      </div>
    );
  };

  const onFailDragStart = (e) => {
    console.info("onFailDragStart");
    let oi = failData[e.fromIndex];
    e.itemData = {
      sourceType: "FAIL",
      text: oi.name,
      description: "",
      objectId: oi.objectId,
      defaultDuration: 4,
      source: oi
    };
  };

  const onOccupancyDragStart = (e) => {
    console.info("onOccupancyDragStart");
    let oi = occupancyData[e.fromIndex];
    e.itemData = {
      sourceType: "OCCUPANCY",
      text: oi.name,
      description: "",
      objectId: e.id,
      defaultDuration: 4,
      source: oi
    };
  };

  const onOccupancyDragEnd = (e) => {
    console.info("onOccupancyDragEnd");
    e.cancel = true;
    if (e.toData === "tasks") {
      let data = e.toComponent.getTargetCellData();
      let startDate = new Date(data.startDate);
      startDate.setHours(startDate.getHours() < 12 ? 8 : 12);

      e.toComponent.addAppointment({
        sourceType: e.itemData.sourceType,
        objectId: e.itemData.objectId,
        userId: data.groups.userId,
        startDate: startDate.toISOString(),
        defaultDuration: e.itemData.defaultDuration,
        endDate: Utils.addHours(
          startDate,
          e.itemData.defaultDuration
        ).toISOString(),
        text: e.itemData.text,
        description: e.itemData.description,
        source: e.itemData.source
      });
      console.info("onOccupancyDragEnd: Adding appointment");
    }
  };

  const RightPanel = () => (
    <div className={"right-panel"}>
      <DataGrid
        dataSource={failData}
        height={600}
        showBorders={true}
        focusedRowEnabled={true}
        keyExpr={"id"}
        columnResizingMode={"nextColumn"}
        columnAutoWidth={true}
        allowColumnResizing={true}
      >
        <RowDragging
          data={1}
          group={draggingGroupName}
          onDragStart={onFailDragStart}
        />
        <Scrolling mode="virtual" />
        <Column dataField="id" dataType="number" />
        <Column dataField="text" dataType="string"></Column>
        <Column dataField="objectName" dataType="string" visible={true} />
      </DataGrid>
      <Sortable
        id="list"
        group={draggingGroupName}
        dropFeedbackMode={"push"}
        itemOrientation={"vertical"}
        dragDirection={"both"}
        scrollSpeed={30}
        scrollSensitivity={60}
        handle={".handle"}
        dragComponent={DragOccupancyItem}
        cursorOffset1={"cursorOffset"}
        onDragStart={onOccupancyDragStart}
        onDragEnd={onOccupancyDragEnd}
      >
        {occupancyData.map((item) => (
          <OccupancyItem
            key={item.id}
            text={item.name}
            handle={".handle"}
            color={item.color}
          />
        ))}
      </Sortable>
    </div>
  );

  const toolbarItems = [


  ];

  useEffect(() => {
    document.body.className += "Wave KTV";
  }, []);
  return (
   <div>
     {/*<TextBox mask="+1 (000) 000-0000"*/}
     {/*         maskRules={this.rules} />*/}
      <Toolbar items={toolbarItems} />
      <Drawer
        openedStateMode={"shrink"}
        position={"right"}
        revealMode={"expand"}
        component={RightPanel}
        height={"100%"}
      >
        <MyScheduler
          taskDataInit={data}
          userData={userData}
          objectData={objectData}
          recallInstanceData={recallInstanceData}
          draggingGroupName={draggingGroupName}
          showRecallDefinitions={showRecallDefinitions}
        ></MyScheduler>
      </Drawer>
</div>
  );
};

export default App;
