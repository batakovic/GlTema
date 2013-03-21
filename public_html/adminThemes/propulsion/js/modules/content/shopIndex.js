$(function () {

$("#productHolder").html('');
$(".displaygroup").each(function(){
    $(this).hide();
    var fildset = $(this).find('fieldset');
    var fieldId = $(fildset).get(0).id;
    var heading = $(this).attr('groupname');
    var html = "<div class='fl well' style='width:200px; height:150px; margin:10px 5px 10px 5px;'><div style='width:100%; height:120px; text-align:center'><h4>"+ heading +"\n\
            </h4></div><div style='width:100%; height:30px; text-align:center'><input class='showProduct' type='radio' name='selectedGroup' value='"+fieldId+"'></div></div>";
    $("#productHolder").append(html);
});
$('.actionDisplayGroup').hide();
  
  $("input[name='selectedGroup']").change(function(){
    $('.formHolder').show();
    $(".active").hide();  
    $(".active").removeClass('active');
    var parentDiv = $("#"+$(this).val()).parent();
    parentDiv.addClass('active');
    parentDiv.show();
    $('#activeDisplayGroup').val(parentDiv.attr('groupname'));
    $('.actionDisplayGroup').show();
});
  
})