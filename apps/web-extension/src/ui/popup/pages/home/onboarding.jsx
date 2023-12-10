import { useNavigate } from "react-router-dom";
import { useSetOnboardedMutation } from "../../store/api/notion";
import "./onboarding.scss";

export const Onboarding = () => {
  const navigate = useNavigate();
  const [setMutation, { isSuccess }] = useSetOnboardedMutation();

  const authorize = async () => {
    setMutation({ onboarded: true });
    navigate("/", { state: { onboarded: true } });
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
