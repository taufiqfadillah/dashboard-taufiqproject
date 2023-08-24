$(document).ready(function () {
  $('#change-password').focus(function () {
    $('#popover-password').show();
  });

  $('#change-password').blur(function () {
    $('#popover-password').hide();
  });

  $('#change-password').keyup(function () {
    var password = $('#change-password').val();
    if (checkStrength(password) == false) {
      $('#sign-up').attr('disabled', true);
    }
  });

  $('#confirm-password').blur(function () {
    if ($('#change-password').val() !== $('#confirm-password').val()) {
      $('#popover-cpassword').removeClass('hide');
      $('#sign-up').attr('disabled', true);
    } else {
      $('#popover-cpassword').addClass('hide');
    }
  });

  $('input[type="reset"]').click(function () {
    $('#validateForm')[0].reset();
    $('.form-group i').removeClass('fa-check').addClass('fa-times');
    $('.form-group').removeClass('text-success');
    $('#change-password-strength').removeClass('progress-bar-warning progress-bar-success').addClass('progress-bar-danger');
    $('#popover-password-top').removeClass('hide');
  });

  function checkStrength(password) {
    var strength = 0;

    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      strength += 1;
      $('.low-upper-case').addClass('text-success');
      $('.low-upper-case i').removeClass('fa-times').addClass('fa-check');
      $('#popover-password-top').addClass('hide');
    } else {
      $('.low-upper-case').removeClass('text-success');
      $('.low-upper-case i').addClass('fa-times').removeClass('fa-check');
      $('#popover-password-top').removeClass('hide');
    }

    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) {
      strength += 1;
      $('.one-number').addClass('text-success');
      $('.one-number i').removeClass('fa-times').addClass('fa-check');
      $('#popover-password-top').addClass('hide');
    } else {
      $('.one-number').removeClass('text-success');
      $('.one-number i').addClass('fa-times').removeClass('fa-check');
      $('#popover-password-top').removeClass('hide');
    }

    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
      strength += 1;
      $('.one-special-char').addClass('text-success');
      $('.one-special-char i').removeClass('fa-times').addClass('fa-check');
      $('#popover-password-top').addClass('hide');
    } else {
      $('.one-special-char').removeClass('text-success');
      $('.one-special-char i').addClass('fa-times').removeClass('fa-check');
      $('#popover-password-top').removeClass('hide');
    }

    if (password.length > 7) {
      strength += 1;
      $('.eight-character').addClass('text-success');
      $('.eight-character i').removeClass('fa-times').addClass('fa-check');
      $('#popover-password-top').addClass('hide');
    } else {
      $('.eight-character').removeClass('text-success');
      $('.eight-character i').addClass('fa-times').removeClass('fa-check');
      $('#popover-password-top').removeClass('hide');
    }

    if (strength < 2) {
      $('#result').removeClass();
      $('#change-password-strength').addClass('progress-bar-danger');

      $('#result').addClass('text-danger').text('Very Week');
      $('#change-password-strength').css('width', '10%');
    } else if (strength == 2) {
      $('#result').addClass('good');
      $('#change-password-strength').removeClass('progress-bar-danger');
      $('#change-password-strength').addClass('progress-bar-warning');
      $('#result').addClass('text-warning').text('Week');
      $('#change-password-strength').css('width', '60%');
      return 'Week';
    } else if (strength == 4) {
      $('#result').removeClass();
      $('#result').addClass('strong');
      $('#change-password-strength').removeClass('progress-bar-warning');
      $('#change-password-strength').addClass('progress-bar-success');
      $('#result').addClass('text-success').text('Strength');
      $('#change-password-strength').css('width', '100%');

      return 'Strong';
    }
  }
});
