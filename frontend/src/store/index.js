import { configureStore } from "@reduxjs/toolkit";
import pointsReducer from "./reducers/pointsReducer";
import pointsReducer3D from "./reducers/pointsReducer3D";
import picturesReducer from "./reducers/picturesReducer";
import videosReducer from "./reducers/videosReducer";
import navigationReducer from "./reducers/navigationReducer";
import statReducer from "./reducers/statReducer";
import tagsReducer from "./reducers/tagsReducer";
import pictureTagsReducer from "./reducers/pictureTagsReducer";
import pictureAlbumReducer from "./reducers/pictureAlbumReducer";


const store = configureStore({
  reducer: {
    points: pointsReducer,
    points3D: pointsReducer3D,
    pictures: picturesReducer,
    videos: videosReducer,
    navigation: navigationReducer,
    stats: statReducer,
    tags: tagsReducer,
    pictureTags: pictureTagsReducer,
    pictureAlbum: pictureAlbumReducer,
  },

});

export default store;
