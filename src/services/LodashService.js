'use strict';

angular
  .module('tbrg.lodash')
  .factory('$lodash', [

    '$window',

    function($window){

      var ret = $window._;

      if(!ret){
        throw new Error('Error!  Module tbrg.lodash could not resolve lodash from the global scope!');
      }

      return ret;

    }


  ]);
