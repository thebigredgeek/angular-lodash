angular-lodash
==============

Lodash injectable for AngularJS


### Installation

Using [Bower](http://bower.io/):

    $ bower install --save tbrg.angular-lodash
    

### Usage

Inject `$lodash` like so:

    angular
      .module('foo',[
        'tbrg.angular-lodash'
      ])
      .controller('bar',[
      
        '$lodash',
        
        function($lodash){
        
        }
        
      ]);
