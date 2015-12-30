import fs from 'fs';
import path from 'path';

import {assign} from 'bound-native-methods/object';
import Vorpal from 'vorpal';
import JSONFilePlus from 'json-file-plus';
import INI from 'ini';

const cli = Vorpal();

cli.command('config', 'Configures this project.')
   .action(function () {
     const {log, prompt} = this;
     const gitconfig = INI.parse(fs.readFileSync(path.join(process.env.HOME, '.gitconfig'), 'utf-8'));

     log();

     prompt(
       [{
         name: 'name',
         message: 'Enter package name: '
       }, {
         name: 'author',
         message: 'Enter author information: ',
         default: `${gitconfig.user.name} <${gitconfig.user.email}>`
       }, {
         name: 'license',
         message: 'Enter license information: '
       }, {
         name: 'description',
         message: 'Enter package description: '
       }, {
         name: 'keywords',
         message: 'Enter package keywords (comma-separated): '
       }, {
         name: 'url',
         message: 'Enter the URL of the repository: '
       }, {
         type: 'confirm',
         name: 'private',
         message: 'Is the project private?'
       }],

       async ({keywords, url, ...answers}) => {
         const file = await JSONFilePlus(path.join(process.cwd(), 'package.json'));

         file.set(answers::assign({
           keywords: keywords.split(/[ ,]+/),
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
