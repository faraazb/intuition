import { Link } from "react-router-dom";
import Peep from "react-peeps";
import {
  SittingPose,
  StandingPose,
  BustPose,
  Face,
  FacialHair,
  Hair,
  Accessories,
} from "react-peeps";
import "./saved.scss";

const sittingPose = Object.keys(SittingPose);
const standingPose = Object.keys(StandingPose);
const bustPose = Object.keys(BustPose);

const isSittingPose = (pose) => sittingPose.includes(pose);
const isStandingPose = (pose) => standingPose.includes(pose);
const isBustPose = (pose) => bustPose.includes(pose);

const body = [...bustPose, ...sittingPose, ...standingPose];
const face = Object.keys(Face);
const facialHair = Object.keys(FacialHair);
const hair = Object.keys(Hair);
const accessory = Object.keys(Accessories);

const adjustPeepsViewbox = (bodyPiece) => {
  let x = "-350",
    y = "-150",
    width = "1500",
    height = "1500";
  if (isSittingPose(bodyPiece)) {
    x = "-800";
    y = "-300";
    width = "2600";
    height = "2600";
    if (bodyPiece === "MediumBW" || bodyPiece === "MediumWB") {
      x = "-1000";
    }
    if (bodyPiece === "OneLegUpBW" || bodyPiece === "OneLegUpWB") {
      x = "-900";
    }
    if (bodyPiece === "CrossedLegs") {
      x = "-850";
      width = "2800";
      height = "2800";
    }
    if (bodyPiece === "WheelChair") {
      x = "-700";
      y = "-150";
      width = "2700";
      height = "2700";
    }
    if (bodyPiece === "Bike") {
      x = "-1450";
      y = "-450";
      width = "4200";
      height = "4200";
    }
  } else if (isStandingPose(bodyPiece)) {
    x = "-1300";
    y = "-200";
    width = "3350";
    height = "3350";
  } else {
    if (bodyPiece === "PocketShirt") {
      x = "-395";
    }
    if (bodyPiece === "Geek" || bodyPiece === "DotJacket") {
      x = "-305";
    }
    if (bodyPiece === "Device") {
      y = "-160";
    }
  }
  return { x, y, width, height };
};

const getRandom = (array) => array[Math.floor(Math.random() * array.length)];

export const Saved = () => {
  const randomBody = getRandom(body);
  return (
    <div id="save">
      <div className="peep-container">
        <Peep
          style={{
            width: "100%",
            height: 150,
            justifyContent: "center",
            alignSelf: "center",
            overflow: "initial",
          }}
          accessory={getRandom(accessory)}
          body={randomBody}
          face={getRandom(face)}
          facialHair={getRandom(facialHair)}
          hair={getRandom(hair)}
          strokeColor="black"
          backgroundColor="white"
          viewBox={adjustPeepsViewbox(randomBody)}
        />
      </div>
      <div className="save-message">Saved!</div>
      <div>
        <Link href="/">
          <button className="action-button">Back to Home</button>
        </Link>
      </div>
    </div>
  );
};
