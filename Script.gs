function emailTemplate() {
  var docId = "1lOnt8LQidIVsAs-HWmf06tCEXS8dmWC1G4VpE66x0ho"; //Id del documento
  var today = new Date().toISOString().slice(0, 10); //Se obtiene la fecha de hoy 
  var mainFile = DriveApp.getFileById(docId);
  const nameTemp = mainFile.getName();
  const keyword = nameTemp.split(",")[0];
  var newFile = mainFile.makeCopy(); //Se hace una copia del archivo
  mainFile.setName("ARCHIVED, ARTi, " + today + ", " + DriveApp.getFileById(docId).getName());
  newFile.setName(keyword + ", Email Templates and Quotes, ARTi, " + today); //Engineers, Email Templates and Quotes, Mateo, 2022-05-09
  removeToReviewParagraphs(docId); //Removemos el primero
  folderFiles(newFile.getUrl(), keyword); //Actualiza los links de los archivos
  //X removeSolvedComments(docId); 
  removeArchivedParagraphs(newFile.getId()); //Removemos el segundo
  mainFile.moveTo(DriveApp.getFolderById("1dYDdAeUtN0T-wm1BNVso4Zd7ikf989eD"));
  removeFirstPage(docId);
}
function removeFirstPage(docId){
  var docBody = DocumentApp.openById(docId).getBody(); //Se obtiene el documento (cuerpo)
  docBody.appendParagraph(''); //Se agrega un espacio al final para evitar errores.
  var specifiedItem = docBody.findElement(DocumentApp.ElementType.PARAGRAPH);
  var input = specifiedItem.getElement();  //Inputs
  var inputOld;
  var inputToRemove = [];
  try {
    var example = 0;
    while(input.getNextSibling()){
        if(inputOld && inputOld.getText().indexOf("(Review xx)") === 0){
          for(let itemToRemove of inputToRemove){ //Se remueven los items
            if(itemToRemove)
              docBody.removeChild(itemToRemove);
          }
          break;
        }
        inputToRemove.push(input);
      try{
        if(input.getText().length > 0){
          inputOld = input;
        }
        input = input.getNextSibling();
      }catch(e){
        Logger.log(e);
      }
    } 
  }catch(e) {
    Logger.log(e);
  }
}
function removeSolvedComments(docId){ //Función para eliminar los comentarios resueltos
    var commentsList = Drive.Comments.list(docId); //Obtenemos la lista de comentarios
    commentsList.items.forEach((comment) => { //Recorremos los comentarios
      if(comment.status === "resolved"){  //Si esta resuelto, lo eliminamos
        Drive.Comments.remove(docId, comment.commentId);
      }
    })
}
function removeArchivedParagraphs(docId){
  var docBody = DocumentApp.openById(docId).getBody(); //Se obtiene el documento (cuerpo)
  docBody.appendParagraph(''); //Se agrega un espacio al final para evitar errores.
  var specifiedItem = docBody.findElement(DocumentApp.ElementType.PARAGRAPH);
  var input = specifiedItem.getElement();  //Inputs
  var inputOld;
  var inputToRemove = [];
  try {
    var example = 0;
    while(input.getNextSibling()){
      //identificar si el parafo seleccionado es un heading y tiene un texto hacer lo siguiente
      if(example < 9){
        example++;
      }
      else{
        if(input.getText().indexOf("EMAIL Template: Potential Clients Initiation") === 0){
          break;
        }
        if(input.getText().toLowerCase().trim().startsWith("email for") || input.getText().toLowerCase().trim().startsWith("text for")){
          if(!(inputOld.getText().toLowerCase().trim().startsWith("(review"))){
            for(let itemToRemove of inputToRemove){ //Se remueven los items
              if(itemToRemove)
                docBody.removeChild(itemToRemove);
            }
          }
          inputToRemove = [];
        }
        inputToRemove.push(input);
      }
      try{
        if(input.getText() !== "")
          inputOld = input;
        input = input.getNextSibling();
      }catch(e){
        Logger.log(e);
      }
    } 
  }catch(e) {
    Logger.log(e);
  }
}

function folderFiles(URL, keyword){
  let folderId = "1oJ2LGqkRgR_Msz18O8-VyAwzBGs4_IAp";
  let folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles();
  while(files.hasNext()){
    changeHyperLink(files.next().getId(), URL, keyword);
  }
}

function changeHyperLink(docId, URL, keyword){
  try{
    const replaceText = 'Link';
    const document = DocumentApp.openById(docId);
    const body = document.getBody();
    let search = null;
    search = body.findText(keyword, search)
    const searchElement = search.getElement();
    const startIndex = search.getStartOffset();
    const endIndex = search.getEndOffsetInclusive();
    console.log(endIndex);
    const textElement = searchElement.asText();
    textElement.deleteText(endIndex + 3, endIndex + 6);
    textElement.insertText(endIndex + 3, replaceText);
    textElement.setLinkUrl(endIndex + 3, endIndex + 3 + replaceText.length - 1, URL);
    document.saveAndClose();
  }catch(e) {
    Logger.log(e);
  }
}
function removeToReviewParagraphs(docId){
  var docBody = DocumentApp.openById(docId).getBody(); //Se obtiene el documento (cuerpo)
  docBody.appendParagraph(''); //Se agrega un espacio al final para evitar errores.
  var specifiedItem = docBody.findElement(DocumentApp.ElementType.PARAGRAPH);
  var input = specifiedItem.getElement();  //Inputs
  var inputOld;
  var inputToRemove = [];
  try {
    var example = 0;
    while(input.getNextSibling()){
      //identificar si el parafo seleccionado es un heading y tiene un texto hacer lo siguiente
      if(example < 9){
        example++;
        inputToRemove.push(input);
      }
      else{
        if(input.getText().indexOf("EMAIL Template: Potential Clients Initiation") === 0){
          console.log("Fin");
          break;
        }
        if(input.getText().toLowerCase().trim().startsWith("email for") || input.getText().toLowerCase().trim().startsWith("text for")){
          if(inputOld.getText().toLowerCase().trim().startsWith("(review")){
            for(let itemToRemove of inputToRemove){ //Se remueven los items
              if(itemToRemove)
                docBody.removeChild(itemToRemove);
            }
          }
          inputToRemove = [];
        }
        inputToRemove.push(input);
      }
      try{
        if(input.getText() !== "")
          inputOld = input;
        input = input.getNextSibling();
      }catch(e){
        Logger.log(e);
      }
    } 
  }catch(e) {
    Logger.log(e);
  }
}
