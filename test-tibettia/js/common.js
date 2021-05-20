if (typeof adc !== 'object') var adc = {};

adc.Global = {
  inquirerSlider: function () {
    this.infiniteLoop = false;
    this.pager = false;
    this.controls = false;
    this.adaptiveHeight = true;
    this.preloadImages = 'all';
    this.touchEnabled = false;
    this.onSlideAfter = function () {
      adc.inquirer.settings.delayBut = 0;
    }
  }
};

adc.inquirer = {
  selector: {
    question: 'slide-title',
    slider: 'slider',
    wrapSlid: 'slider-wrap',
    itemSlid: 'slider__item',
    inquirerBut: 'inquirer',
    title: 'head-title',
    footer: 'footer',
    bar: 'question-count__list',
    errorMes: 'errorMes',
    resultBut: 'resulText',
    number: 'question-number',
    canvas: 'anlysis__load',
    analysis: 'analysis-screen',
    analysisPresent: 'present',
    analysisProgress: 'progress',
    analysisImg: 'run',
    result: 'result-screen'
  },
  settings: {
    dom: {},
    delayBut: 0,
    canvas: {
      frames: 60,
      lineWidth: 14,
      lineCap: 'round',
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      strokeStyle: '#ccc',
      strokeStyleDefoult: '#000',
      interval: [[34, 35, 100], [75, 76, 100], [1, 2, 3, 100]],
      gradient: [[[0, 136, 0, 184], [1, 189, 162, 232]], [[0, 207, 27, 61], [1, 255, 209, 69]], [[0, 41, 112, 219], [1, 41, 228, 229]]]
    }
  },
  slider: function () {
    this.settings.dom.slider = $('.' + this.selector.wrapSlid).html();
    this.settings.slider = $('.' + this.selector.slider).bxSlider(new adc.Global.inquirerSlider());
  },
  validation: function (current) {
    if (!this.settings.errorMes) this.settings.errorMes = $('#' + this.selector.errorMes).text();
    var valid = 0,
    elem = current.find('input');
    if (elem.length > 1) {
      elem.each(function () {
        if ($(this).prop("checked")) {
          valid = 1;
          return false;
        }
      });
      if (!valid) current.find('.' + this.selector.errorMes).html(this.settings.errorMes).css('color', 'red');
    } else {
      var val = elem.val();
      if (val && /\d+/g.test(val)) {
        if (elem.attr('name') === 'age' && val >= 18 && val <= 90) valid = 1;
        if (elem.attr('name') === 'weight' && val >= 40 && val <= 250) valid = 1;
      }
    }
    return valid;
  },
  inquirerBut: function () {
    var _this = this,
    _setting = _this.settings;
    count = _setting.slider.getSlideCount();
    _setting.inquirerBut = $('.' + this.selector.inquirerBut);
    _setting.bar = $('.' + this.selector.bar);
    _setting.number = $('.' + this.selector.number);
    _setting.inquirerBut.on('click', function () {
      if (!_setting.delayBut) {
        var index = _setting.slider.getCurrentSlide(),
        current = _setting.slider.find('.' + _this.selector.itemSlid).eq(index);
        if (current.hasClass('validation')) {
          if (_this.validation(current)) {
            current.find('input').css('border-color', 'rgba(0, 0, 0, .2)');
            _this.goSlide();
          } else {
            current.find('input').css('border-color', 'red');
          }
        } else {
          _this.goSlide();
        }
        if (index === count - 2) {
          $(this).html($('#' + _this.selector.resultBut).text());
        }
        if (index === count - 1) {
          $('.' + _this.selector.question).hide();
          $('.' + _this.selector.analysis).show();
          _this.analysis();
        }
      }
    });
  },
  goSlide: function () {
    $('.' + this.selector.title + ',.' + this.selector.footer).hide();
    this.settings.delayBut = 1;
    this.settings.slider.goToNextSlide();
    this.settings.bar.find('.point').eq(this.settings.slider.getCurrentSlide()).addClass('active');
    this.settings.number.html(this.settings.slider.getCurrentSlide() + 1);
  },
  canvasGen: function () {
    var _this = this,
    _canvas = _this.settings.canvas;
    _canvas['all'] = [];
    _canvas['num'] = {};
    _canvas['progress'] = {};
    $('.' + this.selector.canvas).each(function (e) {
      if (window.innerWidth < 768) {
        this.setAttribute('width', this.width / 2);
        this.setAttribute('height', this.height / 2);
        _canvas.lineWidth = 6;
      }
      _canvas.all.push({
        dom: this,
        x: this.width / 2,
        y: this.height / 2,
        r: this.width / 2 - _canvas.lineWidth / 2,
        c: Math.PI * 2,
        q: Math.PI / 2,
        s: 0,
        i: _canvas.interval[e],
        id: this.getAttribute('id'),
        g: {
          x1: 0,
          x2: 0,
          y1: 0,
          y2: this.height,
          p: _canvas.gradient[e]
        }
      });
      _this.canvasAnim(_canvas.all[e]);
    });
  },
  canvasAnim: function (elem, current, anim, count, stop) {
    var _this = this;
    if (elem.dom.getContext) {
      var ctx = elem.dom.getContext('2d'),
      _canvas = this.settings.canvas;
      ctx.lineWidth = _canvas.lineWidth;
      ctx.shadowOffsetX = _canvas.shadowOffsetX;
      ctx.shadowOffsetY = _canvas.shadowOffsetY;
      ctx.lineCap = _canvas.lineCap;
      ctx.clearRect(0, 0, elem.dom.width, elem.dom.height);
      ctx.beginPath();
      ctx.strokeStyle = _canvas.strokeStyle;
      ctx.arc(elem.x, elem.y, elem.r, -(elem.q), elem.c - elem.q, true);
      ctx.stroke();
      if (anim) {
        ctx.beginPath();
        if (elem.g) {
          var gradient = ctx.createLinearGradient(elem.g.x1, elem.g.y1, elem.g.x2, elem.g.y2);
          for (var q = 0; q < elem.g.p.length; q++) {
            gradient.addColorStop(elem.g.p[q][0], 'rgb(' + elem.g.p[q][1] + ',' + elem.g.p[q][2] + ',' + elem.g.p[q][3] + ')');
          }
          ctx.strokeStyle = gradient;
        } else {
          ctx.strokeStyle = _canvas.strokeStyleDefoult;
        }
        ctx.arc(elem.x, elem.y, elem.r, -(elem.q), ((elem.c) * current) - elem.q, false);
        ctx.stroke();
        _this.analysisNum(elem.id, elem.s);
        _this.analysisProgress(elem.id, elem.s);
        _this.analysisProgressIMG(elem.id);
        count = count || 1;
        for (var i = 0; i < elem.i.length; i++) {
          var start = (elem.i[i - 1]) ? elem.i[i - 1] : 0;
          if (elem.s < elem.i[i]) {
            elem.s = ((elem.i[i] - start) / _canvas.frames * count) + start;
            break;
          }
        }
        (count < _canvas.frames) ? count++ : count = 1;
        if (elem.s <= 100 && !stop) {
          stop = (elem.s < 100) ? 0 : 1;
          requestAnimationFrame(function () {
            _this.canvasAnim(elem, elem.s / 100, 1, count, stop);
          });
        }
      }
    }
  },
  analysisNum: function (id, num) {
    if (!this.settings.canvas.num[id]) this.settings.canvas.num[id] = $('[data-' + this.selector.analysisPresent + ' = "' + id + '"]');
    if (this.settings.canvas.num[id]) this.settings.canvas.num[id].html(Math.ceil(num) + '%');
  },
  analysisProgress: function (id, num) {
    if (!this.settings.canvas.progress[id]) this.settings.canvas.progress[id] = $('[data-' + this.selector.analysisProgress + ' = "' + id + '"]');
    if (this.settings.canvas.progress[id]) this.settings.canvas.progress[id].css({'width': num + '%', 'opacity': 1});
  },
  analysisProgressIMG: function (id) {
    var margin = (this.settings.canvas.progress[id]) ? this.settings.canvas.progress[id].parent().position().left + this.settings.canvas.progress[id].width() : 0;
    if (!this.settings.canvas.img) this.settings.canvas.img = $('[data-' + this.selector.analysisImg + ']');
    if (this.settings.canvas.img) this.settings.canvas.img.css({'margin-left': (margin - (this.settings.canvas.img.width() / 2)) + 'px'});
  },
  analysis: function () {
    this.canvasGen();
    var _this = this;
    if (_this.settings.canvas.all) {
      var i = 0,
      set = _this.settings.canvas.all;
      _this.canvasAnim(set[i], set[i].s, 1);
      var time = setTimeout(function t() {
        if (set[i].s >= 100) {
          if (set[i + 1]) {
            i++;
            _this.canvasAnim(set[i], set[i].s, 1);
            time = setTimeout(t, 10);
          } else {
            setTimeout(function () {
              $('.' + _this.selector.analysis).hide();
              $('.' + _this.selector.result).show();
            }, 500);
          }
        } else {
          time = setTimeout(t, 100);
        }
      }, 100);
    }
  },
  init: function () {
    this.slider();
    this.inquirerBut();
  }
};


$(window).load(function () {
  adc.inquirer.init();
});

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (function () {
    return window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback, element) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();
}