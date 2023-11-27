$('#flexSwitchCheckDefault').change(function() {
    if ($(this).is(':checked')) {
        $('html').attr('data-bs-theme', 'dark');
    } else {
        $('html').attr('data-bs-theme', 'light');
    }
});