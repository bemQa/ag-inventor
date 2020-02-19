import $ from "jquery";

export function initDevState() {

  if (!~location.href.indexOf('localhost')) {
    return null;
  }

  $('.dev').css({
    display: 'flex'
  });

  $('.dev button').on('click', (e) => {
    $('.template').toggle();
  });
}
