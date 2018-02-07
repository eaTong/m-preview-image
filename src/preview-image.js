/**
 * Created by eatong on 18-2-6.
 */

const picUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAYCAQAAABHYIU0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAfQAAAH0AMQEOAcAAAAHdElNRQffCAIWOxJiZcaiAAABxUlEQVQ4y53UPUjVYRzF8c+tmxgqFYmIRbS21BC9GGJKJrbWELSUYBEaDe0NOVTU2GJhQYEQVBCuTW5BFFHGrXypyBDJKDOh0uuv4Xq913dvZ3ng8Hz/5zxv/4TnqkwrXGuMJFWq/A8UEkmBe3qsLQBLq9YiGBKaC049LgwnYZWp6zTZ7akn0hkiWUDaUZ1K/XBSd3bPVq9GpdioIWsUAqdmxrdZY7HaO332fRH/jk2q9ejKWUNCS96UIz64pWyJ9OKZ8YQwPL92ow7btbisZMFeb8XvfGsu3OCmbb6a0qrd+jnz2nSrm18kV7vegPBSrevSplyZLZnQZlx4pya/dg4+qF94bQ9K3BAmtStCwlk/hQkhpXo+3Gy/98Ib+2a+XKZD+OOiYqeNCY8dkxJ67Z0Ld+oVUg7kLWeD28KER74J3bagVp/wyq7M3c7Af+esJ6tN7goxi0KdAeGZa9JZOPSpXeRUN+sSwiWJWe+QQeFXLrlf/RKXotx9Ydz5vEM97KPIwRcsrQoPhXGteelNPuXgU5ZTuQfCmDN53rncz6DG5DLva9oLtSpcVWlQAmk7MnfniyorKfIq5zSSNKpIrIgvVMLoP/x1qQweYb+nAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTExLTEyVDExOjEwOjE2KzA4OjAwRvrOyQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNS0wOC0wMlQyMjo1OToxOCswODowMPgtuC0AAABNdEVYdHNvZnR3YXJlAEltYWdlTWFnaWNrIDcuMC4xLTYgUTE2IHg4Nl82NCAyMDE2LTA5LTE3IGh0dHA6Ly93d3cuaW1hZ2VtYWdpY2sub3Jn3dmlTgAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABh0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQAMTU1coyr+gAAABd0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAAxOTejxtWHAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE0Mzg1Mjc1NThTJFqXAAAAEnRFWHRUaHVtYjo6U2l6ZQAyLjM1S0JN0kRMAAAAX3RFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vaG9tZS93d3dyb290L3NpdGUvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL3NyYy8xMTkwOS8xMTkwOTQzLnBuZ94F5egAAAAASUVORK5CYII=';

//container for preview image...
let container, galleryContainer, currentIndex = 0, startPoint = {x: 0, y: 0, time: new Date().getTime()};

const opts = {
  index: 0,
  // required
  urls: [],
  //sometime you may not want your customer to close the preview themselves , then you may give me `false`
  clickToHide: true,
  transition: 'slide',
  //当滑动距离大于此值的时候触发上一个或者下一个
  offset: 75,
  smoothly: true,
  //use your own container
  containerEle: document.body,
  picUrl: picUrl
};

function previewImage(options) {
  options = options || {};
  if (!options.urls && Array.isArray(options.urls)) {
    console.error('urls is required and should be an Array');
    return;
  }

  if (options.index < 0 || options.index >= options.urls.length) {
    console.error('error index ');
    return;
  }
  for (let key in options) {
    opts[key] = options[key];
  }
  currentIndex = options.index || 0;

  initDOM();

}

function initDOM() {
  container = document.createElement('div');
  container.className = 'preview-image-root-container';
  container.innerHTML = `<div class="preview-image-container" id="preview-image-container">${generateContainer()}</div><div class="optional-render"></div>`;
  opts.containerEle.appendChild(container);
  galleryContainer = document.getElementById('preview-image-container');
  galleryContainer.style.width = `${opts.urls.length * 100}vw`;

  galleryContainer.addEventListener('touchstart', handlerTouchStart);
  galleryContainer.addEventListener('touchmove', handlerTouchMove);
  galleryContainer.addEventListener('touchend', handlerTouchEnd);
  // setOptionalRender(currentIndex);
  jumpToIndex(currentIndex);
}

function generateContainer() {
  let str = '';
  for (let index in opts.urls) {
    str += `<div class="image-cover loading ${opts.transition}" id="preview-image-container-id${index}">
              <img/></div>`;
  }
  return str;
}


function handlerTouchStart(event) {
  //remove transition when start touch
  galleryContainer.style.transition = 'none';
  startPoint = {x: event.touches[0].clientX, y: event.touches[0].clientY, time: new Date().getTime()};
}

function handlerTouchMove() {
  const touche = event.touches[0];
  galleryContainer.style.transform = `translateX(${touche.clientX - startPoint.x - currentIndex * window.screen.width}px)`;
}

function handlerTouchEnd(event) {
  event.preventDefault();
  const touch = event.changedTouches[0];
  if (touch.clientX - startPoint.x < 0 - opts.offset && currentIndex !== opts.urls.length - 1) {
    jumpToIndex(++currentIndex);
  } else if (touch.clientX - startPoint.x > opts.offset && currentIndex !== 0) {
    jumpToIndex(--currentIndex);
  } else {
    const distance = Math.pow(startPoint.x - touch.clientX, 2) + Math.pow(startPoint.y - touch.clientY, 2);
    //滑动距离不超过10像素，且时间小于300ms则隐藏图片
    if (distance < Math.pow(10, 2) && new Date().getTime() - startPoint.time < 300) {
      if (opts.clickToHide) {
        removeItems();
      }
    } else {
      galleryContainer.style.transform = `translateX(${-currentIndex * window.screen.width}px)`;
    }
  }
}

function jumpToIndex(index) {
  galleryContainer.style.transition = 'transform 100ms';
  galleryContainer.style.transform = `translateX(${-index * window.screen.width}px)`;
  setOptionalRender(index);
  ensurePictureVisible(index);
  if (opts.smoothly) {
    ensurePictureVisible(Math.max(0, index - 1));
    ensurePictureVisible(Math.min(index + 1, opts.urls.length));
  }
}

function getImageStr(index) {
  const item = opts.urls[index];
  if (item) {
    return typeof item === 'string' ? item : item[opts.urlLabel || 'url'];
  } else {
    return opts.picUrl;
  }
}

function setOptionalRender(index) {
  const item = opts.urls[index];
  if (typeof item !== 'string' && item.optionalRender) {
    let optRender = '';
    if (typeof item.optionalRender === 'string') {
      optRender = item.optionalRender.replace('{index}', index + 1).replace('{total}', opts.urls.length);
    } else if (typeof item.optionalRender === 'function') {
      optRender = item.optionalRender(index, opts.urls.length);
    }
    container.getElementsByClassName('optional-render')[0].innerHTML = optRender;
  }
}

function ensurePictureVisible(index) {
  const imgContainer = document.getElementById(`preview-image-container-id${index}`);
  if (/loading/.test(imgContainer.className)) {
    const img = new Image();
    img.onload = function () {
      imgContainer.className = imgContainer.className.replace(/loading/g, '');
      imgContainer.getElementsByTagName('img')[0].src = getImageStr(index);
    };
    img.onerror = function () {
      imgContainer.className = imgContainer.className.replace(/loading/g, '');
      imgContainer.getElementsByTagName('img')[0].src = picUrl;
    };
    img.src = getImageStr(index);
  }
}

function removeItems() {
  container.parentNode.removeChild(container);
  container = undefined;
  galleryContainer = undefined;
}

// export default previewImage;
