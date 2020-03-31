import $ from "jquery";

export function initDevState() {

  if (!~location.href.indexOf('8080')) {
    $('.dev').remove();
    $('.template').remove();
    return null;
  }

  $('.dev').css({
    display: 'flex'
  });

  $('.dev button').on('click', (e) => {
    $('.template').toggle();
  });

  if (~location.href.indexOf('delete-promo')) {
    $('.cross-site-promo--wrap').remove();
  }
}
