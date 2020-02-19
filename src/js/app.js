import "../css/entry.scss"
import $ from 'jquery'
import {initDevState} from "./dev";
import '../img/common/mondelez.png';

$(document).ready(_ => {
  initDevState();
});

$(window).load($('body').css({
  opacity: 1
}));

