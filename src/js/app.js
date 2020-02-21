import "../css/entry.scss"
import $ from 'jquery'
import {initDevState} from "./dev";
import '../img/common/mondelez.png';
import '../img/main/mobile/ag-logo.png';

$(document).ready(_ => {

  initDevState();

  setPageSizeTypes();
  stickFooter();

  bindListeners();
});

function bindListeners() {

  $(window).on('resize', _ => {
    setPageSizeTypes();
    stickFooter();
  });

  $('[data-popup]').on('click', e => {
    showPopup($(e.target).attr('data-popup'));
  });

  $('.popup, .popup-close').on('click', e => {
    $('.popup').removeClass('active');
    $('body').removeClass('no-scroll');
  });

  $('.popup-content').on('click', e => {
    e.stopPropagation();
  });

}

function setPageSizeTypes() {
  window.isMobile = window.innerWidth < 780;
  window.isAdaptive = window.innerWidth < 1200;
}

function stickFooter() {

  let windowBodyHeightsDifference = window.innerHeight - $('body').innerHeight(),
      footer = $('footer');

  if (window.isAdaptive) {

    if (windowBodyHeightsDifference > 0) {
      footer.css('top', `${windowBodyHeightsDifference - 12}px`);
    } else {
      footer.css('top', 0);
    }
  } else {
    footer.css('top', 0);
  }
}

function showPopup(type) {
  $('body').addClass('no-scroll');
  $('.popup-content.active').removeClass('active');
  $(`.popup, .popup-content--${type}`).addClass('active');
}
