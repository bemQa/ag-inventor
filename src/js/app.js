import "../css/entry.scss"
import $ from 'jquery'
import {initDevState} from "./dev";
import './images_import';
import '../../node_modules/perfect-scrollbar/css/perfect-scrollbar.css';
import PerfectScrollbar from 'perfect-scrollbar';

$(document).ready(_ => {
  initDevState();
  setPageSizeTypes();
  stickFooter();
  bindListeners();
  tryLoadScrollbarFor_FAQ();
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

  $('[data-popup]').on('click', e => {
    e.preventDefault();
    showPopup($(e.target).attr('data-popup'));
  });

  $('.popup, .popup-close').on('click', e => {
    $('.popup').removeClass('active');
    $('body').removeClass('no-scroll');
  });

  $('.popup-content').on('click', e => {
    e.stopPropagation();
  });

  $('#enter_form').on('submit', e => {
    e.preventDefault();
    submitEnterForm($(e.target));
  });

  $('#reg_form').on('submit', e => {
    e.preventDefault();
    submitRegForm($(e.target));
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

function showPopup(type) {
  $('body').addClass('no-scroll');
  $('.popup-content.active').removeClass('active');
  $(`.popup, .popup-content--${type}`).addClass('active');
}

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

function submitEnterForm(form) {

  let formData = {
    email: form.find('[name="enter_email"]').val(),
    password: form.find('[name="enter_password"]').val()
  };

  $('.popup--enter-submit-btn').prop('disabled', true);

  $.ajax({
    url: window.config.url.enter,
    data: formData,
    method: 'get',
    success: data => {
      if (typeof data.status !== 'undefined' &&
          data.status === 'success'
      ) {

        let message = typeof data.message !== 'undefined'
            ? data.message
            : 'Добро пожаловать!';

        showServiceMessage({
          title: 'Вход',
          body: message
        });
      } else {
        showEnterError();
      }
    },
    error: _ => {
      showEnterError();
    }
  });

  let showEnterError = function () {
    showServiceMessage({
      title: 'Вход временно недоступен',
      body: 'Ведутся технические работы.',
    });
  }
}

function submitRegForm(form) {

  let formData = {
    email: form.find('[name="reg_email"]').val(),
    name: form.find('[name="name"]').val(),
    surname: form.find('[name="surname"]').val(),
    sales_agreement: form.find('[name="sales_agreement"]').val(),
    policy_agreement: form.find('[name="policy_agreement"]').val(),
  };

  if (formData.sales_agreement === 'off' ||
      formData.policy_agreement === 'off') {
    return showServiceMessage('Для продолжения вы должны согласиться с условиями регистрации');
  }

  $('.popup--reg-submit-btn').prop('disabled', true);

  $.ajax({
    url: window.config.url.reg,
    data: formData,
    method: 'get',
    success: data => {
      if (typeof data.status !== 'undefined' &&
          data.status === 'success'
      ) {

        let message = typeof data.message !== 'undefined'
            ? data.message
            : 'Вы успешно зарегистрированы';

        showServiceMessage({
          title: 'Регистрация',
          body: message
        });
      } else {
        showRegError();
      }
    },
    error: _ => {
      showRegError();
    }
  });

  let showRegError = function () {
    showServiceMessage({
      title: 'Регистрация временно недоступна',
      body: 'Ведутся технические работы.',
    });
  }
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
