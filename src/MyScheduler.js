import React, { useState, useCallback, useEffect } from "react";
import Scheduler, {
  Resource,
  AppointmentDragging
} from "devextreme-react/scheduler";
import Utils from "./utils";
import Appointment from "./Appointment.js";

const views = [
  { viewId: "timelineDay", type: "timelineDay" },
  {
    viewId: "timelineWeek",
    type: "timelineWeek",
    name: "2 Weeks",
    intervalCount: 100,
    maxAppointmentsPerCell: "unlimited"
  },
  {
    viewId: "timelineWorkWeek",
    type: "timelineWorkWeek"
  },
  { viewId: "timelineMonth", type: "timelineMonth" }
];
const groupsRecall = ["objectId"];
const groupsTasks = ["userId"];

const MyScheduler = ({
  taskDataInit,
  userData,
  objectData,
  recallInstanceData,
  showRecallDefinitions,
  draggingGroupName
}) => {
  const [currentView, setCurrentView] = useState("timelineDay");

  const recallEditing = {
    allowDragging: true,
    allowUpdating: true,
    allowDeleting: false
  };

  const [taskData, setTaskData] = useState(taskDataInit);
  const [taskSchedulerClassName, setTaskSchedulerClassName] = useState();
  const [currentDate, setCurrentDate] = useState(new Date());

  const [liveRecallData, setLiveRecallData] = useState(
    JSON.parse(JSON.stringify(recallInstanceData))
  );

  const onOptionChanged = useCallback(
    (e) => {
      console.info(`Option: '${e.name}':'${e.value}'`);
      if (e.name === "currentView") {
        setCurrentView(e.value === "2 Weeks" ? "timelineWeek" : e.value);
        console.log(onOptionChanged);
      } else if (e.name === "currentDate") {
        setCurrentDate(e.value);
      }
    },
    [setCurrentView]
  );

  const DataCellUser = useCallback((props) => {
    // const { startDate } = props.itemData;
    let cssClasses = props.className ? props.className : "";

    cssClasses += " cell-background-user";
    cssClasses += " cell-background";

    if (props.startDate.getHours() === 8) {
      cssClasses += " left-border-cell";
    }
    if (props.startDate.getHours() === 12) {
      cssClasses += " left-border-cell";
    }
    if (props.startDate.getHours() === 15) {
      cssClasses += " right-border-cell";
    }

    return (
      <div className={cssClasses}>
        {/*<div>A Text</div>*/}
        {props.children}
      </div>
    );
  }, []);

  const DataCellObject = useCallback((props) => {
    // const { startDate } = props.itemData;
    let cssClasses = props.className ? props.className : "";
    cssClasses += " cell-background-object";
    cssClasses += " cell-background";

    if (props.startDate.getHours() === 8) {
      cssClasses += " left-border-cell";
    }
    if (props.startDate.getHours() === 12) {
      cssClasses += " left-border-cell";
    }
    if (props.startDate.getHours() === 15) {
      cssClasses += " right-border-cell";
    }

    return <div className={cssClasses}>{props.children}</div>;
  }, []);

  const onTaskItemRemove = useCallback((e) => {
    console.info("onAppointmentRemove1");
  }, []);

  const onTaskItemAdd = useCallback(
    (e) => {
      console.info(`onAppointmentAdd: ${e.itemData.sourceType}`);
      printObject(e.itemData);
      let newAppointment = {
        source: e.itemData
      };

      //let data = e.toComponent.getTargetCellData();
      let startDate = new Date(e.itemData.startDate);
      startDate.setHours(startDate.getHours() < 12 ? 8 : 12);

      newAppointment = {
        ...newAppointment,
        sourceType: e.itemData.sourceType,
        text: e.itemData.text,
        startDate: startDate,
        endDate: Utils.addHours(startDate, e.itemData.defaultDuration),
        userId: e.itemData.userId,
        objectId: e.itemData.objectId
      };
      let newTasks = [newAppointment, ...taskData];
      setTaskData(newTasks);
      //resourceId: e.itemData.recurrenceData.resourceId,
      /*            "From Recall Id:" +
            e.itemData.recurrenceData.id +
            " on " +
            e.event.data.itemSettings.info.appointment.startDate.toString(),
          source: {
            startDate: e.event.data.itemSettings.info.appointment.startDate,
            endDate: e.event.data.itemSettings.info.appointment.endDate,
            recurrenceData: e.itemData.recurrenceData
          }
          */

      // setLiveRecallData(JSON.parse(JSON.stringify(recallData)));
    },
    [taskData, setTaskData]
  );

  const onRecallItemRemove = useCallback((e) => {
    console.info("onRecallItemRemove");
    printObject(e);
    //e.cancel = true;
    //e.cancel = true;
  }, []);

  const isValidAppointment = (component, appointmentData) => {
    const startDate = new Date(appointmentData.startDate);
    const endDate = new Date(appointmentData.endDate);
    const cellDuration = component.option("cellDuration");
    console.info(`isValidAppointment ${startDate}`);
    return startDate.getHours() === 8 || startDate.getHours() === 12;
  };

  const onRecallAppointmentUpdating = (e) => {
    console.info("onRecallAppointmentUpdating");
    const r = isValidAppointment(e.component, e.newData);
    if (!r) {
      e.cancel = true;
      //notifyDisableDate();
    }
  };

  const onTaskAppointmentUpdating = (e) => {
    console.info(
      `onTaskAppointmentUpdating: ${e.newData.sourceType}, ${e.newData.endDate}`
    );
    const r = isValidAppointment(e.component, e.newData);
    if (
      e.newData.sourceType === "RECALL" ||
      e.newData.sourceType === "FAIL" ||
      e.newData.sourceType === "OCCUPANCY"
    ) {
      if (!r) {
        e.cancel = true;
        //notifyDisableDate();
      } else {
        let startDate = new Date(e.newData.startDate);
        let endDate = new Date(e.newData.endDate);
        let hours = endDate.getHours();
        endDate.setHours(hours <= 8 ? 8 : hours <= 12 ? 12 : 16);
        console.info(
          `onTaskAppointmentUpdating hours : ${hours}->${endDate.getHours()}`
        );
        if (endDate <= startDate) {
          endDate = Utils.addHours(startDate, e.newData.defaultDuration);
        }
        e.newData.endDate = endDate.toISOString();
        console.info(`onTaskAppointmentUpdating: ${e.newData.endDate}`);
        /*   if (oldDate !== e.newData.endDate) {
          e.cancel = true;
          let oldApp = { ...e.oldData };
          let newApp = {
            ...e.oldData,
            ...e.newData
          };
          console.info(
            `onTaskAppointmentUpdating: ${JSON.stringify(
              oldApp
            )},  ${JSON.stringify(newApp)}`
          );

          setTimeout(() => {
            e.component.updateAppointment(oldApp, newApp);
          }, 1);
        }*/
      }
    }
  };

  const onTaskItemDragStart = useCallback((e) => {
    console.info("onItemDragStart1");
    //e.itemData = e.fromData;
  }, []);

  const onTaskItemDragMove = useCallback((e) => {
    //console.info("onDragMove1");
  }, []);

  const onRecallItemDragMove = useCallback((e) => {
    //console.info("onDragMove1");
  }, []);

  const onTaskItemDragEnd = useCallback((e) => {
    // console.info("onItemDragEnd1");
    // if (e.toData) {
    //   console.info("onItemDragEnd1: cancel");
    //   e.cancel = true;
    // }
  }, []);

  const onRecallItemDragStart = useCallback((e) => {
    console.info("onRecallItemDragStart");
    e.itemData = {
      sourceType: "RECALL",
      text: e.itemData.text,
      startDate: new Date(e.itemData.startDate),
      endDate: new Date(e.itemData.endDate),
      description: e.itemData.description,
      objectId: e.itemData.objectId,
      defaultDuration: 4,
      source: e.itemData
    };
  }, []);

  const onRecallItemDragEnd = useCallback((e) => {
    console.info("onRecallItemDragEnd");
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
        endDate: Utils.addHours(
          startDate,
          e.itemData.defaultDuration
        ).toISOString(),
        text: e.itemData.text,
        description: e.itemData.description,
        source: e.itemData.source
      });
      console.info("onRecallItemDragEnd: Adding appointment");
    }
  }, []);

  useEffect(() => {
    setTaskSchedulerClassName(showRecallDefinitions ? "hide-header" : "");
  }, [showRecallDefinitions]);
  console.info("RELOAD");
  return (
    <div>
      <Scheduler
        key="recallScheduler"
        timeZone="en-US"
        visible={showRecallDefinitions}
        dataSource={recallInstanceData}
        views={views}
        onOptionChanged={onOptionChanged}
        defaultCurrentView={currentView}
        currentView={currentView}
        /*defaultCurrentDate={currentDate}*/
        height={"100%"}
        cellDuration={60}
        firstDayOfWeek={1}
        startDayHour={12}
        endDayHour={29}
        groups={groupsRecall}
        editing={true}
        dataCellRender={DataCellObject}
        onAppointmentUpdating={onRecallAppointmentUpdating}
        currentDate={currentDate}
        /* appointmentComponent={Appointment}*/
      >
        <Resource
          fieldExpr="objectId"
          allowMultiple={false}
          dataSource={objectData}
          label="Object"
          useColorAsDefault={true}
        />
        <Resource
            fieldExpr="userId"
            allowMultiple={false}
            dataSource={userData}
            label="User"
        />
        <AppointmentDragging
          group={draggingGroupName}
          data="objects"
          onRemove={onRecallItemRemove}
          onDragStart={onRecallItemDragStart}
          onDragEnd={onRecallItemDragEnd}
          onDragMove={onRecallItemDragMove}
        />
      </Scheduler>

    </div>
  );
};

export default MyScheduler;

const printObject = (obj) => {
  return;
  /*
  let cache = [];
  console.debug(
    JSON.parse(
      JSON.stringify(obj, (key, value) => {
        if (typeof value === "object" && value !== null) {
          // Duplicate reference found, discard key
          if (cache.includes(value)) return;

          // Store value in our collection
          cache.push(value);
        }
        return value;
      })
    )
  );
  */
};
