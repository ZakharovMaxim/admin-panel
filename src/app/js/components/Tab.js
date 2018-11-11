export default class Tab {
  constructor(el, parent) {
    this.element = el;
    this.navigation = el.querySelectorAll('.tab-header ul a');
    this.parent = parent;
    this.tabs = el.querySelectorAll('.tab');
    this.navigation.forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        let hash = e.target.href.split('#')[1];
        if(hash) this.changeTab(hash, true);
      });
    });
    this.presentationTimer = null;
    this.init();
  }
  init(initial = 0) {
    this.navigation[initial].classList.add('active');
    this.tabs[initial].classList.add('active');
    this.activeTab = this.tabs[initial];
    this.activeLink = this.navigation[initial];
  }
  changeTab(hash, stopPresentationMode) {
    if (stopPresentationMode) this.presentationModeEnd();
    let found = this.find(hash);
    if(!found) return;
    var myEvent = new CustomEvent("tabChanged");
    this.parent.dispatchEvent(myEvent);
    this.activeTab.classList.remove('active');
    this.activeLink.classList.remove('active');
    this.activeTab = found.el;
    this.activeLink = this.navigation[found.index];
    this.activeLink.classList.add('active');
    this.activeTab.classList.add('active');
  }
  presentationModeStart (tabs, timer = 5000) {
    let i = 0;
    const nextTick = () => {
      this.changeTab(tabs[i]);
      i++;
      if (i > tabs.length - 1) i = 0;
      this.presentationTimer = setTimeout(nextTick, timer);
    }
    nextTick();
    // this.presentationTimer = setTimeout(nextTick, timer)
  }
  presentationModeEnd () {
    clearTimeout(this.presentationTimer);
  }
  find(hash) {
    let found = false;
    this.tabs.forEach((tab, i) => {
      if(tab.id === hash) found = {el: tab, index: i};
    });
    return found;
  }
}
