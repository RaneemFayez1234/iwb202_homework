$(document).ready(function () {

    //  منطلع ونخفي تفاصيل الوجبة بس نكبس على مربع الاختيار
    $(".show_details_cb").change(function () {
        let main_row = $(this).closest(".main_row");
        let details_row = main_row.next(".meal_details");

        // إذا المستخدم حط صح بالمربع
        if ($(this).is(":checked")) {
            details_row.fadeIn(400);
            main_row.css("border-right", "8px solid #ffcc00");
        } else {
            // إذا شال الصح
            details_row.fadeOut(300);
            main_row.css("border-right", "none");
        }
    });

    // لما يكبس الزبون زر "متابعة" مشان يطلع الفورم
    $("#btn_continue").click(function () {
        let is_any_meal_selected = false; // منتأكد إذا نقى شي وجبة عالأقل

        $(".select_meal_cb").each(function () {
            if ($(this).is(":checked")) {
                is_any_meal_selected = true;
            }
        });

        // إذا مختار وجبة بنكمل
        if (is_any_meal_selected) {
            $("#order_form_section").slideDown(500); // بنزل الفورم بحركة سلايد
            // وبنعمل سكرول لحالنا لتحت مشان الزبون ما يضطر ينزل بالشاشة
            $('html, body').animate({
                scrollTop: $("#order_form_section").offset().top
            }, 500);
        } else {
            // إذا نسي يختار وجبة وكبس متابعة بننبهه
            alert("يا غالي نقي وجبة وحدة عالأقل لتكمل طلبك وتذوق الطعم الأصيل!");
            $("#order_form_section").slideUp(300); // بنخفي الفورم إذا كان طالع
        }
    });

    //   زر الإرسال والتحقق من الفورم- كل الحقول  مطلوبة
    $("#btn_submit_order").click(function () {

        // منسحب القيم من الحقول و منشيل الفراغات من الأطراف  
        let full_name = $("#full_name").val().trim();
        let national_id = $("#national_id").val().trim();
        let birth_date = $("#birth_date").val().trim();
        let mobile_num = $("#mobile_num").val().trim();
        let user_email = $("#user_email").val().trim();

        let is_valid = true; //   منتأكد إذا كلشي تمام ولا في خطأ 

        // منفرغ رسائل الغلط القديمة 
        $(".error_msg").text("");

        //  التحقق من الرقم الوطني
        let reg_national_id = /^(0[1-9]|1[0-4])[0-9]{9}$/;
        if (national_id === "") {
            $("#err_national_id").text("الرقم الوطني مطلوب!");
            is_valid = false;
        } else if (!reg_national_id.test(national_id)) {
            $("#err_national_id").text("الرقم الوطني لازم يكون 11 رقم وبيبدأ بين 01 و 14");
            is_valid = false;
        }

        //  التحقق من الاسم
        let reg_name = /^[\u0621-\u064A\s]+$/;
        if (full_name === "") {
            $("#err_full_name").text("الاسم مطلوب يا غالي!");
            is_valid = false;
        } else if (!reg_name.test(full_name)) {
            $("#err_full_name").text("يرجى كتابة الاسم باللغة العربية فقط");
            is_valid = false;
        }

        //  التحقق من تاريخ الولادة
        let reg_date = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
        if (birth_date === "") {
            $("#err_birth_date").text("تاريخ الولادة مطلوب!");
            is_valid = false;
        } else if (!reg_date.test(birth_date)) {
            $("#err_birth_date").text("التاريخ لازم يكون بهاد الشكل: dd-mm-yyyy");
            is_valid = false;
        }

        //  التحقق من رقم الموبايل
        let reg_mobile = /^09\d{8}$/;
        if (mobile_num === "") {
            $("#err_mobile_num").text("رقم الموبايل مطلوب!");
            is_valid = false;
        } else if (!reg_mobile.test(mobile_num)) {
            $("#err_mobile_num").text("رقم الموبايل غير صحيح، لازم يبدأ بـ 09 ويكون 10 أرقام");
            is_valid = false;
        }

        //  التحقق من الإيميل
        let reg_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (user_email === "") {
            $("#err_user_email").text("البريد الإلكتروني مطلوب!");
            is_valid = false;
        } else if (!reg_email.test(user_email)) {
            $("#err_user_email").text("شكل البريد الإلكتروني مو صحيح!");
            is_valid = false;
        }

        // إذا كل شي تمام والتحقق ناجح ومافي أخطاء
        if (is_valid) {
            let total_price = 0;
            let order_summary = "تفاصيل طلبك الفاخر:\n\n";

            $(".main_row").each(function () {
                let current_cb = $(this).find(".select_meal_cb");

                if (current_cb.is(":checked")) {
                    let meal_n = $(this).find(".meal_name").text();
                    let meal_p = parseInt($(this).find(".meal_price_val").text());

                    // منطبع اسم الوجبة وسعرها بالفاتورة
                    order_summary += "✔️ " + meal_n + " (السعر: " + meal_p + " ل.س)\n";
                    total_price += meal_p; // منضيف السعر عالمجموع العام
                }
            });

            // حساب الضريبة 5%
            let tax = total_price * 0.05;
            let final_price = total_price + tax;

            // تنسيق الفاتورة النهائية
            order_summary += "\n----------------------\n";
            order_summary += "المجموع الأساسي: " + total_price + " ل.س\n";
            order_summary += "ضريبة (5%): " + tax + " ل.س\n";
            order_summary += "المبلغ النهائي للدفع: " + final_price + " ل.س\n";
            order_summary += "----------------------\n\n";

            order_summary += "أهلاً بك يا " + full_name + "، طلبك قيد التحضير!\n";
            order_summary += "صحتين وهنا من مطعم الأناقة!";

            alert(order_summary);

            // تحديث للصفحة بعد ما يكبس موافق
            location.reload();
        }
    });

});
