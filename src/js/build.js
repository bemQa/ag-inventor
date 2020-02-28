import $ from 'jquery';
import {stickFooter} from './app'
import productsJSON from './../demo/ingredients';

export function BlockbusterBuilder() {

  this.f = function (string) {
    return this.wrap.find(string);
  };

  this.init = function () {
    this.initState();
    this.bindPageElements();
    this.listeners = this.bindListeners();
    this.load();
    return this;
  };

  this.initState = function () {
    this.step = null;
    this.addingIsLocked = false;
    this.setIngredients();

    this.firstStepState = {
      currentCategory: null,
      currentProduct: null
    };

    this.result = {
      parts: [],
      choco: null,
      color: null,
      title: null,
      description: null
    };

    this.isDemo =
        ~location.href.indexOf('localhost') ||
        ~location.href.indexOf('.world');
  };

  this.bindPageElements = function () {
    this.wrap = $('.build-content');
    this.page = {
      container: this.f('.container').eq(0),
      resultChocolateTextWrap: {
        wrap: this.f('.result-chocolate--text-wrap'),
        title: this.f('.result-chocolate--text-wrap .x-title'),
        description: this.f('.result-chocolate--text-wrap .x-choco-type'),
      },
      steps: {
        wrap: this.f('.build--slides-numbers-wrap'),
        circles: {
          all: this.f('.figure-circle'),
          number_1: this.f('[data-circle-number="1"]'),
          number_2: this.f('[data-circle-number="2"]'),
          number_3: this.f('[data-circle-number="3"]'),
          number_4: this.f('[data-circle-number="4"]')
        },
        text: {
          all: this.f('.step-title'),
          number_1: this.f('[data-step-number="1"]'),
          number_2: this.f('[data-step-number="2"]'),
          number_3: this.f('[data-step-number="3"]'),
          number_4: this.f('[data-step-number="4"]')
        }
      },
      cupBg: this.f('.build-body--cup-bg'),
      sliderBody: {
        wrap: this.f('.build--slider-body'),
        categories: {
          wrap: this.f('.categories-select-wrap'),
          select: this.f('.categories-select'),
          categories: this.f('.categories-option'),
        },
        main: {
          wrap: this.f('.build-body--main'),
          title: this.f('.build-body--title'),
          content: {
            directionButtonsWrap: {
              wrap: this.f('.build-body--direction-buttons-wrap'),
              both: this.f('.build-body--button-wrap'),
              left: {
                wrap: this.f('.build-body--button-wrap--left'),
                title: this.f('.build-body--button-wrap--left .build-button-title div'),
                image: this.f('.build-body--button-wrap--left .build-button-image'),
              },
              right: {
                wrap: this.f('.build-body--button-wrap--right'),
                title: this.f('.build-body--button-wrap--right .build-button-title div'),
                image: this.f('.build-body--button-wrap--right .build-button-image'),
              }
            },
            scene: {
              wrap: this.f('.build-body--scene-wrap'),
              element: this.f('.build-body--element')
            }
          }
        }
      },
      selectColorSlide: {
        wrap: this.f('.select-color-slide'),
        title: this.f('.colors-title'),
        elements: this.f('.color-element'),
        showMoreButton: this.f('.show-all-colors--button')
      },
      finalSlide: {
        wrap: this.f('.build--final-slide'),
        images: {
          image_1: this.f('.build--final-slide--ingredient-float--1'),
          image_2: this.f('.build--final-slide--ingredient-float--2'),
        },
        form: {
          block: this.f('.build-result-form'),
          inputs: {
            title: this.f('#build-title'),
            description: this.f('#build-description'),
            ingredients: this.f('#build-ingredients'),
            choco: this.f('#build-choco'),
            color: this.f('#build-color'),
          }
        }
      },
      floatExampleResult: {
        wrap: this.f('.select-color--result'),
        images: {
          all: this.f('.ingredient-float-image'),
          image_1: this.f('.ingredient-float-image--1'),
          image_2: this.f('.ingredient-float-image--2'),
          image_3: this.f('.ingredient-float-image--3'),
          image_4: this.f('.ingredient-float-image--4'),
          image_5: this.f('.ingredient-float-image--5'),
          image_6: this.f('.ingredient-float-image--6'),
        }
      },
      floatUi: {
        wrap: this.f('.build-body--main-ui-wrap'),
        buttons: {
          right: this.f('.build-ui--variants-button--right'),
          left: this.f('.build-ui--variants-button--left')
        },
        variants: {
          wrap: this.f('.build-ui--variants-content'),
          all: this.f('.build-ui--variants--element'),
          variant_1: this.f('[data-variant-number="1"]'),
          variant_2: this.f('[data-variant-number="2"]'),
          variant_3: this.f('[data-variant-number="3"]'),
          variant_1_color: this.f('[data-variant-number="1"] div'),
        }
      },
      submitButton: this.f('.build-ui--submit-button'),
      chocoAnimation: {
        choco: $('.choco-animation'),
        venchik: $('.venchik-img')
      }
    };
  };

  this.bindListeners = function () {

    this.page.sliderBody.main.content.scene.element.on('click', _ => {
      this.addCurrentProductToBuild();
    });

    this.page.floatUi.variants.all.on('click', e => {

      if (this.addingIsLocked === true) {
        return null;
      }

      let target = $(e.target);

      let button = target.hasClass('build-ui--variants--element')
          ? target
          : target.parents('.build-ui--variants--element');

      switch (this.step) {

        case 1:
          this.parts.map(part => {
            if (button.attr('style') === `background-image: url('${part.img.inCart}')`) {
              this.result.parts = this.result.parts.filter(partFiltering => {
                return part.code !== partFiltering;
              })
            }
          });
          break;

        case 2:
          this.result.choco = null;
          break;

        case 3:
          this.page.floatExampleResult.wrap.attr('style', '');
          this.result.color = null;
      }

      button
          .removeClass('filled')
          .attr('style', '')
          .find('div')
          .hide();

      if ($('.build-ui--variants--element.filled').length === 0 ||
          this.step === 3) {
        this.page.floatUi.buttons.right.addClass('disabled');
      }
    });

    this.page.floatUi.buttons.left.on('click', e => {
      this.stepBackward();
    });

    this.page.floatUi.buttons.right.on('click', e => {
      if ($(e.target).hasClass('disabled') ||
          this.addingIsLocked === true) {
        return null;
      }
      this.stepForward();
    });

    this.page.submitButton.on('click', _ => {
      this.submitBuild();
    });

    this.page.selectColorSlide.showMoreButton.on('click', _ => {
      this.page.selectColorSlide.showMoreButton.hide();
      this.page.selectColorSlide.elements.show();
    });

    this.page.selectColorSlide.elements.on('click', e => {
      this.selectChocoColor($(e.target));
    });

    this.page.sliderBody.main.content.directionButtonsWrap.both.on('click', e => {

      let button = $(e.target).hasClass('build-body--button-wrap')
          ? $(e.target)
          : $(e.target).parents('.build-body--button-wrap');

      switch (this.step) {
        case 1:
          this.fillProductsSlider(button.attr('data-product-code'));
          break;

        case 2:
          this.fillChocolateSlider(button.attr('data-product-code'));
      }
    });

    this.page.finalSlide.form.inputs.title.on('keyup', e => {
      this.result.title = $(e.target).val();
      this.page.resultChocolateTextWrap.title.text(this.result.title);
    });

    this.page.finalSlide.form.inputs.description.on('keyup', e => {
      this.result.description = $(e.target).val();
    });

    let categoriesSelect = () => {
      this.page.sliderBody.categories.categories.off();
      this.page.sliderBody.categories.categories.on('click', e => {
        this.changeProductsCategory($(e.target));
      });
    };

    return {categoriesSelect};
  };

  this.load = function () {

    {
      if (~location.href.indexOf('step=4')) {
        this.step = 4;
      } else if (~location.href.indexOf('step=3')) {
        this.step = 3;
      } else if (~location.href.indexOf('step=2')) {
        this.step = 2;
      } else {
        this.step = 1;
      }
    }

    this.loadByStep();
    this.fillStateFromRequest();
    this.fillFromState();

    stickFooter();
  };

  this.loadByStep = function () {
    switch (this.step) {

      case 1:
        this.page.cupBg.show();

        this.fillProductsSlider();

        this.page.sliderBody.categories.wrap.show();
        this.page.sliderBody.main.wrap.show();
        this.page.sliderBody.wrap.show();

        this.page.floatUi.buttons.left.hide();
        this.page.floatUi.buttons.right
            .addClass('disabled');

        this.page.floatUi.variants.all
            .removeClass('filled')
            .attr('style', '');

        this.page.floatUi.variants.variant_1.show();
        this.page.floatUi.variants.variant_2.show();
        this.page.floatUi.variants.variant_3.show();
        this.page.submitButton.text('Сохранить и продолжить');
        this.page.floatUi.variants.wrap.show();
        break;

      case 2:
        this.page.cupBg.show();

        this.page.container.removeClass('steps-3-4');

        this.page.selectColorSlide.wrap.hide();
        this.page.floatExampleResult.wrap.hide();
        this.page.sliderBody.categories.wrap.hide();

        this.fillChocolateSlider();

        if (this.isDemo) {
          this.page.sliderBody.main.title.html('Молочный шоколад');
          this.page.sliderBody.main.content
              .directionButtonsWrap.left.title.html('Тёмный <br> шоколад');
          this.page.sliderBody.main.content
              .directionButtonsWrap.right.title.html('Белый <br> шоколад');
        }

        this.page.sliderBody.wrap.removeClass('steps-3-4').show();
        this.page.sliderBody.main.wrap.show();

        this.page.floatUi.buttons.left.show();
        this.page.floatUi.buttons.right
            .addClass('disabled');

        this.page.floatUi.variants.all
            .removeClass('filled')
            .attr('style', '');

        this.page.floatExampleResult.images.all.hide();

        this.page.floatUi.variants.variant_1.show();
        this.page.floatUi.variants.variant_2.hide();
        this.page.floatUi.variants.variant_3.hide();

        this.page.submitButton.text('Сохранить и продолжить');
        this.page.floatUi.variants.wrap.show();
        break;

      case 3:
        this.page.cupBg.hide();

        this.page.container.addClass('steps-3-4');

        this.page.selectColorSlide.wrap.show();
        this.page.floatExampleResult.wrap.show();
        this.page.finalSlide.wrap.hide();

        this.page.sliderBody.main.wrap.hide();

        this.page.sliderBody.wrap
            .addClass('steps-3-4')
            .removeClass('step-4')
            .show();

        this.page.floatUi.buttons.left.show();
        this.page.floatUi.buttons.right
            .addClass('disabled');

        this.page.floatUi.variants.all
            .removeClass('filled')
            .attr('style', '');

        this.page.floatExampleResult.images.all.hide();

        this.page.floatUi.variants.variant_1.show();
        this.page.floatUi.variants.variant_2.hide();
        this.page.floatUi.variants.variant_3.hide();

        this.page.submitButton.text('Сохранить и продолжить');
        this.page.floatUi.variants.wrap.show();
        break;

      case 4:
        this.page.cupBg.hide();

        this.page.container.addClass('steps-3-4');

        this.page.selectColorSlide.wrap.hide();
        this.page.finalSlide.wrap.show();
        this.page.floatExampleResult.wrap.show();

        this.page.floatUi.buttons.left.show();
        this.page.floatUi.buttons.right
            .addClass('disabled')
            .hide();

        this.page.floatUi.variants.all
            .removeClass('filled')
            .attr('style', '');

        this.page.sliderBody.wrap
            .addClass('steps-3-4')
            .addClass('step-4')
            .show();

        this.page.floatExampleResult.images.all.hide();

        this.page.floatUi.variants.variant_1.hide();
        this.page.floatUi.variants.variant_2.hide();
        this.page.floatUi.variants.variant_3.hide();

        this.page.submitButton.text('Сохранить и создать свой блокбастер вкуса');
        this.page.floatUi.variants.wrap.hide();
    }

    this.page.floatUi.variants.variant_1
        .find('div')
        .hide();

    this.page.steps.circles.all.removeClass('circle-filled');
    this.page.steps.text.all.removeClass('step-selected');

    this.page.steps.circles[`number_${this.step}`].addClass('circle-filled');
    this.page.steps.text[`number_${this.step}`].addClass('step-selected');
    this.page.steps.wrap.show();

    this.page.floatUi.wrap.show();

    this.fillFromState();
    stickFooter();
  };

  this.addCurrentProductToBuild = function () {

    if (this.addingIsLocked === true) {
      return null;
    }

    let availableCellsLength = this.page.floatUi.variants.all
        .filter((index, variant) => {
          return !$(variant).hasClass('filled') &&
              $(variant).is(':visible');
        })
        .toArray().length;

    if (availableCellsLength === 0) {
      return null;
    }

    if (this.step === 1) {

      let ingredientsWithThisProduct = this.page.floatUi.variants.all
          .filter((index, variant) => {
            return $(variant).attr('style') ===
                `background-image: url('${this.firstStepState.currentProduct.img.inCart}')`
          });

      if (ingredientsWithThisProduct.length) {
        return null;
      }

      this.addingIsLocked = true;
      this.page.sliderBody.main.content.scene.element.addClass('in-cart');

      setTimeout(_ => {
        this.page.sliderBody.main.content.scene.element.attr('style',
            `background-image: url('${this.firstStepState.currentProduct.img.forAddNewAnimation}')`);
      }, 610);

      setTimeout(_ => {
        this.page.sliderBody.main.content.scene.element.attr('style',
            `background-image: url('${this.firstStepState.currentProduct.img.full}')`);
      }, 2640);

      this.result.parts.push(this.firstStepState.currentProduct.code);

      $(this.page.floatUi.variants.all
          .filter((index, variant) => !$(variant).hasClass('filled'))
          .toArray()[0]
      )
          .addClass('filled')
          .attr(
              'style',
              `background-image: url('${this.firstStepState.currentProduct.img.inCart}')`);

    } else {

      setTimeout(_ => {
        this.page.sliderBody.main.content.scene.element.attr('style',
            `background-image: url('${this.currentChocolate.img.forAddNewAnimation}')`);
      }, 610);

      setTimeout(_ => {
        this.page.sliderBody.main.content.scene.element.attr('style',
            `background-image: url('${this.currentChocolate.img.full}')`);
      }, 2640);

      $(this.page.floatUi.variants.all
          .filter((index, variant) => {
            return !$(variant).hasClass('filled') &&
                $(variant).is(':visible');
          })
          .toArray()[0]
      )
          .addClass('filled')
          .attr(
              'style',
              `background-image: url('${this.currentChocolate.img.inCart}')`);

      this.addingIsLocked = true;
      this.page.sliderBody.main.content.scene.element.addClass('in-cart');

      this.result.choco = this.currentChocolate.code;
    }

    setTimeout(_ => {
      this.addingIsLocked = false;
      this.page.sliderBody.main.content.scene.element.removeClass('in-cart');
      this.page.floatUi.buttons.right.removeClass('disabled')
    }, 3000);

  };

  this.stepBackward = function () {

    if (this.step === 1) {
      return null;
    }
    this.step--;
    this.loadByStep();
  };

  this.stepForward = function () {

    switch (this.step) {

      case 4:
        return null;

      case 2:

        if (window.innerWidth > 780) {

          this.addingIsLocked = true;

          this.page.sliderBody.main.wrap.hide();
          this.page.floatUi.wrap.hide();

          this.page.chocoAnimation.choco.css({display: 'block'});
          this.page.chocoAnimation.venchik.css({display: 'block'});

          this.page.chocoAnimation.choco.animate({
            opacity: 1
          }, 200);

          this.page.chocoAnimation.venchik.animate({
            opacity: 1
          }, 200);

          setTimeout(_ => {
            this.page.chocoAnimation.choco.animate({
              opacity: 0
            }, 300);

            this.page.chocoAnimation.venchik.animate({
              opacity: 0
            }, 300);
          }, 1680);

          setTimeout(_ => {
            this.page.chocoAnimation.choco.hide();
            this.page.chocoAnimation.venchik.hide();
          }, 1980);

          setTimeout(_ => {
            this.addingIsLocked = false;
            this.step++;
            this.loadByStep();
          }, 2000);

        } else {

          this.step++;
          this.loadByStep();
        }

        break;

      default:
        this.step++;
        this.loadByStep();
    }
  };

  this.fillProductsSlider = function (productCode) {

    this.page.sliderBody.main.wrap.removeClass('step-2');

    this.page.sliderBody.main.wrap.animate({opacity: 0}, 300);

    setTimeout(_ => {

      if (this.firstStepState.currentCategory === null) {
        this.categories.map(category => {
          if (~category.indexOf('рукты')) {
            this.firstStepState.currentCategory = category;
          }
        });
      }

      let currentCategoryParts = this.parts.filter(part => {
        return part.category === this.firstStepState.currentCategory;
      });

      if (currentCategoryParts.length === 0) {
        throw Error('Категория ингредиентов не может быть пустой');
      }

      let productInCategoryIndex;

      if (typeof productCode === 'undefined') {
        productInCategoryIndex = 0;
        this.firstStepState.currentProduct = currentCategoryParts[0];
      } else {
        currentCategoryParts.forEach((part, index) => {
          if (part.code === productCode) {
            this.firstStepState.currentProduct = part;
            productInCategoryIndex = index;
          }
        });
      }

      this.page.sliderBody.categories.select.html('');

      this.categories.map(category => {

        if (category === 'Шоколад') {
          return null;
        }

        let selectedClass = category === this.firstStepState.currentCategory
            ? 'categories-option--selected'
            : '';

        this.page.sliderBody.categories.select
            .append(`<div class="categories-option ${selectedClass}">${category}</div>`);
      });

      this.bindPageElements();
      this.listeners.categoriesSelect();

      this.page.sliderBody.main.title.html(this.firstStepState.currentProduct.title);

      this.page.sliderBody.main.content.scene.element.attr('style',
          `background-image: url('${this.firstStepState.currentProduct.img.full}')`);

      if (currentCategoryParts.length === 1) {

        this.page.sliderBody.main.content.directionButtonsWrap.left.wrap.hide();
        this.page.sliderBody.main.content.directionButtonsWrap.right.wrap.hide();

      } else if (currentCategoryParts.length >= 2) {

        let previousProductIndex = productInCategoryIndex === 0
            ? currentCategoryParts.length - 1
            : productInCategoryIndex - 1;

        let previousProduct = currentCategoryParts[previousProductIndex];

        this.page.sliderBody.main.content
            .directionButtonsWrap.left.title.html(previousProduct.title);
        this.page.sliderBody.main.content
            .directionButtonsWrap.left.image.attr('style',
            `background-image: url('${previousProduct.img.arrow}')`);

        this.page.sliderBody.main.content.directionButtonsWrap.left.wrap
            .attr('data-product-code', previousProduct.code)
            .show();

        if (currentCategoryParts.length === 2) {

          this.page.sliderBody.main.content
              .directionButtonsWrap.right.title.html(previousProduct.title);
          this.page.sliderBody.main.content
              .directionButtonsWrap.right.image.attr('style',
              `background-image: url('${previousProduct.img.arrow}')`);

          this.page.sliderBody.main.content.directionButtonsWrap.right.wrap
              .attr('data-product-code', previousProduct.code)
              .show();

        } else {

          let nextProductIndex = productInCategoryIndex === currentCategoryParts.length - 1
              ? 0
              : productInCategoryIndex + 1;

          let nextProduct = currentCategoryParts[nextProductIndex];

          this.page.sliderBody.main.content
              .directionButtonsWrap.right.title.html(nextProduct.title);
          this.page.sliderBody.main.content
              .directionButtonsWrap.right.image.attr('style',
              `background-image: url('${nextProduct.img.arrow}')`);

          this.page.sliderBody.main.content.directionButtonsWrap.right.wrap
              .attr('data-product-code', nextProduct.code)
              .show();
        }
      }

      this.page.sliderBody.main.wrap.animate({opacity: 1}, 300);

    }, 300);
  };

  this.fillChocolateSlider = function (productCode) {

    this.page.sliderBody.main.wrap.addClass('step-2');

    this.page.sliderBody.main.wrap.animate({opacity: 0}, 300);

    setTimeout(_ => {

      let currentCategoryParts = this.parts.filter(part => {
        return part.category === 'Шоколад';
      });

      let productInCategoryIndex;

      this.currentChocolate = null;

      if (typeof productCode === 'undefined') {
        productInCategoryIndex = 0;
        this.currentChocolate = currentCategoryParts[0];
      } else {
        currentCategoryParts.forEach((part, index) => {
          if (part.code === productCode) {
            this.currentChocolate = part;
            productInCategoryIndex = index;
          }
        });
      }

      this.page.sliderBody.main.title.html(this.currentChocolate.title);

      this.page.sliderBody.main.content.scene.element.attr('style',
          `background-image: url('${this.currentChocolate.img.full}')`);

      let previousProductIndex = productInCategoryIndex === 0
          ? currentCategoryParts.length - 1
          : productInCategoryIndex - 1;

      let previousProduct = currentCategoryParts[previousProductIndex];

      this.page.sliderBody.main.content
          .directionButtonsWrap.left.title.html(previousProduct.title);
      this.page.sliderBody.main.content
          .directionButtonsWrap.left.image.attr('style',
          `background-image: url('${previousProduct.img.arrow}')`);

      this.page.sliderBody.main.content.directionButtonsWrap.left.wrap
          .attr('data-product-code', previousProduct.code)
          .show();

      let nextProductIndex = productInCategoryIndex === currentCategoryParts.length - 1
          ? 0
          : productInCategoryIndex + 1;

      let nextProduct = currentCategoryParts[nextProductIndex];

      this.page.sliderBody.main.content
          .directionButtonsWrap.right.title.html(nextProduct.title);
      this.page.sliderBody.main.content
          .directionButtonsWrap.right.image.attr('style',
          `background-image: url('${nextProduct.img.arrow}')`);

      this.page.sliderBody.main.content.directionButtonsWrap.right.wrap
          .attr('data-product-code', nextProduct.code)
          .show();

      this.page.sliderBody.main.wrap.animate({opacity: 1}, 300);

    }, 300);
  };

  this.submitBuild = function () {

    this.page.finalSlide.form.inputs.ingredients.val(this.result.parts.join(';'));
    this.page.finalSlide.form.inputs.choco.val(this.result.choco);
    this.page.finalSlide.form.inputs.color.val(this.result.color);

    if (this.step !== 4) {

      if (!this.page.floatUi.buttons.right.hasClass('disabled')) {
        this.stepForward();
      }
    }

    /*
    $.ajax({
      url: '',
      data: {},
      success: _ => {},
      error: _ => {},
    });
     */
  };

  this.setIngredients = function () {

    const productsBlock = $('.product-info');

    let categories = [];
    let products = [];

    productsBlock.each((index, element) => {
      element = $(element);

      if (!~categories.indexOf(element.data('productCategory'))) {
        categories.push(element.data('productCategory'));
      }

      products.push({
        code: element.data('productCode'),
        title: element.data('productTitle'),
        category: element.data('productCategory'),
        img: {
          full: element.data('productImgFull'),
          float: element.data('productImgFloat'),
          forAddNewAnimation: element.data('productImgForAddAnimation'),
          arrow: element.data('productImgArrow'),
          inCart: element.data('productImgInCart'),
        }
      });
    });

    this.categories = categories;
    this.parts = products;
  };

  this.changeProductsCategory = function (category) {

    let selectedCategoryClass = 'categories-option--selected';

    if (category.hasClass(selectedCategoryClass)) {
      return false;
    }

    this.page.sliderBody.categories.categories.removeClass(selectedCategoryClass);

    category.addClass(selectedCategoryClass);
    this.firstStepState.currentCategory = category.text();
    this.fillProductsSlider();
  };

  this.selectChocoColor = function (colorBlock) {

    this.page.floatExampleResult.wrap.attr('style',
        `background-image: url('${colorBlock.attr('data-color-choco-image')}')`);

    this.page.floatUi.variants.variant_1_color
        .attr('style', colorBlock.attr('style'))
        .show();

    this.result.color = colorBlock.attr('data-color-code');

    if (~colorBlock.attr('style').indexOf('#FFF')) {
      this.page.resultChocolateTextWrap.wrap.css('color', 'black');
    } else {
      this.page.resultChocolateTextWrap.wrap.css('color', 'white');
    }

    this.page.floatUi.buttons.right.removeClass('disabled');
  };

  this.fillStateFromRequest = function () {

    if (typeof window.location.search !== 'string' ||
        window.location.search.trim() === '') {
      return null;
    }

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('parts[]')) {
      this.result.parts = urlParams.getAll('parts[]');
    }

    if (urlParams.has('choco')) {
      this.result.choco = urlParams.get('choco');
    }

    if (urlParams.has('color')) {
      this.result.color = urlParams.get('color');
    }

    if (urlParams.has('title')) {
      this.result.title = urlParams.get('title');
    }

    if (urlParams.has('description')) {
      this.result.description = urlParams.get('description');
    }

    this.result.parts.map(backendPart => {
      const thisPartChecked = this.parts
          .filter(part => part.code === backendPart)
          .length;

      if (thisPartChecked === 0) {
        this.result.parts.splice(~this.result.parts.indexOf(backendPart), 1);
      }
    });
  };

  this.fillFromState = function () {

    switch (this.step) {

      case 1:
        if (this.result.parts.length === 0) {
          return null;
        }
        this.result.parts.map((partCode, index) => {
          const thisPart = this.parts.filter(part => part.code === partCode)[0];
          this.page.floatUi.variants[`variant_${index + 1}`]
              .addClass('filled')
              .attr('style', `background-image: url('${thisPart.img.inCart}')`);

        });
        this.page.floatUi.buttons.right.removeClass('disabled');
        break;

      case 2:
        if (this.result.choco === null) {
          return null;
        }
        const thisChoco = this.parts.filter(part => part.code === this.result.choco)[0];
        this.page.floatUi.variants.variant_1
            .addClass('filled')
            .attr('style', `background-image: url('${thisChoco.img.inCart}')`);
        this.page.floatUi.buttons.right.removeClass('disabled');
        break;

      case 3:
        if (this.result.color === null) {
          return null;
        }

        this.page.floatUi.variants.variant_1
            .find('div')
            .attr('style', colorBlock.attr('style'));

        this.page.floatUi.buttons.right.removeClass('disabled');

        break;

      case 4:
        if (this.result.title !== null) {
          this.page.finalSlide.form.inputs.title.val(this.result.title);
          this.page.resultChocolateTextWrap.title.text(this.result.title);
        }
        if (this.result.description !== null) {
          this.page.finalSlide.form.inputs.description.val(this.result.description);
        }
    }

    if (this.step === 3 ||
        this.step === 4) {

      this.page.floatExampleResult.images.all.hide();

      this.result.parts.map((partCode, index) => {

        let part = this.parts.filter(filteringPart => filteringPart.code === partCode)[0];

        let order = index + 1;

        switch (order) {
          case 1:
            this.page.floatExampleResult.images.image_1.attr('style',
                `background-image: url('${part.img.float}')`).show();
            this.page.floatExampleResult.images.image_4.attr('style',
                `background-image: url('${part.img.float}')`).show();
            break;

          case 2:
            this.page.floatExampleResult.images.image_2.attr('style',
                `background-image: url('${part.img.float}')`).show();
            this.page.floatExampleResult.images.image_5.attr('style',
                `background-image: url('${part.img.float}')`).show();
            break;

          case 3:
            this.page.floatExampleResult.images.image_3.attr('style',
                `background-image: url('${part.img.float}')`).show();
            this.page.floatExampleResult.images.image_6.attr('style',
                `background-image: url('${part.img.float}')`).show();
        }
      });
    }

    if (this.result.choco !== null) {
      let thisChocolate = this.parts.filter(part => part.code === this.result.choco)[0];
      this.page.resultChocolateTextWrap.description.text(thisChocolate.title.replace('<br>', ''));

      const colorBlock = $(`[data-color-code="${this.result.color}"]`);

      this.page.floatExampleResult.wrap.attr('style',
          `background-image: url('${colorBlock.attr('data-color-choco-image')}')`);

      if (~colorBlock.attr('style').indexOf('#FFF')) {
        this.page.resultChocolateTextWrap.wrap.css('color', 'black');
      } else {
        this.page.resultChocolateTextWrap.wrap.css('color', 'white');
      }
    }
  };

  this.showFloatingParts = function () {

  };
}

