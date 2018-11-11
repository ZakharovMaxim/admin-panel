export default class AutoComplete {
  constructor(input, data) {
    this.input = input;
    this.filterValue = "";
    this.data = data;
    this.init();
  }
  init() {
    const parent = this.input.parentNode;
    this.input.remove();
    this.input.autocomplete = 'off';
    const autoComplete = document.createElement("DIV");
    autoComplete.classList.add("auto-complete");
    autoComplete.appendChild(this.input);
    parent.appendChild(autoComplete);

    const autoCompleteContent = document.createElement("DIV");
    autoCompleteContent.classList.add("auto-complete-content");
    let autoCompleteList = "<ul>";
    for (let i = 0; i < this.data.length; i++) {
      autoCompleteList += `<li>${this.data[i].name}</li>`;
    }
    autoCompleteList += "</ul>";
    autoCompleteContent.innerHTML = autoCompleteList;
    autoCompleteContent.addEventListener("click", e => {
      if (e.target.tagName !== "LI") return;
      this.input.value = e.target.textContent;
      this.input.dispatchEvent(new Event('change'));
    });
    autoComplete.appendChild(autoCompleteContent);
    this.list = autoComplete.getElementsByTagName('ul')[0];

    const close = (e) => {
      if (e.target === this.input) return;
      autoComplete.classList.remove("auto-complete-active");
      window.removeEventListener("click", close);
    }
    this.input.addEventListener("focus", e => {
      autoComplete.classList.add("auto-complete-active");
      window.addEventListener("click", close);
    });
    
    this.input.addEventListener('keyup', e => {
      this.filterValue = e.target.value;
      this.changeList();
    })
  }
  changeList () {
    this.list.querySelectorAll('li').forEach(item => {
      const text = item.textContent.trim();
      const index = text.indexOf(this.filterValue);
      if (~index) {
        item.style.display = 'block';
        item.innerHTML = text.slice(0, index) + `<span class='bold'>${this.filterValue}</span>` + text.slice(index + this.filterValue.length)
      } else {
        item.style.display = 'none';
        item.innerHTML = item.textContent;
      }
    })
  }
}
