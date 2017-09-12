$(document).ready(function() {
    var myColors = [
        "green", "red", "blue", "orange", "pink", "darkblue", "red"
    ];
    $("div.relevant p").each(function() {
        $(this).hide();
    });
    var i = 0;
    $("div.relevant p").each(function() {
        $(this).css('color', myColors[i]);
        i++;
        i = (i + 1) % myColors.length;
        console.log(myColors[i]);
        $(this).fadeIn();
     });

});

    