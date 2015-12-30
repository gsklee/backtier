import path from 'path';

import {assign} from 'bound-native-methods/object';
import Vorpal from 'vorpal';
import JSONFilePlus from 'json-file-plus';

const cli = Vorpal();

cli.command('init', 'Initializes this project.')
   .action(function (args, callback) {
     const {log, prompt} = this;

     log();

     prompt(
       [{
         name: 'name',
         message: 'Enter the package name: '
       }, {
         name: 'description',
         message: 'Enter the package description: '
       }, {
         name: 'url',
         message: 'Enter the URL of the repository: '
       }, {
         type: 'confirm',
         name: 'private',
         message: 'Is the project private?'
       }],

       async ({url, ...answers}) => {
         const file = await JSONFilePlus(path.join(process.cwd(), 'package.json'));

         file.set(answers::assign({
           repository: {url}
         }));

         log();

         try {
           await file.save(callback);

           log('Success!');
         } catch (error) {
           log('Error!', error);
         }

         log();
       }
     );
   });

cli.delimiter('backtier>').show().exec('init');
