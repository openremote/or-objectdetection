import React from "react";

import LiveTvIcon from '@material-ui/icons/LiveTv';
import LinkedCameraIcon from '@material-ui/icons/LinkedCamera';
import CameraIcon from '@material-ui/icons/Camera';

const AvatarIcon = props => {
  let { SourceType } = props;
  switch (SourceType) {
    case "IP_CAM":
      return <LinkedCameraIcon/>;
    case "WEBCAM":
      return <CameraIcon/>;
    case "LIVE_FEED":
      return <LiveTvIcon/>;
    default:
      return null;
  }
};

export default AvatarIcon;