/**
 * Created by eatong on 18-2-6.
 */


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

function previewImageV2(options) {
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
  opts.containerEle.style.position = 'relative';
  opts.containerEle.style.overflow = 'hidden';
  container.innerHTML = `<div class="preview-image-container" id="preview-image-container">${generateContainer()}</div>\
                          <div class="optional-render"></div>`;
  opts.containerEle.appendChild(container);
  galleryContainer = document.getElementById('preview-image-container');
  galleryContainer.style.width = `${opts.urls.length * opts.containerEle.offsetWidth}px`;


  galleryContainer.addEventListener('touchstart', handlerTouchStart);
  galleryContainer.addEventListener('mousedown', handlerTouchStart);
  galleryContainer.addEventListener('touchmove', handlerTouchMove);
  galleryContainer.addEventListener('mousemove', handlerTouchMove);
  galleryContainer.addEventListener('touchend', handlerTouchEnd);
  galleryContainer.addEventListener('mouseup', handlerTouchEnd);
  galleryContainer.addEventListener('mouseout', handlerMoueout);
  // setOptionalRender(currentIndex);
  jumpToIndex(currentIndex);
}

function generateContainer() {
  let str = '';
  for (let index in opts.urls) {
    str += `<div class="image-cover loading ${opts.transition}" style="width:${opts.containerEle.offsetWidth}px;height:${opts.containerEle.offsetHeight}px" \
       id="preview-image-container-id${index}"><img draggable="false"/></div>`;
  }
  return str;
}


function handlerTouchStart(event) {
  if (event.type === 'mousedown') {

    galleryContainer.style.transition = 'none';
    startPoint = {x: event.x, y: event.y, time: new Date().getTime(), moving: true};
  } else {
    galleryContainer.style.transition = 'none';
    startPoint = {x: event.touches[0].clientX, y: event.touches[0].clientY, time: new Date().getTime(), moving: true};
  }
}

function handlerTouchMove(event) {
  if (startPoint.moving) {
    if (event.type === 'mousemove') {

      galleryContainer.style.transform = `translateX(${event.x - startPoint.x - currentIndex * opts.containerEle.offsetWidth}px)`;
    } else {

      const touche = event.touches[0];
      galleryContainer.style.transform = `translateX(${touche.clientX - startPoint.x - currentIndex * opts.containerEle.offsetWidth}px)`;
    }
  }
}

function handlerMoueout(event) {
  startPoint.moving = false;
  jumpToIndex(currentIndex);
}

function handlerTouchEnd(event) {
  startPoint.moving = false;
  event.preventDefault();
  const endPoint = {};
  if (event.type === 'mouseup') {
    endPoint.x = event.x;
    endPoint.y = event.x;

  } else {
    const touch = event.changedTouches[0];
    endPoint.x = touch.clientX;
    endPoint.y = touch.clientY;
  }
  if (endPoint.x - startPoint.x < 0 - opts.offset && currentIndex !== opts.urls.length - 1) {
    jumpToIndex(++currentIndex);
  } else if (endPoint.x - startPoint.x > opts.offset && currentIndex !== 0) {
    jumpToIndex(--currentIndex);
  } else {
    const distance = Math.pow(startPoint.x - endPoint.x, 2) + Math.pow(startPoint.y - endPoint.y, 2);
    //滑动距离不超过10像素，且时间小于300ms则隐藏图片
    if (distance < Math.pow(10, 2) && new Date().getTime() - startPoint.time < 300) {
      if (opts.clickToHide) {
        removeItems();
      }
    } else {
      galleryContainer.style.transform = `translateX(${-currentIndex * opts.containerEle.offsetWidth}px)`;
    }
  }
}

function jumpToIndex(index) {
  galleryContainer.style.transition = 'transform 100ms';
  galleryContainer.style.transform = `translateX(${-index * opts.containerEle.offsetWidth}px)`;
  setOptionalRender(index);
  ensurePictureVisible(index);
  if (opts.smoothly) {
    ensurePictureVisible(Math.max(0, index - 1));
    ensurePictureVisible(Math.min(index + 1, opts.urls.length - 1));
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
    container.getElementsByClassName('optional-render')[0].style.display = 'block';
    container.getElementsByClassName('optional-render')[0].innerHTML = optRender;
  } else {
    container.getElementsByClassName('optional-render')[0].style.display = 'none';
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

// export default previewImageV2;
module.exports = previewImageV2;
