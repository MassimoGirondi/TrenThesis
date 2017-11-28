function showModal(id) {
  $(id).show();
  $(id).on("click", function(event) {
    if ($(event.target).hasClass("modal"))
      $(this).hide();
  });
}
