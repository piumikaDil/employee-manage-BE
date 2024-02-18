export class Validation {
  checkValidity(object) {
    let errorCount = 0;
    for (let validation of object) {
      if (this.check(validation.reg, validation.field)) {
        this.textSuccess(validation.field, "");
      } else {
        errorCount = errorCount + 1;
        this.setTextError(validation.field, validation.error);
      }
    }
    if (errorCount > 0){
      return false;
    }else{
      return true;
    }
    
  }

  check(regex, txtField) {
    let inputValue = txtField.val();
    return regex.test(inputValue) ? true : false;
  }

  setTextError(txtField, error) {
    if (txtField.val().length <= 0) {
      this.defaultText(txtField, "");
    } else {
      txtField.css("border", "2px solid red");
      txtField.parent().children("span").text(error);
    }
  }

  textSuccess(txtField, error) {
    if (txtField.val().length <= 0) {
      this.defaultText(txtField, "");
    } else {
      txtField.css("border", "2px solid green");
      txtField.parent().children("span").text(error);
    }
  }

  defaultText(txtField, error) {
    txtField.css("border", "1px solid #ced4da");
    txtField.parent().children("span").text(error);
  }

  focusText(txtField) {
    txtField.focus();
  }
}
