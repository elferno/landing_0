"use strict";

const Page = {
  init: function () {
    this.id('.menu__mobile').addEventListener('click', () => {
      this.toggleMobileMenu();
    });
  },
  toggleMobileMenu: function () {
    this.id('.page').classList.toggle('mobile-active-menu');
  },
  id: function (el) {
    return document.querySelectorAll(el)[0];
  }
};
document.addEventListener('DOMContentLoaded', () => {
  Page.init();
});
const Slick = {
  settings: {
    container: 'slider__body',
    arrowsOn: true,
    autoplay: false,
    autoplaySpeed: 3000
  },
  slider: {},
  create: function () {
    // vars
    const Slider = this._id(`.${this.settings.container}`);

    const SlickContainer = this._div('slick-container');

    const Slides = [...Slider.childNodes];
    this.slider.slidesAmount = Slides.length; // create slider

    const SlickList = this._div('slick-list');

    const SlickTrack = this._div('slick-track');

    for (let i = 0; i < 3; i++) {
      const SlickBlock = this._div('slick-block');

      Slides.forEach(child => {
        SlickBlock.appendChild(child);
        SlickBlock.innerHTML += '';
      });
      SlickTrack.appendChild(SlickBlock);
    }

    while (Slider.firstChild) Slider.removeChild(Slider.lastChild);

    SlickList.appendChild(SlickTrack);
    SlickContainer.appendChild(SlickList); // create dots

    const SlickDots = this._div('slick-dots');

    for (let i = 0; i < this.slider.slidesAmount; i++) {
      const SlickDot = this._div('slick-dot');

      this._addEvent(SlickDot, 'click', () => {
        this._moveSlide(i);
      }, false);

      SlickDots.appendChild(SlickDot);
    }

    SlickContainer.appendChild(SlickDots); // create arrows

    const SlickArrowLeft = this._div(`slick-arrow slick-arrow-left`);

    SlickArrowLeft.innerHTML = '<div><b></b><b></b></div>';

    this._addEvent(SlickArrowLeft, 'click', () => {
      this._moveSlideBy(-1);
    }, false);

    SlickContainer.appendChild(SlickArrowLeft);

    const SlickArrowRight = this._div(`slick-arrow slick-arrow-right`);

    SlickArrowRight.innerHTML = '<div><b></b><b></b></div>';

    this._addEvent(SlickArrowRight, 'click', () => {
      this._moveSlideBy(1);
    }, false);

    SlickContainer.appendChild(SlickArrowRight); // apply slider

    Slider.appendChild(SlickContainer); // define slider

    this._define();

    this._setSizes();

    this._setOffsets();

    this._moveSlide(0, true); // default css


    const styles = `
      .slick-container{width:100%;height:100%;position:relative;}
      .slick-list {width:100%;height:100%;overflow:hidden;}
      .slick-track {display:flex;}
      .slick-block {display:flex;align-items:center;}
    `;
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    if (styleElement.styleSheet) styleElement.styleSheet.cssText = styles;else styleElement.appendChild(document.createTextNode(styles));
    document.getElementsByTagName('head')[0].appendChild(styleElement);
  },
  _define: function () {
    this.slider.Slider = this._id(`.${this.settings.container}`);
    this.slider.SlickList = this._id(`.slick-list`);
    this.slider.SlickTrack = this._id(`.slick-track`);
    this.slider.SlickBlocks = document.querySelectorAll(`.slick-block`);
    this.slider.SlickDots = document.querySelectorAll(`.slick-dot`);

    this._addEvent(window, 'resize', () => {
      this._setSizes();

      this._setOffsets();
    }, false);
  },
  _moveSlideBy: function (direction) {
    let step = this.slider.currentStep + direction;

    this._moveSlide(step);
  },
  handling: false,
  _moveSlide: function (slideOrder, instantMove = false) {
    if (true !== this.handling || instantMove) {
      this.handling = true;
      this.slider.currentStep = slideOrder;
      const offset = this.slider.minOffset + this.slider.sliderWidth * -1 * this.slider.currentStep;

      this._style(this.slider.SlickTrack, `
        transform: translate(${offset}px, 0);
        ${instantMove ? '' : 'transition: all .2s ease-in-out'}
      `);

      const step = this.slider.currentStep;
      if (this.slider.currentStep < 0) this.slider.currentStep = this.slider.slidesAmount - 1;
      if (this.slider.currentStep >= this.slider.slidesAmount) this.slider.currentStep = 0;

      for (let i = 0; i < this.slider.SlickDots.length; i++) this.slider.SlickDots[i].classList.remove('slick-active');

      this.slider.SlickDots[this.slider.currentStep].classList.add('slick-active');
      setTimeout(() => {
        this.handling = false;
        if (step < 0) this._moveSlide(this.slider.slidesAmount - 1, true);
        if (step >= this.slider.slidesAmount) this._moveSlide(0, true);
      }, 200);
    }
  },
  _setOffsets: function () {
    this.slider.minOffset = this.slider.sliderWidth * -3;
    this.slider.maxOffset = this.slider.minOffset + this.slider.sliderWidth * -1 * this.slider.slidesAmount;
  },
  _setSizes: function () {
    this.slider.sliderWidth = this._getOffsetRect(this.slider.Slider).w;

    if (this.slider.sliderPrevWidth !== this.slider.sliderWidth) {
      // global track width
      this._style(this.slider.SlickTrack, `width: ${this.slider.slidesAmount * 3 * this.slider.sliderWidth}px;`); // each slide width


      let style = `width: ${this.slider.sliderWidth}px;`;

      if (this.settings.arrowsOn) {
        const arrowSpace = this._getOffsetRect(this._id('.slick-arrow-left')).w;

        console.log(arrowSpace);
        style = `
          width: ${this.slider.sliderWidth - arrowSpace * 2}px;
          margin: 0 ${arrowSpace}px;
        `;
      }

      for (let order in this.slider.SlickBlocks) if (this.slider.SlickBlocks.hasOwnProperty(order)) {
        const children = [...this.slider.SlickBlocks[order].childNodes];
        children.forEach(child => {
          this._style(child, style);
        });
      } // slider position
      // memorize slider previous width


      this.slider.sliderPrevWidth = this.slider.sliderWidth;
    }
  },

  _div(classNameList) {
    const d = document.createElement('div');
    const classNames = classNameList.split(' ');

    for (let i = 0; i < classNames.length; i++) d.classList.add(classNames[i]);

    return d;
  },

  _id: function (el) {
    return document.querySelectorAll(el)[0];
  },
  _style: function (elem, style) {
    if (style) elem.setAttribute('style', style);else elem.removeAttribute('style');
  },
  _addEvent: function (elem, event, func, param) {
    if (elem.addEventListener) elem.addEventListener(event, function (event) {
      func(event, param);
    }, false);else if (elem.attachEvent) {
      if (event === 'DOMContentLoaded') document.attachEvent('onreadystatechange', function () {
        if (document.readyState === 'complete') func(event, param);
      });else elem.attachEvent('on' + event, function (event) {
        func(event, param);
      });
    } else elem['on' + event] = function () {
      func(event, param);
    };
  },
  _getOffsetRect: function (elem) {
    const box = elem.getBoundingClientRect(),
          body = document.body,
          docElem = document.documentElement,
          scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
          scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
          clientTop = docElem.clientTop || body.clientTop || 0,
          clientLeft = docElem.clientLeft || body.clientLeft || 0;
    const top = box.top + scrollTop - clientTop,
          left = box.left + scrollLeft - clientLeft;
    return {
      t: Math.round(top),
      l: Math.round(left),
      w: Math.round(box.right - box.left),
      h: Math.round(box.bottom - box.top)
    };
  }
};

Slick._addEvent(document, 'DOMContentLoaded', () => {
  Slick.create();
}, false);
//# sourceMappingURL=app.js.map