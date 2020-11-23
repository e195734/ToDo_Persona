window.onload = function(){
  document.getElementById("add-list").onsubmit = function(){
      document.getElementById("list").insertAdjacentHTML('afterbegin','<li>abc</li>');//要素の追加
    return confirm("この内容で登録しますか?");
  }
}