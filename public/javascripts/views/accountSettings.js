/**
 * Page view for viewing / changing settings of current account
 */

(function ($, _, Backbone) {

  "use strict";

  cantas.views.accountSettingsView = cantas.views.BaseView.extend({
    events: {
    },

    template: jade.compile($("#template-account-settings-view").text()),

    initialize: function () {
      // no models to listen too
    },

    render: function (context) {
      cantas.setTitle(this.options.title);

      this.$el.html(this.template({
        header: this.options.title,
        username: cantas.user.username
      }));

      var _this = this;
      _this.renderUploadAvatar();

      _this.avatarupload = _this.$el.find('#attachmentUpload').fileupload({
        autoUpload: false,
        url: '/avatar/upload',
        maxFileSize: 500000, // 500kb
        minFileSize: 1,
        dataType: 'json',
        messages: {
          maxFileSize: 'File is too large, the maximum size is 500KB',
          minFileSize: 'File is too small, the minimum size is 1B'
        }
      }).on('fileuploadadd', function(err, data) {
        var newUploadingAvatarView = new cantas.views.accountUploadingAvatarView({
          'data': data,
          'parentView': this
        });
        data.context = newUploadingAvatarView.render().$el;
        var uploadTableEl = _this.$('.js-attachment-upload-table');
        if (uploadTableEl.find('tbody tr').length === 0) {
          uploadTableEl.prepend(
            '<thead><tr><th>Preview</th><th>File Name</th><th>Size</th></tr></thead>'
          );
        }
        _this.$('.js-attachment-upload-table tbody').append(data.context);
      }).on('fileuploadprocessalways', function (err, data) {
        var file = data.files[0];
        if (file.preview) {
          data.context.find('.upload-preview').append(file.preview);
        }
        if (file.error) {
          data.context.find('.upload-control').append($('<p>', {
            'class': 'upload-errormessage',
            'text': file.error
          })).find('.upload-errormessage').prepend($('<span>', {
            'class': 'label label-important',
            'text': 'Error'
          }));
        }
        data.context.find('.js-upload-start').text('Attach').prop('disabled', !!file.error);
      }).on('fileuploadprogress', function (e, data) {
        var progress = Math.floor(data.loaded / data.total * 100);
        data.context.find('.js-upload-progress').prop('aria-valuenow', progress)
          .find('.bar').css('width', progress + '%');
      }).on('fileuploaddone', function (e, data) {
        data.context.find('.upload-errormessage').remove();
        if (data.result.user_error) {
          _this.reportUploadError(data.context, data.result.user_error);
          throw new Error(data.result.maintainer_error);
        } else {
          data.context.find('.js-upload-abort').text('Finished').prop('disabled', true);
          data.context.fadeOut().remove();
          var uploadTableEl = _this.$('.js-attachment-upload-table');
          if (uploadTableEl.find('tbody tr').length === 0) {
            uploadTableEl.find('thead').remove();
          }
          var newAttachment = new cantas.models.Attachment(data.result.attachment);
          newAttachment.save();
        }
      }).on('fileuploadfail', function (e, data) {
        data.context.find('.upload-errormessage').remove();
        if (data.errorThrown !== 'abort') {
          _this.reportUploadError(data.context, 'Uploading attachment failed');
        }
      }).on('fileuploadsubmit', function (e, data) {
        if (data.files[0].size === 0) {
          _this.reportUploadError(data.context, 'Uploading attachment failed');
          data.context.find('.js-upload-start')[0].setAttribute('disabled', 'disabled');
          return false;
        }
      });

      return this;
    },

    close: function() {
      this.remove();
    },

    remove: function() {
      this.undelegateEvents();
      this.$el.empty();
      this.stopListening();
      return this;
    },

    renderUploadAvatar: function() {
      // reference CardDetailsView
      this.uploadAvatarView = new cantas.views.accountUploadAvatarView({
        el: this.$el.find('section.avatar')
      });
      this.uploadAvatarView.render();
    }
  });

  cantas.views.accountUploadAvatarView = cantas.views.BaseView.extend({
    template: jade.compile($('#template-account-upload-avatar-view').text()),

    initialize: function () {
      // no models to listen too
    },

    render: function (context) {
      this.$el.html(this.template({
      }));
      // reference AttachmentView
      return this;
    },

    close: function() {
      this.remove();
    },

    remove: function() {
      this.undelegateEvents();
      this.$el.empty();
      this.stopListening();
      return this;
    }
  });

  cantas.views.accountUploadingAvatarView = cantas.views.BaseView.extend({
    template: jade.compile($('#template-account-uploading-avatar-view').text()),

    events: {
      'click .js-upload-start': 'startUpload',
      'click .js-upload-abort': 'abortUpload',
      'click .js-upload-delete': 'deleteUpload'
    },

    initialize: function () {
      // no models to listen too
    },

    render: function (context) {
      this.$el.html(this.template({
        name: this.data.files[0].name,
        fileSize: cantas.utils.formatFileSize(this.data.files[0].size)
      }));

      return this;
    },

    startUpload: function(event) {
      event.stopPropagation();

      this.options.data.submit();
      $(event.target).removeClass('js-upload-start').addClass('js-upload-abort').text('Abort');
    },

    abortUpload: function(event) {
      event.stopPropagation();

      this.options.data.abort();
      $(event.target).removeClass('js-upload-abort').addClass('js-upload-start').text('Attach');
      $(event.target).closest('tr.js-template-upload').children('td.upload-size')
        .find('.js-upload-progress').prop('aria-valuenow', 0)
        .find('.bar').css('width', '0' + '%');
    },

    deleteUpload: function(event) {
      event.stopPropagation();

      this.options.data.abort();

      var uploadTableEl = this.options.parentView.$el.find('.js-attachment-upload-table');
      if (uploadTableEl.find('tbody tr').length === 1) {
        uploadTableEl.find('thead').remove();
      }

      this.close();
    },

    close: function() {
      this.remove();
    },

    remove: function() {
      this.undelegateEvents();
      this.$el.empty();
      this.stopListening();
      return this;
    }
  });

}(jQuery, _, Backbone));