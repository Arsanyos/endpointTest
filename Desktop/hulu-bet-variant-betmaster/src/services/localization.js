import LocalizedStrings from "react-localization";
import en from "./languages/en.json";
import am from "./languages/am.json";

class SingletonStrings {
  constructor() {
    if (this.instance) {
      return this.instance;
    } else {
      this.instance = new LocalizedStrings({
        Am: am,
        En: en
      });
      return this.instance;
    }
  }
}

let ex = new SingletonStrings();

export default ex;
