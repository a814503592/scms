(function() {
  "use strict";

  var app = angular.module("webapp", ["ngTable", "ngTableDemos", "ui.bootstrap"]);

  app.controller("demoController", demoController);
  demoController.$inject = ["NgTableParams", "ngTableSimpleMediumList"];

  function demoController(NgTableParams, simpleList) {
    var self = this;
    self.tableParams = new NgTableParams({ count: 5 }, { counts: [5, 10, 20], dataset: simpleList});
    
    self.selectedPageSizes = self.tableParams.settings().counts;
    self.availablePageSizes = [5, 10, 15, 20, 25, 30, 40, 50, 100];
    self.changePage = changePage;
    self.changePageSize = changePageSize;
    self.changePageSizes = changePageSizes;
    
    function changePage(nextPage){
      self.tableParams.page(nextPage);
    }
    
    function changePageSize(newSize){
      self.tableParams.count(newSize);
    }
    
    function changePageSizes(newSizes){
      // ensure that the current page size is one of the options
      if (newSizes.indexOf(self.tableParams.count()) === -1) {
          newSizes.push(self.tableParams.count());
          newSizes.sort();
      }
      self.tableParams.settings({ counts: newSizes});
    }
  }
})();