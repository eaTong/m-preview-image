/**
 * Created by eatong on 17-6-1.
 */

var PreviewImage = {
  images: [],
  opts: {
    index: 0,
    offset: 75,
    clickToHide: true,//sometime you may not want your customer to close the preview themselves , then you may give me `false`
    containerEle: document.body,//use your own container
  },
  start: {},
  moveIndex: 0,
  preview: function (images, options) {
    if (!images || !Array.isArray(images)) {
      console.error('images is required,and type should be Array!');
      return false;
    } else {
      options = options || {};
      this.images = images;
      for (var i in options) {
        this.opts[i] = options[i];
      }
      this.init();
    }
  },
  init: function () {
    this.container = document.createElement('div');
    this.container.className = 'preview-image-container';
    this.container.innerHTML = '<div class="shadow"></div><img class="image"/><div class="optional-render"></div>';
    this.opts.containerEle.appendChild(this.container);
    this.loadImage();
    this.container.addEventListener('touchstart', this.handlerTouchStart.bind(this));
    this.container.addEventListener('touchmove', this.handlerTouchMove.bind(this));
    this.container.addEventListener('touchend', this.handlerTouchEnd.bind(this));
  },
  loadImage: function () {
    var _this = this;
    // this.image = this.container.getElementsByTagName('img')[0];
    if (this.container.getElementsByTagName('img').length > 0) {
      this.image = this.container.getElementsByTagName('img')[0];
    } else {
      this.image = document.createElement('img');
      this.container.appendChild(this.image);
    }
    var image = new Image();
    image.onload = function () {
      _this.image.src = this.src;
      var h = window.screen.height;
      var w = window.screen.width;
      if (this.height / this.width > h / w) { //长宽比大于于屏幕尺寸的长宽比的时候，高度为100%，宽度则通过缩放计算
        //图片太小時居中
        if (this.width < w) {
          _this.image.style.left = w / 2 - this.width / 2 + 'px';
          _this.image.style.top = h / 2 - this.height / 2 + 'px';
        } else {
          const width = h / this.height * this.width;
          _this.image.style.left = w / 2 -  width/ 2 + 'px';
        }
      } else if (this.height / this.width < h / w) { //长宽比小于屏幕尺寸的长宽比的时候，宽度为100%，高度则通过缩放计算
        //图片太小時居中
        if (this.width < w) {
          _this.image.style.left = w / 2 - this.width / 2 + 'px';
          _this.image.style.top = h / 2 - this.height / 2 + 'px';
        } else {
          const height = w / this.width * this.height;
          _this.image.style.top = h / 2 - height/ 2   + 'px';
        }
      } else {
        if (this.width < w) {
          _this.image.style.left = w / 2 - this.width / 2 + 'px';
          _this.image.style.top = h / 2 - this.height / 2 + 'px';
        } else {
          _this.image.style.left = '0px';
          _this.image.style.top = '0px';
          _this.image.style.width = '100%';
          _this.image.style.height = '100%';
        }
      }
    };
    var img = this.images[this.opts.index];
    image.src = typeof img === 'string' ? img : img.url;
    if (typeof img !== 'string' && img.optionalRender) {
      this.container.getElementsByClassName('optional-render')[0].innerHTML = img.optionalRender;
    }
    this.opts.onChangePic && this.opts.onChangePic(this.opts.index, this.images.length);
  },
  handlerTouchStart: function (event) {
    //暂时只处理上下
    this.start = {x: event.touches[0].clientX, y: event.touches[0].clientY, time: new Date().getTime()};
  },
  handlerTouchMove: function (event) {
    var touche = event.touches[0];
    this.image.style.transform = 'translateX(' + (touche.clientX - this.start.x) + 'px)';
  },
  handlerTouchEnd: function (event) {
    var touch = event.changedTouches[0];
    if (touch.clientX - this.start.x < 0 - this.opts.offset && this.opts.index !== this.images.length - 1) {
      this.nextImage();
    } else if (touch.clientX - this.start.x > this.opts.offset && this.opts.index !== 0) {
      this.lastImage();
    } else {
      var distance = Math.pow(this.start.x - touch.clientX, 2) + Math.pow(this.start.y - touch.clientY, 2);
      //滑动距离不超过10像素，且时间小于300ms则隐藏图片
      if (distance < Math.pow(10, 2) && new Date().getTime() - this.start.time < 300) {
        if (this.opts.clickToHide) {
          this.removeItems();
        }
      } else {
        this.image.style.transform = 'translateX(0px)';
      }
    }
  },
  nextImage: function () {
    this.image.style.transform = 'translateX(' + (-window.screen.width) + 'px)';
    setTimeout(function () {
      this.image.parentNode.removeChild(this.image);
      this.opts.index++;
      this.loadImage();
    }.bind(this), 200)
  },
  lastImage: function () {
    this.image.style.transform = 'translateX(' + (window.screen.width) + 'px)';
    setTimeout(function () {
      this.image.parentNode.removeChild(this.image);
      this.opts.index--;
      this.loadImage();
    }.bind(this), 200)
  },
  removeItems: function () {
    this.container.parentNode.removeChild(this.container);
    this.container = undefined;
    this.image = undefined;
  }
};
