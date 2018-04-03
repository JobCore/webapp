import Flux from '../flux.js';
import LoginStore from './LoginStore';
// import EmployeeStore from './EmployeeStore';

class MenuStore extends Flux.Store {
  constructor() {
    super();
    this.state = {
      menu: [],
    };
  }

  addMenuItem(itemName, itemURL, itemIcon = null, itemLinks = null) {
    const icons = ['dashboard', 'area-chart', 'table', 'table', 'wrench'];
    return {
      id: Math.floor(Math.random() * 99999),
      label: itemName,
      url: itemURL,
      links: itemLinks,
      icon: itemIcon || this.icons[Math.floor(Math.random() * icons.length)],
    };
  }

  generateMenu() {
    // Navbar for employers
    if (LoginStore.getUser().employer != null) {
      this.setStoreState({
        menu: [
          this.addMenuItem('Browse Employee', '/talent/list', 'users'),
          this.addMenuItem('Manage Shifts', '/shift/list', 'calendar'),
          this.addMenuItem('Favorite Employees', '/talent/favorites', 'star'),
          this.addMenuItem('Company Profile', '/employer/', 'user'),
        ],
      }).emit('change');
    } else {
      // Navbar for employees
      this.setStoreState({
        menu: [
          this.addMenuItem('Dashboard', '/private', 'dashboard'),
          this.addMenuItem('Employer Profile', '/employee/', 'user'),
        ],
      }).emit('change');
    }
  }

  getAll() {
    return this.state.menu;
  }
}

export default new MenuStore();
