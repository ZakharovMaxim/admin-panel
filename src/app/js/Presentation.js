export default class Presentacion {
    constructor(tabEl, tabs, delay, parent) {
        this.parent = parent;
        this.tabs = tabEl.querySelectorAll('.tab');
        this.tabs.forEach(tab => {
            tab.classList.remove('active');
        })
        this.links = tabEl.querySelectorAll('.tab-header ul a');
        this.links.forEach(link => {
            link.classList.remove('active');
        })
        this.list = tabs;
        this.delay = delay * 1000;
        this.start();
    }
    start() {
        let i = 0;
        this.last = undefined;
        changeSlide(this);
        function changeSlide(ctx) {
           if(!ctx.tabs[i]) {
            i = 0;
           }
           if(!~ctx.list.indexOf(ctx.tabs[i].id)) {
               i++;
               ctx.timer = setTimeout(() => changeSlide(ctx), 0);
           } else {
                if(ctx.last !== undefined) {
                    ctx.tabs[ctx.last].classList.remove('active');
                    ctx.links[ctx.last].classList.remove('active');
                }
                ctx.tabs[i].classList.add('active');
                ctx.links[i].classList.add('active');
                ctx.last = i;
                i++;
                ctx.timer = setTimeout(() => changeSlide(ctx), ctx.delay);
           }
           
        }
    }
    end() {
        const last = this.tabs[this.last].id;
        this.reset();
        var myEvent = new CustomEvent("presentationEnd", {
            detail: {
                last: last
            }
        });
        this.parent.dispatchEvent(myEvent);
    }
    reset() {
        this.tabs.forEach(tab => tab.classList.remove('active'));
        this.links.forEach(link => link.classList.remove('active'));
        clearTimeout(this.timer);
    }
}