var app = angular.module('app', []).factory('pagination', function ($sce) {

    'use strict';

    var currentPage = 0,
        itemsPerPage = 12,
        products = [];

    return {

        setProducts: function (newProducts) {
            products = newProducts;
        },
        /* END of setProducts */

        getPageProducts: function (num) {
            num = angular.isUndefined(num) ? 0 : num;
            var first = itemsPerPage * num,
                last = first + itemsPerPage;
            currentPage = num;
            last = last > products.length ? (products.length) : last;
            return products.slice(first, last);
        },
        /* END of getPageProducts */

        getTotalPagesNum: function () {
            return Math.ceil(products.length / itemsPerPage);
        },
        /* END of getTotalPagesNum */

        getPaginationList: function () {
            var pagesNum = this.getTotalPagesNum(),
                paginationList = [];
            paginationList.push({
                name: $sce.trustAsHtml('&laquo;'),
                link: 'prev'
            });
            for (var i = 0; i < pagesNum; i++) {
                var name = i + 1;
                paginationList.push({
                    name: $sce.trustAsHtml(String(name)),
                    link: i
                });
            };
            paginationList.push({
                name: $sce.trustAsHtml('&raquo;'),
                link: 'next'
            });
            if (pagesNum > 2) {
                return paginationList;
            } else {
                return null;
            }
        },
        /* END of getPaginationList */

        getCurrentPageNum: function () {
            return currentPage;
        },
        /* END of getCurrentPageNum */

        getPrevPageProducts: function () {
            var prevPageNum = currentPage - 1;
            if (prevPageNum < 0) prevPageNum = 0;
            return this.getPageProducts(prevPageNum);
        },
        /* END of getPrevPageProducts */

        getNextPageProducts: function () {
            var nextPageNum = currentPage + 1,
                pagesNum = this.getTotalPagesNum();
            if (nextPageNum >= pagesNum) nextPageNum = pagesNum - 1;
            return this.getPageProducts(nextPageNum);
        }
        /* END of getNextPageProducts */
    }
}) /* END of factory-pagination */

.controller('MainController', function ($scope, $http, pagination) {

    $http.get('./menu.json')
        .success(function (data) {
            $scope.menuObj = data;
            pagination.setProducts(data.products);
            $scope.products = pagination.getPageProducts($scope.currentPage);
            $scope.paginationList = pagination.getPaginationList();
        });

    $scope.showPage = function (page) {
        if (page == 'prev') {
            $scope.products = pagination.getPrevPageProducts();
        } else if (page == 'next') {
            $scope.products = pagination.getNextPageProducts();
        } else {
        $scope.products = pagination.getPageProducts(page);
        }
    };

    $scope.currentPageNum = function () {
        return pagination.getCurrentPageNum();
    }
}) /* END of MainController */