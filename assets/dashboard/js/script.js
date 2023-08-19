/*! -----------------------------------------------------------------------------------

    Template Name: Cuba Admin
    Template URI: http://admin.pixelstrap.com/cuba/theme
    Description: This is Admin theme
    Author: Pixelstrap
    Author URI: https://themeforest.net/user/pixelstrap

-----------------------------------------------------------------------------------

        01. password show hide
        02. Background Image js
        03. sidebar filter
        04. Language js
        05. Translate js

 --------------------------------------------------------------------------------- */

(function ($) {
  'use strict';
  $(document).on('click', function (e) {
    var outside_space = $('.outside');
    if (!outside_space.is(e.target) && outside_space.has(e.target).length === 0) {
      $('.menu-to-be-close').removeClass('d-block');
      $('.menu-to-be-close').css('display', 'none');
    }
  });

  $('.prooduct-details-box .close').on('click', function (e) {
    var tets = $(this).parent().parent().parent().parent().addClass('d-none');
    console.log(tets);
  });

  if ($('.page-wrapper').hasClass('horizontal-wrapper')) {
    $('.sidebar-list').hover(
      function () {
        $(this).addClass('hoverd');
      },
      function () {
        $(this).removeClass('hoverd');
      }
    );
    $(window).on('scroll', function () {
      if ($(this).scrollTop() < 600) {
        $('.sidebar-list').removeClass('hoverd');
      }
    });
  }

  /*----------------------------------------
     password show hide
     ----------------------------------------*/
  $('.show-hide').show();
  $('.show-hide span').addClass('show');

  $('.show-hide span').click(function () {
    if ($(this).hasClass('show')) {
      $('input[name="login[password]"]').attr('type', 'text');
      $(this).removeClass('show');
    } else {
      $('input[name="login[password]"]').attr('type', 'password');
      $(this).addClass('show');
    }
  });
  $('form button[type="submit"]').on('click', function () {
    $('.show-hide span').addClass('show');
    $('.show-hide').parent().find('input[name="login[password]"]').attr('type', 'password');
  });

  /*=====================
      02. Background Image js
      ==========================*/
  $('.bg-center').parent().addClass('b-center');
  $('.bg-img-cover').parent().addClass('bg-size');
  $('.bg-img-cover').each(function () {
    var el = $(this),
      src = el.attr('src'),
      parent = el.parent();
    parent.css({
      'background-image': 'url(' + src + ')',
      'background-size': 'cover',
      'background-position': 'center',
      display: 'block',
    });
    el.hide();
  });

  $('.mega-menu-container').css('display', 'none');
  $('.header-search').click(function () {
    $('.search-full').addClass('open');
  });
  $('.close-search').click(function () {
    $('.search-full').removeClass('open');
    $('body').removeClass('offcanvas');
  });
  $('.mobile-toggle').click(function () {
    $('.nav-menus').toggleClass('open');
  });
  $('.mobile-toggle-left').click(function () {
    $('.left-header').toggleClass('open');
  });
  $('.bookmark-search').click(function () {
    $('.form-control-search').toggleClass('open');
  });
  $('.filter-toggle').click(function () {
    $('.product-sidebar').toggleClass('open');
  });
  $('.toggle-data').click(function () {
    $('.product-wrapper').toggleClass('sidebaron');
  });
  $('.form-control-search input').keyup(function (e) {
    if (e.target.value) {
      $('.page-wrapper').addClass('offcanvas-bookmark');
    } else {
      $('.page-wrapper').removeClass('offcanvas-bookmark');
    }
  });
  $('.search-full input').keyup(function (e) {
    console.log(e.target.value);
    if (e.target.value) {
      $('body').addClass('offcanvas');
    } else {
      $('body').removeClass('offcanvas');
    }
  });

  $('body').keydown(function (e) {
    if (e.keyCode == 27) {
      $('.search-full input').val('');
      $('.form-control-search input').val('');
      $('.page-wrapper').removeClass('offcanvas-bookmark');
      $('.search-full').removeClass('open');
      $('.search-form .form-control-search').removeClass('open');
      $('body').removeClass('offcanvas');
    }
  });
  $('.mode').on('click', function () {
    const bodyModeDark = $('body').hasClass('dark-only');

    if (!bodyModeDark) {
      $('.mode').addClass('active');
      localStorage.setItem('mode', 'dark-only');
      $('body').addClass('dark-only');
      $('body').removeClass('light');
    }
    if (bodyModeDark) {
      $('.mode').removeClass('active');
      localStorage.setItem('mode', 'light');
      $('body').removeClass('dark-only');
      $('body').addClass('light');
    }
  });
  $('body').addClass(localStorage.getItem('mode') ? localStorage.getItem('mode') : 'light');
  $('.mode').addClass(localStorage.getItem('mode') === 'dark-only' ? 'active' : ' ');

  // sidebar filter
  $('.md-sidebar .md-sidebar-toggle ').on('click', function (e) {
    $('.md-sidebar .md-sidebar-aside ').toggleClass('open');
  });
})(jQuery);

$('.loader-wrapper').fadeOut('slow', function () {
  $(this).remove();
});

$(window).on('scroll', function () {
  if ($(this).scrollTop() > 600) {
    $('.tap-top').fadeIn();
  } else {
    $('.tap-top').fadeOut();
  }
});

$('.tap-top').click(function () {
  $('html, body').animate(
    {
      scrollTop: 0,
    },
    600
  );
  return false;
});
(function ($, window, document, undefined) {
  'use strict';
  var $ripple = $('.js-ripple');
  $ripple.on('click.ui.ripple', function (e) {
    var $this = $(this);
    var $offset = $this.parent().offset();
    var $circle = $this.find('.c-ripple__circle');
    var x = e.pageX - $offset.left;
    var y = e.pageY - $offset.top;
    $circle.css({
      top: y + 'px',
      left: x + 'px',
    });
    $this.addClass('is-active');
  });
  $ripple.on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function (e) {
    $(this).removeClass('is-active');
  });
})(jQuery, window, document);

// active link

$('.chat-menu-icons .toogle-bar').click(function () {
  $('.chat-menu').toggleClass('show');
});

// Language
var tnum = 'en';

$(document).ready(function () {
  if (localStorage.getItem('primary') != null) {
    var primary_val = localStorage.getItem('primary');
    $('#ColorPicker1').val(primary_val);
    var secondary_val = localStorage.getItem('secondary');
    $('#ColorPicker2').val(secondary_val);
  }

  $(document).click(function (e) {
    $('.translate_wrapper, .more_lang').removeClass('active');
  });
  $('.translate_wrapper .current_lang').click(function (e) {
    e.stopPropagation();
    $(this).parent().toggleClass('active');

    setTimeout(function () {
      $('.more_lang').toggleClass('active');
    }, 5);
  });

  /*TRANSLATE*/
  translate(tnum);

  $('.more_lang .lang').click(function () {
    $(this).addClass('selected').siblings().removeClass('selected');
    $('.more_lang').removeClass('active');

    var i = $(this).find('i').attr('class');
    var lang = $(this).attr('data-value');
    var tnum = lang;
    translate(tnum);

    $('.current_lang .lang-txt').text(lang);
    $('.current_lang i').attr('class', i);
  });
});

function translate(tnum) {
  $('.lan-1').text(trans[0][tnum]);
  $('.lan-2').text(trans[1][tnum]);
  $('.lan-3').text(trans[2][tnum]);
  $('.lan-4').text(trans[3][tnum]);
  $('.lan-5').text(trans[4][tnum]);
  $('.lan-6').text(trans[5][tnum]);
  $('.lan-7').text(trans[6][tnum]);
  $('.lan-8').text(trans[7][tnum]);
  $('.lan-9').text(trans[8][tnum]);
  $('.lan-10').text(trans[9][tnum]);
  $('.lan-11').text(trans[10][tnum]);
  $('.lan-12').text(trans[11][tnum]);
  $('.lan-13').text(trans[12][tnum]);
  $('.lan-14').text(trans[13][tnum]);
  $('.lan-15').text(trans[14][tnum]);
  $('.lan-16').text(trans[15][tnum]);
  $('.lan-17').text(trans[16][tnum]);
}

var trans = [
  {
    en: 'General',
    id: 'Umum',
  },
  {
    en: 'Dashboards,widgets & layout.',
    id: 'Dasboard, widget & tata letak.',
  },
  {
    en: 'Dashboards',
    id: 'Dasboard',
  },
  {
    en: 'Default',
    id: 'Dasar',
  },
  {
    en: 'Ecommerce',
    id: 'E-commerce',
  },
  {
    en: 'Widgets',
    id: 'Widget',
  },
  {
    en: 'Page layout',
    id: 'Tata Letak Halaman',
  },
  {
    en: 'Applications',
    id: 'Aplikasi',
  },
  {
    en: 'Ready to use Apps',
    id: 'Aplikasi Siap Dipakai',
  },
  {
    en: 'Blog',
    id: 'Artikel',
  },
  {
    en: 'Blog Details',
    id: 'Detail Artikel',
  },
  {
    en: 'Blog Single',
    id: 'Artikel Utama',
  },
  {
    en: 'Add Post',
    id: 'Tambahkan Postingan',
  },
  {
    en: 'Users',
    id: 'Pengguna',
  },
  {
    en: 'Users Profile',
    id: 'Tampilan Pengguna',
  },
  {
    en: 'Users Edit',
    id: 'Edit Pengguna',
  },
  {
    en: 'File Manager',
    id: 'Berkas',
  },
  {
    en: 'Chat',
    id: 'Obrolan',
  },
  {
    en: 'Chat App',
    id: 'Aplikasi Obrolan',
  },
  {
    en: 'Video Chat',
    id: 'Obrolan Video',
  },
  {
    en: 'To-Do',
    id: 'Agenda',
  },
];

$('.mobile-title svg').click(function () {
  $('.header-mega').toggleClass('d-block');
});

$('.onhover-dropdown').on('click', function () {
  $(this).children('.onhover-show-div').toggleClass('active');
});

$('#flip-btn').click(function () {
  $('.flip-card-inner').addClass('flipped');
});

$('#flip-back').click(function () {
  $('.flip-card-inner').removeClass('flipped');
});

// FullScreen
function toggleFullScreen() {
  if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}

// <!-- Change Image -->
const userImage = document.getElementById('userImage');
const editImageIcon = document.getElementById('editImageIcon');
const imageInput = document.getElementById('imageInput');

editImageIcon.addEventListener('click', () => {
  imageInput.click();
});

imageInput.addEventListener('change', (event) => {
  const selectedImage = event.target.files[0];
  if (selectedImage) {
    const reader = new FileReader();
    reader.onload = () => {
      userImage.src = reader.result;
    };
    reader.readAsDataURL(selectedImage);
  }
});

// <!-- Text Area 2000 -->
const bioTextarea = document.getElementById('bioTextarea');
const wordCountDisplay = document.getElementById('wordCount');
const maxLength = 2000;

bioTextarea.addEventListener('input', () => {
  const remainingCharacters = maxLength - bioTextarea.value.length;
  wordCountDisplay.textContent = `Remaining characters: ${remainingCharacters}`;
});

flatpickr('[data-flatpickr]', {
  dateFormat: 'd-m-Y',
  locale: 'id',
});
