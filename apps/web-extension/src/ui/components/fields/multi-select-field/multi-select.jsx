import { MultiCombobox } from "@intuition/notion-ui";
import { useController, useFormContext } from "react-hook-form";

export function MultiSelectField({ id, options }) {
  const { control } = useFormContext();
  const {
    field: { ref, ...fieldController },
  } = useController({
    name: id,
    control,
  });

  const getTagFilterWithSelectedItems = (items, selectedItems, inputValue) => {
    const lowerCasedInputValue = inputValue.toLowerCase();
    return items.filter((tag) => {
      return (
        !selectedItems.includes(tag) &&
        tag.value.toLowerCase().includes(lowerCasedInputValue)
      );
    });
  };

  return (
    <MultiCombobox
      items={options}
      getFilter={getTagFilterWithSelectedItems}
      fieldRef={ref}
      {...fieldController}
    />
  );
}
