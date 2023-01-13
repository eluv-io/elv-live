import {makeAutoObservable, runInAction} from "mobx";

class UIStore {
  pageWidth = window.innerWidth;
  pageHeight = window.innerHeight;

  constructor() {
    makeAutoObservable(this);

    this.resizeHandler = new ResizeObserver(elements => {
      const {width, height} = elements[0].contentRect;

      this.HandleResize({width, height});
    });

    this.resizeHandler.observe(document.body);
  }

  HandleResize({width, height}) {
    clearTimeout(this.resizeTimeout);

    this.resizeTimeout = setTimeout(() => {
      runInAction(() => {
        this.pageWidth = Math.floor(width);
        this.pageHeight = Math.floor(height);
      });
    }, 250);
  }
}

export default UIStore;
