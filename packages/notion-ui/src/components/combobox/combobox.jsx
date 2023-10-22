import { useSelect, useCombobox, useMultipleSelection } from "downshift";
import "./combobox.scss";
import { CheckIcon, ChevronDownIcon, CloseIcon, ExpandIcon } from "../icons";
import { useMemo, useRef, useState } from "react";
import { usePopper } from "react-popper";

// TODO - When filter leads to an empty list, show message
const Select = ({ items, selected, onChange }) => {
  const [selectedItem, setSelectedItem] = useState(selected);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const [arrowRef, setArrowRef] = useState(null);
  const { styles, attributes } = usePopper(toggleRef.current, menuRef.current, {
    placement: "auto-start",
    modifiers: [
      {
        name: "flip",
        enabled: true,
      },
    ],
  });

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items,
    selectedItem,
    itemToString(item) {
      return item ? item.title : "";
    },
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      onChange(newSelectedItem);
      setSelectedItem(newSelectedItem);
    },
  });

  return (
    <div className="select">
      <div className="control">
        <div className="tag-input" ref={toggleRef}>
          <div {...getToggleButtonProps()}>
            {selectedItem ? selectedItem.title : "Select..."}
            <ChevronDownIcon className="icon" />
          </div>
        </div>
      </div>
      {isOpen ? (
        <ul
          {...getMenuProps({
            ...attributes.popper,
            style: styles ? { ...styles.popper, margin: 0 } : {},
            ref: (el) => (menuRef.current = el),
          })}
          className="combo-list"
          data-open={isOpen}
        >
          <div ref={setArrowRef} />
          {items.map((item, index) => {
            return (
              <li
                className={`combo-item${
                  highlightedIndex === index ? " highlight" : ""
                }`}
                key={`${item.value}${index}`}
                // key={`${item.value}${index}`}
                {...getItemProps({ item, index })}
              >
                <span>{item.title}</span>
                {selectedItem.value === item.value && (
                  <CheckIcon className="icon" />
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <ul {...getMenuProps({ hidden: true })} />
      )}
    </div>
  );
};

const Combobox = ({ items: itemsList = [], getFilter, onChange, onBlur, value, fieldRef, name }) => {
  const [items, setItems] = useState(itemsList);
  // const inputValueRef = useRef();

  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const [arrowRef, setArrowRef] = useState(null);
  const { styles, attributes } = usePopper(toggleRef.current, menuRef.current, {
    placement: "auto-start",
    modifiers: [
      {
        name: "flip",
        enabled: true,
      },
    ],
  });

  const {
    isOpen,
    inputValue,
    openMenu,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
    setInputValue,
    selectItem,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      if (!inputValue) {
        setItems(itemsList);
        return;
      }
      setItems(items.filter(getFilter(inputValue)));
    },
    onSelectedItemChange({ selectedItem: newSelectedItem }) {
      // When an item is selected the inputValue is updated to this selectedItem
      // so we set the input value back
      setInputValue("");
      // parent's onChange
      onChange(newSelectedItem);
    },
    items,
    itemToString(item) {
      return item ? item.value : "";
    },
  });

  const onInputValueChange = (event) => {
    setInputValue(event.target.value);
    // openMenu();
  };

  return (
    <div className="combobox" ref={fieldRef}>
      <div className="control" onClick={openMenu}>
        <div className="tag-input" ref={toggleRef}>
          {selectedItem && (
            <div className="tags">
              <span className={`tag ${selectedItem.color}`}>
                <span>{selectedItem.value}</span>
                <CloseIcon
                  className="remove-tag"
                  onClick={() => selectItem(null)}
                />
              </span>
            </div>
          )}
          <input
            placeholder={!selectedItem ? "Search for an option..." : ""}
            {...getInputProps({
              onChange: onInputValueChange,
              onKeyDown: (event) => {
                let k = event.key;
                if ((k === "Backspace" && !inputValue) || k === "Delete") {
                  selectItem(null);
                  openMenu();
                }
              },
            })}
            name={name}
            onBlur={onBlur}
          />
          {/* <input ref={inputValueRef} onChange={onInputValueChange} placeholder={!selectedItem ? "Search for an option..." : ""} /> */}
          {/* dummy disabled input element for downshift */}
          {/* <input hidden={true} {...getInputProps({disabled: true})}/> */}
        </div>
        <button
          className="toggle-button"
          aria-label="toggle menu"
          {...getToggleButtonProps()}
        >
          <ExpandIcon className="icon" />
        </button>
      </div>
      {isOpen ? (
        <ul
          {...getMenuProps({
            ...attributes.popper,
            style: styles ? { ...styles.popper, margin: 0 } : {},
            ref: (el) => (menuRef.current = el),
          })}
          // ref={el => (menuRef.current = el)}
          className="combo-list"
          data-open={isOpen}
        >
          <div ref={setArrowRef} />
          {items.map((item, index) => {
            return (
              <li
                className={`combo-item${
                  highlightedIndex === index ? " highlight" : ""
                }`}
                key={`${item.id}`}
                // key={`${item.value}${index}`}
                {...getItemProps({ item, index })}
              >
                <div
                  className={`tag ${
                    item.color != null ? item.color : "light-gray"
                  }`}
                >
                  <span>{item.value}</span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul {...getMenuProps({ hidden: true })} />
      )}
    </div>
  );
};

const MultiCombobox = ({ items: itemsList = [], getFilter, onChange, onBlur, name, fieldRef }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const items = useMemo(
    () => getFilter(itemsList, selectedItems, inputValue),
    [itemsList, selectedItems, inputValue]
  );

  // popper
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const [arrowRef, setArrowRef] = useState(null);
  const { styles, attributes } = usePopper(toggleRef.current, menuRef.current, {
    placement: "auto-start",
    modifiers: [
      {
        name: "flip",
        enabled: true,
      },
    ],
  });

  const {
    getSelectedItemProps,
    getDropdownProps,
    removeSelectedItem,
  } = useMultipleSelection({
    selectedItems,
    onStateChange({ selectedItems: newSelectedItems, type }) {
      switch (type) {
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
        case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
          setSelectedItems(newSelectedItems);
          break;
        default:
          break;
      }
    },
  });

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items,
    itemToString(item) {
      return item ? item.value : "";
    },
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            ...(changes.selectedItem && { isOpen: true, highlightedIndex: 0 }),
          };
        default:
          return changes;
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (newSelectedItem != null) {
            let newSelectedItems = [...selectedItems, newSelectedItem];
            setSelectedItems(newSelectedItems);
            // call parent onchange
            console.log(newSelectedItems)
            onChange(newSelectedItems);
          }
          break;

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue);

          break;
        default:
          break;
      }
    },
  });

  return (
    <div className="combobox multi" ref={fieldRef}>
      <div className="control">
        <div className="tag-input" ref={toggleRef}>
          <div className="tags">
            {selectedItems.map((item, index) => {
              if (item != null) {
                return (
                  <div
                    className={`tag ${item.color ? item.color : "light-gray"}`}
                    key={`selected-item-${index}`}
                    {...getSelectedItemProps({ selectedItem: item, index })}
                  >
                    <span>{item.value}</span>
                    <CloseIcon
                      className="remove-tag"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeSelectedItem(item);
                      }}
                    />
                  </div>
                );
              }
            })}
          </div>
          <input
            placeholder="Search for an option..."
            {...getInputProps(
              getDropdownProps({
                onFocus: (e) =>
                  (e.target.placeholder = "Search for an option..."),
                onBlur: (e) => {
                  if (selectedItems.length !== 0) {
                    e.target.placeholder = "";
                  }
                },
              })
            )}
            name={name}
            onBlur={onBlur}
          />
        </div>
        <button
          className="toggle-button"
          aria-label="toggle menu"
          {...getToggleButtonProps()}
        >
          <ExpandIcon className="icon" />
        </button>
      </div>
      {isOpen ? (
        <ul
          {...getMenuProps({
            ...attributes.popper,
            style: styles ? { ...styles.popper, margin: 0 } : {},
            ref: (el) => (menuRef.current = el),
          })}
          className="combo-list"
          data-open={isOpen}
        >
          <div ref={setArrowRef} />
          {items.map((item, index) => {
            return (
              <li
                className={`combo-item${
                  highlightedIndex === index ? " highlight" : ""
                }`}
                key={`${item.id}`}
                {...getItemProps({ item, index })}
              >
                <div
                  className={`tag ${
                    item.color != null ? item.color : "light-gray"
                  }`}
                >
                  <span>{item.value}</span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul {...getMenuProps({ hidden: true })} />
      )}
    </div>
  );
};

export { Select, Combobox, MultiCombobox };
