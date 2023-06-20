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


(function($) {
    app.incompleteOrder = {
        
        timer: null,
        lock: null,
        data: {},
        currentData: {},
        currentForm: null,
        
        processForm: function(form) {
            
            this.currentForm = form;
            
            var phoneField = $(form).find('input[name=phone]');
            var nameField = $(form).find('input[name=name]');
            var offerField = $(form).find('[name=offer]');
            
            if (!phoneField.length || !offerField.length) {
                // offer and phone fields are essential for correct lead submission
                return;
            }
                    
            var errors = orderValidator.validate(form);
            
            // don't really need to check customer name, phone is enough
            delete errors.name;
            
            errors = orderValidator.getErrorsList(errors);
            if (errors.length) {
                return;
            }
            
            this.data.offer = offerField.val();
            this.data.name = nameField.val();
            this.data.phone = phoneField.val();
            
            clearTimeout(this.timer);
            this.timer = setTimeout($.proxy(this.send, this), 1000);
        },
        
        send: function() {

            // var sms_code_confirm = $('#sms_code_confirm').val();
            // if ( sms_code_confirm ) {
            //     return;
            // }
            
            var form = this.currentForm;
            if (!form) {
                return;
            }
            
            form = $(form);
            
            var offerChanged = this.data.offer != this.currentData.offer;
            var nameChanged = this.data.name != this.currentData.name;
            var phoneChanged = this.data.phone != this.currentData.phone;
            
            var anythingChanged = offerChanged || nameChanged || phoneChanged;
            
            if (!anythingChanged) {
                return;
            }
            
            if (this.lock) {
                return;
            }
            
            this.lock = true;
            
            $.extend(this.currentData, this.data);
            
            var formData = {};
            
            $.each(form.serializeArray(), function(idx, field) {
                formData[field.name] = field.value;
            });
            
            $.extend(formData, this.currentData, {
                submitted: '', 
                lead_token: app.leadToken
            });
            
            console.log('test');

            $.ajax({
                url: window.location.href,
                method: 'POST',
                data: formData,
                context: this
            }).done(function(data) {
                console.log('done');
            }).always(function() {
                this.lock = false;
            });
        }

    }
})(app.jq);


}
/*
     FILE ARCHIVED ON 10:29:15 Dec 01, 2022 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 10:17:51 Jun 20, 2023.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 288.922
  exclusion.robots: 0.081
  exclusion.robots.policy: 0.071
  RedisCDXSource: 0.666
  esindex: 0.009
  LoadShardBlock: 268.673 (3)
  PetaboxLoader3.resolve: 261.206 (4)
  PetaboxLoader3.datanode: 180.188 (5)
  load_resource: 196.801
  loaddict: 30.765
*/