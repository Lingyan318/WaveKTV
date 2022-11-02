import { DateTime } from "luxon";

const objectColors = [
  "#d3d3d3",
  "#2f4f4f",
  "#808000",
  "#b22222",
  "#3cb371",
  "#8b008b",
  "#ff0000",
  "#ff8c00",
  "#ffd700",
  "#00ff7f",
  "#4169e1",
  "#e9967a",
  "#00ffff",
  "#00bfff",
  "#0000ff",
  "#adff2f",
  "#ff00ff",
  "#f0e68c",
  "#dda0dd",
  "#ff1493"
];

export const userData = (() => {
  let ud = [];
  for (let i = 1; i <= 1; i++) {
    ud.push({
      text: `Shiyi`,
      id: i
    });
  }
  return ud;
})();

export const objectData = (() => {
  let ud = [];
  for (let i = 1; i <= 3; i++) {
    ud.push({
      text: `80${i}`,
      id: i,
      color: objectColors[i - 1]
    });
  }
  for (let i = 5; i <= 9; i++) {
    ud.push({
      text: `80${i}`,
      id: i,
      color: objectColors[i - 1]
    });
  }
  ud.push({
    text: 810,
    id: 10,
    color: objectColors[10 - 1]
  });
  for (let i = 11; i <= 13; i++) {
    ud.push({
      text: `8${i}`,
      id: i,
      color: objectColors[i - 1]
    });
  }
  for (let i = 15; i <= 18; i++) {
    ud.push({
      text: `8${i}`,
      id: i,
      color: objectColors[i - 1]
    });
  }

  return ud;
})();

export const failData = (() => {
  let ud = [];
  for (let i = 1; i <= 20; i++) {
    let obj = objectData[Math.floor(Math.random() * (objectData.length - 1))];
    ud.push({
      text: `Equipment ${i}`,
      id: i,
      objectId: obj.id,
      objectName: obj.text,
      reported: randomDate(new DateTime(2022, 1, 1), DateTime.now(), 8, 16)
    });
  }
  return ud;
})();

export const recallInstanceData = (() => {
  let ud = [];
  for (let i = 1; i <= 20; i++) {
    let obj = objectData[Math.floor(Math.random() * (objectData.length - 1))];
    let startDate = randomDate(
      new Date(2022, 7, 1),
      new Date(2022, 9, 1),
      8,
      8
    );
    ud.push({
      text: `Recall ${i}`,
      id: i,
      resourceId: `OBJ${obj.id}`,
      objectId: obj.id,
      objectName: obj.text,
      startDate: new Date(startDate),
      endDate: new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        12,
        0,
        0
      )
    });
  }
  return ud;
})();

export const data = [
  {
    text: "Vacancy",
    id: -1,
    userId: 2,
    resourceId: `USR${2}`,
    startDate: new Date("2022-08-12T08:00:00.000Z"),
    endDate: new Date("2022-08-18T16:00:00.000Z")
  },
  ...recallInstanceData
];

export const occupancyData = [
  { id: 1, name: "Vacation", color: "#9ADCFF" },
  { id: 2, name: "Holiday", color: "#FFF89A" },
  { id: 3, name: "Absence", color: "#FF8AAE" }
];

function randomDate(start, end, startHour, endHour) {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = (startHour + Math.random() * (endHour - startHour)) | 0;
  date.setHours(hour);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}
