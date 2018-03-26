import Flux from '../flux';
import EmployerActions from './employerActions';
import { PUT } from '../store/ApiRequests';

class ProfileActions extends Flux.Action {
  updateProfile(id, profileData) {
    profileData = JSON.stringify({
      ...profileData,
    });
    PUT('profiles', id, profileData).then(() => EmployerActions.get());
  }
}
export default new ProfileActions();
