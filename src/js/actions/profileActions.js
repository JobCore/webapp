import Flux from '../flux';
import EmployerActions from './employerActions';
import { PUT } from '../store/ApiRequests';
import EmployeeActions from './employeeActions';

class ProfileActions extends Flux.Action {
  updateProfile(id, profileData) {
    profileData = JSON.stringify({
      ...profileData,
    });
    PUT('profiles', id, profileData).then(() => {
      EmployerActions.get();
      EmployeeActions.getAll();
    });
  }
}
export default new ProfileActions();
