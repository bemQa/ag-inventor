import "@babel/polyfill";
import "unorm";
import $ from 'jquery'
import {initDevState} from "./dev";
import './images_import';
import '../../node_modules/perfect-scrollbar/css/perfect-scrollbar.css';
import PerfectScrollbar from 'perfect-scrollbar';
import {BlockbusterBuilder} from "./build";
import 'select2/dist/css/select2.min.css';
import {select2} from 'select2';
import {LanguageHandler} from "./language";

$(document).ready(_ => {
  initDevState();
  setPageSizeTypes();
  stickFooter();
  bindListeners();
  tryLoadScrollbarFor_FAQ();
  if ($('.build-content').length) {
    window.blockbusterBuilder = new BlockbusterBuilder().init();
  }

  let languageInitTimeout = ~location.href.indexOf('8080')
      ? 0
      : 100;

  window.languangeHandler = new LanguageHandler().init();

  setTimeout(_ => {
    window.languangeHandler.showOnPageLoading();
  }, languageInitTimeout);
});

window.config = {
  url: {
    enter: '/demo/success.json',
    reg: '/demo/success.json'
  }
};

function bindListeners() {

  $(window).on('resize', _ => {
    setPageSizeTypes();
    stickFooter();
  });

  $('.popup, .popup-close').on('click', e => {
    $('.popup').removeClass('active');
    $('body').removeClass('no-scroll');
  });

  $('.popup-content').on('click', e => {
    e.stopPropagation();
  });

  $('.pseudo-checkbox').on('click', e => {
    togglePseudoCheckbox($(e.target));
  });

  $('.input-group--checkbox label').on('click', e => {
    $(e.target).siblings('.pseudo-checkbox').click();
  });

  $('.faq--question-header').on('click', e => {
    $(e.target)
        .parents('.faq--question')
        .toggleClass('faq--question--opened');
    window.faqScrollbar.update();
  });

  if ($('#feedback_theme').length) {
    $('#feedback_theme').select2({
      placeholder: "Выбрать из списка",
      minimumResultsForSearch: 10
    });
  }

  if ($('.popup--feedback-submit-btn').length) {

    if (~location.href.indexOf('?feedback-demo')) {
      setTimeout(_ => {
        showPopup('feedback-success');
      }, 2000);
    }

    $('.popup--feedback-submit-btn').on('click', _ => {
      $('.popup').removeClass('active');
      $('body').removeClass('no-scroll');
    })
  }
}

function setPageSizeTypes() {
  window.isMobile = window.innerWidth < 780;
  window.isAdaptive = window.innerWidth < 1200;
}

function stickFooter() {

  let body = $('body'),
      windowBodyHeightsDifference = window.innerHeight - body.innerHeight(),
      footer = $('footer');

  if (windowBodyHeightsDifference > 0) {
    footer.css('top', `${windowBodyHeightsDifference - 12}px`);
  } else {
    footer.css('top', 0);
  }
}

window.showPopup = function (type) {
  $('header').removeClass('menu-opened');
  $('.mobile-menu-btn').removeClass('active');
  $(".menu").removeClass('active');

  $('body').addClass('no-scroll');
  $('.popup-content.active').removeClass('active');
  $(`.popup, .popup-content--${type}`).addClass('active');
};

function showServiceMessage(message) {
  $('body').addClass('no-scroll');
  $('.popup-content.active').removeClass('active');

  let blocks = {
    title: $('.service-msg-title'),
    body: $('.service-msg-body'),
  };

  if (typeof message !== 'string' &&
      typeof message.title !== 'undefined' &&
      typeof message.body !== 'undefined') {
    blocks.title.html(message.title);
    blocks.body.html(message.body);
  } else {
    blocks.title.html('Внимание');
    blocks.body.html(message);
  }

  $(`.popup, .popup-content--service`).addClass('active');
}

function togglePseudoCheckbox(pseudoCheckbox) {

  let checkbox = pseudoCheckbox
      .parents('.input-group')
      .find('[type="checkbox"]');

  pseudoCheckbox.toggleClass('selected');

  if (pseudoCheckbox.hasClass('selected')) {
    checkbox.val('on');
  } else {
    checkbox.val('off');
  }
}

function tryLoadScrollbarFor_FAQ() {

  let faqContainer = $('.faq--wrap-level-2');

  if (faqContainer.length === 0) {
    return null;
  }

  window.faqScrollbar = new PerfectScrollbar(faqContainer.toArray()[0]);
}

$('.cross-site-promo--close').on('click', _ => {
  $('.cross-site-promo--wrap').hide();
  document.cookie = "crossPromoWasClosed=true; path=/";
});

$(".mobile-menu-btn").on('click', function () {
  $('body').toggleClass('no-scroll');
  $('header').toggleClass('menu-opened');
  $(this).toggleClass('active');
  $(".menu").toggleClass('active');
});

$("menu a[onclick]").on('click', _ => {
  $('header').removeClass('menu-opened');
  $('.mobile-menu-btn').removeClass('active');
  $(".menu").removeClass('active');
});

export {
  stickFooter,
  showServiceMessage
}

$(window).on('load', function() {
  setTimeout(function(){
    $('#preloader').fadeOut();
  },500);
});