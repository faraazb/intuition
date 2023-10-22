import { useNavigate } from "react-router-dom";
import { CheckIcon } from "../../../components/icons";
import "./spaces.scss";
import {
  useGetSpaceQuery,
  useGetSpacesQuery,
  useGetUsersQuery,
} from "../../store/api/notion";

export const Spaces = () => {
  const navigate = useNavigate();
  const { data: users, isSuccess: isUsersSuccess } = useGetUsersQuery();
  const { data: spaces, isSuccess: isSpacesSuccess } = useGetSpacesQuery();
  const { data: currentSpace, isSuccess: isCurrentSpaceSuccess } =
    useGetSpaceQuery();
  // const { data: currentUser } = useGetUserQuery();

  // let notionSpaces = [];
  // users.forEach((user) => {
  // 	let workspaces = spaces.filter((space) =>
  // 		space.for_users.includes(user.id)
  // 	);
  // 	notionSpaces.push({ user, workspaces });
  // });

  const handleSpaceChange = (event, spaceId, userId) => {
    event.preventDefault();
    if (currentSpace.id !== spaceId) {
      console.log("Change space triggered by ", userId, " to ", spaceId);
      // changeSpace(spaceId, userId).then(history.back());
    }
  };

  const getPlanName = (subscriptionTier, planType) => {
    let plan = "";
    if (planType === "personal") {
      if (!subscriptionTier || subscriptionTier === "personal_free") {
        plan = "Personal Plan";
      } else {
        plan = "Personal Pro Plan";
      }
      if (subscriptionTier === "student") {
        plan += " (Student)";
      }
    } else if (planType === "team") {
      plan = "Team Plan";
    } else if (planType === "enterprise") {
      plan = "Enterprise Plan";
    }
    return plan;
  };

  const spacesDataInitialized =
    isUsersSuccess && isSpacesSuccess && isCurrentSpaceSuccess;

  return (
    <div id="spaces">
      <div className="title-container">
        <div className="title">
          <div className="header-2">Workspaces</div>
          <button className="action-button" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
        <hr className="title-divider-content" />
      </div>
      {spacesDataInitialized
        ? Object.values(users).map((user) => {
            return (
              <div key={user.id}>
                <div className="user-email">{user.email}</div>
                <div className="workspaces">
                  {user.spaces &&
                    user.spaces.map((spaceId) => {
                      const { id, icon, name, subscription_tier, plan_type } =
                        spaces[spaceId];
                      return (
                        <div
                          key={id}
                          className="workspace"
                          onClick={(e) => handleSpaceChange(e, id, user.id)}
                        >
                          {icon && (
                            <img className="workspace-icon" src={icon} />
                          )}
                          {!icon && (
                            <div className="workspace-icon-letter">
                              <span>{name[0]}</span>
                            </div>
                          )}
                          <div className="workspace-name">{name}</div>
                          <div className="workspace-plan">
                            {getPlanName(subscription_tier, plan_type)}
                          </div>
                          {currentSpace.id === id && (
                            <CheckIcon className="icon-20 workspace-check" />
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};
