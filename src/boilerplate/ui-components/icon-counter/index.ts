interface IconCounterProps {
  id: string;
  initialValue: number;
  parentElement: HTMLElement;
  type?: 'overlap' | 'row';
}

class IconCounter {
  private iconCounterId: string;
  private containerElement: HTMLElement;
  protected iconElement: HTMLElement;
  private counterElement: HTMLElement;
  private counter: Counter;

  constructor(config: IconCounterProps) {
    this.setupIconCounter(config);
  }

  setupIconCounter({ id, initialValue, parentElement, type = 'row' }: IconCounterProps) {
    this.containerElement = document.createElement('div');
    this.containerElement.id = id;
    this.containerElement.className = 'icon-counter-container';
    this.containerElement.dataset.type = type;

    this.iconElement = document.createElement('div');
    this.iconElement.id = `${id}-icon`;
    this.iconElement.className = 'icon-counter-icon';

    this.counterElement = document.createElement('span');
    this.counterElement.id = `${id}-counter`;
    this.counterElement.className = 'icon-counter-counter';

    this.containerElement.appendChild(this.iconElement);
    if (type === 'overlap') {
      this.iconElement.appendChild(this.counterElement);
    } else {
      this.containerElement.appendChild(this.counterElement);
    }
    
    

    parentElement.appendChild(this.containerElement);

    this.counter = new ebg.counter();
    this.counter.create(`${id}-counter`);
    this.setValue(initialValue);
  }

  public setValue(value: number) {
    this.counter.setValue(value);

    this.checkHasValue(value);
  }

  public incValue(value: number) {
    this.counter.incValue(value);
    this.checkHasValue(this.counter.getValue());
  }

  public getElement(): HTMLElement {
    return this.containerElement;
  }

  public getValue() {
    return this.counter.getValue();
  }

  private checkHasValue(value: number) {
    if (value === 0) {
      this.containerElement.dataset.hasValue = 'false';
    } else {
      this.containerElement.dataset.hasValue = 'true';
    }
  }
}
