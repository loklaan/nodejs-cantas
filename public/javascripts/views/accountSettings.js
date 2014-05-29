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
    },

    render: function (context) {
      _this = this;
      $.when(this.$el.html(this.template({
        header: this.options.title,
        username: cantas.user.username
      }))).done(function () {
        cantas.setTitle(this.options.title);

        // initialise avatar upload(ing) views
        // reference CardDetailsView

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
    },

    renderUploadingAvatar: function() {
      // reference CardDetailsView
    }
  });

  cantas.views.accountUploadAvatarView = cantas.views.BaseView.extend({
    template: jade.compile($('#template-account-upload-avatar-view').text())

    initialize: function () {
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
    template: jade.compile($('#template-account-uploading-avatar-view').text())

    initialize: function () {
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

}(jQuery, _, Backbone));