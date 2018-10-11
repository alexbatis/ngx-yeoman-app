# ngx-yeoman-app

A desktop app that scaffolds projects using Yeoman.  Based on [yeoman-app](https://github.com/yeoman/yeoman-app). 

Built with [angular-electron](https://github.com/maximegris/angular-electron) which is written in Angular 6 and provides many great features such as hot-reloading duing development. Electron main process written in [Typescript](https://github.com/Microsoft/TypeScript).

This project is based on [yeoman-app](https://github.com/yeoman/yeoman-app) which has been unmaintained since October 2016. I saw a need for an application that would leverage many of the features included in this project, so I decided to make a first pass effort at re-writing this application and bringing it up to speed with the present.

### Features
- ##### Main Process Written in Typescript
    - Reap all the benefits of writing in typescript in the main electron process that interfaces with the [yeoman environment](https://github.com/yeoman/environment)
    - Eliminates need for previous dependencies such as [babel-plugin-transform-es2015-modules-commonjs](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-modules-commonjs), [babel-preset-es2015](https://www.npmjs.com/package/babel-preset-es2015), [babel-preset-react](https://github.com/babel/babel/tree/master/packages/babel-preset-react), [babel-preset-stage-0](https://github.com/babel/babel/tree/master/packages/babel-preset-stage-0), [babel-register](https://github.com/babel/babel/tree/master/packages/babel-register), and more. 
- ##### Main process written in Angular 6
    - Using [angular-electron](https://github.com/maximegris/angular-electron) developing and building an electron desktop app has never been easier
    - Leverages [ngrx](https://github.com/ngrx/platform) for easy state control using [rxjs](https://github.com/ReactiveX/rxjs) observables

### Usage
If you **just want to run the desktop app**, you can download and run the portable executables:
- [Windows]()
- [MacOs]()

If you want to use this as a boilerplate to start your own angular project that interacts with the yeoman environment, check out the sections below on installation and development.

### Installation
To **install the application** for use on your local machine **without downloading & running the executable**, follow these steps

```sh
$ git clone https://github.com/alexbatis/ngx-yeoman-app
$ cd ngx-yeoman-app
$ npm install
```

### Execution & Development
To **run the app**, simply run 
```sh
$ npm start
```
This will start the app with hot-reloading on all the renderer (angular) code. This is the preferred development command.

### Build
To **build the app** into an executable, run the following command
```sh
$ npm run electron:<platform>
```
where platform is either windows, mac, or linux based on which OS you're running.

## Contributing
If you're interested in contributing, please reach out. This app is still in its infancy, but if there is the demand I'd be willing to allocate more time to it.  All contributions and feedback are welcomed. 

### References
- [yeoman](https://github.com/yeoman)
- [yeoman-app](https://github.com/yeoman/yeoman-app)
- [angular](https://github.com/angular)
- [electron](https://github.com/electron/electron)
- [angular-electron](https://github.com/maximegris/angular-electron)

License
----


MIT © [Alex Batis](https://github.com/alexbatis)
