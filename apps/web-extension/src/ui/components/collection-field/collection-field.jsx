import { useFormContext } from "react-hook-form";
import {
  CheckboxIcon,
  DateIcon,
  EmailIcon,
  MultiSelectIcon,
  NumberIcon,
  PhoneIcon,
  SelectIcon,
  StatusIcon,
  TextIcon,
  TitleIcon,
  UrlIcon,
} from "@intuition/notion-ui";
import { FieldLabel } from "../field-label";

const labelIcons = {
  title: TitleIcon,
  text: TextIcon,
  url: UrlIcon,
  email: EmailIcon,
  phone_number: PhoneIcon,
  number: NumberIcon,
  date: DateIcon,
  checkbox: CheckboxIcon,
  status: StatusIcon,
  select: SelectIcon,
  multi_select: MultiSelectIcon,
};

export function CollectionField({ id, name, type, renderInput, tab }) {
  const { setValue } = useFormContext();

  // for title, text and url fields, allow setting the field value to the tab's
  // title and url by clicking on the label icon
  let labelIconProps = {};
  if (type === "url") {
    labelIconProps = {
      onClick: () => {
        setValue(id, tab?.url);
      },
    };
  }
  else if (type === "text" || type === "title") {
    labelIconProps = {
      onClick: () => {
        setValue(id, tab?.title);
      },
    };
  }

  return (
    <div className={type === "checkbox" ? "field-row" : "field"} key={id}>
      <FieldLabel
        htmlFor={id}
        label={name}
        icon={labelIcons[type]}
        iconProps={labelIconProps}
      />
      {renderInput()}
    </div>
  );
}
