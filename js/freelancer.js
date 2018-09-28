/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('body').on('click', '.page-scroll a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Floating label headings for the contact form
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !! $(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});

// Read More - Read Less
$(function() {
    $('.collapse-text').click(function(e){
        e.preventDefault();
        $('.collapse-on-mobile').removeClass('hidden-xs');

        $('.collapse-text').hide();

        //var text = $('.collapse-text').text();
        //$('.collapse-text').text(
        //    text == "More about me.." ? "Less about me.." : "More about me..");
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});


var myApp = angular.module('samgargsWebsite', []);
myApp.controller('PortfolioController', function($scope, ProjectsFactory) {
    function init() {
        ProjectsFactory.getProjects()
            .success(function(data) {
                $scope.projects = data;
            })
            .error(function(data, status) {
                alert(status);
            });
    }

    init();
}).factory('ProjectsFactory', function($http) {
    var factory = {}
    factory.getProjects = function() {
        return $http.get('projects.json')
    }
    return factory;
});

