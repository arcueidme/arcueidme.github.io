(function($){
  
  redirectToKoreanSite();

  // Search
  var $searchWrap = $('#search-form-wrap'),
    isSearchAnim = false,
    searchAnimDuration = 200;

  var startSearchAnim = function(){
    isSearchAnim = true;
  };

  var stopSearchAnim = function(callback){
    setTimeout(function(){
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  $('#nav-search-btn').on('click', function(){
    if (isSearchAnim) return;

    startSearchAnim();
    $searchWrap.addClass('on');
    stopSearchAnim(function(){
      $('.search-form-input').focus();
    });
  });

  $('.search-form-input').on('blur', function(){
    startSearchAnim();
    $searchWrap.removeClass('on');
    stopSearchAnim();
  });

  // Share
  $('body').on('click', function(){
    $('.article-share-box.on').removeClass('on');
  }).on('click', '.article-share-link', function(e){
    e.stopPropagation();

    var $this = $(this),
      url = $this.attr('data-url'),
      encodedUrl = encodeURIComponent(url),
      id = 'article-share-box-' + $this.attr('data-id'),
      offset = $this.offset();

    if ($('#' + id).length){
      var box = $('#' + id);

      if (box.hasClass('on')){
        box.removeClass('on');
        return;
      }
    } else {
      var html = [
        '<div id="' + id + '" class="article-share-box">',
          '<input class="article-share-input" value="' + url + '">',
          '<div class="article-share-links">',
            '<a href="https://twitter.com/intent/tweet?url=' + encodedUrl + '" class="article-share-twitter" target="_blank" title="Twitter"></a>',
            '<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="article-share-facebook" target="_blank" title="Facebook"></a>',
            '<a href="http://pinterest.com/pin/create/button/?url=' + encodedUrl + '" class="article-share-pinterest" target="_blank" title="Pinterest"></a>',
            '<a href="https://plus.google.com/share?url=' + encodedUrl + '" class="article-share-google" target="_blank" title="Google+"></a>',
          '</div>',
        '</div>'
      ].join('');

      var box = $(html);

      $('body').append(box);
    }

    $('.article-share-box.on').hide();

    box.css({
      top: offset.top + 25,
      left: offset.left
    }).addClass('on');
  }).on('click', '.article-share-box', function(e){
    e.stopPropagation();
  }).on('click', '.article-share-box-input', function(){
    $(this).select();
  }).on('click', '.article-share-box-link', function(e){
    e.preventDefault();
    e.stopPropagation();

    window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
  });

  // Caption
  $('.article-entry').each(function(i){
    $(this).find('img').each(function(){
      if ($(this).parent().hasClass('fancybox')) return;

      var alt = this.alt;

      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
    });

    $(this).find('.fancybox').each(function(){
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox){
    $('.fancybox').fancybox();
  }

  // Mobile nav
  var $container = $('#container'),
    isMobileNavAnim = false,
    mobileNavAnimDuration = 200;

  var startMobileNavAnim = function(){
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function(){
    setTimeout(function(){
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  }

  $('#main-nav-toggle').on('click', function(){
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    $container.toggleClass('mobile-nav-on');
    stopMobileNavAnim();
  });

  $('#wrap').on('click', function(){
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;

    $container.removeClass('mobile-nav-on');
  });






  document.addEventListener('DOMContentLoaded', function() {
    
  
  //初始化
  if (typeof localStorage !== 'undefined' && typeof JSON !== 'undefined') {
      var viewHistory = new ViewHistory();
      viewHistory.init({
          limit: 8,
          storageKey: 'viewHistory',
          primaryKey: 'url'
      });
  }
  
  // 保存页面信息 如果 ViewHistory 的实例存在，则可以将页面信息写入。
  if (viewHistory) {
    var tE = document.getElementsByClassName('article-title');
    var cE = document.getElementsByClassName('article-category-link');

    // 检查标题元素是否存在且内容不为空
    if (tE && tE.length === 1 && tE[0].innerText.trim() !== '') {
      console.log(tE)
        // 检查分类元素是否存在且内容不为空
        if (cE && cE.length === 1 && cE[0].innerText.trim() !== '') {
            // 添加历史记录
            viewHistory.addHistory({
                "title": tE[0].innerText.trim(),
                "url": window.location.pathname, // 这是 primaryKey
                "category": cE[0].innerText.trim(),
                // 这里可以写入更多相关内容作为浏览记录中的信息
                // 截断的办法："title": document.getElementsByTagName('title')[0].innerHTML.split(" | ")[0]
            });
        }
    }
  }
  
  var wrap = document.getElementById('view-history');
  
  // 如果 ViewHistory 的实例存在，并且外层节点存在，则可显示历史浏览记录
  if (viewHistory && wrap) {
    // 获取浏览记录
    var histories = viewHistory.getHistories();

    // 组装列表
    if (histories && histories.length > 0) {
        // 当历史记录数量超过指定的阈值时，使用下拉框展示
        var count = 10; // 设置一个阈值，当历史记录数量超过这个值时使用下拉框
        if (histories.length > count) {
            var select = document.createElement('select');
            for (var i = histories.length - 1; i >= 0; i--) {
                var history = histories[i];
                var option = document.createElement('option');
                option.value = history.url;
                option.text = history.category + ' ' + history.title;
                select.appendChild(option);
            }
            // 直接将下拉框插入到页面中
            wrap.appendChild(select);
        } else {
            // 当历史记录数量不超过阈值时，使用列表展示
            var list = document.createElement('ul');
            for (var i = histories.length - 1; i >= 0; i--) {
                var history = histories[i];
                var item = document.createElement('li');
                var link = document.createElement('a');
                link.href = history.url;
                link.innerHTML = history.category + ' ' + history.title;
                item.appendChild(link);
                list.appendChild(item);
            }
            // 插入页面特定位置
            wrap.appendChild(list);
        }
    }
  }


  translateInitilization();
});
})(jQuery);

ViewHistory = function() {

  this.config = {
      limit: 10,
      storageKey: 'viewHistory',
      primaryKey: 'url'
  };

  this.cache = {
      localStorage: null,
      userData: null,
      attr: null
  };
};

ViewHistory.prototype = {

  init: function(config) {
      this.config = config || this.config;
      var _self = this;

      // define localStorage
      if (!window.localStorage && (this.cache.userData = document.body) && this.cache.userData.addBehavior && this.cache.userData.addBehavior('#default#userdata')) {
          this.cache.userData.load((this.cache.attr = 'localStorage'));

          this.cache.localStorage = {
              'getItem': function(key) {
                  return _self.cache.userData.getAttribute(key);
              },
              'setItem': function(key, value) {
                  _self.cache.userData.setAttribute(key, value);
                  _self.cache.userData.save(_self.cache.attr);
              }
          };

      } else {
          this.cache.localStorage = window.localStorage;
      }
  },

  addHistory: function(item) {
      var items = this.getHistories();
      for (var i = 0, len = items.length; i < len; i++) {
          if (item[this.config.primaryKey] && items[i][this.config.primaryKey] && item[this.config.primaryKey] === items[i][this.config.primaryKey]) {
              items.splice(i, 1);
              break;
          }
      }

      items.push(item);

      if (this.config.limit > 0 && items.length > this.config.limit) {
          items.splice(0, 1);
      }

      var json = JSON.stringify(items);
      this.cache.localStorage.setItem(this.config.storageKey, json);
  },

  getHistories: function() {
      var history = this.cache.localStorage.getItem(this.config.storageKey);
      if (history) {
          return JSON.parse(history);
      }
      return [];
  }
};

function redirectToKoreanSite() {
    var onSuccess = function (geoipResponse) {
        if (geoipResponse.country.iso_code === 'KR') {
            window.location.href = 'https://arcueidme.github.io/404';
        }
    };
    var onError = function (error) {
        console.error('Error retrieving geoip information:', error);
    };
    geoip2.country(onSuccess, onError);
}
    