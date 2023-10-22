import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./home.scss";
// import browser from "webextension-polyfill";
import {
  CogIcon,
  ExpandIcon,
  PageIcon,
  SearchIcon,
} from "~/ui/components/icons";
import { Spinner } from "~/ui/components/spinner/spinner";
import {
  useGetRecentCollectionsQuery,
  useGetSpaceQuery,
  useSearchCollectionsQuery,
  useGetUserQuery,
  useGetUsersQuery,
} from "../../store/api/notion";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const Home = () => {
  // const {
  // 	space,
  // 	user,
  // 	users,
  // 	collections: allCollections,
  // 	setCollections: setAllCollections,
  // } = useContext(NotionContext);
  const navigate = useNavigate();

  const { data: users, isSuccess: isUsersSuccess } = useGetUsersQuery();
  const { data: space, isSuccess: isSpaceSuccess } = useGetSpaceQuery();
  const { data: user, isSuccess: isUserSuccess } = useGetUserQuery();
  const { data: recentCollections, isSuccess: isRecentCollectionSuccess } =
    useGetRecentCollectionsQuery(
      {
        userId: user?.id,
        spaceId: space?.id,
      },
      {
        skip: !isUserSuccess || !isSpaceSuccess,
      }
    );

  const [collectionsQuery, setCollectionsQuery] = useState("");
  const collectionsQueryDebounced = useDebounce(collectionsQuery, 500);

  const { data: searchedCollections, isSuccess: isSearchedCollectionsSuccess } =
    useSearchCollectionsQuery(
      {
        query: collectionsQueryDebounced,
        spaceId: space?.id,
      },
      {
        skip: !isSpaceSuccess || !collectionsQueryDebounced,
      }
    );

  useEffect(() => {
    console.log(isSpaceSuccess, isUserSuccess);
  }, [isSpaceSuccess, isUserSuccess]);

  const setSearchCollectionsQuery = async (event) => {
    const query = event.target.value;
    setCollectionsQuery(query);
  };

  // returns a URL to an SVG twemoji using unicode value, unused as we directly use the font from Mozilla
  // const getIconSrc = (icon) => {
  // 	let unicode = icon.codePointAt(0).toString(16);
  // 	return `https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/${unicode}-fe0f.svg`;
  // };

  // useEffect(() => {
  // 	if (currentUser?.id && users && spaces) {
  // 		const nextUser = users[currentUser.id] ?? null;
  // 		const nextSpace = (nextUser && nextUser?.spaces?.length) ?
  // 			spaces[currentSpace?.id ?? nextUser.spaces[0]] : null;
  // 		setUser(nextUser)
  // 		setSpace(nextSpace)
  // 	}
  // }, [currentUser, currentSpace, users, spaces])

  useEffect(() => {
    console.log("Home finished rendering");
  }, []);

  let collections = {};
  if (collectionsQuery && isSearchedCollectionsSuccess) {
    collections = searchedCollections;
  } else if (isRecentCollectionSuccess) {
    collections = recentCollections;
  }

  console.log(collections)

  return (
    <div id="home">
      {isSpaceSuccess ? (
        <div className="space" onClick={(_event) => navigate("/spaces")}>
          {space.icon && (
            <img className="space-icon" src={space.icon} alt="profile photo" />
          )}
          {!space.icon && (
            <div className="space-icon-letter">
              <span>{space.name[0]}</span>
            </div>
          )}
          <div className="user">
            <span className="name">{space.name}</span>
            {isUserSuccess && isUsersSuccess && users.length && (
              <span className="email">{user.email}</span>
            )}
          </div>
          <ExpandIcon className="icon" />
        </div>
      ) : (
        <div className="space skeleton-container">
          <div className="space-icon-letter skeleton"></div>
          <div className="user skeleton">
            <span className="name"></span>
            <span className="email"></span>
          </div>
        </div>
      )}
      <div className="settings">
        <Link className="link-button" to="/settings">
          <button className="settings-button">
            <CogIcon className="icon" />
            <span>Settings</span>
          </button>
        </Link>
      </div>
      <div className="search">
        <div className="search-bar">
          <div className="search-input">
            <SearchIcon className="icon" />
            <input placeholder="Search.." onChange={setSearchCollectionsQuery}></input>
          </div>
        </div>
      </div>
      {Object.keys(collections).length ? (
        <div className="search-results">
          <div className="collections">
            {Object.values(collections).map(({ id, name, icon }) => {
              return (
                <div key={id} className="collection">
                  <Link className="link-button" to={`/collection/${id}`}>
                    <button className="settings-button">
                      {icon ? (
                        // <img
                        // 	className="icon"
                        // 	src={getIconSrc(icon)}
                        // 	alt={icon}
                        // 	aria-labelledby={icon}
                        // />
                        <span className="emoji">{icon}</span>
                      ) : (
                        <PageIcon className="icon" />
                      )}
                      <span>{name[0]}</span>
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="collections-loading">
          <Spinner />
        </div>
      )}
    </div>
  );
};