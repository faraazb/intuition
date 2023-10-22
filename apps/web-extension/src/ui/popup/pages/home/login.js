import "./login.scss";

export const Login = () => {
  return (
    <div id="onboarding">
      <div className="title header-1">Get Started</div>
      <div className="help">
        Please log into Notion! (This extension uses cookies stored by Notion to
        retrieve from and store data to Notion.)
      </div>
      <a className="action" href="https://notion.so/login" target="_blank">
        Go to Notion
      </a>
    </div>
  );
};
