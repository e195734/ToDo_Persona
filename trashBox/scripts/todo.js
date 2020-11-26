window.onload = function(){
  document.getElementById("add-list").onclick = function(){
    var str = document.getElementById("todo").value;//入力文字列の取得
    if(str!=""){
      document.getElementById("list").insertAdjacentHTML('beforeend','<li>'+str+'</li>');//要素の追加
      document.getElementById("todo").value = '';//入力内容のクリア
    }
  }
}