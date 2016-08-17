# Connect Four

I have been working on this app to learn [Angular 2](https://github.com/angular/angular) and [Angular CLI](https://github.com/angular/angular-cli).

This project was generated with CLI version 1.0.0-beta.11-webpack.2.

I might move this repository to replace [this one](https://github.com/cmermingas/connect-four), which is a previous version that used the SystemJS-based CLI.

All feedback is welcome.

# Notes

## General Architecture

It's very simple:

```
connect-four-game
   ai-player
      connect-four-ai-player.ts             // A "robot" that plays the game
      connect-four-ai-player-web-worker.ts  // A wrapper for the robot to run it in a web worker.
                                            // It basically implements the messaging protocol between the app and the web worker.
    
   model
      connect-four-game-model.spec.ts  // Tests for the model 
      connect-four-game-model.ts       // Game model
  
  
app.component // What you see on the screen and interact with
```

### TODO

- Convert the `connect-four-game` folder into an NgModule.
- Add animations (they are there in the code but they don't behave as expected).
- Maybe refactor some of the components, to simplify `app.component`.
- Use web workers the Angular 2 way. Challenge: the documentation that I've found is outdated. 

## To Deploy to Github Pages

Currently, deploying to Github Pages via the CLI is not working for me. So, I am doing it manually, guided by [these instructions](https://help.github.com/articles/creating-project-pages-manually/).

1. Clone the master branch:

```
git clone https://github.com/cmermingas/connect-four-webpack.git
cd connect-four-webpack
git checkout --orphan gh-pages
git rm rf .
```

2. Build the project for prod in a separate repository. *Why so many Webpack warnings!?*

```
ng build --prod
```

3. Copy the built files where the gh-pages branch is. Also copy the images (they don't seem to be copied by `ng build --prod`). 
 
4. Change `base href="/"` to `base href="/connect-four-webpack/"` in index.html

5. Finally, push to Github:
 
```
git push origin gh-pages
```
