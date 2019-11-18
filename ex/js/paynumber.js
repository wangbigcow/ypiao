(function ($) {
    var defaults = {
        reNumbers: /(-|-\$)?(\d+(,\d{3})*(\.\d{1,})?|\.\d{1,})/g, 
        cleanseNumber: function (v) {
            return v.replace(/[^0-9.\-]/g, "");
        }, 
        useFieldPlugin: (!!$.fn.getValue),
        onParseError: null, 
        onParseClear: null
    };
    $.Calculation = {
        version: "0.4.07",
        setDefaults: function (options) {
            $.extend(defaults, options);
        }
    };
    $.fn.parseNumber = function (options) {
        var aValues = [];
        options = $.extend(options, defaults);
        this.each(function () {
            var $el = $(this),
            sMethod = ($el.is(":input") ? (defaults.useFieldPlugin ? "getValue" : "val") : "text"),
            v = $.trim($el[sMethod]()).match(defaults.reNumbers, "");
            if (v == null) {
                v = 0;
                if (jQuery.isFunction(options.onParseError)) 
                    options.onParseError.apply($el, [sMethod]);
                    $.data($el[0], "calcParseError", true);
            } else {
                v = options.cleanseNumber.apply(this, [v[0]]);
                if ($.data($el[0], "calcParseError") && jQuery.isFunction(options.onParseClear)) {
                    options.onParseClear.apply($el, [sMethod]);
                    $.data($el[0], "calcParseError", false);
                }
            }
            aValues.push(parseFloat(v, 10));
        });
        return aValues;
    };
    $.each(["sum", "avg", "min", "max"],
    function (i, method) {
        $.fn[method] = function (bind, selector) {
            if (arguments.length == 0) return math[method](this.parseNumber());
            var bSelOpt = selector && (selector.constructor == Object) && !(selector instanceof jQuery);
            var opt = bind && bind.constructor == Object ? bind : { bind: bind || "keyup", selector: (!bSelOpt) ? selector : null, oncalc: null };
            if (bSelOpt) opt = jQuery.extend(opt, selector);
            if (!!opt.selector) opt.selector = $(opt.selector);
            var self = this, sMethod, doCalc = function () {
                var value = math[method](self.parseNumber(opt));
                if (!!opt.selector) {
                    sMethod = (opt.selector.is(":input") ? (defaults.useFieldPlugin ? "setValue" : "val") : "text");
                    opt.selector[sMethod](value.toString());
                }
                if (jQuery.isFunction(opt.oncalc)) opt.oncalc.apply(self, [value, opt]);
            };
            doCalc();
            return self.bind(opt.bind, doCalc);
        };
    });
    var math = {
        sum: function (a) {
            var total = 0, precision = 0;
            $.each(a, function (i, v) {
                var p = v.toString().match(/\.\d+$/gi), len = (p) ? p[0].length - 1 : 0;
                if (len > precision) precision = len;
                total += v;
            });
            if (precision) total = Number(total.toFixed(precision));
            return total;
        }, 
        avg: function (a) {
            return math.sum(a) / a.length;
        }, 
        min: function (a) {
            return Math.min.apply(Math, a);
        },
        max: function (a) {
            return Math.max.apply(Math, a);
        }
    };
})(jQuery);

/* reduce_add */
var setAmount = {
    min: 1,
    max: 999,
    urladd: '',
    setmin: function (minValue) {
        this.min = minValue;
    },
    setmax: function (maxValue) {
        this.max = maxValue;
    },
    init: function() {

    },
    reg: function (x) {
        return new RegExp("^[0-9]\\d*$").test(x);
    },
    amount: function (obj, mode) {
        var x = $(obj).val();
        if (x == "") x = 0;
        if (this.reg(x)) {
            if (mode) {
                x++;
            } else {
                x--;
            }
        } else {
            $(obj).val(this.min);
            $(obj).focus();
        }
        return x;
    },
    reduce: function (obj) {
        var x = this.amount(obj, false);
        if (x >= this.min) {
            $(obj).val(x);
        } else {
            $(obj).val(this.min);
            $(obj).focus();
        }
    },
    add: function (obj) {
        var x = this.amount(obj, true);
        if (x <= this.max) {
            $(obj).val(x);
        } else {
            $(obj).val(this.max);
            $(obj).focus();
        }
    },
    modify: function (obj) {
        var x = $(obj).val();
        if (x != "")
            if (x < this.min || x > this.max || !this.reg(x)) {
                $(obj).val(this.min);
                $(obj).focus();
            }
    },
    post: function () {
       
    },
    load: function (obj) {
        var x = $(obj).val();
        if (x == "") {
            $(obj).val(this.min);
        }
    }
};
var AjaxCart = {
    loadWaiting: false,
    usepopupnotifications: false,
    topcartselector: '',
    topwishlistselector: '',
    flyoutcartselector: '',
    init: function (usepopupnotifications, topcartselector, topwishlistselector, flyoutcartselector) {
        this.loadWaiting = false;
        this.usepopupnotifications = usepopupnotifications;
        this.topcartselector = topcartselector;
        this.topwishlistselector = topwishlistselector;
        this.flyoutcartselector = flyoutcartselector;
    },
    setLoadWaiting: function (display) {
        displayAjaxLoading(display);
        this.loadWaiting = display;
    },
    delproduct: function (id) {
        if (this.loadWaiting != false) {
            return;
        }
        this.setLoadWaiting(true);
        var d = dialog({
            content: '<div class="tip_confirm"><i class="iconfont">&#xe619;</i>确定要删除该商品吗？</div>',
            cancel: false,
            cancelValue: '取消',
            cancel: function () {
                AjaxCart.setLoadWaiting(false);
                return;
            },
            okValue: '确定',
            ok: function () {
                $.ajax({
                    cache: false,
                    url: "/shoppingcart/removecartitem",
                    data: { sciId: id },
                    type: 'post',
                    success: function (rep) {
                        if (rep.success) {
                            $("#item_" + id).remove();
                            checkTotal();
                            //$("#content").html(rep.html);
                        }
                        AjaxCart.setLoadWaiting(false);
                    }
                });
                return true;
            },
            width: 240
        });
        d.show();
    },
    delproducts: function () {
        if (this.loadWaiting != false) {
            return;
        }
        this.setLoadWaiting(true);
        var ids = [];
        $("input[name=chkitem]:checked").each(function (i, t) {
            ids.push($(this).val());
        });
        if (ids.length == 0) {
            var d = dialog({
                content: '<div class="tip_warn"><i class="iconfont">&#xe633;</i>请选择要删除的商品</div>',
                okValue: '确定',
                ok: function () {
                    AjaxCart.setLoadWaiting(false);
                    return true;
                },
                width: 200
            });
            d.show();
            return false;
        }
        var ids_group = ids.join(",");
        var d = dialog({
            content: '<div class="tip_confirm"><i class="iconfont">&#xe619;</i>确定要删除这些商品吗？</div>',
            cancel: false,
            cancelValue: '取消',
            cancel: function () {
                AjaxCart.setLoadWaiting(false);
                return;
            },
            okValue: '确定',
            ok: function () {
                $.ajax({
                    cache: false,
                    url: "/shoppingcart/removecartitems",
                    data: { sciIds: ids_group },
                    type: 'post',
                    success: function (rep) {
                        if (rep.success) {
                            for (var i = 0; i < ids.length; i++) {
                                $("#item_" + ids[i]).remove();
                            }
                            checkTotal();
                            //$("#content").html(rep.html);
                        }
                        AjaxCart.setLoadWaiting(false);
                    }
                });
                return true;
            },
            width: 240
        });
        d.show();
    },
    post: function () {
        if (this.loadWaiting != false) {
            return;
        }
        this.setLoadWaiting(true);
        $("#topay").attr("data-status", 0);
        var urladd = "/shoppingcart/updatecartall";
        var formselector = "#cart-summary-form";
        $.ajax({
            cache: false,
            url: urladd,
            data: $(formselector).serialize(),
            type: 'post',
            success: function (rep) {
                $("#topay").attr("data-status", 1);
                if (rep.success) {
                    $("#topay").attr("data-status", 1);
                    if (typeof (checkTotal) == "function") {
                        checkTotal();
                    }
                } else {
                    var d = dialog(
                        {
                            title: '',
                            content: rep.warn,
                            okValue: '确定',
                            icon: 'ok',
                            width: 340,
                            ok: function () {
                                d.close().remove();
                                return true;
                            },
                            onshow: function () {
                                $("#dialog_close").click(function () {
                                    d.close().remove();
                                })
                            }
                        });
                    d.show();
                }
                AjaxCart.setLoadWaiting(false);
            }
        });
    },
    checkout: function (anonymous) {
        if ($("#topay").hasClass("topay_ok") &&
            $("#topay").attr("data-status") == "1") {
            //var ids = [];
            //$("input[name=chkitem]:checked").each(function (i, t) {
            //    ids.push($(this).val());
            //});
            //ids = ids.join(",");
            var ids = [];
            $("input[name=chkitem]:checked").each(function (i, t) {
                var q = 1;
                var rootNote = $(this).parent().parent().parent().parent();
                if (rootNote.hasClass("item_content")) {
                    var num = parseInt(rootNote.find(".num_val").val());
                    if (!isNaN(num)) q = num;
                }
                ids.push($(this).val() + "_" + q);
            });
            ids = ids.join(",");
            this.setLoadWaiting(true);
            $.ajax({
                cache: false,
                url: "/shoppingcart/StartCheckoutV2",
                data: { sciIds: ids, anonymous: anonymous },
                type: 'post',
                success: function (rep) {
                    AjaxCart.setLoadWaiting(false);
                    if (rep.message) {
                        var d = dialog(
                        {
                            title: '',
                            content: rep.message,
                            okValue: '确定',
                            icon: 'ok',
                            width: 340,
                            ok: function () {
                                d.close().remove();
                                return true;
                            },
                            onshow: function () {
                                $("#dialog_close").click(function () {
                                    d.close().remove();
                                })
                            }
                        });
                        d.show();
                    }
                    if (rep.error) {
                        if (rep.url) {
                            window.parent.window.location.href = rep.url;
                        }
                    }
                    if (rep.success) {
                        window.parent.window.location.href = rep.url;
                    }
                }
            });
        }
    },
    addproducttocart: function (urladd, formselector) {
        if (this.loadWaiting != false) {
            return;
        }
        this.setLoadWaiting(true);
        //if (urladd.indexOf("AddProductVariantToCheckout") > 0) {
        //    $.ajax({
        //        cache: false,
        //        url: urladd,
        //        data: $(formselector).serialize(),
        //        type: 'post',
        //        success: function (data) {
        //            window.parent.window.location.href = data.redirect;
        //            AjaxCart.setLoadWaiting(false);
        //        },
        //        complete: function (data) {
        //            console.log("complete:" + data);
        //            AjaxCart.setLoadWaiting(false);
        //        },
        //        error: function (data) {
        //            console.log("error:" + data);
        //            AjaxCart.setLoadWaiting(false);
        //        }
        //    });
        //}
        //else {
        var parm = "";
        if (typeof (formselector) != "undefined")
            parms = $(formselector).serialize();
        if (parms.length > 0)
            parms += "&";
        parms += "urlReferrer=" + document.referrer;
        $.ajax({
            cache: false,
            url: urladd,
            data: parms,
            type: 'post',
            success: this.successprocess,
            complete: this.resetLoadWaiting,
            error: this.ajaxFailure
        });
        //}
    },
    speedbuy: function (urladd, formselector) {
        if (this.loadWaiting != false) {
            return;
        }
        this.setLoadWaiting(true);
        $.ajax({
            cache: false,
            url: urladd,
            data: $(formselector).serialize(),
            type: 'post',
            success: function (data) {
                AjaxCart.setLoadWaiting(false);
                if (typeof (data.message) != "undefined") {
                    var d = dialog(
                    {
                        title: '',
                        content: data.message,
                        okValue: '确定',
                        icon: 'ok',
                        ok: function () {
                            d.close().remove();
                            return true;
                        },
                        onshow: function () {
                            $("#dialog_close").click(function () {
                                d.close().remove();
                            })
                        }
                    });
                    d.show();
                }
                if (typeof (data.redirect) != "undefined") {
                    window.parent.window.location.href = data.redirect;
                }
            },
            error: function (data) {
                console.log("error:" + data);
                AjaxCart.setLoadWaiting(false);
            }
        });
    },
    successprocess: function (response) {
        if (response.updatetopcartsectionhtml) {
            $(AjaxCart.topcartselector).html(response.updatetopcartsectionhtml);
            if (window.parent)
                $(AjaxCart.topcartselector, window.parent.document).html(response.updatetopcartsectionhtml);
            if (response.updatetopcartsectionhtml > 0) {
                $(AjaxCart.topcartselector).css("visibility", "visible");
                if (window.parent)
                    $(AjaxCart.topcartselector, window.parent.document).css("visibility", "visible");
            }
        }
        if (response.updatetopwishlistsectionhtml) {
            $(AjaxCart.topwishlistselector).html(response.updatetopwishlistsectionhtml);
        }
        if (response.updateflyoutcartsectionhtml) {
            $(AjaxCart.flyoutcartselector).replaceWith(response.updateflyoutcartsectionhtml);
            if (window.parent)
                $(AjaxCart.flyoutcartselector, window.parent.document).html(response.updateflyoutcartsectionhtml);
        }
        if (response.message) {
            //display notification
            if (response.success == true) {
                //success
                if (AjaxCart.usepopupnotifications == true) {
                    var d = dialog(
                        {
                            title: '',
                            content: response.message,
                            icon: 'ok',
                            width: 340,
                            onshow: function () {
                                $("#dialog_close").click(function () {
                                    d.close().remove();
                                })
                            }
                        });
                    d.show();
                }
                else {
                    displayBarNotification(response.message, 'ok', 3500);
                }
            }
            else {
                //error
                if (AjaxCart.usepopupnotifications == true) {
                    displayPopupWarn(response.message, null, 3000);
                }
                else {
                    displayBarNotification(response.message, 'error', 0);
                }

            }
            //return false;
        }
        if (response.redirect) {
            window.parent.window.location.href = response.redirect;
            return true;
        }
        return false;
    },
    resetLoadWaiting: function () {
        AjaxCart.setLoadWaiting(false);
    },
    ajaxFailure: function () {
        alert('Failed to add the product to the cart. Please refresh the page and try one more time.');
    }
}; 


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 如果用户登录修改用户登录的状态
jQuery.getJSON("/json/GetCurrentCustomer", function (data) {
    if (data.IsGuest == false) {
        var userName = data.Name;
        if (userName == "" || userName == null)
            userName = "茶友" + data.Id;
        $(".topbar_user").html('<a href="/customer/info" class="name" rel="nofollow">' + userName + '</a>  &nbsp;[<a href="/logout">退出</a>]');
        $(".topbar_user").after(
        '<li class="more_menu" id="header_mymember">' +
        '   <a href="/orders" rel="nofollow">我的茶七</a>'+
        '   <i class="iconfont arrow"> </i>'+
        '   <div class="more_bd">'+
        '       <div class="list">'+
        '           <a href="/customer/info" rel="nofollow">个人资料</a>' +
        '           <a href="/orders" rel="nofollow">我的订单</a>'+
        '           <a href="/customer/coindetail" rel="nofollow">我的茶币</a>' +
                '   <a href="/UserCenter/MyCoupons" rel="nofollow">我的优惠券</a>' +
        '           <a href="/addresses" class="last" rel="nofollow">修改收货地址</a>'+
        '       </div>'+
        '   </div>'+
        '</li>');
        // public.js 中有加载
        //$('#header_mymember').delegate("hover").hover(function () {
        //    $(this).toggleClass('hover');
        //});
        //加载购物车的内容
        $('#flyout-cart').load("/ShoppingCart/GetMiniShopping", function () {
            var num = parseInt($("#cartlist").text());
            if (isNaN(num)) num = 0;
            jQuery(".cartnum").html(num);
            if (num > 0)
                jQuery(".cartnum").css({ "visibility": "visible" });
        });
    }
});
// 热门搜索
jQuery(".head_search_hot").append('<a href="/search/%E5%A4%A7%E7%BA%A2%E8%A2%8D" target="_blank" rel="nofollow">大红袍</a>' +
    '<a href="/search/%E9%93%81%E8%A7%82%E9%9F%B3" target="_blank" rel="nofollow">铁观音</a>' +
    '<a href="/search/%E9%87%91%E9%AA%8F%E7%9C%89" target="_blank" rel="nofollow">金骏眉</a>');

//搜索按钮
jQuery(".sea_submit").click(function () {
    var value = jQuery("#small-searchterms").val();
    if (value == "搜索所有商品" || value == "") {
        alert("请输入您要搜索的商品信息！");
        return false;
    }
});

function delcartshop(id, count) {
    jQuery("#" + id + " .del").html("正在删除..");
    jQuery.ajax({
        type: 'POST',
        url: "/ShoppingCart/RemoveCartItem",
        data: { sciId: id },
        dataType: 'json',
        success: function (data) {
            if (data.success == "1") {
                jQuery("#" + id).remove();
                var num = parseInt(jQuery("#cartlist").html()) - count;
                jQuery("#cartlist").html(num);
                jQuery(".cartnum").html(num);
            } else {
                alert("系统忙,请稍后再试！");
                jQuery("#" + id + " .del").html("删除");
            }
        }
    });
}
AjaxCart.init(true, '.cartnum', '', '#flyout-cart');
jQuery(function () {
    jQuery("#sidebar_cartnum").html(0);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//$(function () {
// 四舍五入
// s 数值，
// n  保留小数点的位数
function ForDight(s, n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}
var ProductCombinationList = [];
if (typeof (ProductParms) != "undefined") {
    //加载产品所需要的信息
    $.getJSON("/API/Product/GetProductBaseInfo", { "Id": ProductParms.Id }, function (data) {
        // if (data.ProductCombinationList.length > 0) {
        //     $(data.ProductCombinationList).each(function (n, item) {
        //         var valuearray = [];
        //         $(item.ProductCombinationList).each(function (i, it) {
        //             valuearray.push(it.ProductAttributeValueId.toString());
        //         });
        //        ProductCombinationList.push(valuearray);
        //     });
        // }
        // ResetAttrAttributelist();
        // $(".price-val-for-dyn-upd").html(ForDight(data.Price,2));
        // $(".setSaleVolume").html(data.SaleVolume);
        // $(".setStockQuantity").html(data.StockQuantity);
        // $(".setReviewNumber").html(data.ApprovedTotalReviews);
        // if (typeof (data.GoodReviewCount) == "undefined" || data.GoodReviewCount == null || data.GoodReviewCount < 0) data.GoodReviewCount = 0;
        // if (typeof (data.MediumReviewCount) == "undefined" || data.MediumReviewCount == null || data.GoodReviewCount < 0) data.MediumReviewCount = 0;
        // if (typeof (data.BadReviewCount) == "undefined" || data.BadReviewCount == null || data.GoodReviewCount < 0) data.BadReviewCount = 0;
        // var rating = 0, ratingPercent = 0,
        //     goodPercent = 0, badPercent = 0, mediumPercent = 0;

        // if (data.ApprovedTotalReviews > 0) {
        //     rating = ForDight(data.ApprovedRatingSum / data.ApprovedTotalReviews, 1);
        //     if (rating > 5) { rating = 5; }
        //     ratingPercent = ForDight(((data.ApprovedRatingSum * 20) / data.ApprovedTotalReviews), 1);
        //     if (ratingPercent > 100) ratingPercent = 100;
        //     goodPercent = ForDight(data.GoodReviewCount * 100.0 / data.ApprovedTotalReviews, 0);
        //     mediumPercent = ForDight(data.MediumReviewCount * 100.0 / data.ApprovedTotalReviews, 0);
        //     badPercent = ForDight(data.BadReviewCount * 100.0 / data.ApprovedTotalReviews, 0);

        //     goodPercent += 100 - (goodPercent + mediumPercent + badPercent);  //补齐差价
        // }
       
        // //这里处理特价
        // if (typeof (data.HasSpecialPrice) == "boolean"
        //     && data.HasSpecialPrice
        //     && data.SpecialPrice >= 0) {
        //     if (priceValForDynUpd) {
        //         priceValForDynUpd = data.SpecialPrice;
        //     }
        //     $(".price-val-for-dyn-upd").html(data.SpecialPrice);
        //     $("#product_indo_area .t1").html(data.ActivityTitle);
        //     if (data.SpecialPriceTime > 0) {
        //         $("#product_indo_area").append('<li class="t6"><span class="timedown" id="timedown" data-time="' + data.SpecialPriceTime + '"><i class="iconfont">:</i><span class="s">剩余时间：</span></span></li>');

        //         timeDownFn({
        //             elem: $('#timedown'),
        //             endTime: $('#timedown').data("time"),
        //             endFunc: function () {
        //                 $('#timedown').html("特卖已结束")
        //             }
        //         });
        //     }
        //     if (data.GiftPoints > 0) {
        //         $(".SetPoints .orange").html(data.GiftPoints);
        //     }
        //     else {
        //         $(".SetPoints").hide();
        //     }
        // }

        // $("#badPercent").html(badPercent + "%");
        // $("#setBadPercent").css({ "width": badPercent + "%" });
        // $("#goodPercent").html(goodPercent + "%");
        // $("#setGoodPercent").css({ "width": goodPercent + "%" });
        // $("#mediumPercent").html(mediumPercent + "%");
        // $("#setMediumPercent").css({ "width": mediumPercent + "%" });
        // $(".setReviewPoint").html(rating);
        // $(".setReviewPoint10").html(rating * 10);
        // $(".SetRatingPercent").css({ "width": ratingPercent + "%" });

        // // 库存限制
        // var PurchaseNumber = 99;
        // if (typeof ($("#li_PurchaseType").attr("data-num")) != "undefined")
        //     PurchaseNumber = parseInt($("#li_PurchaseType").attr("data-num"));

        // setAmount.setmax(data.StockQuantity); // 设置购物车最大值
        // if (data.IsSoldOut) {
        //     setAmount.setmin(0);
        //     setAmount.setmax(0);
        //     document.getElementById("Quantity").value = "0";
        //     $(".add_cart_li").html('<a href="javascript:;" id="buy_btn" class="buy_btn_Unable">已售罄</a>');
        //     $(".buy_fr span").eq(0).html('<a href="javascript:;" id="buy_btn" class="buy_btn_Unable">已售罄</a>');
        // }
        // ///存在限购数量时 设置可选择数量的最大值
        // if (data.StockQuantity < PurchaseNumber)
        //     setAmount.setmax(PurchaseNumber);

        // $(".add_cart_li").show();
        // //这里还要处理特价
        // //加载评论信息
        // if ($('#reviewPager').length > 0) {
        //     $.getJSON("/API/Product/GetProductReviews", { "Id": ProductParms.Id }, function (data) {
        //         if (data.TotalCount) {
        //             $.ajax({
        //                 data: { ProductId: ProductParms.Id, PageNumber: 1 },
        //                 url: '/Catalog/ProductReviewsBlock',
        //                 type: 'POST',
        //                 success: function (data) {
        //                     $("#comment_list").html(data.html);
        //                     BindViewPhonsClick();
        //                 }
        //             });
        //             $('#reviewPager').jqPaginator({
        //                 totalCounts: data.TotalCount,
        //                 pageSize: 5,
        //                 currentPage: 1,
        //                 visiblePages: 5,
        //                 activeClass: 'page-cur',
        //                 prev: '<span class=\'checked\'><a href=\'javascript:;\'>上一页</a><\/span>',
        //                 next: '<span><a href=\'javascript:;\'>下一页</a><\/span>',
        //                 page: '<span><a href=\'javascript:;\'>{{page}}</a><\/span>',
        //                 onPageChange: function (num, type) {
        //                     $.ajax({

        //                         data: { ProductId: ProductParms.Id, PageNumber: num },
        //                         url: '/Catalog/ProductReviewsBlock',
        //                         type: 'POST',
        //                         success: function (data) {
        //                             $("#comment_list").html(data.html);
        //                             BindViewPhonsClick();
        //                         }
        //                     });
        //                 }
        //             });
        //         } else {
        //             $(".comment_box").html("暂无评论信息");
        //         }
        //     });
        // }
    });
    //判断用户是否登录，如果登录就显示极速购买
    $.getJSON("/json/GetCurrentCustomer", function (data) {
        if (typeof (ProductParms.SupportCashOnDelivery) == "undefined")
            ProductParms.SupportCashOnDelivery = true;
        if (data.AllowSpeedBuy && ProductParms.SupportCashOnDelivery) {
            // 表示是已经登录的用户, 并且允许快速购买
            if ($("#buy_btn").length > 0) {
                var buyBtn = $("#buy_btn");
                if (!buyBtn.hasClass("buy_btn_Unable")) {
                    buyBtn.html("极速购买");
                    buyBtn.attr("onclick", "AjaxCart.speedbuy('/speedtobuy/" + ProductParms.Id + "', '#product-details-form'); return false;");
                }
            }
        }
    });
    $(function () {
        $("#buy_btn").click(function () {
            if (!checking()) return;
            AjaxCart.addproducttocart('/AddProductVariantToCheckout/' + $(this).attr("value") + '/0', '#product-details-form'); return false;
        });
        $("#cart_btn").click(function () {
            if (!checking()) return;
            AjaxCart.addproducttocart('/addproductvarianttocart/' + $(this).attr("value") + '/1', '#product-details-form'); return false;
        });
    });
    
}
function checking()
{
    var curlenth = $(".attributes .sku_box li .sku_list a.current").length;
    if (curlenth < $(".attributes .sku_box li").length) {
        var d = dialog({
            content: '<div class="tip_warn"><i class="iconfont">&#xe633;</i>请选择您要的商品信息</div>',
            okValue: '确定',
            ok: function () {
            },
            width: 200
        });
        d.show();
        return false;
    }
    return true;
}
function ResetAttrAttributelist() {
    var me = this;
    var Combination = ProductCombinationList;
    if (Combination.length > 0)
    {
        $(".attributes .sku_box li").each(function (i, item) {
            var parms = [];
            $($(".attributes .sku_box li").not($(".attributes .sku_box li").eq(i)).find(".current")).each(function (n, it) {
                parms.push($(this).find("input").val());
            });
            $(item).find("a").each(function (n, it) {
                var Isexist = false;
                var val1 = $(it).find("input").val();
                $(Combination).each(function (n, it1) {
                    if (it1.indexOf(val1) >= 0) {
                        for (var q = 0; q < parms.length; q++) {
                            if (it1.indexOf(parms[q]) < 0)
                            {
                                Isexist = false;
                                return true;
                            }
                        }
                        Isexist = true;
                        return false;
                    }
                });
                if (Isexist) {
                    $(this).removeClass("nostorage");
                }
                else {
                    $(this).removeClass("current");
                    $(this).find("input").removeAttr("checked");
                    $(this).addClass("nostorage");
                }
            });
        });
    }
};
// 绑定评论图片的点击事件
function BindViewPhonsClick() {
    $("#comment_list .thumbs li").click(function () {
        var ul = $(this).parent();
        var viewer = ul.parent().find(".viewer");
        if ($(this).hasClass("current")) {
            //缩小
            viewer.html("").hide();
            $(this).removeClass("current");
        } else {
            //放大
            var img = $(this).find("img");
            $(this).addClass("current");

            viewer.html("").append("<img src='" + $(this).attr("data-src") + "' />").show().unbind("click").click(function () {
                viewer.html("").hide();
                ul.find("li").removeClass("current");
            });
        }
    });
}
//});

// 调整价格
function adjustPrice() {
    var sum = 0;
    for (var i in adjustmentTable) {
        var ctrl = jQuery('#' + i);
        if ((ctrl.is(':radio') && ctrl.is(':checked')) || (ctrl.is(':checkbox') && ctrl.is(':checked'))) {
            sum += adjustmentTable[i];
        }
        else if (ctrl.is('select')) {
            var idx = jQuery('#' + i + " option").index(jQuery('#' + i + " option:selected"));
            if (idx != -1) {
                sum += adjustmentTable[i][idx];
            }
        }
    }

    var res = (priceValForDynUpd + sum).toFixed(2);
    jQuery(".price-val-for-dyn-upd").text(res);
    if (priceyuanjia > 0) {
        var oldres = (priceyuanjia + sum).toFixed(2);
        jQuery(".oldprice-val-for-dyn-upd").text(oldres);
    }
}

if (typeof (adjustmentTable) !== "undefined") {

    adjustPrice();
    jQuery('.attributes .sku_box li .sku_list a').click(function () {
        if ($(this).hasClass("nostorage")) { return; }
        if ($(this).hasClass("current")) {
            $(this).find('input').removeAttr("checked");
            $(this).removeClass("current");
        }
        else {
            jQuery('.attributes sku_box li .sku_list a :radio').removeAttr("checked");
            var obj = $(this).find('input');
            obj.attr('checked', 'checked');
            jQuery('.product_attribute_' + $(this).attr("value") + '_btn').removeClass('current');
            $(this).addClass('current');
        }
        ResetAttrAttributelist();
        adjustPrice();
        if ($(this).attr("data-pic") != "") {
            $(".attrpic").attr("src", $(this).attr("data-pic"));
            $("#item_cover .view_bd img").hide();
            $(".attrpic").show();
            $(".view_thumbs li").removeClass("current");
        }
    });
}