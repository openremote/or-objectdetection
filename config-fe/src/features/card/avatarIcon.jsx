import React from "react";

import LiveTvIcon from '@material-ui/icons/LiveTv';
import LinkedCameraIcon from '@material-ui/icons/LinkedCamera';
import CameraIcon from '@material-ui/icons/Camera';

const AvatarIcon = props => {
  let { SourceType } = props;
  switch (SourceType) {
    case 2:
      return <LinkedCameraIcon/>;
    case 1:
      return <CameraIcon/>;
      //local file of live feed??
    case 3:
      return <LiveTvIcon/>;
    default:
      return null;
  }
};

export default AvatarIcon;