# Blurred Map
### Desc
This is a very rough idea so far, but the idea/plan is to create a map that allows you to track where you've been. This gives people a chance to fully explore their city or town without retracing the same steps every day.

### Features
- The entire map begins grayed out showing that you've explored nothing.
- As you walk/drive/cycle a path is cleared from the grayed-out space updating to show where you have now travelled.
- This should ideally run in the background allowing the user to simply have the app installed to track progress.

### Technology stack
So far the app is based on React Native with TypeScript. I haven't decided what to use for the rest of the app for Database, Hosting, Backend, etc. However, the initial functionality needs to be figured out beforehand.

### Extra notes
- Potentially limit map size to optimize performance. Set distance in configuration settings for the user or at the start when making an account. For example, Jerry from Montreal sets the Greater Montreal Area as his area and it only renders that allowing for optimal performance.
