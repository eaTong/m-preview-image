# m-preview-image

`m-preview-image` let you preview image in mobile ,to make sure image is more smooth , `m-preview-image` will auto load three image (current , next and last )

## browser support 
- android : 4.4 +
- ios : 8 +
- IE mobile : 10+

## how to get?

- in browser : download and add a tag :`<script src="path-to/preview-image.js">` 
- using node : 
> npm i m-preview-image -S 

> const  previewImage = require('m-preview-image');
## how to use?
first you should have a url list just like:
  
    var urls = [
      "http://139.129.33.188:8000/file/read/8418,4259c96c45c811e78eab00163e002820,common",
      "http://139.129.33.188:8000/file/read/8421,426209ce45c811e78eab00163e002820,common",
      "http://139.129.33.188:8000/file/read/8424,426a140245c811e78eab00163e002820,common"
    ];
      
and then call ` previewImage({urls: urls});` when you want to preview images

urls can also be a list of object , when you give me a list of object , key of url should be `url`,just like :

    var urls = [
      {
        url: 'http://icon.nipic.com/BannerPic/20150821/home/20150821102514.jpg',
        optionalRender: '11111111111111'
      }, {
        url: 'http://image.tupian114.com/20140722/20441639.jpg',
        optionalRender: '22222222'
      }, {
        url: 'http://image.tupian114.com/20131219/11432580.jpg',
        optionalRender: '33333333'
      }, {
        url: 'http://image.tupian114.com/20150831/23135049.jpg',
        optionalRender: '44444444'
      }, {
        url: 'http://image.tupian114.com/20100710/23030647.jpg',
        optionalRender: '5555555'
      }, {
        url: 'http://image.tupian114.com/20140923/16420259.jpg',
        optionalRender: '66666666'
      }, {
        url: 'http://image.tupian114.com/20140923/16510218.jpg',
        optionalRender: '7777777'
      }
    ];
      
param `optionalRender` can allows you DIY you own render,such as render your own progress.

`optionalRender`can now auto replace `{index}` to current index , `{total}` to tatal length of all url,or you can pass a function and return the html you want to render
   
    

    
