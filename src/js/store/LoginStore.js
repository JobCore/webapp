import Flux from '../flux';
import EmployeeActions from '../actions/employeeActions';
import EmployerActions from '../actions/employerActions';
import ShiftActions from '../actions/shiftActions';
import FavoriteListActions from '../actions/favoriteListActions';
import BadgesActions from '../actions/badgesActions';
import VenueActions from '../actions/venueActions';
import PositionsActions from '../actions/positionsActions';

class LoginStore extends Flux.Store {
  constructor() {
    super();
    this.state.user = null;
  }

  _setUserLogin({ data }) {
    this.setStoreState({
      user: data,
    }).emit('change');
    EmployerActions.get();
    EmployeeActions.getAll();
    ShiftActions.getAll();
    FavoriteListActions.getAll();
    BadgesActions.getAll();
    VenueActions.getAll();
    PositionsActions.getAll();
    console.log('The user has logged in');
  }
  _loggoutUser() {
    this.setStoreState({ user: null }).emit();
  }

  // Just getters for the properties it got from the action.
  getUser() {
    return this.state.user;
  }
  isLoggedIn() {
    return !!this.state.user;
  }
}
export default new LoginStore();
