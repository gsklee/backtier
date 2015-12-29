import vorpal from 'vorpal';

const cli = vorpal();

cli.command('init', 'Initializes this project.')
   .action(function (args, callback) {
     this.log();

     this.prompt([{
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
       name: 'isPrivate',
       message: 'Is the project private?'
     }], answers => {
       this.log();

       callback();
     });
   });

cli.delimiter('backtier>').show().exec('init');
