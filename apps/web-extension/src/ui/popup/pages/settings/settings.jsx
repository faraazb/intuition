import { Select } from "../../../components/combobox/combobox";
import { useNavigate } from "react-router-dom";
import "./settings.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme, setTheme } from "../../store/slices/settings";

const browser = chrome;

const themes = [
  {
    title: "Use system setting",
    value: "",
  },
  {
    title: "Light",
    value: "light",
  },
  {
    title: "Dark",
    value: "dark",
  },
];

export const Settings = () => {
  const theme = useSelector(selectTheme);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onThemeChange = async (nextTheme) => {
    console.log(nextTheme);
    try {
      dispatch(setTheme(nextTheme));
      await browser.storage.local.set({ theme: nextTheme });
    } catch (error) {
      console.error("Failed to set theme", error);
    }
  };

  return (
    <div id="settings">
      <div className="title">
        <div className="header-2">Settings</div>
        <button className="action-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
      <hr className="title-divider-content" />
      <div className="content">
        <div className="setting">
          <div className="setting-description">Appearance</div>
          <div className="setting-control">
            <Select items={themes} selected={theme} onChange={onThemeChange} />
          </div>
        </div>
      </div>
    </div>
  );
};
