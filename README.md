# Connect Four

I made this little game to learn and practice working with [Angular 2](https://angular.io/) and [Angular CLI](https://cli.angular.io). I used CLI version 1.0.0-beta.10.

**The game is live at <https://cmermingas.github.io/connect-four/>**

Check it out, look at the code, and send me your feedback.

## Some Thoughts

I organized the application like this:

  * [App Component](https://github.com/cmermingas/connect-four/blob/master/src/app/app.component.ts)
    * [Connect Four Component](https://github.com/cmermingas/connect-four/tree/master/src/app/connect-four)
      * [Column Component](https://github.com/cmermingas/connect-four/tree/master/src/app/game-column)
        * ~~Cell Component~~

After several refactoring cycles, I decided to remove the Cell Component, since it wasn't doing anything substantial.  

I made the model mirror that:

  * Connect Four
    * Column
      * Cell (with a numeric property that indicates the content of the cell)

The model is all in [one file](https://github.com/cmermingas/connect-four/blob/master/src/app/model/connect-four.ts)

I decided to keep the Cell model, unlike the Cell Component, because I noticed that if I stored the cell state (a number) directly in the column, then the whole column flickers when a single number changes. My guess is that the ngFor in the Column Component runs the whole list whenever one item changes (?).

When it comes to styling, the CSS files seem a bit scattered and coupled. For example: if I define a certain color scheme in a parent component, I have to redefine it in other descedant components as well. I can imagine the challenge compounding in large application.       

## Issues
* The images included in the repo are not correctly deployed to Github Pages. I had to change the code to point to the images in the repo itself. Not exactly what I wanted.

## Next Steps
Main:
* An algorithm that plays the game.
* Undo.
* A way to play over the network. Ideally without a server in the middle.
* Tinker with different models and see how they affect (or not) the components' behavior.
* Support more than two players.
* Force it to display in landscape mode, regardless of how the device is held.
* Fill in the test specs.

Side dishes:
* Better images/look.
* Or no images at all pure CSS. The only reason I used images was to be able to make it responsive.
