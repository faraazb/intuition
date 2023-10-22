import { Combobox } from "@intuition/notion-ui";
import { useController, useFormContext } from "react-hook-form";

export function SelectField({ id, options }) {
  const { control } = useFormContext();
  const {
    field: { ref, ...fieldControls },
  } = useController({
    name: id,
    control,
  });

  const getTagFilter = (inputValue) => {
    return (tag) => tag.value.toLowerCase().includes(inputValue.toLowerCase());
  };

  return (
    <Combobox items={options} getFilter={getTagFilter} fieldRef={ref} {...fieldControls} />
  );
}
