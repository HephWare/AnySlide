// TODO: 
// Additional style types
// Styles for slide types


class AnySlide {
  constructor(
    id,
    data,
    controls = {
      text: { left: 'Prev', right: 'Next' },
      icon: { left: '/arrow-left.png', right: '/arrow-right.png' },
    }
  ) {
    this.id = id;
    this.data = data;
    this.controls = controls;
  }

  toggleControls() {
    const prev = this.instance.querySelector('.AnySlide__controlPrev');
    const next = this.instance.querySelector('.AnySlide__controlNext');

    this.current == 1
      ? prev.classList.add('AnySlide__controlDisabled')
      : prev.classList.remove('AnySlide__controlDisabled');

    this.current == this.slider.childElementCount
      ? next.classList.add('AnySlide__controlDisabled')
      : next.classList.remove('AnySlide__controlDisabled');
  }

  #scrollIntoView(nthId) {
    const currentItem = this.slider.querySelector('.AnySlide__item.isCurrent');
    const nthItem = this.slider.querySelector(`.AnySlide__item:nth-of-type(${nthId})`);
    currentItem.classList.remove('isCurrent');
    nthItem.classList.add('isCurrent');
    nthItem.scrollIntoView({behavior: 'smooth'});

    this.toggleControls();
  }

  prev() {
    const isFirstElement = this.current == 1;

    !isFirstElement && console.log('Is not first');
    isFirstElement && console.log('Is first');

    if (!isFirstElement) {
      this.current -= 1;
      this.#scrollIntoView(this.current)
    }
  }

  next() {
    const isLastElement = this.current == this.slider.childElementCount;

    !isLastElement && console.log('Is not last');
    isLastElement && console.log('Is last');

    if (!isLastElement) {
      this.current += 1;
      this.#scrollIntoView(this.current)
    }
  }

  createSlider(data) {
    const boundry = document.createElement('div');
    boundry.className = 'AnySlide__boundry';

    const controls = document.createElement('div');
    controls.className = 'AnySlide__controls';

    const controlPrev = document.createElement('button');
    controlPrev.className = 'AnySlide__controlPrev';

    const controlNext = document.createElement('button');
    controlNext.className = 'AnySlide__controlNext';

    this.controls?.icon?.right
      ? (controlNext.innerHTML = `<img src="${this.controls.icon.right}"/>`)
      : this.controls?.text?.right &&
        (controlNext.innerText = this.controls.text.right);

    controlNext.innerHTML == '' && (controlNext.innerText = 'Next');

    this.controls?.icon?.left
      ? (controlPrev.innerHTML = `<img src="${this.controls.icon.left}"/>`)
      : this.controls?.text?.left &&
        (controlPrev.innerText = this.controls.text.left);

    controlPrev.innerHTML == '' && (controlPrev.innerText = 'Prev');

    controlPrev.setAttribute('onclick', `AnySliders['${this.id}'].prev()`);
    controlNext.setAttribute('onclick', `AnySliders['${this.id}'].next()`);

    controls.appendChild(controlPrev);
    controls.appendChild(controlNext);

    const slider = document.createElement('div');
    slider.className = 'AnySlide__slider';

    const insertHeader = (element, text, isHtml = false) => {
      const header = document.createElement('h2');
      header.className = 'AnySlide__header';

      isHtml ? (header.innerHTML = text) : (header.innerText = text);

      element.appendChild(header);
    };

    const insertParagraph = (element, text, isHtml = false) => {
      const paragraph = document.createElement('p');
      paragraph.className = 'AnySlide__paragraph';

      isHtml
        ? (paragraph.innerHTML = text || '')
        : (paragraph.innerText = text || '');

      element.appendChild(paragraph);
    };

    const insertKicker = (element, kickerObj, isHtml = false) => {
      const kicker = document.createElement('p');
      kicker.className = 'AnySlide__kicker';

      const { text, icon } = kickerObj;

      kicker.innerHTML = `<img class="AnySlide__kickerIcon" src="${icon}"/>`;

      isHtml ? (kicker.innerHTML += text) : (kicker.innerText += text);

      element.appendChild(kicker);
    };

    const insertLink = (element, linkObj, isHtml = false) => {
      const link = document.createElement('a');
      link.className = 'AnySlide__link';

      const { text, url } = linkObj;

      link.setAttribute('href', url != '' ? url : '');

      isHtml ? (link.innerHTML = text || '') : (link.innerText = text || '');

      element.appendChild(link);
    };

    const setBackground = (element, backgroundSrc) => {
      !!backgroundSrc &&
        element.setAttribute(
          'style',
          `background-image: url(${backgroundSrc})`
        );
      !!backgroundSrc && element.classList.add('AnySlide__invertColors');
    };

    data.forEach((dataset) => {
      const isHtml = dataset?.html || false;

      const item = document.createElement('div');
      item.className = 'AnySlide__item u-shadow--light';

      if (dataset.type == 'TYPE_A') {
        insertHeader(item, dataset?.header, isHtml);
        insertParagraph(item, dataset?.paragraph, isHtml);
        insertLink(item, dataset?.link, isHtml);
      }

      if (dataset.type == 'TYPE_B') {
        insertKicker(item, dataset?.kicker, isHtml);
        insertHeader(item, dataset?.header, isHtml);
        insertParagraph(item, dataset?.paragraph, isHtml);
        insertLink(item, dataset?.link, isHtml);
      }

      setBackground(item, dataset?.background);

      slider.appendChild(item);
    });

    boundry.appendChild(slider);

    return { boundry, controls };
  }

  init() {
    const { boundry: sliderBoundry, controls: sliderControls } =
      this.createSlider(this.data);
    const insertPoint = document.getElementById(this.id);

    if (!insertPoint) {
      console.error(
        `Valid DOM element must be selected, element with id "${this.id}" doesn't exist`
      );

      return;
    }

    insertPoint.classList.add('AnySlide');
    insertPoint.appendChild(sliderBoundry);
    insertPoint.appendChild(sliderControls);

    this.slider = insertPoint.querySelector('.AnySlide__slider');
    this.instance = insertPoint;
    this.current = 1;
    this.slider.firstChild.classList.add('isCurrent');
    this.#scrollIntoView(this.current);

    !window.AnySliders && (window.AnySliders = {});
    window.AnySliders[this.id] = this;

    return this;
  }

  reinit() {
    while (this.instance.firstChild) {
      this.instance.removeChild(this.instance.firstChild);
    }
    this.init();

    return this;
  }
}
