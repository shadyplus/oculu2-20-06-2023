var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");


/**
 * Declaration of FormValidator.
 * Inspired by jquery-validate.
 */

function FormValidator() {
    this.errors = {};
    this.rules = {};
    this.messages = {};
    this.is_show_alert = true;
    this.is_standart = true;

    this.errorTitle = 'Пожалуйста, исправьте следующие ошибки';
    this.errorNameField = 'Имя';
    this.errorNameMess = 'Укажите своё имя';
    this.errorPhoneField = 'Телефон';
    this.errorPhoneMess = 'Введите правильный телефон';
    this.errorAddress = 'Введите правильный адрес';
    this.errorPhone = 'указан неправильный телефон';
    this.errorRequired = 'обязательное поле';
    this.errorMaxLength = 'допустимо максимум {1} символа';
    this.errorMinLength = 'допустимо минимум {1} символа';
    this.errorEmailField = 'Email';
    this.errorEmail = 'указан не корректный email';

}

FormValidator.prototype.validators = {
  
    length: function(validator, element, rule) {
        var el = $(element);
        var value = el.val();
        var errs = [];
        
        if (rule.args.minlength) {
            var msg = validator.getMessage(element.name, 'minlength');
            msg = msg || this.errorMinLength;
            var check_value = value.toString().replace(/ +/g, ' ').trim();
            if (check_value.length < rule.args.minlength) {
                errs.push(FormValidator.utilStrFormat(msg, rule.name, rule.args.minlength));
            }
        }
            
        if (rule.args.maxlength) {
            var msg = validator.getMessage(element.name, 'maxlength');
            msg = msg || this.errorMaxLength;
            if (value.toString().length > rule.args.maxlength) {
                errs.push(FormValidator.utilStrFormat(msg, rule.name, rule.args.minlength));
            }
        }   
        return errs;
    },
  
    required: function(validator, element, rule) {
        var el = $(element);
        var value = el.val().replace(' ', '');
        var value = el.val().replace(/ +/g, ' ').trim();
        var msg = validator.getMessage(element.name, 'required');
        msg = msg || FormValidator.utilStrFormat(this.errorRequired, rule.name);
        var errs = [];
        if (!value || value === '') {
            errs.push(msg);
        }
        else if ((el.attr('placeholder') || '').toLowerCase() === value.toString().toLowerCase()) {
            errs.push(msg);
        }
        return errs;
    },

    phone: function(validator, element, rule) {

        var errs = [];
        var value = $(element).val();
        var cleanPhone = value.replace(/[^\d]/g, '');
        var msg = validator.getMessage(element.name, 'phone');
        msg = msg || FormValidator.utilStrFormat(this.errorPhone, rule.name)
        if (value.length > 40 || value.length < 7) {
            errs.push(msg);
        } else {
            if (cleanPhone.length > 15 || cleanPhone.length < 7) {
                errs.push(msg);
            }
        }

        if (rule.args.interPhoneCodes && !errs.length) {
            var currentPhoneCode = rule.args.interPhoneCodes.currentPhoneCode;

            if (currentPhoneCode === '7') {
                if (cleanPhone.indexOf('7') !== 0 && cleanPhone.indexOf('8') !== 0) {
                    errs.push(msg);
                }
            }
            else if (cleanPhone.indexOf(currentPhoneCode) !== 0) {
                errs.push(msg);
            }
        }

        return errs;
    },

    email: function(validator, element, rule) {
        var errs = [];
        if (element) {
            var value = $(element).val();
            // var pattern = /^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i; //name-_09@mail09-.ru
            var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i;
            var msg = validator.getMessage(element.name, 'email');
            msg = msg || FormValidator.utilStrFormat(this.errorEmail, rule.name)
            if (value.search(pattern) !== 0) {
                errs.push(msg);
            }
        }
        return errs;
    }
}

FormValidator.prototype.addRule = function(field, name, rule, args) {
    args = args || null;
    this.rules[field] = this.rules[field] || [];
    this.rules[field].push({
        field: field,
        name: name,
        rule: rule,
        args: args
    });
}

FormValidator.prototype.addMessages = function(field, messages) {
    this.messages[field] = messages;
}

FormValidator.prototype.getMessage = function(field, rule) {
    var msgs = this.messages[field];
    var msg = msgs && msgs[rule]
    return msg;
}

FormValidator.prototype.watch = function(el) {
    if ( this.is_standart === true ) {
        $(document).on('submit', el, {validator: this}, FormValidator.submitHandler);
    }
    $(document).on('change click keyup', el, {validator: this}, FormValidator.changeHandler);
}

FormValidator.submitHandler = function(e) {
    if ( this.is_standart === false ) {
        e.preventDefault();
        return
    }
    var validator = e.data.validator;
    if (FormValidator.isFormLocked(this)) {
        validator.fireEvent('locked', this, e);
        e.preventDefault();
    } else {
        FormValidator.lockForm(this);
        validator.validate(this, true);
        validator.fireEvent(validator.isValid() ? 'valid' : 'error', this);
        if (!validator.isValid()) {
            e.preventDefault();
            validator.showErrors();
            validator.fireEvent('error', this, e);
            FormValidator.unlockForm(this);
        } else {
            validator.fireEvent('success', this, e);
        }
    }
}

FormValidator.changeHandler = function(e) {
    if (!$(this).data('validating')) {
        return;
    }
    var validator = e.data.validator;
    validator.validate(this, true);
    validator.fireEvent(validator.isValid() ? 'valid' : 'error', this);
}

FormValidator.lockForm = function(form) {
    $(form).data('locked', true);
}

FormValidator.unlockForm = function(form) {
    $(form).data('locked', false);
}

FormValidator.isFormLocked = function(form) {
    return $(form).data('locked');
}

FormValidator.prototype.fireEvent = function(eventName, form, submitEvent) {
    var e = jQuery.Event('validate.' + eventName);
    e.submitEvent = submitEvent || null;
    e.validator = this;
    e.form = form;
    $(form).trigger(e);
}

FormValidator.prototype.validate = function(form, changeState) {
    
    var errors = {}
    for (var field in this.rules) {
        var rules = this.rules[field];
        var errs = errors[field] || [];
        for (var i=0; i < rules.length; ++i) {
            var rule = rules[i];
            errors[field] = errs.concat(this.checkRule(form, rule));
        }
    }
    
    if (changeState) {
        $(form).data('validating', true);
        this.errors = errors;
    }
    
    return errors;
    
}

FormValidator.prototype.getErrorsList = function(errors) {
    errors = errors || this.errors;
    var errs = $.map(errors, function(errs, field) {
        return $.map(errs, function(err) {
            return {field: field, msg: err};
        });
    });
    return errs;
}

FormValidator.prototype.showFormErrors = function(form, errors) {

    errors = errors || this.errors;
    $.map(errors, function(errs, field) {
        if (errs.length === 0 ) {
            $(form).find(field).removeClass('field-error').addClass('field-valid');
        } else {
            $(form).find(field).removeClass('field-valid').addClass('field-error');
        }

    });
}


FormValidator.prototype.showErrors = function() {
    if (this.is_show_alert === true ) {
        var errs = $.map(this.getErrorsList(), function(err) {
            return ' - ' + err.msg;
        });
        alert(this.errorTitle + ':\n\n' + errs.join('\n'));
    } else {
        this.showFormErrors();
    }
}

FormValidator.prototype.checkRule = function(form, rule) {
    var validate = this.validators[rule.rule];
    if (rule.field.startsWith("#") === true) {
        var element = $(form).find(rule.field).get(0);
    } else {
        var rule_field = rule.field.replace('[', "\\[").replace(']', "\\]");
        var element = $(form).find('[name=' + rule_field + ']').get(0);
    }
    return validate(this, element, rule);
}

FormValidator.prototype.isValid = function() {
    return this.getErrorsList(this.errors).length == 0;
}

FormValidator.utilStrFormat = function(s) {
    for (var i = 0; i < arguments.length - 1; i++) {       
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        if (s) {
            s = s.replace(reg, arguments[i + 1]);
        }
    }
    return s;
}


}
/*
     FILE ARCHIVED ON 10:37:46 Dec 01, 2022 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 10:17:51 Jun 20, 2023.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 106.383
  exclusion.robots: 0.083
  exclusion.robots.policy: 0.072
  RedisCDXSource: 1.957
  esindex: 0.009
  LoadShardBlock: 80.259 (3)
  PetaboxLoader3.datanode: 129.578 (5)
  load_resource: 188.827
  PetaboxLoader3.resolve: 63.99
  loaddict: 110.49
*/