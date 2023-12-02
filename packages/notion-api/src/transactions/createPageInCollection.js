import { v4 } from "uuid";

export function createPageInCollection({
  userId,
  spaceId,
  collectionId,
  page,
}) {
  const pointerId = v4();
  const { properties: propertiesWithType, time } = page;

  const properties = {};
  Object.entries(propertiesWithType).forEach(([property, { type, value }]) => {
    let val = value;
    if (type === "checkbox") {
      val = value ? ["Yes"] : ["No"];
    } 
    else if (type === "date") {
      // ‣ this is a right triangle, don't know why it's required
      val = ["‣", [["d", { start_date: value, type: "date" }]]];
    } 
    else if (type === "multi_select") {
      val = [value.join()];
    } 
    else if (type === "title") {
      val = [value, [["b"]]]
    } 
    else if (type === "url") {
      val = [value, [["a", value]]]
    } 
    else {
      val = [value];
    }
    properties[property] = [val];
  });

  const transaction = {
    id: v4(),
    operations: [
      {
        command: "set",
        path: [],
        args: {
          id: pointerId,
          space_id: spaceId,
          type: "page",
          version: 1,
          // contents: [],
          // is_template: false,
          // isBookmarked: false,
        },
        pointer: {
          id: pointerId,
          spaceId,
          table: "block",
        },
      },
      {
        command: "update",
        path: [],
        args: {
          created_by_id: userId,
          last_edited_by_id: userId,
          created_by_table: "notion_user",
          last_edited_by_table: "notion_user",
          created_time: time,
          last_edited_time: time,
          properties,
          // contents: [],
          // is_template: false,
          // isBookmarked: false,
        },
        pointer: {
          id: pointerId,
          spaceId,
          table: "block",
        },
      },
      {
        command: "setParent",
        path: [],
        pointer: {
          id: pointerId,
          spaceId,
          table: "block",
        },
        args: {
          parentId: collectionId,
          parentTable: "collection",
        },
        additionalUpdatedPointer: [
          {
            id: pointerId,
            spaceId,
            table: "block",
          }
        ],
      },
    ],
    spaceId,
  };

  return transaction;
}
