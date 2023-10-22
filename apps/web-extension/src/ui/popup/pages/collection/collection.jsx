import { useEffect, useState, createElement } from "react";
import "./collection.scss";
import { Spinner } from "@intuition/notion-ui";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreatePageInCollectionMutation,
  useGetCollectionQuery,
  useGetSpaceQuery,
  useGetUserQuery,
} from "../../store/api/notion";
import { SelectField } from "~/ui/components/fields/select-field";
import { MultiSelectField } from "~/ui/components/fields/multi-select-field";
import { FormProvider, useForm } from "react-hook-form";
import { CollectionField } from "~/ui/components/collection-field/collection-field";

// let NUMBER_PATTERN = /[^0-9.]/g;

const browser = chrome;

export const Collection = () => {
  const { id } = useParams();
  const [tab, setTab] = useState();
  const { data: user } = useGetUserQuery();
  const { data: space, isSuccess: isSpaceSuccess } = useGetSpaceQuery();
  const { data: collection, isSuccess: isCollectionSuccess } =
    useGetCollectionQuery(
      {
        id,
        spaceId: space.id,
      },
      { skip: !isSpaceSuccess }
    );

  const [createPageInCollection, result] = useCreatePageInCollectionMutation();
  const [message, setMessage] = useState();
  const navigate = useNavigate();
  const methods = useForm();

  const handleTempClick = () => {
    console.log(methods.getValues());
  };

  useEffect(() => {
    (async () => {
      // get active tab url and title
      const activeTab = (
        await browser.tabs.query({
          active: true,
          currentWindow: true,
        })
      )[0];
      setTab({ url: activeTab.url, title: activeTab.title });
    })();
  }, [id]);

  // normalize collection schema ids since they contain special characters
  // such as [, @, etc. which are not allowed in react-hook-form field paths
  const normalizedIds = {};
  const normalizedIdsMirror = {};
  if (isCollectionSuccess) {
    collection.schemaOrder.forEach((id, index) => {
      const normalizedId = `field-${index}`;
      normalizedIds[id] = normalizedId;
      normalizedIdsMirror[normalizedId] = id;
    });
  }

  useEffect(() => {
    if (isCollectionSuccess && tab) {
      methods.setValue(normalizedIds["title"], tab.title);
      for (const id of collection.schemaOrder) {
        const { type } = collection.schema[id];
        if (type === "url") {
          methods.setValue(normalizedIds[id], tab.url);
          return;
        }
      }
    }
  }, [isCollectionSuccess, tab]);

  const createRow = (data) => {
    let row = {};
    Object.entries(data).forEach(([id, value]) => {
      // TODO check empty, NaN, etc. rn unchecked checkbox will never make it
      if (value) {
        const type = collection.schema[normalizedIdsMirror[id]].type;
        const isSelectLike =
          type === "select" || type === "multi_select" || type === "status";
        row[normalizedIdsMirror[id]] = {
          type,
          value: isSelectLike ? value.value : value,
        };
      }
    });
    console.log(row);
    return row;
  };

  const addToNotion = async (data) => {
    const row = createRow(data);

    try {
      setMessage({
        text: (
          <>
            <Spinner alt="Saving" />
            <span>Saving to Notion...</span>
          </>
        ),
        intent: "info",
      });
      await createPageInCollection({
        userId: user.id,
        spaceId: space.id,
        collectionId: id,
        properties: row,
      });
      // navigate("/saved");
    } catch (error) {
      console.error(error);
      setMessage({ text: "Failed to add to Notion!", intent: "danger" });
    }
  };

  console.log("Collections rendered", collection);

  return (
    <FormProvider {...methods}>
      {isCollectionSuccess && Object.keys(normalizedIds).length ? (
        <form onSubmit={methods.handleSubmit(createRow)}>
          <div className="collection">
            <div className="header">
              <div className="title">
                <div className="header-2">{collection.name[0]}</div>
                <button className="action-button" onClick={() => navigate(-1)}>
                  Back
                </button>
              </div>
              <hr className="title-divider-content" />
            </div>
            <div className="fields">
              {collection.schemaOrder.map((id) => {
                const { name, type, options } = collection.schema[id];
                if (
                  type === "select" ||
                  type === "multi_select" ||
                  type === "status"
                ) {
                  const field =
                    type === "multi_select" ? MultiSelectField : SelectField;
                  return (
                    <CollectionField
                      key={id}
                      id={id}
                      name={name}
                      type={type}
                      tab={tab}
                      renderInput={() =>
                        createElement(field, { id: normalizedIds[id], options })
                      }
                    />
                  );
                } else if (
                  [
                    "title",
                    "text",
                    "url",
                    "number",
                    "email",
                    "phone_number",
                    "date",
                    "checkbox",
                  ].includes(type)
                ) {
                  let inputType = type;
                  if (type === "phone_number") {
                    inputType = "tel";
                  } else if (type === "title") {
                    inputType = "text";
                  }
                  return (
                    <CollectionField
                      key={id}
                      id={id}
                      name={name}
                      type={type}
                      tab={tab}
                      renderInput={() => (
                        <div className={`search-input input--${type}`}>
                          <input
                            {...methods.register(normalizedIds[id], {
                              valueAsNumber: type === "number",
                              valueAsDate: type === "date",
                            })}
                            type={inputType}
                            placeholder={name}
                          />
                        </div>
                      )}
                    />
                  );
                }
              })}
            </div>
            <div className="save">
              {message && (
                <div className={`message ${message.intent}`}>
                  {message.text}
                </div>
              )}
              <button className="button" type="submit">
                Save
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="collection collection--loading">
          <Spinner />
        </div>
      )}
    </FormProvider>
  );
};
