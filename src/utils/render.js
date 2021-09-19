import { RenderPosition } from '../const';
import AbstractView from '../view/abstract-view';

export const createElement = (template) => {
  const newElement = document.createElement('div');

  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, child, position) => {
  if (child instanceof AbstractView) {
    child = child.getElement();
  }

  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
  }
};

export const remove = (component) => {
  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

export const replace = (oldChild, newChild) => {
  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }

  const parentElement = oldChild.parentElement;

  if (oldChild === null || newChild === null || parentElement === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parentElement.replaceChild(newChild, oldChild);
};

