import { combineReducers } from 'redux';
import pointsReducer from './pointsReducer';
import pointsReducer3D from './pointsReducer3D';
import picturesReducer from './picturesReducer';
import videosReducer from './videosReducer';
import tagsReducer from './tagsReducer';
import pictureTagsReducer from './pictureTagsReducer';
import pictureAlbumReducer from './pictureAlbumReducer';

const rootReducer = combineReducers({
  points: pointsReducer,
  points3D: pointsReducer3D,
  pictures: picturesReducer,
  videos: videosReducer,
  tags: tagsReducer,
  pictureTags: pictureTagsReducer,
  pictureAlbum: pictureAlbumReducer,
});
export default rootReducer;