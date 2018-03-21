import Flux from '../flux.js';

import Seeder from "./Seeder.js";

class MenuStore extends Flux.Store {

  constructor() {
    super();
    this.state = {
      menu: Seeder.make(1, "menu"),
    };
  }

  getAll() {
    return this.state.menu;
  }
}

export default new MenuStore();