function sidebarFix(){
    if (!$('.sidebar__right_fix').length){
        return;
    }
    if (window.innerWidth >= 1024){
        let position = $('.page__content').position();
        let articleRight = position.left + $('.page__content').width();
        
        //if the window is not so width, the width of the toc would depend on the width of window
        if (window.innerWidth < 1280){
            let sidebarWid = document.body.clientWidth - articleRight - 30;
            $('.sidebar__right_fix').css('width', sidebarWid);
        } else {
            $('.sidebar__right_fix').removeAttr("style")
        }
        
        //calculate the left position and the top position for the toc fixed in the window
        $('.sidebar__right_fix').css('left', articleRight);
        let articleTop = position.top;
        let menuHeight = $('.masthead').height();
        if (articleTop < $(this).scrollTop() + menuHeight){
            $('.sidebar__right_fix').css('top', menuHeight + 30);
        } else {
            $('.sidebar__right_fix').css('top', articleTop - $(this).scrollTop() + 30);
        }

        //when the toc is used to show, it would use scroll for overflow
        $('.sidebar__right_fix').css('height', "");
        let sidebarBottom = $('.sidebar__right_fix').position().top + $('.sidebar__right_fix').height();
        if (articleTop < $(this).scrollTop() + menuHeight && sidebarBottom > $(window).height() - 30){
            $('.sidebar__right_fix').css('height', $(window).height() - $('.sidebar__right_fix').position().top - 30);
            $('.sidebar__right_fix').css('overflow', 'scroll');
        } else {
            $('.sidebar__right_fix').css('height', "");
            $('.sidebar__right_fix').css('overflow', "");
        }
    }
    else {
        $('.sidebar__right_fix').removeAttr("style");
    }
}

function menuScroll(){
    var lastScrollTop = 0
    $(window).bind('scroll', function(){
        if (!$('.masthead').length){
            return;
        }
        let scrollTop = $(this).scrollTop();
        if (scrollTop > 50){
            if (scrollTop > lastScrollTop){
                $('.masthead').removeClass('masthead_fixed');
            } else {
                $('.masthead').addClass('masthead_fixed');
                $('.masthead__inner-wrap').addClass('masthead_shrink');
            }
        } else {
            $('.masthead').removeClass('masthead_fixed');
            $('.masthead__inner-wrap').removeClass('masthead_shrink');
        }
        lastScrollTop = scrollTop;
        sidebarFix();
    });
}

function trackDowloadNumber(){
    let url = $(this).attr('href');
    let redirect = false;
    ga('send', 'event', 'Downloads', 'click', url, {
        'hitCallback': function(){
            redirect = true;
            document.location = url;
        }
    });
    setTimeout(function(){
        if (!redirect){
            document.location = url;
        }
    }, 1500);
    return false;
}

function platformSwitcher(){
    let url = $(this).attr('href');
    $('.switch_result').each(function(){
        if ($(this).attr('id').search(url.substring(1)) != -1){
            $(this).css('display', '');
        } else {
            $(this).css('display', 'none');
        }
    });
    $('.switch').each(function(){
        let tocElement =  $('#markdown-toc-' + $(this).attr('href').substring(1)).parent();
        if ($(this).attr('href') == url){
            tocElement.css('display', '');
            $(this).addClass('switch_active');
        } else {
            tocElement.css('display', 'none');
            $(this).removeClass('switch_active');
        }
    });
    return false;
}

$(window).load(function(){
    menuScroll();
    
    $('.sidebar__right').addClass('sidebar__right_fix');
    sidebarFix();
    $(window).resize(sidebarFix);

    let firstPlatform = '';
    if ($('.switcher').length > 0){
        let switchLevel = $('.switcher').next().prop('tagName');
        if (switchLevel[0] != 'H'){
            $('.switcher').remove();
        } else {
            switchLevel = switchLevel[1];
            $('.switch').each(function(){
                let id = $(this).attr('id');
                let platform = '';
                let curPlatform = false;
                let string = '';
                $('.page__content').children().each(function(){
                    let curLevel = $(this).prop('tagName');
                    if (curPlatform){
                        if (curLevel[0] == 'H' && curLevel[1] <= switchLevel){
                            $('#' + platform + '_switch_result').html(string);
                            curPlatform = false;
                        } else {
                            string += $(this).clone().wrap('<p>').parent().html();
                            $(this).remove();
                        }
                    } else {
                        if (curLevel[0] == 'H' && curLevel[1] == switchLevel && id.search($(this).attr('id')) != -1){
                            curPlatform = true;
                            string += $(this).clone().wrap('<p>').parent().html();
                            platform = $(this).attr('id');
                            if (firstPlatform == ''){
                                firstPlatform = platform;
                                $(this).before('<div id = "' + platform + '_switch_result" class = "switch_result">');
                                $('#' + platform + '_switch').addClass('switch_active');
                            } else {
                                $(this).before('<div id = "' + platform + '_switch_result" class = "switch_result" style = "display: none">');
                                $('#markdown-toc-' + platform).parent().css('display', 'none');
                            }
                            $(this).remove();
                        }
                    }
                });
                if (curPlatform){
                    $('#' + platform + '_switch_result').html(string);
                    curPlatform = false;
                }
            });
            $('.switch').each(function(){
                $(this).click(platformSwitcher);
            });
        }
    }

    // download track
    $('.click-download-tracker').click(trackDowloadNumber);
});