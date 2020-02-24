import $ from 'jquery';
import {stickFooter} from './app'

export function BlockbusterBuilder() {

  this.f = function (string) {
    return this.wrap.find(string);
  };

  this.init = function () {
    this.initState();
    this.bindPageElements();
    this.load();
    this.bindListeners();
  };

  this.initState = function () {
    this.step = null;
    this.addingIsLocked = false;
    this.isDemo =
        ~location.href.indexOf('localhost') ||
        ~location.href.indexOf('.world');
  };

  this.bindPageElements = function () {
    this.wrap = $('.build-content');
    this.page = {
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
          categories: this.f('.categories-select'),
        },
        main: {
          wrap: this.f('.build-body--main'),
          title: this.f('.build-body--title'),
          content: {
            directionButtonsWrap: {
              wrap: this.f('.build-body--direction-buttons-wrap'),
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
        }
      },
      submitButton: this.f('.build-ui--submit-button')
    };
  };

  this.bindListeners = function () {

    this.page.sliderBody.main.content.scene.element.on('click', _ => {
      this.addCurrentProductToBuild();
    });

    this.page.floatUi.variants.all.on('click', e => {
      $(e.target)
          .removeClass('filled')
          .attr('style', '');
    });

    this.page.floatUi.buttons.left.on('click', _ => {
      this.stepBackward();
    });


    this.page.floatUi.buttons.right.on('click', _ => {
      this.stepForward();
    });

    this.page.submitButton.on('click', _ => {
      this.submitBuild();
    });
  };

  this.load = function () {
    // Set step.
    {
      if (~location.href.indexOf('?step=4')) {
        this.step = 4;
      } else if (~location.href.indexOf('?step=3')) {
        this.step = 3;
      } else if (~location.href.indexOf('?step=2')) {
        this.step = 2;
      } else {
        this.step = 1;
      }
    }

    this.loadByStep();

    // Fill by GET params.
    {

    }

    // Show elements, for any step
    {
      this.page.steps.circles[`number_${this.step}`].addClass('circle-filled');
      this.page.steps.text[`number_${this.step}`].addClass('step-selected');
      this.page.steps.wrap.show();

      this.page.floatUi.wrap.show();
    }

    stickFooter();
  };

  this.loadByStep = function () {
    switch (this.step) {

      case 1:
        this.page.cupBg.show();

        if (this.isDemo) {
          this.page.sliderBody.main.title.html('Клубника');
          this.page.sliderBody.main.content
              .directionButtonsWrap.left.title.html('Апельсин');
          this.page.sliderBody.main.content
              .directionButtonsWrap.right.title.html('Малина');
        }

        this.page.sliderBody.categories.wrap.show();
        this.page.sliderBody.main.wrap.show();
        this.page.sliderBody.wrap.show();

        this.page.floatUi.buttons.left.hide();
        this.page.floatUi.buttons.right.show();

        this.page.floatUi.variants.variant_1.show();
        this.page.floatUi.variants.variant_2.show();
        this.page.floatUi.variants.variant_3.show();
        this.page.submitButton.text('Сохранить прогресс');
        this.page.floatUi.variants.wrap.show();
        break;

      case 2:
        this.page.cupBg.show();

        if (this.isDemo) {
          this.page.sliderBody.main.title.html('Молочный шоколад');
          this.page.sliderBody.main.content
              .directionButtonsWrap.left.title.html('Тёмный <br> шоколад');
          this.page.sliderBody.main.content
              .directionButtonsWrap.right.title.html('Белый <br> шоколад');
        }

        this.page.sliderBody.main.wrap.show();

        this.page.floatUi.buttons.left.show();
        this.page.floatUi.buttons.right.show();

        this.page.floatUi.variants.all
            .removeClass('filled')
            .attr('style', '');

        this.page.floatUi.variants.variant_1.show();
        this.page.floatUi.variants.variant_2.hide();
        this.page.floatUi.variants.variant_3.hide();

        this.page.submitButton.text('Сохранить прогресс');
        this.page.floatUi.variants.wrap.show();
        break;

      case 3:
        this.page.cupBg.hide();

        this.page.selectColorSlide.wrap.show();
        this.page.floatExampleResult.wrap.show();

        this.page.sliderBody.categories.wrap.hide();
        this.page.sliderBody.main.wrap.hide();
        this.page.sliderBody.wrap.show();

        this.page.floatUi.buttons.left.show();
        this.page.floatUi.buttons.right.show();

        this.page.submitButton.text('Сохранить прогресс');
        this.page.floatUi.variants.wrap.show();
        break;

      case 4:
        this.page.cupBg.hide();

        this.page.floatUi.buttons.left.show();
        this.page.floatUi.buttons.right.hide();

        this.page.submitButton.text('Сохранить и создать свой блокбастер вкуса');
        this.page.floatUi.variants.wrap.hide();
    }
  };

  this.addCurrentProductToBuild = function () {

    let ingredientsWithThisProduct = this.page.floatUi.variants.all
        .filter((index, variant) => {
          return $(variant).attr('style') ===
              `background-image: url('${this.page.sliderBody.main.content.scene.element.attr('data-small-img')}')`
        });

    if (ingredientsWithThisProduct.length ||
        this.addingIsLocked === true) {
      return true;
    }

    this.addingIsLocked = true;
    this.page.sliderBody.main.content.scene.element.addClass('in-cart');

    $(this.page.floatUi.variants.all
        .filter((index, variant) => !$(variant).hasClass('filled'))
        .toArray()[0]
    )
        .addClass('filled')
        .attr(
        'style',
        `background-image: url('${this.page.sliderBody.main.content.scene.element.attr('data-small-img')}')`);

    setTimeout(_ => {
      this.addingIsLocked = false;
      this.page.sliderBody.main.content.scene.element.removeClass('in-cart');
    }, 2000);
  };

  this.stepBackward = function () {

    if (this.step === 1) {
      return null;
    }
    this.step--;
    this.loadByStep();
  };

  this.stepForward = function () {

    if (this.step === 4) {
      return null;
    }
    this.step++;
    this.loadByStep();
  };

  this.submitBuild = function () {

    if (this.step !== 4) {
      return this.saveUncompletedResult();
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

  this.saveUncompletedResult = function () {

    /*
    $.ajax({
      url: '',
      data: {},
      success: _ => {},
      error: _ => {},
    });
     */

    this.wrap.animate({
      opacity: 0,
    }, 400);

    setTimeout(_ => {
      location.href = '/lk';
    }, 500);
  };
}

