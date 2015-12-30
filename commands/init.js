import path from 'path';

import {assign} from 'bound-native-methods/object';
import Vorpal from 'vorpal';
import JSONFilePlus from 'json-file-plus';

const cli = Vorpal();

cli.command('config', 'Configures this project.')
   .action(function (args, callback) {
     const {log, prompt} = this;

     log();

     prompt(
       [{
         name: 'name',
         message: 'Enter package name: '
       }, {
         name: 'description',
         message: 'Enter package description: '
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
           await file.save();

           log('Configuration was successfully saved.');
         } catch (error) {
           log(`Error while saving the configuration! ${error}`);
         }

         log();

         cli.ui.cancel();
       }
     );
   });

cli.delimiter('backtier>').show().exec('config');
