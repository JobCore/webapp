import Flux from '../flux';

class FilterActions extends Flux.Action {
  updateConfig(value, configOption, listName) {
    this.dispatch('FilterConfigStore.updateConfig', { value, configOption, listName });
  }

  clearConfigFor(listName) {
    this.dispatch('FilterConfigStore.clearConfigFor', { listName });
  }
}
export default new FilterActions();
