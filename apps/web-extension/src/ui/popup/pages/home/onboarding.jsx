import { useEffect } from "react";
import "./onboarding.scss";
import { useNavigate } from "react-router-dom";

const browser = chrome;

export const Onboarding = () => {
  const navigate = useNavigate();

  const authorize = async () => {
    try {
      await browser.storage.local.set({ onboarding: true });
      let cookie = await browser.runtime.sendMessage({
        action: "getCookie",
        payload: { name: "notion_user_id" },
      });
      console.log(cookie);
      if (cookie?.data) {
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error(
        "Onboarding: Failed to set onboarding key in storage",
        error
      );
    }
  };

  return (
    <div id="onboarding">
      <div className="title header-1">Get Started</div>
      <div className="help">
        This extension uses cookies stored by Notion to retrieve from and store
        data to Notion.
        {/* <ul className="list">
                    <li>You will be redirected to Notion to authorize this extension.</li>
                    <li>You will have to select the pages and databases that  will be accessible by this extension.</li>
                    <li>However, you can always add more databases at a later time using Notion’s  “Share” menu.</li>
                </ul> */}
      </div>
      <div className="action" onClick={authorize}>
        Go ahead
      </div>
    </div>
  );
};
