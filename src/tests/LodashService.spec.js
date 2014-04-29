(function(){

  'use strict';

  describe('Service $lodash', function(){

    beforeEach(function(){

      module('tbrg.lodash');

      inject([

        '$lodash',

        angular.noop

      ]);

    });

    it('should pass this smoke test', function(){

      expect(true).toEqual(true);

    });

  });

}());
