import Flux from '../flux';
import { GET, PUT } from '../store/ApiRequests';
import LoginStore from '../store/LoginStore';

class EmployerActions extends Flux.Action {
  addEmployer() {
    this.dispatch('EmployerStore.addEmployer');
  }

  get() {
    GET('employers').then(employers => {
      const employer = employers.filter(data => data.profile.user.id === LoginStore.getUser().id);
      this.dispatch('EmployerStore.setEmployer', {
        data: employer[0],
      });
    });
  }

  updateEmployer = (id, employerData) => {
    employerData = JSON.stringify({
      ...employerData,
    });
    PUT('employers', id, employerData).then(() => this.get());
  };
}
export default new EmployerActions();
