var DropzoneExample = (function () {
  var DropzoneDemos = function () {
    Dropzone.options.singleFileUpload = {
      paramName: 'image',
      url: 'add-post',
      maxFiles: 1,
      maxFilesize: 5,
      addRemoveLinks: true,
      init: function () {
        this.on('success', function (file, response) {
          console.log('File uploaded:', file.name);
          console.log('Response:', response);
        });
      },
    };
  };
  return {
    init: function () {
      DropzoneDemos();
    },
  };
})();
DropzoneExample.init();
