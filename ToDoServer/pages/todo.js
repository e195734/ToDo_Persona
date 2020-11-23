window.onload = function(){
  document.getElementById("add-list").onsubmit = function(){
  return confirm("この内容で登録しますか?");
  }
}