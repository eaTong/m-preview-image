;(function (root, undefined) {
  const picUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAYCAQAAABHYIU0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAfQAAAH0AMQEOAcAAAAHdElNRQffCAIWOxJiZcaiAAABxUlEQVQ4y53UPUjVYRzF8c+tmxgqFYmIRbS21BC9GGJKJrbWELSUYBEaDe0NOVTU2GJhQYEQVBCuTW5BFFHGrXypyBDJKDOh0uuv4Xq913dvZ3ng8Hz/5zxv/4TnqkwrXGuMJFWq/A8UEkmBe3qsLQBLq9YiGBKaC049LgwnYZWp6zTZ7akn0hkiWUDaUZ1K/XBSd3bPVq9GpdioIWsUAqdmxrdZY7HaO332fRH/jk2q9ejKWUNCS96UIz64pWyJ9OKZ8YQwPL92ow7btbisZMFeb8XvfGsu3OCmbb6a0qrd+jnz2nSrm18kV7vegPBSrevSplyZLZnQZlx4pya/dg4+qF94bQ9K3BAmtStCwlk/hQkhpXo+3Gy/98Ib+2a+XKZD+OOiYqeNCY8dkxJ67Z0Ld+oVUg7kLWeD28KER74J3bagVp/wyq7M3c7Af+esJ6tN7goxi0KdAeGZa9JZOPSpXeRUN+sSwiWJWe+QQeFXLrlf/RKXotx9Ydz5vEM97KPIwRcsrQoPhXGteelNPuXgU5ZTuQfCmDN53rncz6DG5DLva9oLtSpcVWlQAmk7MnfniyorKfIq5zSSNKpIrIgvVMLoP/x1qQweYb+nAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTExLTEyVDExOjEwOjE2KzA4OjAwRvrOyQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNS0wOC0wMlQyMjo1OToxOCswODowMPgtuC0AAABNdEVYdHNvZnR3YXJlAEltYWdlTWFnaWNrIDcuMC4xLTYgUTE2IHg4Nl82NCAyMDE2LTA5LTE3IGh0dHA6Ly93d3cuaW1hZ2VtYWdpY2sub3Jn3dmlTgAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABh0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQAMTU1coyr+gAAABd0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAAxOTejxtWHAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE0Mzg1Mjc1NThTJFqXAAAAEnRFWHRUaHVtYjo6U2l6ZQAyLjM1S0JN0kRMAAAAX3RFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vaG9tZS93d3dyb290L3NpdGUvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL3NyYy8xMTkwOS8xMTkwOTQzLnBuZ94F5egAAAAASUVORK5CYII=';

  function getOption(options) {
    const DEFAULT_OPTIONS = {
      index: 0,
      // required
      urls: [],
      //sometime you may not want your customer to close the preview themselves , then you may give me `false`
      clickToHide: true,
      //当滑动距离大于此值的时候触发上一个或者下一个
      offset: 75,
      smoothly: true,
      urlLabel: 'url',
      //use your own container
      containerEle: document.body,
      picUrl: picUrl,
      onImageHidden: function () {
      },
      onChangePic: function () {
      }
    };
    return Object.assign({}, DEFAULT_OPTIONS, options);
  }

  class PreviewImage {
    constructor(options) {

      if (!options.urls && Array.isArray(options.urls)) {
        console.error('urls is required and should be an Array');
        return;
      }

      if (options.index < 0 || options.index >= options.urls.length) {
        console.error('error index ');
        return;
      }
      this.opts = getOption(options);
      this.container = null;
      this.galleryContainer = null;
      this.startPoint = {x: 0, y: 0, time: new Date().getTime()};
      this.currentIndex = options.index || 0;
      this.unionKey = Math.random();

      this.onTouchStart = this.onTouchStart.bind(this);
      this.onTouchMove = this.onTouchMove.bind(this);
      this.onTouchEnd = this.onTouchEnd.bind(this);
      this.onMouseOut = this.onMouseOut.bind(this);
    }

    isPreviewInBody() {
      return this.opts.containerEle.tagName === 'BODY';
    }

    preview() {
      this.container = document.createElement('div');
      this.container.className = `preview-image-root-container ${this.isPreviewInBody() ? 'preview-in-body' : 'preview-inside'}`;
      this.opts.containerEle.style.position = 'relative';
      this.opts.containerEle.style.overflow = 'hidden';
      this.container.innerHTML = `<div class="preview-image-container" id="preview-image-container~${this.unionKey}">\
        ${this.generateContainer()}</div><div class="optional-render"></div>`;
      this.opts.containerEle.appendChild(this.container);
      this.galleryContainer = document.getElementById(`preview-image-container~${this.unionKey}`);
      this.galleryContainer.style.width = `${this.opts.urls.length * this.opts.containerEle.offsetWidth + 2}px`;

      this.galleryContainer.addEventListener('touchstart', this.onTouchStart);
      this.galleryContainer.addEventListener('mousedown', this.onTouchStart);
      this.galleryContainer.addEventListener('touchmove', this.onTouchMove);
      this.galleryContainer.addEventListener('mousemove', this.onTouchMove);
      this.galleryContainer.addEventListener('touchend', this.onTouchEnd);
      this.galleryContainer.addEventListener('mouseup', this.onTouchEnd);
      this.galleryContainer.addEventListener('mouseout', this.onMouseOut);
      this.jumpToIndex(this.currentIndex);
    }

    onTouchStart(event) {
      if (event.type === 'mousedown') {
        this.startPoint = {x: event.x, y: event.y, time: new Date().getTime(), moving: true};
      } else {
        this.startPoint = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
          time: new Date().getTime(),
          moving: true
        };
      }
    }

    onTouchMove(event) {
      if (this.startPoint.moving) {
        if (event.type === 'mousemove') {
          this.galleryContainer.style.transform = `translateX(${event.x - this.startPoint.x - this.currentIndex * this.opts.containerEle.offsetWidth}px)`;
        } else {
          const touche = event.touches[0];
          this.galleryContainer.style.transform = `translateX(${touche.clientX - this.startPoint.x - this.currentIndex * this.opts.containerEle.offsetWidth}px)`;
        }
      }
    }

    onMouseOut(event) {
      this.startPoint.moving = false;
      this.jumpToIndex(this.currentIndex);
    }

    onTouchEnd(event) {
      this.startPoint.moving = false;
      event.preventDefault();
      const endPoint = {};
      if (event.type === 'mouseup') {
        endPoint.x = event.x;
        endPoint.y = event.y;

      } else {
        const touch = event.changedTouches[0];
        endPoint.x = touch.clientX;
        endPoint.y = touch.clientY;
      }
      if (endPoint.x - this.startPoint.x < 0 - this.opts.offset && this.currentIndex !== this.opts.urls.length - 1) {
        this.jumpToIndex(++this.currentIndex);
      } else if (endPoint.x - this.startPoint.x > this.opts.offset && this.currentIndex !== 0) {
        this.jumpToIndex(--this.currentIndex);
      } else {
        const distance = Math.pow(this.startPoint.x - endPoint.x, 2) + Math.pow(this.startPoint.y - endPoint.y, 2);
        //滑动距离不超过10像素，且时间小于300ms则隐藏图片
        if (distance < Math.pow(10, 2) && new Date().getTime() - this.startPoint.time < 300) {
          if (this.opts.clickToHide) {
            this.removeItems();
          }
        } else {
          this.galleryContainer.style.transform = `translateX(${-this.currentIndex * this.opts.containerEle.offsetWidth}px)`;
        }
      }
    }

    jumpToIndex(index) {
      const containerWidth = this.isPreviewInBody() ? document.body.offsetWidth : this.opts.containerEle.offsetWidth;
      this.galleryContainer.style.transform = `translateX(${-index * containerWidth}px)`;
      this.setOptionalRender(index);
      this.ensurePictureVisible(index);
      if (this.opts.smoothly) {
        this.ensurePictureVisible(Math.max(0, index - 1));
        this.ensurePictureVisible(Math.min(index + 1, this.opts.urls.length - 1));
      }
      this.opts.onChangePic && this.opts.onChangePic(index)
    }

    generateContainer() {
      let str = '';
      const width = this.isPreviewInBody() ? '100vw' : `${this.opts.containerEle.offsetWidth}px`;
      const height = this.isPreviewInBody() ? '100vh' : `${this.opts.containerEle.offsetHeight}px`;
      for (let index in this.opts.urls) {
        str += `<div class="image-cover loading "\
        style="width:${width};height:${height}" \
       id="preview-image-container-id${index}~${this.unionKey}"><img draggable="false"/></div>`;
      }
      return str;
    }

    setOptionalRender(index) {
      const item = this.opts.urls[index];
      if (typeof item !== 'string' && item.optionalRender) {
        let optRender = '';
        if (typeof item.optionalRender === 'string') {
          optRender = item.optionalRender.replace('{index}', index + 1).replace('{total}', this.opts.urls.length);
        } else if (typeof item.optionalRender === 'function') {
          optRender = item.optionalRender(index, this.opts.urls.length);
        }
        this.container.getElementsByClassName('optional-render')[0].style.display = 'inline-block';
        this.container.getElementsByClassName('optional-render')[0].innerHTML = optRender;
      } else {
        this.container.getElementsByClassName('optional-render')[0].style.display = 'none';
      }
    }

    ensurePictureVisible(index) {
      const imgContainer = document.getElementById(`preview-image-container-id${index}~${this.unionKey}`);
      if (/loading/.test(imgContainer.className)) {
        const img = new Image();
        img.onload = () => {
          imgContainer.className = imgContainer.className.replace(/loading/g, '');
          imgContainer.getElementsByTagName('img')[0].src = this.getImageStr(index);
        };
        img.onerror = function () {
          imgContainer.className = imgContainer.className.replace(/loading/g, '');
          imgContainer.getElementsByTagName('img')[0].src = picUrl;
        };
        img.src = this.getImageStr(index);
      }
    }

    getImageStr(index) {
      const item = this.opts.urls[index];
      if (item) {
        return typeof item === 'string' ? item : item[this.opts.urlLabel || 'url'];
      } else {
        return this.opts.picUrl;
      }
    }

    removeItems() {
      if (this.container) {
        this.container.parentNode.removeChild(this.container);
        this.container = undefined;
        this.galleryContainer = undefined;
        if (this.isPreviewInBody()) {
          this.opts.containerEle.style.overflow = 'auto';
        }
      }
      this.opts.onImageHidden();
    }
  }

  // ....
  if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    module.exports = PreviewImage;
  } else if (root) {
    root.PreviewImage = PreviewImage;
  }
}(this));
