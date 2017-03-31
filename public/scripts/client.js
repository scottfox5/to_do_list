$(function(){

getTasks();

  $('#task-form').on('click', '#addTask', addTask);
  $('#task-table').on('change', '#checkIt', updateCheck);
  $('#task-table').on('click', '.update', updateTask);
  $('#task-table').on('click', '.delete', deleteTask);

});

function getTasks() {
  $.ajax({
    url: '/tasks',
    type: 'GET',
    success: displayTasks
  });
}

function displayTasks(tasks){

    $('#table-body').empty();

    tasks.forEach(function(task){

    var $tableRow = $('<tr></tr>');

    if (task.complete == true){
      var $checkBox = $(('<td><input id="checkIt" type="checkbox" name="complete" value="false" checked/></td>'));
      $checkBox.data('id', task.id);
      $tableRow.append($checkBox);
    } else {
      var $checkBox = $(('<td><input id="checkIt" type="checkbox" name="complete" value="true"/></td>'));
      $checkBox.data('id', task.id);
      $tableRow.append($checkBox);
    }

    $tableRow.append('<td><input class="focus editFields" type="text" name="task" value="' + task.task +'"/></td>');
    $tableRow.append('<td><input class="focus editFields" type="text" name="notes" value="' + task.notes + '"/></td>');

    var $now = $.now();
    var time = $now.toLocaleDateString;
    if (task.update == null) {
      $tableRow.append('<td id="theDate">' + $now + '</td>');
    } else {
      $tableRow.append('<td id="theDate">' + task.updated + '</td>');
    }

    var $updateButton = $('<td><button class="update btn btn-outline-success btn-sm"><i class="fa fa-pencil" aria-hidden="true"></i></button></td>');
    $updateButton.data('id', task.id);
    $tableRow.append($updateButton);

    var $deleteButton = $('<td><button class="delete btn btn-outline-danger btn-sm"><i class="fa fa-trash" aria-hidden="true"></i></button></td>');
    $deleteButton.data('id', task.id);
    $tableRow.append($deleteButton);

    console.log($('#checkIt').attr('value'));

    $('#task-table').append($tableRow);

    $("[value=false]").parent().siblings().find('input').css({'text-decoration': 'line-through', 'color': 'lightgray'});

  });
}

function addTask(event) {

  var $form = $('#task-form')[0];

  if($form.checkValidity()) { // checking input fields for required text
    event.preventDefault();
    var formData = $('#task-form').serialize();

    $.ajax({
      url: '/tasks',
      type: 'POST',
      data: formData,
      success: getTasks
    });
    swal("Great!", "You added a task!", "success")

  } else {
    return
  }

  $('#task-form').find('input[type=text]').val(''); // clear input fields after submission

} // end of addTask

function updateCheck(event) {
  event.preventDefault();

  var $check = $(this).parent();
  var $table = $check.closest('tr');

  var data = $table.find('input');

  $.ajax({
    url: '/tasks/' + $check.data('id'),
    type: 'PUT',
    data: data.serialize(),
    success: getTasks
  });

  swal("OK", "You changed the status of a task.")
} // end of updateCheck

function updateTask(event) {
  event.preventDefault();

  var $button = $(this).parent();
  var $table = $button.closest('tr');

  var data = $table.find('input');

  $.ajax({
    url: '/tasks/' + $button.data('id'),
    type: 'PUT',
    data: data.serialize(),
    success: getTasks
  });
  swal("Excellent!", "Your task has been updated!", "success")
} // end of updateTask

function deleteTask (event){
  var _this = this;
  swal({
    title: "Are you sure?",
    text: "You will not be able to recover this task!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel please!",
    closeOnConfirm: false,
    closeOnCancel: false },
    function(isConfirm){
      if (isConfirm) {
        event.preventDefault();
        swal("Deleted!", "You have succesfully deleted this task", "success");
        $.ajax({
          url: '/tasks/' + $(_this).parent().data('id'),
          type: 'DELETE',
          success: getTasks
        });
      } else {
        swal("Cancelled", "Your task is safe.", "error");
      }// end else
    });// end sweet alert
} // end of deleteTask
