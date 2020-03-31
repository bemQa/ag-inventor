import $ from 'jquery';

function LanguageHandler() {

  this.f = function (string) {
    return $(string);
  };

  this.init = function () {
    this.initState();
    this.bindPageElements();
    this.bindListeners();
    return this;
  };

  this.initState = function () {
    this.state = {
      languageWasChangedAlready: false
    };
  };

  this.bindPageElements = function () {

    this.page = {
      desktop: {
        wrap: this.f('.change-language-select-popup.x-desktop'),
        head: this.f('.change-language-select-popup--head.x-desktop'),
        body: this.f('.change-language-select-popup--body.x-desktop')
      },
      mobile: {
        wrap: this.f('.change-language-select-popup.x-mobile'),
        head: this.f('.change-language-select-popup--head.x-mobile'),
        body: this.f('.change-language-select-popup--body.x-mobile')
      }
    };
  };

  this.bindListeners = function () {

    this.page.desktop.head.on('click', _ => {
      this.toggleDesktopBubble();
    });

    this.page.mobile.head.on('click', _ => {
      this.toggleMobileLanguageMenu();
    })
  };

  this.showOnPageLoading = function () {

    if (this.state.languageWasChangedAlready === false) {

      switch (location.hostname) {

        case 'kz.alpengold.me':
            if (~location.href.indexOf('kz.alpengold.me/uz/') || location.pathname === '/uz') {
              this.page.desktop.wrap.attr('data-country-code', 'uz');
              this.page.mobile.wrap.attr('data-country-code', 'uz');
            } else {
              this.page.desktop.wrap.attr('data-country-code', 'kz');
              this.page.mobile.wrap.attr('data-country-code', 'kz');
            }
          break;

        case 'mn.alpengold.me':
          this.page.desktop.wrap.attr('data-country-code', 'mn');
          this.page.mobile.wrap.attr('data-country-code', 'mn');
          break;

        case 'ge.alpengold.me':
          this.page.desktop.wrap.attr('data-country-code', 'ge');
          this.page.mobile.wrap.attr('data-country-code', 'ge');
          break;

        case 'alpengold.me':
        default:
          this.page.desktop.wrap.attr('data-country-code', 'ru');
          this.page.mobile.wrap.attr('data-country-code', 'ru');
          console.warn('LanguageHandler: Неизвестная площадка');
      }
    }

    this.page.desktop.head.show();
  };

  this.toggleDesktopBubble = function () {
    this.page.desktop.body.toggle();
  };

  this.toggleMobileLanguageMenu = function () {
    this.page.mobile.body.toggle();
    this.page.mobile.head.toggleClass('x-collapsed');
  };

  this.changeLanguage = function (lang) {

    this.state.languageWasChangedAlready = true;

    switch (lang) {

      case 'ru':
        this.page.desktop.wrap.attr('data-country-code', 'ru');
        this.page.mobile.wrap.attr('data-country-code', 'ru');
        break;

      case 'uz':
        this.page.desktop.wrap.attr('data-country-code', 'uz');
        this.page.mobile.wrap.attr('data-country-code', 'uz');
        break;

      case 'kz':
        this.page.desktop.wrap.attr('data-country-code', 'kz');
        this.page.mobile.wrap.attr('data-country-code', 'kz');
        break;

      case 'mn':
        this.page.desktop.wrap.attr('data-country-code', 'mn');
        this.page.mobile.wrap.attr('data-country-code', 'mn');
        break;

      case 'ge':
        this.page.desktop.wrap.attr('data-country-code', 'ge');
        this.page.mobile.wrap.attr('data-country-code', 'ge');
        break;

      default:
        this.page.desktop.wrap.attr('data-country-code', lang);
        this.page.mobile.wrap.attr('data-country-code', lang);
        console.error('LanguageHandler: Неподдерживаемый язык. Доступные значения: ru, uz, kz, mn, ge')
    }
  };
}

export {LanguageHandler}
